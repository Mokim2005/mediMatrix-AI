import { z } from "zod";
import type { MedicineCategory } from "@/types/medical-record";

export const MedicineCategorySchema = z.enum([
  "antibiotic",
  "gastric",
  "vitamin",
  "calcium",
  "other",
]);

export const RawMedicineSchema = z.object({
  name: z.string().optional(),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  duration: z.string().optional(),
  category: z.string().optional(),
});

export const RawTestResultSchema = z.object({
  testName: z.string().optional(),
  value: z.string().optional(),
  unit: z.string().optional(),
  normalRange: z.string().optional(),
  date: z.string().optional(),
});

export const RawAIResponseSchema = z.object({
  doctorName: z.string().optional(),
  consultationDate: z.string().optional(),
  patientCase: z.string().optional(),
  symptoms: z.string().optional(),
  respiratoryRate: z.union([z.string(), z.number()]).optional(),
  bloodPressure: z.string().optional(),
  medicines: z.array(RawMedicineSchema).optional(),
  testResults: z.array(RawTestResultSchema).optional(),
  additionalNotes: z.string().optional(),
});

export type RawAIResponse = z.infer<typeof RawAIResponseSchema>;

const CATEGORY_MAP: Record<string, MedicineCategory> = {
  antibiotic: "antibiotic",
  antibiotics: "antibiotic",
  antibacterial: "antibiotic",
  gastric: "gastric",
  antacid: "gastric",
  ppi: "gastric",
  h2: "gastric",
  vitamin: "vitamin",
  vitamins: "vitamin",
  supplement: "vitamin",
  calcium: "calcium",
  others: "other",
  other: "other",
  "anti-biotic": "antibiotic",
  "anti biotic": "antibiotic",
};

export function normaliseCategory(raw: string | undefined): MedicineCategory {
  if (!raw) return "other";
  const key = raw.toLowerCase().trim();
  const mapped = CATEGORY_MAP[key];
  if (mapped) return mapped;
  for (const [k, v] of Object.entries(CATEGORY_MAP)) {
    if (key.includes(k)) return v;
  }
  const parsed = MedicineCategorySchema.safeParse(key);
  return parsed.success ? parsed.data : "other";
}

export function stripMarkdownFences(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}
