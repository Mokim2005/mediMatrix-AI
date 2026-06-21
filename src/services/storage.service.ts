import { Patient } from "@/types/patient";
import { Doctor } from "@/types/doctor";
import { MedicalRecord } from "@/types/medical-record";
import { AuditLog } from "@/types/admin";

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const PATIENTS_KEY = "hc_patients";
const AUDIT_LOGS_KEY = "hc_audit_logs";
const DOCTORS_KEY = "hc_doctors";

// ─── Mock Doctors ─────────────────────────────────────────────────────────────

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: "D-1001",
    name: "Dr. Sarah Johnson",
    specialty: "Internal Medicine",
    email: "sarah.johnson@medimatrix.ai",
    contactNumber: "+966-50-1111111",
    status: "active",
  },
  {
    id: "D-1002",
    name: "Dr. Michael Chen",
    specialty: "Cardiology",
    email: "michael.chen@medimatrix.ai",
    contactNumber: "+966-50-2222222",
    status: "active",
  },
  {
    id: "D-1003",
    name: "Dr. Emily Torres",
    specialty: "Neurology",
    email: "emily.torres@medimatrix.ai",
    contactNumber: "+966-50-3333333",
    status: "active",
  },
];

// ─── Mock Patients ────────────────────────────────────────────────────────────

