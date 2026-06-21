"use client";

import { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { AuditActionType } from "@/types/admin";
import { cn } from "@/lib/utils";
import { Search, Filter, ClipboardList } from "lucide-react";

const BADGE_STYLES: Record<AuditActionType, string> = {
  PARSE_SUCCESS:      "border-[#10B981]/20 bg-[#10B981]/10 text-[#10B981]",
  PARSE_FAILURE:      "border-red-500/20 bg-red-500/10 text-red-400",
  SYSTEM_RESET:       "border-red-500/20 bg-red-500/10 text-red-400",
  MOCK_DATA_INJECTED: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  USER_SUSPENDED:     "border-amber-500/20 bg-amber-500/10 text-amber-400",
  USER_DELETED:       "border-red-500/20 bg-red-500/10 text-red-400",
};

const BADGE_LABELS: Record<AuditActionType, string> = {
  PARSE_SUCCESS:      "Parse Success",
  PARSE_FAILURE:      "Parse Failure",
  SYSTEM_RESET:       "System Reset",
  MOCK_DATA_INJECTED: "Mock Data Injected",
  USER_SUSPENDED:     "User Suspended",
  USER_DELETED:       "User Deleted",
};

const ALL_ACTION_TYPES: AuditActionType[] = ["PARSE_SUCCESS", "PARSE_FAILURE", "SYSTEM_RESET", "MOCK_DATA_INJECTED", "USER_SUSPENDED", "USER_DELETED"];

function formatTimestamp(iso: string): string {
  try { return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso)); }
  catch { return iso; }
}

export default function AuditLogTable() {
  const { auditLogs } = useApp();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<AuditActionType | "ALL">("ALL");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return auditLogs.filter((log) => {
      const matchesType = filterType === "ALL" || log.actionType === filterType;
      const matchesSearch = !q || log.details.toLowerCase().includes(q) || log.actionType.toLowerCase().includes(q) || log.logId.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [auditLogs, search, filterType]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search logs…"
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-9 pr-3 text-sm text-[#E2E8F0] outline-none placeholder:text-[#94A3B8] focus:border-[#10B981]/40 focus:ring-2 focus:ring-[#10B981]/10 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 shrink-0 text-[#94A3B8]" />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value as AuditActionType | "ALL")}
            className="rounded-xl border border-white/[0.08] bg-[#0F172A] px-3 py-2.5 text-sm text-[#E2E8F0] outline-none focus:border-[#10B981]/40 focus:ring-2 focus:ring-[#10B981]/10 transition-all"
          >
            <option value="ALL">All Types</option>
            {ALL_ACTION_TYPES.map((t) => <option key={t} value={t}>{BADGE_LABELS[t]}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ClipboardList className="mb-3 h-10 w-10 text-[#94A3B8]/30" />
            <p className="text-sm font-medium text-[#94A3B8]">{auditLogs.length === 0 ? "No audit logs yet." : "No logs match your filters."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  {["Timestamp", "Action Type", "Details"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((log) => (
                  <tr key={log.logId} className="hover:bg-white/[0.02] transition-colors">
                    <td className="whitespace-nowrap px-4 py-3.5 text-xs text-[#94A3B8]">{formatTimestamp(log.timestamp)}</td>
                    <td className="px-4 py-3.5">
                      <span className={cn("inline-block rounded-full border px-2.5 py-1 text-xs font-semibold", BADGE_STYLES[log.actionType])}>
                        {BADGE_LABELS[log.actionType]}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-[#94A3B8]">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-right text-xs text-[#94A3B8]">
        Showing {filtered.length} of {auditLogs.length} log{auditLogs.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
