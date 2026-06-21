"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import PatientSearch from "@/components/doctor/PatientSearch";
import AntibioticTracker from "@/components/doctor/AntibioticTracker";
import TestHistoryChart from "@/components/doctor/TestHistoryChart";
import ConsultationDetails from "@/components/doctor/ConsultationDetails";
import MedicineChart from "@/components/doctor/MedicineChart";
import { MedicalRecord, MedicineCategory } from "@/types/medical-record";
import { formatDate } from "@/lib/utils";
import { User, ClipboardList, Pill, FlaskConical, Clock, ChevronDown, ChevronUp, LayoutDashboard, Heart } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.3, delay: d } }),
};

const MEDICINE_SECTIONS: { category: MedicineCategory; label: string; accent: string }[] = [
  { category: "vitamin",  label: "Vitamins", accent: "border-[#10B981]/20 bg-[#10B981]/[0.08] text-[#10B981]" },
  { category: "calcium",  label: "Calcium",  accent: "border-blue-500/20 bg-blue-500/[0.08] text-blue-400" },
  { category: "gastric",  label: "Gastric",  accent: "border-amber-500/20 bg-amber-500/[0.08] text-amber-400" },
  { category: "other",    label: "Others",   accent: "border-white/10 bg-white/[0.04] text-[#94A3B8]" },
];