export const MOCK_PATIENTS: Patient[] = [
  {
    id: "P-1001",
    name: "Ahmed Al-Rashid",
    age: 42,
    gender: "Male",
    contactNumber: "+966-50-1234567",
    email: "ahmed.alrashid@email.com",
    bloodGroup: "A+",
    status: "active",
    records: [
      {
        id: "REC-1001-001",
        consultationDate: "2024-01-15",
        doctorName: "Dr. Sarah Johnson",
        symptoms:
          "Persistent cough, fever (38.5°C), fatigue for 5 days. Mild chest tightness reported.",
        respiratoryRate: "22",
        bloodPressure: "128/84",
        medicines: [
          { name: "Amoxicillin",       dosage: "500mg",   frequency: "3x daily", duration: "7 days",  category: "antibiotic" },
          { name: "Omeprazole",        dosage: "20mg",    frequency: "1x daily", duration: "14 days", category: "gastric"    },
          { name: "Vitamin C",         dosage: "1000mg",  frequency: "1x daily", duration: "30 days", category: "vitamin"    },
        ],
        testResults: [
          { testName: "Complete Blood Count", value: "WBC: 11.2", unit: "10³/µL", normalRange: "4.5–11.0", date: "2024-01-15" },
          { testName: "CRP",                  value: "42",         unit: "mg/L",   normalRange: "< 10",     date: "2024-01-15" },
        ],
      },
      {
        id: "REC-1001-002",
        consultationDate: "2024-03-22",
        doctorName: "Dr. Michael Chen",
        symptoms: "Recurrent acid reflux, bloating after meals, mild epigastric discomfort.",
        respiratoryRate: "18",
        bloodPressure: "122/78",
        medicines: [
          { name: "Pantoprazole",     dosage: "40mg",    frequency: "2x daily", duration: "28 days", category: "gastric"  },
          { name: "Vitamin D3",       dosage: "5000 IU", frequency: "1x daily", duration: "90 days", category: "vitamin"  },
          { name: "Calcium Carbonate",dosage: "500mg",   frequency: "2x daily", duration: "90 days", category: "calcium"  },
        ],
        testResults: [
          { testName: "H. Pylori Antigen", value: "Negative", unit: "",      normalRange: "Negative", date: "2024-03-22" },
          { testName: "Vitamin D Level",   value: "18",        unit: "ng/mL", normalRange: "30–100",   date: "2024-03-22" },
        ],
      },
      {
        id: "REC-1001-003",
        consultationDate: "2024-06-10",
        doctorName: "Dr. Sarah Johnson",
        symptoms: "Urinary tract infection symptoms: burning urination, frequency, lower abdominal pain.",
        respiratoryRate: "19",
        bloodPressure: "130/82",
        medicines: [
          { name: "Ciprofloxacin", dosage: "500mg", frequency: "2x daily", duration: "5 days", category: "antibiotic" },
          { name: "Metronidazole", dosage: "400mg", frequency: "3x daily", duration: "5 days", category: "antibiotic" },
        ],
        testResults: [
          { testName: "Urine Culture", value: "E. coli",     unit: "",     normalRange: "No growth", date: "2024-06-10" },
          { testName: "Urine R/E",     value: "WBC: 30–40",  unit: "/HPF", normalRange: "0–5",       date: "2024-06-10" },
        ],
      },
      {
        id: "REC-1001-004",
        consultationDate: "2024-09-05",
        doctorName: "Dr. Emily Torres",
        symptoms: "Follow-up visit. Hypertension monitoring. Mild headache, no other complaints.",
        respiratoryRate: "17",
        bloodPressure: "145/92",
        medicines: [
          { name: "Amlodipine",   dosage: "5mg",      frequency: "1x daily", duration: "30 days", category: "other"   },
          { name: "Multivitamin", dosage: "1 tablet", frequency: "1x daily", duration: "30 days", category: "vitamin" },
        ],
        testResults: [
          { testName: "Fasting Blood Sugar", value: "102", unit: "mg/dL", normalRange: "70–100",  date: "2024-09-05" },
          { testName: "Creatinine",          value: "1.1", unit: "mg/dL", normalRange: "0.7–1.3", date: "2024-09-05" },
        ],
      },
    ],
  },
  {
    id: "P-1002",
    name: "Fatima Al-Zahra",
    age: 31,
    gender: "Female",
    contactNumber: "+966-55-9876543",
    email: "fatima.alzahra@email.com",
    bloodGroup: "O+",
    status: "active",
    records: [
      {
        id: "REC-1002-001",
        consultationDate: "2024-02-08",
        doctorName: "Dr. Emily Torres",
        symptoms: "Severe throat pain, difficulty swallowing, tonsil enlargement. Temp 39.1°C.",
        respiratoryRate: "24",
        bloodPressure: "110/70",
        medicines: [
          { name: "Azithromycin",   dosage: "500mg",   frequency: "1x daily", duration: "3 days",  category: "antibiotic" },
          { name: "Ibuprofen",      dosage: "400mg",   frequency: "3x daily", duration: "5 days",  category: "other"      },
          { name: "Vitamin B Complex", dosage: "1 tablet", frequency: "1x daily", duration: "30 days", category: "vitamin" },
        ],
        testResults: [
          { testName: "Throat Swab Culture", value: "Group A Strep", unit: "",        normalRange: "No pathogen", date: "2024-02-08" },
          { testName: "Complete Blood Count", value: "WBC: 13.5",    unit: "10³/µL",  normalRange: "4.5–11.0",    date: "2024-02-08" },
        ],
      },
      {
        id: "REC-1002-002",
        consultationDate: "2024-04-18",
        doctorName: "Dr. Michael Chen",
        symptoms: "Iron deficiency symptoms: fatigue, pallor, brittle nails, shortness of breath on exertion.",
        respiratoryRate: "20",
        bloodPressure: "108/68",
        medicines: [
          { name: "Ferrous Sulfate",   dosage: "325mg", frequency: "2x daily", duration: "60 days", category: "vitamin"  },
          { name: "Calcium Gluconate", dosage: "500mg", frequency: "1x daily", duration: "60 days", category: "calcium"  },
          { name: "Folic Acid",        dosage: "5mg",   frequency: "1x daily", duration: "60 days", category: "vitamin"  },
        ],
        testResults: [
          { testName: "Hemoglobin",     value: "9.8",  unit: "g/dL",   normalRange: "12.0–16.0", date: "2024-04-18" },
          { testName: "Serum Ferritin", value: "6",    unit: "ng/mL",  normalRange: "12–150",    date: "2024-04-18" },
          { testName: "TIBC",           value: "420",  unit: "µg/dL",  normalRange: "250–370",   date: "2024-04-18" },
        ],
      },
      {
        id: "REC-1002-003",
        consultationDate: "2024-07-29",
        doctorName: "Dr. Sarah Johnson",
        symptoms: "Skin infection — cellulitis on right forearm. Redness, warmth, swelling.",
        respiratoryRate: "18",
        bloodPressure: "116/74",
        medicines: [
          { name: "Clindamycin", dosage: "300mg", frequency: "4x daily", duration: "10 days", category: "antibiotic" },
          { name: "Omeprazole",  dosage: "20mg",  frequency: "1x daily", duration: "10 days", category: "gastric"    },
        ],
        testResults: [
          { testName: "CBC", value: "WBC: 12.8", unit: "10³/µL", normalRange: "4.5–11.0", date: "2024-07-29" },
          { testName: "ESR", value: "55",         unit: "mm/hr",  normalRange: "0–20",     date: "2024-07-29" },
        ],
      },
      {
        id: "REC-1002-004",
        consultationDate: "2024-11-12",
        doctorName: "Dr. Emily Torres",
        symptoms: "Routine annual checkup. No acute complaints. Mild vitamin D deficiency on last labs.",
        respiratoryRate: "16",
        bloodPressure: "112/72",
        medicines: [
          { name: "Vitamin D3",        dosage: "2000 IU", frequency: "1x daily", duration: "90 days", category: "vitamin"  },
          { name: "Calcium Carbonate", dosage: "500mg",   frequency: "1x daily", duration: "90 days", category: "calcium"  },
        ],
        testResults: [
          { testName: "Vitamin D Level",   value: "22",  unit: "ng/mL", normalRange: "30–100",  date: "2024-11-12" },
          { testName: "TSH",               value: "2.4", unit: "mIU/L", normalRange: "0.4–4.0", date: "2024-11-12" },
          { testName: "Lipid Panel - LDL", value: "118", unit: "mg/dL", normalRange: "< 100",   date: "2024-11-12" },
        ],
      },
    ],
  },
  {
    id: "P-1003",
    name: "Khalid Mahmoud",
    age: 55,
    gender: "Male",
    contactNumber: "+966-50-3456789",
    email: "khalid.mahmoud@email.com",
    bloodGroup: "B+",
    status: "active",
    records: [
      {
        id: "REC-1003-001",
        consultationDate: "2024-03-10",
        doctorName: "Dr. Sarah Johnson",
        symptoms: "Type 2 diabetes management. Elevated fasting glucose, mild peripheral numbness.",
        respiratoryRate: "18",
        bloodPressure: "138/88",
        medicines: [
          { name: "Metformin",   dosage: "1000mg",  frequency: "2x daily", duration: "90 days", category: "other"   },
          { name: "Vitamin B12", dosage: "500mcg",  frequency: "1x daily", duration: "30 days", category: "vitamin" },
          { name: "Omeprazole",  dosage: "20mg",    frequency: "1x daily", duration: "30 days", category: "gastric" },
        ],
        testResults: [
          { testName: "HbA1c",             value: "8.2", unit: "%",    normalRange: "< 7.0",  date: "2024-03-10" },
          { testName: "Fasting Blood Sugar",value: "186", unit: "mg/dL",normalRange: "70–100", date: "2024-03-10" },
        ],
      },
      {
        id: "REC-1003-002",
        consultationDate: "2024-05-20",
        doctorName: "Dr. Michael Chen",
        symptoms: "Chest infection with productive cough, mild fever 37.8°C, fatigue.",
        respiratoryRate: "23",
        bloodPressure: "140/90",
        medicines: [
          { name: "Doxycycline",      dosage: "100mg", frequency: "2x daily", duration: "7 days",  category: "antibiotic" },
          { name: "Calcium Carbonate",dosage: "500mg", frequency: "2x daily", duration: "60 days", category: "calcium"    },
          { name: "Vitamin C",        dosage: "500mg", frequency: "2x daily", duration: "14 days", category: "vitamin"    },
        ],
        testResults: [
          { testName: "Chest X-Ray",        value: "Mild infiltrates", unit: "",       normalRange: "Clear",      date: "2024-05-20" },
          { testName: "Complete Blood Count",value: "WBC: 12.1",        unit: "10³/µL", normalRange: "4.5–11.0",  date: "2024-05-20" },
          { testName: "Calcium",            value: "8.6",               unit: "mg/dL",  normalRange: "8.5–10.5",  date: "2024-05-20" },
        ],
      },
      {
        id: "REC-1003-003",
        consultationDate: "2024-08-14",
        doctorName: "Dr. Emily Torres",
        symptoms: "Follow-up diabetes check. Improved control, no new complaints.",
        respiratoryRate: "17",
        bloodPressure: "132/84",
        medicines: [
          { name: "Metformin",  dosage: "1000mg", frequency: "2x daily", duration: "90 days", category: "other"   },
          { name: "Vitamin D3", dosage: "1000 IU",frequency: "1x daily", duration: "90 days", category: "vitamin" },
        ],
        testResults: [
          { testName: "HbA1c",              value: "7.4",  unit: "%",     normalRange: "< 7.0",  date: "2024-08-14" },
          { testName: "Fasting Blood Sugar", value: "138",  unit: "mg/dL", normalRange: "70–100", date: "2024-08-14" },
          { testName: "Kidney Function",     value: "Normal",unit: "",      normalRange: "Normal", date: "2024-08-14" },
        ],
      },
    ],
  },
  {
    id: "P-1004",
    name: "Layla Hassan",
    age: 28,
    gender: "Female",
    contactNumber: "+966-55-7654321",
    email: "layla.hassan@email.com",
    bloodGroup: "AB-",
    status: "active",
    records: [
      {
        id: "REC-1004-001",
        consultationDate: "2024-04-05",
        doctorName: "Dr. Sarah Johnson",
        symptoms: "Migraine headaches, photophobia, nausea. Episodes lasting 6-12 hours.",
        respiratoryRate: "17",
        bloodPressure: "108/72",
        medicines: [
          { name: "Sumatriptan",    dosage: "50mg",    frequency: "as needed", duration: "30 days", category: "other"   },
          { name: "Vitamin B2",     dosage: "400mg",   frequency: "1x daily",  duration: "90 days", category: "vitamin" },
          { name: "Magnesium Oxide",dosage: "500mg",   frequency: "1x daily",  duration: "90 days", category: "other"   },
        ],
        testResults: [
          { testName: "MRI Brain",        value: "Normal",     unit: "",      normalRange: "Normal",    date: "2024-04-05" },
          { testName: "Vitamin D Level",  value: "28",         unit: "ng/mL", normalRange: "30–100",   date: "2024-04-05" },
        ],
      },
      {
        id: "REC-1004-002",
        consultationDate: "2024-08-20",
        doctorName: "Dr. Michael Chen",
        symptoms: "Follow-up migraine management. Reduced frequency, mild symptoms persist.",
        respiratoryRate: "16",
        bloodPressure: "106/70",
        medicines: [
          { name: "Propranolol",    dosage: "40mg",    frequency: "2x daily",  duration: "90 days", category: "other"   },
          { name: "Vitamin D3",     dosage: "2000 IU", frequency: "1x daily",  duration: "90 days", category: "vitamin" },
        ],
        testResults: [
          { testName: "Vitamin D Level", value: "35", unit: "ng/mL", normalRange: "30–100", date: "2024-08-20" },
        ],
      },
    ],
  },
  {
    id: "P-1005",
    name: "Omar Farooq",
    age: 48,
    gender: "Male",
    contactNumber: "+966-50-9988776",
    email: "omar.farooq@email.com",
    bloodGroup: "O-",
    status: "active",
    records: [
      {
        id: "REC-1005-001",
        consultationDate: "2024-05-12",
        doctorName: "Dr. Emily Torres",
        symptoms: "Chronic lower back pain radiating to left leg. Positive straight leg raise test.",
        respiratoryRate: "16",
        bloodPressure: "124/80",
        medicines: [
          { name: "Naproxen",       dosage: "500mg",   frequency: "2x daily",  duration: "14 days",  category: "other"    },
          { name: "Vitamin B Complex", dosage: "1 tablet", frequency: "1x daily", duration: "60 days",  category: "vitamin"  },
          { name: "Calcium Carbonate", dosage: "500mg",   frequency: "1x daily", duration: "60 days",  category: "calcium"  },
        ],
        testResults: [
          { testName: "Lumbar X-Ray",   value: "Mild disc degeneration L4-L5", unit: "", normalRange: "Normal", date: "2024-05-12" },
          { testName: "ESR",            value: "12",   unit: "mm/hr", normalRange: "0–20", date: "2024-05-12" },
        ],
      },
      {
        id: "REC-1005-002",
        consultationDate: "2024-09-18",
        doctorName: "Dr. Sarah Johnson",
        symptoms: "Hypertension screening. Elevated BP at previous visit. No acute complaints.",
        respiratoryRate: "18",
        bloodPressure: "142/90",
        medicines: [
          { name: "Lisinopril",     dosage: "10mg",    frequency: "1x daily", duration: "30 days",  category: "other"    },
          { name: "Vitamin D3",     dosage: "1000 IU", frequency: "1x daily", duration: "90 days",  category: "vitamin"  },
        ],
        testResults: [
          { testName: "Lipid Panel - LDL", value: "142", unit: "mg/dL", normalRange: "< 100",  date: "2024-09-18" },
          { testName: "Lipid Panel - HDL", value: "38",  unit: "mg/dL", normalRange: "> 40",   date: "2024-09-18" },
          { testName: "Triglycerides",     value: "180", unit: "mg/dL", normalRange: "< 150",  date: "2024-09-18" },
        ],
      },
    ],
  },
];

