"use client";

import { MedicalRecord, TestResult } from "@/types/medical-record";
import { formatDate } from "@/lib/utils";
import { FlaskConical } from "lucide-react";

interface TestHistoryChartProps { records: MedicalRecord[]; }
interface TestRow { date: string; testName: string; value: string; unit: string; normalRange: string; }

export default function TestHistoryChart({ records }: TestHistoryChartProps) {
  const rows: TestRow[] = records
    .flatMap((record): TestRow[] =>
      record.testResults.map((t: TestResult) => ({
        date: t.date || record.consultationDate,
        testName: t.testName, value: t.value, unit: t.unit, normalRange: t.normalRange,
      }))
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 text-center text-sm text-[#94A3B8]">
        No test results found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              {["Date", "Test Name", "Value", "Normal Range"].map((h, i) => (
                <th key={h} className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#94A3B8]${i === 3 ? " hidden sm:table-cell" : ""}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                <td className="whitespace-nowrap px-4 py-3 text-xs text-[#94A3B8]">{formatDate(row.date)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="h-3.5 w-3.5 shrink-0 text-[#10B981]" />
                    <span className="font-medium text-[#E2E8F0]">{row.testName}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-[#E2E8F0]">{row.value}</span>
                  {row.unit && <span className="ml-1 text-xs text-[#94A3B8]">{row.unit}</span>}
                </td>
                <td className="px-4 py-3 text-[#94A3B8] hidden sm:table-cell">{row.normalRange || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
