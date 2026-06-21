import type { MedicalRecord, Medicine, MedicineCategory, TestResult } from "@/types/medical-record";
import { callGemini } from "@/lib/ai/gemini";
import {
  RawAIResponseSchema,
  normaliseCategory,
  stripMarkdownFences,
} from "@/lib/ai/schemas";
import type { RawAIResponse } from "@/lib/ai/schemas";
import { GEMINI_MODEL } from "@/lib/constants";

const SYSTEM_PROMPT = `You are an expert medical data extraction AI. Analyze the uploaded image or PDF of this prescription or medical report.

Extract the following fields and respond STRICTLY with a raw JSON object only.
Do NOT include markdown code blocks, backticks, or any text outside the JSON.
Do NOT include explanations, comments, or preamble.
Return ONLY the valid JSON string.

Required JSON structure (use empty string or empty array for missing fields):
{
  "doctorName": "Full name of the prescribing doctor",
  "consultationDate": "Date from the document in YYYY-MM-DD format, or empty string if not found",
  "patientCase": "Brief summary of symptoms, diagnosis, or reason for visit, e.g. 'Fever for 3 days', 'Persistent cough', 'Headache', 'Gastric discomfort'",
  "respiratoryRate": "Respiratory rate as a numeric string, e.g. '18', or empty string if not found",
  "bloodPressure": "e.g. 120/80, or empty string if not found",
  "medicines": [
    {
      "name": "Medicine name",
      "dosage": "e.g. 500mg, 1 tablet, 5ml",
      "frequency": "e.g. twice daily, once daily",
      "duration": "e.g. 7 days, 2 weeks",
      "category": "Must be one of: Antibiotic, Vitamin, Calcium, Gastric, Other"
    }
  ],
  "testResults": [
    {
      "testName": "Name of the diagnostic test (e.g. CBC, Blood Sugar, Hemoglobin, Creatinine)",
      "value": "Numerical value only, e.g. '11.2', '186', '9.8', '1.1' — do NOT include the unit",
      "unit": "Unit of measurement separately, e.g. 'mg/dL', 'g/dL', '10³/µL', '%', 'mm/hr'",
      "normalRange": "e.g. 70-100, Negative, < 10",
      "date": "YYYY-MM-DD or empty string"
    }
  ],
  "additionalNotes": "Any other relevant information from the document not covered above"
}

MEDICINE CLASSIFICATION RULES (you MUST classify each medicine):
- "Antibiotic": Drugs used to treat bacterial infections. Examples: Amoxicillin, Ciprofloxacin, Azithromycin, Doxycycline, Clindamycin, Metronidazole, Cephalexin, Penicillin, etc.
- "Gastric": Drugs for stomach acid, reflux, or digestion. Examples: Omeprazole, Pantoprazole, Ranitidine, Antacids, etc.
- "Vitamin": Vitamins, minerals, supplements. Examples: Vitamin C, Vitamin D3, Vitamin B12, Multivitamin, Iron supplements, Folic Acid, etc.
- "Calcium": Calcium supplements specifically. Examples: Calcium Carbonate, Calcium Gluconate, etc.
- "Other": Any medicine not fitting above categories. Examples: Painkillers, anti-inflammatory, diabetes drugs, blood pressure meds, etc.

CRITICAL RULES FOR TEST VALUES:
- Extract the numeric value WITHOUT the unit. For example: if the report says "Blood Sugar: 186 mg/dL", set value="186" and unit="mg/dL"
- Common tests and their value extraction:
  - CBC -> value is the numeric result (e.g. "11.2")
  - Blood Sugar / Fasting Blood Sugar -> value is the numeric result (e.g. "186", "102")
  - Hemoglobin -> value is the numeric result (e.g. "9.8", "13.5")
  - Creatinine -> value is the numeric result (e.g. "1.1", "0.9")
  - HbA1c -> value is the numeric percentage (e.g. "8.2", "7.4")
  - Vitamin D Level -> value is the numeric result (e.g. "18", "28")
- If the result is non-numeric (e.g. "Negative", "Normal", "E. coli"), set value to that string and unit to empty string

CRITICAL:
- Return ONLY the raw JSON object - NO markdown, NO code fences, NO explanations
- If a field is not present in the document, use empty string "" or empty array []
- Do NOT invent or hallucinate data
- Ensure all JSON keys and strings use double quotes
- The response must be parseable by JSON.parse() directly`;

export async function parseMedicalDocument(
  fileBase64: string,
  fileType: string
): Promise<RawAIResponse> {
  const mimeType = fileType === "application/pdf" ? "application/pdf" : "image/jpeg";

  const responseText = await callGemini(
    {
      contents: [
        {
          parts: [
            { text: SYSTEM_PROMPT },
            { inlineData: { mimeType, data: fileBase64 } },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 4096,
      },
    },
    {
      model: GEMINI_MODEL,
      timeoutMs: 30_000,
      retries: 2,
    }
  );

  const cleaned = stripMarkdownFences(responseText);

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      `Failed to parse AI response as JSON. Raw output:\n${cleaned}`
    );
  }

  const result = RawAIResponseSchema.safeParse(parsed);
  if (!result.success) {
    console.warn("[ai.service] Zod validation warnings:", result.error.flatten());
    return (parsed ?? {}) as RawAIResponse;
  }

  return result.data;
}

export function mapAIResponseToMedicalRecord(
  raw: RawAIResponse,
  recordId: string,
  defaultDate: string
): MedicalRecord {
  const medicines: Medicine[] = (raw.medicines ?? []).map((m) => ({
    name: m.name ?? "Unknown",
    dosage: m.dosage ?? "",
    frequency: m.frequency ?? "",
    duration: m.duration ?? "",
    category: normaliseCategory(m.category),
  }));

  const testResults: TestResult[] = (raw.testResults ?? []).map((t) => ({
    testName: t.testName ?? "Unknown",
    value: t.value && t.unit ? `${t.value} ${t.unit}` : (t.value ?? ""),
    unit: t.unit ?? "",
    normalRange: t.normalRange ?? "",
    date: t.date ?? defaultDate,
  }));

  const consultationDate = raw.consultationDate || defaultDate;
  const symptoms = raw.patientCase ?? raw.symptoms ?? "";

  const notes: string[] = [];
  if (raw.additionalNotes) notes.push(raw.additionalNotes);

  const rrRaw = raw.respiratoryRate;
  const rr =
    rrRaw !== undefined && rrRaw !== null && rrRaw !== ""
      ? String(rrRaw)
      : "Not Available";

  return {
    id: recordId,
    recordId,
    consultationDate,
    date: consultationDate,
    doctorName: raw.doctorName ?? "Unknown Doctor",
    symptoms,
    patientCase: symptoms,
    respiratoryRate: rr,
    bloodPressure: raw.bloodPressure ?? "",
    medicines,
    testResults,
    additionalNotes: notes.join("\n") || undefined,
  };
}