// ─── Doctor CRUD ──────────────────────────────────────────────────────────────

export function getDoctors(): Doctor[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DOCTORS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Doctor[];
  } catch {
    return [];
  }
}

export function saveDoctors(doctors: Doctor[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DOCTORS_KEY, JSON.stringify(doctors));
  } catch {
    // quota exceeded — fail silently
  }
}

export function initializeMockDoctors(): Doctor[] {
  if (typeof window === "undefined") return MOCK_DOCTORS;
  const existing = getDoctors();
  if (existing.length > 0) return existing;
  saveDoctors(MOCK_DOCTORS);
  return MOCK_DOCTORS;
}

// ─── Patient CRUD ─────────────────────────────────────────────────────────────

export function getPatients(): Patient[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PATIENTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Patient[];
  } catch {
    return [];
  }
}

export function savePatients(patients: Patient[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
  } catch {
    // quota exceeded — fail silently
  }
}

function normalizeRecord(record: MedicalRecord): MedicalRecord {
  return {
    ...record,
    recordId: record.recordId ?? record.id,
    date: record.date ?? record.consultationDate,
    patientCase: record.patientCase ?? record.symptoms,
    respiratoryRate: typeof record.respiratoryRate === "number"
      ? record.respiratoryRate > 0 ? String(record.respiratoryRate) : "Not Available"
      : record.respiratoryRate || "Not Available",
  };
}

