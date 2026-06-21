"use client";

import { motion } from "framer-motion";
import { MedicalRecord, MedicineCategory } from "@/types/medical-record";
import { formatDate } from "@/lib/utils";
import { Calendar, User, Pill, Activity } from "lucide-react";

interface RecordCardProps {
  record: MedicalRecord;
}

const CATEGORY_STYLES: Record<MedicineCategory, string> = {
  antibiotic: "border-red-500/20 bg-red-500/[0.08] text-red-400",
  gastric:    "border-amber-500/20 bg-amber-500/[0.08] text-amber-400",
  vitamin:    "border-[#10B981]/20 bg-[#10B981]/[0.08] text-[#10B981]",
  calcium:    "border-blue-500/20 bg-blue-500/[0.08] text-blue-400",
  other:      "border-white/10 bg-white/[0.04] text-[#94A3B8]",
};

const CATEGORY_LABEL: Record<MedicineCategory, string> = {
  antibiotic: "Antibiotic",
  gastric:    "Gastric",
  vitamin:    "Vitamin",
  calcium:    "Calcium",
  other:      "Other",
};

export default function RecordCard({ record }: RecordCardProps) {
  const categories = Array.from(
    new Set(record.medicines.map((m) => m.category))
  ) as MedicineCategory[];
  const hasAntibiotic = categories.includes("antibiotic");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -5,
        boxShadow: "0 20px 40px rgba(16,185,129,0.08)",
        borderColor: "rgba(16,185,129,0.25)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md p-5 cursor-default"
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#10B981]/10">
            <Calendar className="h-4 w-4 text-[#10B981]" />
          </div>
          <div>
            <p className="text-xs text-[#94A3B8]">Date</p>
            <p className="text-sm font-bold text-[#E2E8F0]">{formatDate(record.date ?? record.consultationDate)}</p>
          </div>
        </div>
        {hasAntibiotic && (
          <span className="flex shrink-0 items-center gap-1 rounded-full border border-red-500/20 bg-red-500/[0.08] px-2.5 py-1 text-xs font-bold text-red-400">
            <Pill className="h-3 w-3" />
            Antibiotic
          </span>
        )}
      </div>

      {/* Doctor */}
      <div className="mb-3 flex items-center gap-2">
        <User className="h-4 w-4 shrink-0 text-[#94A3B8]" />
        <p className="text-sm text-[#94A3B8]">
          <span className="font-semibold text-[#E2E8F0]">Doctor: </span>
          {record.doctorName}
        </p>
      </div>

      {/* Patient Case / Symptoms */}
      {(record.patientCase ?? record.symptoms) && (
        <div className="mb-4 flex items-start gap-2">
          <Activity className="mt-0.5 h-4 w-4 shrink-0 text-[#94A3B8]" />
          <p className="text-sm text-[#94A3B8] line-clamp-2">
            <span className="font-semibold text-[#E2E8F0]">Patient Case: </span>
            {record.patientCase ?? record.symptoms}
          </p>
        </div>
      )}

      {/* Category tags */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <span
              key={cat}
              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${CATEGORY_STYLES[cat]}`}
            >
              {CATEGORY_LABEL[cat]}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 flex items-center gap-4 border-t border-white/[0.05] pt-3 text-xs text-[#94A3B8]">
        <span>{record.medicines.length} medicine{record.medicines.length !== 1 ? "s" : ""}</span>
        {record.testResults.length > 0 && (
          <span>{record.testResults.length} test{record.testResults.length !== 1 ? "s" : ""}</span>
        )}
        {record.bloodPressure && <span>BP: {record.bloodPressure}</span>}
      </div>
    </motion.div>
  );
}
