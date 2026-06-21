"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, Users, ClipboardList, Settings, FileText, UserCheck, UserX, Activity, ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.3, delay: d } }),
};

export default function AdminDashboardPage() {
  const { patients, auditLogs } = useApp();

  const totalRecordsParsed = patients.reduce((sum, p) => sum + p.records.length, 0);
  const activePatientsCount = patients.filter((p) => p.status === "active").length;
  const suspendedUsersCount = patients.filter((p) => p.status === "suspended").length;
  const systemStatus = patients.length > 0 ? "Operational" : "Empty";

  const totalAIParseSuccess = auditLogs.filter((l) => l.actionType === "PARSE_SUCCESS").length;
  const totalAIParseFailure = auditLogs.filter((l) => l.actionType === "PARSE_FAILURE").length;
  const totalDocsUploaded = totalAIParseSuccess + totalAIParseFailure;

  const stats = [
    { label: "Total Records",    value: totalRecordsParsed, icon: FileText,   accent: "border-[#10B981]/20 bg-[#10B981]/10 text-[#10B981]" },
    { label: "AI Parse Success", value: totalAIParseSuccess, icon: UserCheck,  accent: "border-[#10B981]/20 bg-[#10B981]/10 text-[#10B981]" },
    { label: "AI Parse Failures",value: totalAIParseFailure, icon: UserX,      accent: "border-amber-500/20 bg-amber-500/10 text-amber-400" },
    { label: "Total Uploaded",   value: totalDocsUploaded,   icon: Activity,   accent: "border-blue-500/20 bg-blue-500/10 text-blue-400" },
  ];

  const navCards = [
    { href: "/admin/users",    icon: Users,        title: "User Management",  description: "View, suspend, or delete patients and doctors.", accent: "hover:border-[#10B981]/30" },
    { href: "/admin/audit",    icon: ClipboardList, title: "Audit Logs",       description: `${auditLogs.length} log${auditLogs.length !== 1 ? "s" : ""} recorded. Review all system activity.`, accent: "hover:border-blue-500/30" },
    { href: "/admin/settings", icon: Settings,     title: "System Settings",  description: "Inject mock data or clear all system data.", accent: "hover:border-amber-500/30" },
  ];

  return (
    <div className="relative min-h-screen bg-[#020817]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#10B981]/[0.04] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.10] bg-white/[0.05]">
            <ShieldCheck className="h-6 w-6 text-[#10B981]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#E2E8F0]">Admin Dashboard</h1>
            <p className="text-sm text-[#94A3B8]">System overview and management controls</p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.07} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, accent }) => (
            <motion.div
              key={label}
              whileHover={{ y: -4, boxShadow: "0 16px 32px rgba(0,0,0,0.3)" }}
              transition={{ type: "spring", stiffness: 350, damping: 22 }}
              className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md p-5 cursor-default"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${accent}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-[#94A3B8]">{label}</p>
                <p className="mt-0.5 text-2xl font-bold text-[#E2E8F0]">{value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Nav cards */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.14} className="grid gap-5 sm:grid-cols-3">
          {navCards.map(({ href, icon: Icon, title, description, accent }) => (
            <motion.div
              key={href}
              whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
            >
              <Link href={href}
                className={`group flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md p-6 transition-colors duration-300 ${accent}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#10B981]/20 bg-[#10B981]/10">
                  <Icon className="h-6 w-6 text-[#10B981]" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-[#E2E8F0]">{title}</p>
                  <p className="mt-1 text-sm text-[#94A3B8]">{description}</p>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-[#10B981] opacity-0 transition-opacity group-hover:opacity-100">
                  Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
