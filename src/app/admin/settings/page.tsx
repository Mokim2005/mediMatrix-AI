"use client";

import { motion } from "framer-motion";
import MockDataManager from "@/components/admin/MockDataManager";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="relative min-h-screen bg-[#020817]">
      <div className="relative mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.05]">
            <Settings className="h-5 w-5 text-[#E2E8F0]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#E2E8F0]">System Settings</h1>
            <p className="text-sm text-[#94A3B8]">Inject mock data or wipe all system data.</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.07 }}>
          <MockDataManager />
        </motion.div>
      </div>
    </div>
  );
}
