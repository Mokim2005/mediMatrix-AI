"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";
import UploadZone from "@/components/patient/UploadZone";
import { MedicalRecord, MedicineCategory } from "@/types/medical-record";
import { Patient } from "@/types/patient";
import { formatDate } from "@/lib/utils";
import {
  User, Activity, Pill, FlaskConical, Heart, Wind, Save, AlertTriangle, CheckCircle2, ChevronDown,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.3, delay: d } }),
};

const CATEGORY_STYLE: Record<MedicineCategory, string> = {
  antibiotic: "border-red-500/20 bg-red-500/[0.08] text-red-300",
  gastric:    "border-amber-500/20 bg-amber-500/[0.08] text-amber-300",
  vitamin:    "border-[#10B981]/20 bg-[#10B981]/[0.08] text-[#10B981]",
  calcium:    "border-blue-500/20 bg-blue-500/[0.08] text-blue-300",
  other:      "border-white/10 bg-white/[0.04] text-[#94A3B8]",
};

export default function UploadPage() {
  const { patients, selectedPatient, selectPatient, addRecordToPatient, addAuditLog } = useApp();
  const router = useRouter();
  const [parsedRecord, setParsedRecord] = useState<MedicalRecord | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showPatientPicker, setShowPatientPicker] = useState(false);

  const handleParsedRecord = (record: MedicalRecord) => {
    setParsedRecord(record);
    setSaveError(null);
    // ── Audit log: parse success ───────────────────────────────────────────
    addAuditLog({
      logId:      `LOG-${Date.now()}`,
      timestamp:  new Date().toISOString(),
      actionType: "PARSE_SUCCESS",
      details:    `AI successfully extracted data from uploaded document. Doctor: ${record.doctorName || "Unknown"}. Medicines: ${record.medicines.length}. Tests: ${record.testResults.length}.`,
    });
    toast.success("AI extraction complete!", {
      description: `Extracted ${record.medicines.length} medicine${record.medicines.length !== 1 ? "s" : ""} and ${record.testResults.length} test result${record.testResults.length !== 1 ? "s" : ""}.`,
    });
  };

  const handleParseError = (errorMsg: string) => {
    // ── Audit log: parse failure ───────────────────────────────────────────
    addAuditLog({
      logId:      `LOG-${Date.now()}`,
      timestamp:  new Date().toISOString(),
      actionType: "PARSE_FAILURE",
      details:    `AI extraction failed. Reason: ${errorMsg}`,
    });
    toast.error("AI extraction failed", { description: errorMsg });
  };

  const handleSave = () => {
    if (!parsedRecord) return;

    if (!selectedPatient) {
      const msg = "No patient selected. Search for a patient on the Doctor Dashboard first.";
      setSaveError(msg);
      toast.error("No patient selected", { description: msg });
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      addRecordToPatient(selectedPatient.id, parsedRecord);
      toast.success("Record saved!", {
        description: `Consultation record saved to ${selectedPatient.name}'s lifetime history.`,
      });
      router.push("/patient/records");
    } catch {
      const msg = "Failed to save the record. Please try again.";
      setSaveError(msg);
      toast.error("Save failed", { description: msg });
      setIsSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#020817]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[#10B981]/[0.04] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
          <h1 className="text-2xl font-bold text-[#E2E8F0]">Upload Prescription</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Upload an image or PDF — AI will extract the medical data instantly.
          </p>
        </motion.div>

        {/* Patient Selector */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.04}>
          <div className="relative">
            <button
              onClick={() => setShowPatientPicker((v) => !v)}
              className="flex w-full items-center justify-between gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-left text-sm transition-all hover:bg-white/[0.06]"
            >
              {selectedPatient ? (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[#10B981]" />
                  <span className="text-[#E2E8F0] btn-text">{selectedPatient.name}</span>
                  <span className="font-mono text-xs text-[#10B981] btn-text">({selectedPatient.id})</span>
                </div>
              ) : (
                <span className="text-[#94A3B8] btn-text">Select a patient to save records for…</span>
              )}
              <ChevronDown className="h-4 w-4 text-[#94A3B8]" />
            </button>
            {showPatientPicker && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowPatientPicker(false)} />
                <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0F172A] shadow-2xl">
                  {patients.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-[#94A3B8]">No patients available.</p>
                  ) : (
                    patients.map((p: Patient) => (
                      <button
                        key={p.id}
                        onClick={() => { selectPatient(p); setShowPatientPicker(false); }}
                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/[0.04] ${
                          selectedPatient?.id === p.id ? "bg-[#10B981]/10 text-[#10B981]" : "text-[#E2E8F0]"
                        }`}
                      >
                        <User className="h-4 w-4 shrink-0" />
                        <span className="font-medium btn-text">{p.name}</span>
                        <span className="ml-auto font-mono text-xs text-[#94A3B8] btn-text">{p.id}</span>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
          {selectedPatient && (
            <p className="mt-2 text-xs text-[#10B981]">
              Saving records for <strong>{selectedPatient.name}</strong>
            </p>
          )}
        </motion.div>

        {!parsedRecord && (
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.07}>
            <UploadZone
              onParsedRecord={handleParsedRecord}
              onParseError={handleParseError}
            />
          </motion.div>
        )}

        {parsedRecord && (
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="space-y-5">
            {/* Success banner */}
            <div className="flex items-center gap-3 rounded-xl border border-[#10B981]/20 bg-[#10B981]/[0.08] px-4 py-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#10B981]" />
              <p className="text-sm font-medium text-[#10B981]">
                AI extraction complete. Review the data below before saving.
              </p>
            </div>

            {/* Vitals */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { icon: User,  label: "Doctor",          value: parsedRecord.doctorName || "—" },
                { icon: Wind,  label: "Respiratory Rate", value: `${parsedRecord.respiratoryRate || "Not Available"} br/min` },
                { icon: Heart, label: "Blood Pressure",  value: parsedRecord.bloodPressure || "—" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
                  <Icon className="h-5 w-5 shrink-0 text-[#10B981]" />
                  <div>
                    <p className="text-xs text-[#94A3B8]">{label}</p>
                    <p className="text-sm font-semibold text-[#E2E8F0]">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Date & Patient Case */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-3">
              <p className="text-xs text-[#94A3B8]">
                <span className="font-semibold text-[#E2E8F0]">Date: </span>
                {formatDate(parsedRecord.date ?? parsedRecord.consultationDate)}
              </p>
              {(parsedRecord.patientCase ?? parsedRecord.symptoms) && (
                <div>
                  <div className="mb-1.5 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-[#94A3B8]" />
                    <span className="text-xs font-semibold text-[#E2E8F0]">Patient Case / Symptoms</span>
                  </div>
                  <p className="text-sm leading-relaxed text-[#94A3B8]">{parsedRecord.patientCase ?? parsedRecord.symptoms}</p>
                </div>
              )}
              {parsedRecord.additionalNotes && (
                <div>
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#E2E8F0]">Additional Notes</span>
                  </div>
                  <p className="text-sm leading-relaxed text-[#94A3B8]">{parsedRecord.additionalNotes}</p>
                </div>
              )}
            </div>

            {/* Medicines */}
            {parsedRecord.medicines.length > 0 && (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Pill className="h-4 w-4 text-[#94A3B8]" />
                  <h3 className="text-sm font-bold text-[#E2E8F0]">
                    Medicines ({parsedRecord.medicines.length})
                  </h3>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {parsedRecord.medicines.map((med, i) => (
                    <div key={i} className={`rounded-xl border px-3 py-2.5 text-xs ${CATEGORY_STYLE[med.category]}`}>
                      <p className="font-bold">{med.name}</p>
                      <p className="mt-0.5 opacity-80">{med.dosage} · {med.frequency}</p>
                      <p className="opacity-60">Duration: {med.duration}</p>
                      <span className="mt-1 inline-block rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium capitalize">
                        {med.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Test Results */}
            {parsedRecord.testResults.length > 0 && (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                <div className="mb-3 flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-[#94A3B8]" />
                  <h3 className="text-sm font-bold text-[#E2E8F0]">
                    Test Results ({parsedRecord.testResults.length})
                  </h3>
                </div>
                <div className="overflow-hidden rounded-xl border border-white/[0.06]">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                        <th className="px-3 py-2 text-left font-semibold text-[#94A3B8]">Test</th>
                        <th className="px-3 py-2 text-left font-semibold text-[#94A3B8]">Value</th>
                        <th className="px-3 py-2 text-left font-semibold text-[#94A3B8] hidden sm:table-cell">
                          Normal Range
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {parsedRecord.testResults.map((t, i) => (
                        <tr key={i} className="hover:bg-white/[0.02]">
                          <td className="px-3 py-2 font-medium text-[#E2E8F0]">{t.testName}</td>
                          <td className="px-3 py-2 text-[#E2E8F0]">
                            {t.value}{t.unit ? ` ${t.unit}` : ""}
                          </td>
                          <td className="px-3 py-2 text-[#94A3B8] hidden sm:table-cell">
                            {t.normalRange || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {saveError && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-sm text-red-300">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                {saveError}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl bg-[#10B981] px-6 py-2.5 text-sm font-bold text-[#020817] shadow-lg shadow-[#10B981]/20 transition-all hover:bg-[#0EA472] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                <span className="btn-text">{isSaving ? "Saving…" : "Save to Lifetime Record"}</span>
              </button>
              <button
                onClick={() => { setParsedRecord(null); setSaveError(null); }}
                disabled={isSaving}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-[#94A3B8] transition-all hover:bg-white/[0.06] hover:text-[#E2E8F0] disabled:opacity-50"
              >
                <span className="btn-text">Upload Different File</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