export function initializeMockData(): Patient[] {
  if (typeof window === "undefined") return normalizePatients(MOCK_PATIENTS);
  const existing = getPatients();
  if (existing.length > 0) return existing;
  const normalized = normalizePatients(MOCK_PATIENTS);
  savePatients(normalized);
  try {
    localStorage.setItem(RECORDS_SCHEMA_VERSION_KEY, String(CURRENT_SCHEMA_VERSION));
  } catch {
    // ignore
  }
  return normalized;
}

function normalizePatients(patients: Patient[]): Patient[] {
  return patients.map((p) => ({
    ...p,
    records: p.records.map(normalizeRecord),
  }));
}

export function addRecordToPatient(
  patientId: string,
  record: MedicalRecord
): void {
  const patients = getPatients();
  const idx = patients.findIndex((p) => p.id === patientId);
  if (idx === -1) return;
  patients[idx].records.push(record);
  savePatients(patients);
}

// ─── Audit Logs ───────────────────────────────────────────────────────────────

export function getAuditLogs(): AuditLog[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(AUDIT_LOGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AuditLog[];
  } catch {
    return [];
  }
}

export function saveAuditLogs(logs: AuditLog[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(logs));
  } catch {
    // quota exceeded — fail silently
  }
}

// ─── Schema Migration ─────────────────────────────────────────────────────────

