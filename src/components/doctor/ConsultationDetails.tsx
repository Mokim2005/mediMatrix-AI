"use client";

import { MedicalRecord, Medicine, MedicineCategory } from "@/types/medical-record";
import { formatDate } from "@/lib/utils";
import { X, User, Activity, Pill, FlaskConical, Heart, Wind } from "lucide-react";

interface ConsultationDetailsProps { record: MedicalRecord; onClose: () => void; }

const categoryLabel: Record<MedicineCategory, string> = {
  antibiotic: "Antibiotics", gastric: "Gastric", vitamin: "Vitamins", calcium: "Calcium", other: "Others",
};

const categoryColor: Record<MedicineCategory, string> = {
  antibiotic: "border-red-500/20 bg-red-500/[0.08] text-red-300",
  gastric:    "border-amber-500/20 bg-amber-500/[0.08] text-amber-300",
  vitamin:    "border-[#10B981]/20 bg-[#10B981]/[0.08] text-[#10B981]",
  calcium:    "border-blue-500/20 bg-blue-500/[0.08] text-blue-300",
  other:      "border-white/10 bg-white/[0.04] text-[#94A3B8]",
};

const categoryCardColor: Record<MedicineCategory, string> = {
  antibiotic: "border-red-500/10 bg-red-500/[0.05]",
  gastric:    "border-amber-500/10 bg-amber-500/[0.05]",
  vitamin:    "border-[#10B981]/10 bg-[#10B981]/[0.05]",
  calcium:    "border-blue-500/10 bg-blue-500/[0.05]",
  other:      "border-white/[0.06] bg-white/[0.03]",
};

function groupMedicines(medicines: Medicine[]): Partial<Record<MedicineCategory, Medicine[]>> {
  return medicines.reduce<Partial<Record<MedicineCategory, Medicine[]>>>((acc, med) => {
    const existing = acc[med.category] ?? [];
    return { ...acc, [med.category]: [...existing, med] };
  }, {});
}

export default function ConsultationDetails({ record, onClose }: ConsultationDetailsProps) {
  const grouped = groupMedicines(record.medicines);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/80 p-4 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/[0.10] bg-[#0F172A] shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-white/[0.06] bg-[#0F172A] px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-[#E2E8F0]">Consultation Details</h2>
            <p className="text-xs text-[#94A3B8]">{formatDate(record.date ?? record.consultationDate)}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-[#94A3B8] transition-colors hover:bg-white/[0.06] hover:text-[#E2E8F0]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          {/* Vitals */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: User,  label: "Doctor",           value: record.doctorName,               color: "text-[#10B981]" },
              { icon: Wind,  label: "Respiratory Rate",  value: `${record.respiratoryRate || "Not Available"} br/min`, color: "text-[#E2E8F0]" },
              { icon: Heart, label: "Blood Pressure",   value: `${record.bloodPressure} mmHg`,  color: "text-[#E2E8F0]" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
                <Icon className="h-5 w-5 shrink-0 text-[#10B981]" />
                <div>
                  <p className="text-xs text-[#94A3B8]">{label}</p>
                  <p className={`text-sm font-semibold ${color}`}>{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Patient Case / Symptoms */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="mb-2 flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#94A3B8]" />
              <h3 className="text-sm font-semibold text-[#E2E8F0]">Patient Case / Symptoms</h3>
            </div>
            <p className="text-sm leading-relaxed text-[#94A3B8]">{record.patientCase ?? record.symptoms}</p>
          </div>

          {/* Medicines */}
          {record.medicines.length > 0 && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Pill className="h-4 w-4 text-[#94A3B8]" />
                <h3 className="text-sm font-semibold text-[#E2E8F0]">Medicines</h3>
              </div>
              <div className="space-y-3">
                {(Object.keys(grouped) as MedicineCategory[]).map((cat) => (
                  <div key={cat}>
                    <span className={`mb-2 inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${categoryColor[cat]}`}>
                      {categoryLabel[cat]}
                    </span>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {grouped[cat]!.map((med, i) => (
                        <div key={i} className={`rounded-lg border px-3 py-2.5 text-xs ${categoryCardColor[cat]}`}>
                          <p className="font-semibold text-[#E2E8F0]">{med.name}</p>
                          <p className="text-[#94A3B8]">{med.dosage} · {med.frequency}</p>
                          <p className="text-[#94A3B8]/60">Duration: {med.duration}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Test Results */}
          {record.testResults.length > 0 && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-[#94A3B8]" />
                <h3 className="text-sm font-semibold text-[#E2E8F0]">Test Results</h3>
              </div>
              <div className="overflow-hidden rounded-xl border border-white/[0.06]">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                      <th className="px-3 py-2.5 text-left font-semibold text-[#94A3B8]">Test</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-[#94A3B8]">Value</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-[#94A3B8] hidden sm:table-cell">Normal Range</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {record.testResults.map((t, i) => (
                      <tr key={i} className="hover:bg-white/[0.02]">
                        <td className="px-3 py-2.5 font-medium text-[#E2E8F0]">{t.testName}</td>
                        <td className="px-3 py-2.5 text-[#E2E8F0]">{t.value}{t.unit ? ` ${t.unit}` : ""}</td>
                        <td className="px-3 py-2.5 text-[#94A3B8] hidden sm:table-cell">{t.normalRange || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
