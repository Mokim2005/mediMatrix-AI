"use client";

import { MedicalRecord, Medicine } from "@/types/medical-record";
import { formatDate } from "@/lib/utils";
import { Pill, Calendar, Hash } from "lucide-react";

interface AntibioticTrackerProps { records: MedicalRecord[]; }
interface AntibioticEntry { medicine: Medicine; consultationDate: string; recordId: string; }

export default function AntibioticTracker({ records }: AntibioticTrackerProps) {
  const antibioticEntries: AntibioticEntry[] = records.flatMap((record) =>
    record.medicines.filter((m) => m.category === "antibiotic").map((medicine) => ({
      medicine, consultationDate: record.consultationDate, recordId: record.id,
    }))
  );

  if (antibioticEntries.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 text-center text-sm text-[#94A3B8]">
        No antibiotic prescriptions found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
          <Pill className="h-5 w-5 text-red-400" />
        </div>
        <div>
          <p className="text-xs font-medium text-red-400">Total Antibiotic Prescriptions</p>
          <p className="text-2xl font-bold text-red-300">{antibioticEntries.length}</p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {antibioticEntries.map((entry, idx) => (
          <div key={`${entry.recordId}-${idx}`} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-[#10B981]/20">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
                  <Pill className="h-4 w-4 text-red-400" />
                </div>
                <span className="text-sm font-semibold text-[#E2E8F0]">{entry.medicine.name}</span>
              </div>
              <span className="rounded-full border border-red-500/20 bg-red-500/[0.08] px-2 py-0.5 text-xs font-medium text-red-400">Antibiotic</span>
            </div>
            <div className="space-y-1.5 text-xs text-[#94A3B8]">
              <div className="flex items-center gap-2">
                <Hash className="h-3.5 w-3.5 text-[#94A3B8]" />
                <span><span className="text-[#E2E8F0]">Dosage:</span> {entry.medicine.dosage} — {entry.medicine.frequency}</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="h-3.5 w-3.5 text-[#94A3B8]" />
                <span><span className="text-[#E2E8F0]">Duration:</span> {entry.medicine.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-[#94A3B8]" />
                <span><span className="text-[#E2E8F0]">Prescribed:</span> {formatDate(entry.consultationDate)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