const RECORDS_SCHEMA_VERSION_KEY = "hc_schema_version";
const CURRENT_SCHEMA_VERSION = 2;

/**
 * Migrates stored patient records from older schema versions to the current one.
 * Handles:
 *  - v1 -> v2: adds recordId, date, patientCase, converts respiratoryRate to string
 */
export function migrateSchemaIfNeeded(patients: Patient[]): Patient[] {
  let version = 1;
  try {
    const raw = localStorage.getItem(RECORDS_SCHEMA_VERSION_KEY);
    if (raw) version = Number(raw);
  } catch {
    // ignore
  }

  if (version >= CURRENT_SCHEMA_VERSION) return patients;

  const migrated = normalizePatients(patients);

  savePatients(migrated);
  try {
    localStorage.setItem(RECORDS_SCHEMA_VERSION_KEY, String(CURRENT_SCHEMA_VERSION));
  } catch {
    // ignore
  }

  return migrated;
}

// ─── Admin helpers ────────────────────────────────────────────────────────────

export function injectMockDataset(): Patient[] {
  const normalized = normalizePatients(MOCK_PATIENTS);
  savePatients(normalized);
  saveDoctors(MOCK_DOCTORS);
  return normalized;
}

export function clearSystemStorage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(PATIENTS_KEY);
    localStorage.removeItem(AUDIT_LOGS_KEY);
    localStorage.removeItem(DOCTORS_KEY);
  } catch {
    // fail silently
  }
}
