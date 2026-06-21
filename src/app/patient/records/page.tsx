"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import RecordCard from "@/components/patient/RecordCard";
import { MedicalRecord } from "@/types/medical-record";
import { Patient } from "@/types/patient";
import { UploadCloud, ClipboardList, User, ChevronDown } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.3, delay: d } }),
};

export default function RecordsPage() {
  const { patients, selectedPatient, selectPatient } = useApp();
  const [showPatientPicker, setShowPatientPicker] = useState(false);
  const sortedRecords: MedicalRecord[] = selectedPatient
    ? [...selectedPatient.records].sort((a, b) => new Date(b.consultationDate).getTime() - new Date(a.consultationDate).getTime())
    : [];

  return (
    <div className="relative min-h-screen bg-[#020817]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-20 h-[400px] w-[400px] rounded-full bg-[#10B981]/[0.04] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981]/10 border border-[#10B981]/20">
              <ClipboardList className="h-5 w-5 text-[#10B981]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#E2E8F0]">Medical History</h1>
              <p className="text-sm text-[#94A3B8]">
                {selectedPatient
                  ? `${selectedPatient.name} · ${sortedRecords.length} record${sortedRecords.length !== 1 ? "s" : ""}`
                  : "Select a patient to view records"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Patient picker */}
            <div className="relative">
              <button
                onClick={() => setShowPatientPicker((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-[#94A3B8] transition-all hover:bg-white/[0.06]"
              >
                {selectedPatient ? (
                  <>
                    <User className="h-4 w-4 text-[#10B981]" />
                    <span className="text-[#E2E8F0] btn-text">{selectedPatient.id}</span>
                  </>
                ) : (
                  <span className="btn-text">Select Patient</span>
                )}
                <ChevronDown className="h-4 w-4" />
              </button>
              {showPatientPicker && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowPatientPicker(false)} />
                  <div className="absolute right-0 top-full z-20 mt-1 w-64 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0F172A] shadow-2xl">
                    {patients.map((p: Patient) => (
                      <button
                        key={p.id}
                        onClick={() => { selectPatient(p); setShowPatientPicker(false); }}
                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/[0.04] ${
                          selectedPatient?.id === p.id ? "bg-[#10B981]/10 text-[#10B981]" : "text-[#E2E8F0]"
                        }`}
                      >
                        <span className="font-medium btn-text">{p.name}</span>
                        <span className="ml-auto font-mono text-xs text-[#94A3B8] btn-text">{p.id}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <Link href="/patient/upload" className="flex items-center gap-2 rounded-xl bg-[#10B981] px-4 py-2.5 text-sm font-semibold text-[#020817] shadow-lg shadow-[#10B981]/20 transition-all hover:bg-[#0EA472]">
              <UploadCloud className="h-4 w-4" />
              <span className="btn-text">Upload New</span>
            </Link>
          </div>
        </motion.div>

        {/* Records grid */}
        {sortedRecords.length > 0 ? (
          <motion.div
            className="grid gap-4 sm:grid-cols-2"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          >
            {sortedRecords.map((record) => (
              <motion.div
                key={record.id}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.32 } } }}
              >
                <RecordCard record={record} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.07}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/[0.08] bg-white/[0.02] py-20 text-center px-6"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03]">
              <ClipboardList className="h-8 w-8 text-[#94A3B8]" />
            </div>
            <p className="text-lg font-semibold text-[#E2E8F0]">
              {selectedPatient ? "No records found" : "No patient selected"}
            </p>
            <p className="mt-2 max-w-sm text-sm text-[#94A3B8]">
              {selectedPatient
                ? "Upload your first prescription and our AI will extract all medical details automatically."
                : "Select a patient from the Doctor Dashboard, then come back to view or upload records."}
            </p>
            <Link href="/patient/upload" className="mt-6 flex items-center gap-2 rounded-xl bg-[#10B981] px-5 py-2.5 text-sm font-semibold text-[#020817] shadow-lg shadow-[#10B981]/20 transition-all hover:bg-[#0EA472]">
              <UploadCloud className="h-4 w-4" />
              <span className="btn-text">Upload Your First Document</span>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
