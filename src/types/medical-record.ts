export type MedicineCategory = "antibiotic" | "gastric" | "vitamin" | "calcium" | "other";

export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  category: MedicineCategory;
}

export interface TestResult {
  testName: string;
  value: string;
  unit: string;
  normalRange: string;
  date: string;
}

export interface MedicalRecord {
  id: string;
  recordId?: string;
  consultationDate: string;
  date?: string;
  doctorName: string;
  symptoms: string;
  patientCase?: string;
  respiratoryRate: string;
  bloodPressure: string;
  medicines: Medicine[];
  testResults: TestResult[];
  additionalNotes?: string;
}
