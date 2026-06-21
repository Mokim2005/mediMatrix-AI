"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { LayoutDashboard, Users } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.3, delay: d } }),
};

export default function DoctorPatientsPage() {
  const { patients, selectPatient } = useApp();
  const router = useRouter();

  const handleViewDashboard = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    if (patient) { selectPatient(patient); router.push("/doctor/dashboard"); }
  };

  return (
    <div className="relative min-h-screen bg-[#020817]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-20 h-[400px] w-[400px] rounded-full bg-[#10B981]/[0.04] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#10B981]/20 bg-[#10B981]/10">
            <Users className="h-5 w-5 text-[#10B981]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#E2E8F0]">All Patients</h1>
            <p className="text-sm text-[#94A3B8]">{patients.length} registered patients</p>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.07}
          className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md shadow-xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  {["Patient ID", "Name", "Age", "Gender", "Blood Group", "Consultations", ""].map((h, i) => (
                    <th key={i} className={`px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#94A3B8]${i === 4 ? " hidden sm:table-cell" : ""}${i === 5 ? " hidden md:table-cell" : ""}${i === 6 ? " text-right" : ""}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <span className="rounded-md border border-[#10B981]/20 bg-[#10B981]/10 px-2 py-1 font-mono text-xs font-semibold text-[#10B981]">
                        {patient.id}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-[#E2E8F0]">{patient.name}</td>
                    <td className="px-5 py-4 text-[#94A3B8]">{patient.age}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium border ${patient.gender === "Female" ? "border-pink-500/20 bg-pink-500/[0.08] text-pink-400" : "border-blue-500/20 bg-blue-500/[0.08] text-blue-400"}`}>
                        {patient.gender}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#94A3B8] hidden sm:table-cell">{patient.bloodGroup}</td>
                    <td className="px-5 py-4 text-[#94A3B8] hidden md:table-cell">{patient.records.length}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleViewDashboard(patient.id)}
                        className="flex items-center gap-1.5 ml-auto rounded-lg bg-[#10B981] px-3 py-1.5 text-xs font-semibold text-[#020817] shadow-lg shadow-[#10B981]/10 transition-all hover:bg-[#0EA472] active:scale-95"
                      >
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        <span className="btn-text">View Dashboard</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {patients.length === 0 && (
            <div className="py-16 text-center text-sm text-[#94A3B8]">No patients found.</div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
