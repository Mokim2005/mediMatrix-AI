"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { Patient } from "@/types/patient";
import { formatDate } from "@/lib/utils";
import { UploadCloud, ClipboardList, FileText, Calendar, User, ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.3, delay: d } }),
};

export default function PatientHomePage() {
  const { patients, selectedPatient, selectPatient } = useApp();
  const [showPatientPicker, setShowPatientPicker] = useState(false);
  const records = selectedPatient?.records ?? [];
  const totalDocuments = records.length;
  const lastConsultation = records.length > 0
    ? [...records].sort((a, b) => new Date(b.consultationDate).getTime() - new Date(a.consultationDate).getTime())[0]?.consultationDate ?? null
    : null;

  return (
    <div className="relative min-h-screen bg-[#020817]">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-[#10B981]/[0.05] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20">
            <User className="h-6 w-6 text-[#10B981]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#E2E8F0]">
              {selectedPatient ? `Welcome, ${selectedPatient.name}` : "Patient Portal"}
            </h1>
            <p className="text-sm text-[#94A3B8]">Manage your prescriptions and medical history</p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.07} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { icon: FileText, label: "Total Documents Uploaded", value: totalDocuments, color: "text-[#10B981]" },
            { icon: Calendar, label: "Last Consultation", value: lastConsultation ? formatDate(lastConsultation) : "No records yet", color: "text-[#E2E8F0]" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#10B981]/10">
                <Icon className="h-5 w-5 text-[#10B981]" />
              </div>
              <div>
                <p className="text-xs text-[#94A3B8]">{label}</p>
                <p className={`text-lg font-bold ${color}`}>{value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Action cards */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.14} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <motion.div
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(16,185,129,0.10)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
          >
            <Link href="/patient/upload" className="group flex flex-col gap-4 rounded-2xl border-2 border-dashed border-[#10B981]/20 bg-white/[0.02] p-7 transition-colors duration-300 hover:border-[#10B981]/50 hover:bg-[#10B981]/[0.04]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#10B981]/10 transition-colors group-hover:bg-[#10B981]/20">
                <UploadCloud className="h-7 w-7 text-[#10B981]" />
              </div>
              <div>
                <p className="text-lg font-bold text-[#E2E8F0]">Upload New Prescription</p>
                <p className="mt-1 text-sm text-[#94A3B8]">
                  Snap or upload a prescription — our AI will extract medicines, tests, and vitals automatically.
                </p>
              </div>
              <span className="mt-auto flex items-center gap-1 text-sm font-semibold text-[#10B981]">
                Get started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(255,255,255,0.04)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
          >
            <Link href="/patient/records" className="group flex flex-col gap-4 rounded-2xl border-2 border-dashed border-white/[0.08] bg-white/[0.02] p-7 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.04]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.06] transition-colors group-hover:bg-white/10">
                <ClipboardList className="h-7 w-7 text-[#94A3B8] group-hover:text-[#E2E8F0] transition-colors" />
              </div>
              <div>
                <p className="text-lg font-bold text-[#E2E8F0]">Medical History Timeline</p>
                <p className="mt-1 text-sm text-[#94A3B8]">
                  Review all your past consultations, prescriptions, and test results in one place.
                </p>
              </div>
              <span className="mt-auto flex items-center gap-1 text-sm font-semibold text-[#94A3B8] group-hover:text-[#E2E8F0] transition-colors">
                View history <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Patient Selector */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.21}>
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
                <span className="text-[#94A3B8] btn-text">Select a patient to view their portal…</span>
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
        </motion.div>
      </div>
    </div>
  );
}
