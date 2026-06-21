"use client";

import { useState } from "react";
import { Search, AlertCircle, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

export default function PatientSearch() {
  const { searchPatient, selectPatient, selectedPatient } = useApp();
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) { setError("Please enter a Patient ID."); setSuccess(false); return; }
    const found = searchPatient(trimmed);
    if (!found) { setError(`No patient found with ID "${trimmed}".`); setSuccess(false); return; }
    setError(null);
    setSuccess(true);
    selectPatient(found);
    setQuery("");
  };

  return (
    <div className="w-full max-w-xl">
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
        Search Patient
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setError(null); setSuccess(false); }}
            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
            placeholder="Enter Patient ID (e.g. P-1001)"
            className={cn(
              "w-full rounded-xl border bg-white/[0.04] py-2.5 pl-9 pr-3 text-sm text-[#E2E8F0] outline-none transition-all placeholder:text-[#94A3B8]",
              error
                ? "border-red-500/40 focus:ring-2 focus:ring-red-500/20"
                : "border-white/[0.08] focus:border-[#10B981]/50 focus:ring-2 focus:ring-[#10B981]/10"
            )}
          />
        </div>
        <button
          onClick={handleSearch}
          className="flex items-center gap-2 rounded-xl bg-[#10B981] px-4 py-2.5 text-sm font-semibold text-[#020817] shadow-lg shadow-[#10B981]/20 transition-all hover:bg-[#0EA472] active:scale-95"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>
      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />{error}
        </p>
      )}
      {success && selectedPatient && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-[#10B981]">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          Patient <strong className="mx-0.5">{selectedPatient.name}</strong> selected.
        </p>
      )}
    </div>
  );
}