function MedCategoryCount({ records, category, label, accent }: { records: MedicalRecord[]; category: MedicineCategory; label: string; accent: string }) {
  const count = records.flatMap((r) => r.medicines).filter((m) => m.category === category).length;
  return (
    <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${accent}`}>
      <span className="text-sm font-medium">{label}</span>
      <span className="text-xl font-bold">{count}</span>
    </div>
  );
}

export default function DoctorDashboardPage() {
  const { selectedPatient } = useApp();
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
  const [modalRecord, setModalRecord] = useState<MedicalRecord | null>(null);
  const records = selectedPatient?.records ?? [];

  return (
    <div className="relative min-h-screen bg-[#020817]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-[#10B981]/[0.04] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Top bar */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#10B981]/20 bg-[#10B981]/10">
              <LayoutDashboard className="h-5 w-5 text-[#10B981]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#E2E8F0]">Doctor Dashboard</h1>
              <p className="text-sm text-[#94A3B8]">Patient lifetime analytics</p>
            </div>
          </div>
          <PatientSearch />
        </motion.div>

        {/* Empty state */}
        {!selectedPatient && (
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.07}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/[0.08] bg-white/[0.02] py-20 text-center"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03]">
              <User className="h-8 w-8 text-[#94A3B8]" />
            </div>
            <p className="text-lg font-semibold text-[#E2E8F0]">No Patient Selected</p>
            <p className="mt-1 text-sm text-[#94A3B8]">Select or Search a Patient ID to view lifetime analytics.</p>
          </motion.div>
        )}

        {selectedPatient && (
          <div className="space-y-6">
            {/* Patient overview */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.07}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md p-6"
            >
              <div className="mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-[#10B981]" />
                <h2 className="text-base font-bold text-[#E2E8F0]">Patient Overview</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
                {[
                  { label: "Patient ID",         value: selectedPatient.id,              mono: true },
                  { label: "Name",               value: selectedPatient.name,            mono: false },
                  { label: "Age",                value: `${selectedPatient.age} yrs`,    mono: false },
                  { label: "Gender",             value: selectedPatient.gender,          mono: false },
                  { label: "Total Consultations",value: String(records.length),          mono: false },
                ].map(({ label, value, mono }) => (
                  <div key={label}>
                    <p className="text-xs text-[#94A3B8]">{label}</p>
                    <p className={`mt-0.5 text-sm font-semibold ${mono ? "font-mono text-[#10B981]" : "text-[#E2E8F0]"}`}>{value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Vital Signs Card */}
            {records.length > 0 && (() => {
              const latest = records.reduce((a, b) =>
                new Date(b.date ?? b.consultationDate).getTime() > new Date(a.date ?? a.consultationDate).getTime() ? b : a
              );
              return (
                <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.1}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md p-6"
                >
                  <div className="mb-4 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-[#10B981]" />
                    <h2 className="text-base font-bold text-[#E2E8F0]">Vital Signs</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                      <p className="text-xs text-[#94A3B8]">Blood Pressure</p>
                      <p className="mt-1 text-lg font-bold text-[#E2E8F0]">{latest.bloodPressure || "—"}</p>
                      <p className="text-xs text-[#94A3B8]">mmHg</p>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                      <p className="text-xs text-[#94A3B8]">Respiratory Rate</p>
                      <p className="mt-1 text-lg font-bold text-[#E2E8F0]">{latest.respiratoryRate || "—"}</p>
                      <p className="text-xs text-[#94A3B8]">br/min</p>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                      <p className="text-xs text-[#94A3B8]">Last Updated</p>
                      <p className="mt-1 text-lg font-bold text-[#E2E8F0]">{formatDate(latest.date ?? latest.consultationDate)}</p>
                      <p className="text-xs text-[#94A3B8]">{records.length} record{records.length > 1 ? "s" : ""}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })()}

            {/* Analytics grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.14}
                whileHover={{ y: -4, boxShadow: "0 16px 32px rgba(16,185,129,0.06)" }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md p-6"
              >
                <div className="mb-4 flex items-center gap-2">
                  <Pill className="h-5 w-5 text-red-400" />
                  <h2 className="text-base font-bold text-[#E2E8F0]">Antibiotic Tracker</h2>
                </div>
                <AntibioticTracker records={records} />
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.21}
                whileHover={{ y: -4, boxShadow: "0 16px 32px rgba(16,185,129,0.06)" }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md p-6"
              >
                <div className="mb-4 flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-[#10B981]" />
                  <h2 className="text-base font-bold text-[#E2E8F0]">Medication Categories</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {MEDICINE_SECTIONS.map(({ category, label, accent }) => (
                    <MedCategoryCount key={category} records={records} category={category} label={label} accent={accent} />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Patient Case Summary */}
            {records.length > 0 && (() => {
              const latest = records.reduce((a, b) =>
                new Date(b.date ?? b.consultationDate).getTime() > new Date(a.date ?? a.consultationDate).getTime() ? b : a
              );
              return (
                <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.23}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md p-6"
                >
                  <div className="mb-4 flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-[#10B981]" />
                    <h2 className="text-base font-bold text-[#E2E8F0]">Patient Case Summary</h2>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs text-[#94A3B8]">Latest Case</p>
                      <span className="font-mono text-xs text-[#10B981]">{formatDate(latest.date ?? latest.consultationDate)}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-[#E2E8F0]">{latest.patientCase ?? latest.symptoms}</p>
                  </div>
                </motion.div>
              );
            })()}

            {/* Medicine Distribution Chart */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.28}
              whileHover={{ y: -4, boxShadow: "0 16px 32px rgba(16,185,129,0.06)" }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md p-6"
            >
              <div className="mb-4 flex items-center gap-2">
                <Pill className="h-5 w-5 text-[#10B981]" />
                <h2 className="text-base font-bold text-[#E2E8F0]">Medicine Distribution</h2>
              </div>
              <MedicineChart records={records} />
            </motion.div>

            {/* Diagnostic analytics */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.28}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md p-6"
            >
              <div className="mb-4 flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-[#10B981]" />
                <h2 className="text-base font-bold text-[#E2E8F0]">Diagnostic Analytics</h2>
              </div>
              <TestHistoryChart records={records} />
            </motion.div>

            {/* Timeline */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.35}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md p-6"
            >
              <div className="mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#10B981]" />
                <h2 className="text-base font-bold text-[#E2E8F0]">Consultation Timeline</h2>
              </div>

              <div className="space-y-3">
                {[...records].sort((a, b) => new Date(b.date ?? b.consultationDate).getTime() - new Date(a.date ?? a.consultationDate).getTime()).map((record) => {
                  const isExpanded = expandedRecord === record.id;
                  return (
                    <div key={record.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] transition-all">
                      <div className="flex items-center justify-between px-4 py-3.5">
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="font-mono text-xs font-semibold text-[#10B981] border border-[#10B981]/20 bg-[#10B981]/10 px-2 py-0.5 rounded">
                            {formatDate(record.date ?? record.consultationDate)}
                          </span>
                          <span className="text-sm font-medium text-[#E2E8F0]">{record.doctorName}</span>
                          <span className="hidden sm:inline text-xs text-[#94A3B8] max-w-xs truncate">
                            {(record.patientCase ?? record.symptoms).substring(0, 60)}…
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setModalRecord(record)}
                            className="rounded-lg border border-[#10B981]/20 bg-[#10B981]/10 px-3 py-1.5 text-xs font-semibold text-[#10B981] transition-colors hover:bg-[#10B981]/20"
                          >
                            <span className="btn-text">View Details</span>
                          </button>
                          <button
                            onClick={() => setExpandedRecord(isExpanded ? null : record.id)}
                            className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-1.5 text-[#94A3B8] transition-colors hover:bg-white/[0.06] hover:text-[#E2E8F0]"
                            aria-label="Toggle expand"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-white/[0.06] px-4 pb-4 pt-3 text-xs text-[#94A3B8] space-y-1.5">
                          <p><span className="font-semibold text-[#E2E8F0]">Patient Case: </span>{record.patientCase ?? record.symptoms}</p>
                          <p>
                            <span className="font-semibold text-[#E2E8F0]">BP: </span>{record.bloodPressure} mmHg
                            &nbsp;|&nbsp;<span className="font-semibold text-[#E2E8F0]">RR: </span>{record.respiratoryRate || "Not Available"} br/min
                          </p>
                          <p><span className="font-semibold text-[#E2E8F0]">Medicines: </span>{record.medicines.map((m) => m.name).join(", ") || "None"}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {records.length === 0 && (
                <p className="py-8 text-center text-sm text-[#94A3B8]">No consultation records found.</p>
              )}
            </motion.div>
          </div>
        )}
      </div>

      {modalRecord && <ConsultationDetails record={modalRecord} onClose={() => setModalRecord(null)} />}
    </div>
  );
}
