// ─── Storage Keys ────────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  PATIENTS:         "hc_patients",
  AUDIT_LOGS:       "hc_audit_logs",
  DOCTORS:          "hc_doctors",
  SELECTED_PATIENT: "hc_selected_patient_id",
} as const;

// ─── File Upload ──────────────────────────────────────────────────────────────
export const UPLOAD_ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "application/pdf"] as const;
export const UPLOAD_MAX_SIZE_MB = 10;

// ─── Pagination ───────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 20;

// ─── Medicine categories ──────────────────────────────────────────────────────
export const MEDICINE_CATEGORY_LABELS = {
  antibiotic: "Antibiotic",
  gastric:    "Gastric",
  vitamin:    "Vitamin",
  calcium:    "Calcium",
  other:      "Other",
} as const;

// ─── Gemini ───────────────────────────────────────────────────────────────────
export const GEMINI_MODEL = "gemini-2.5-flash";
