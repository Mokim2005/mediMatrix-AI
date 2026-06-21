"use client";

import { MedicalRecord, MedicineCategory } from "@/types/medical-record";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface MedicineChartProps {
  records: MedicalRecord[];
}

const CATEGORY_COLORS: Record<MedicineCategory, string> = {
  antibiotic: "#EF4444",
  gastric:    "#F59E0B",
  vitamin:    "#10B981",
  calcium:    "#3B82F6",
  other:      "#94A3B8",
};

const CATEGORY_LABELS: Record<MedicineCategory, string> = {
  antibiotic: "Antibiotic",
  gastric:    "Gastric",
  vitamin:    "Vitamin",
  calcium:    "Calcium",
  other:      "Other",
};

export default function MedicineChart({ records }: MedicineChartProps) {
  const categories = ["antibiotic", "gastric", "vitamin", "calcium", "other"] as MedicineCategory[];
  const data = categories.map((cat) => ({
    name: CATEGORY_LABELS[cat],
    count: records.flatMap((r) => r.medicines).filter((m) => m.category === cat).length,
    fill: CATEGORY_COLORS[cat],
  }));

  const total = data.reduce((s, d) => s + d.count, 0);
  if (total === 0) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 text-center text-sm text-[#94A3B8]">
        No medicine data to chart.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: "#0F172A", border: "1px solid rgba(226,232,240,0.08)", borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: "#E2E8F0" }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
