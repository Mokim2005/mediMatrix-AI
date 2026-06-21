"use client";

import { motion } from "framer-motion";
import UserTable from "@/components/admin/UserTable";
import { Users } from "lucide-react";

export default function AdminUsersPage() {
  return (
    <div className="relative min-h-screen bg-[#020817]">
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#10B981]/20 bg-[#10B981]/10">
            <Users className="h-5 w-5 text-[#10B981]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#E2E8F0]">User Management</h1>
            <p className="text-sm text-[#94A3B8]">Manage patients and doctors — suspend, activate, or delete.</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.07 }}>
          <UserTable />
        </motion.div>
      </div>
    </div>
  );
}
