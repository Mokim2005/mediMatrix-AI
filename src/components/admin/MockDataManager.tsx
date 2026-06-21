"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { AlertTriangle, CheckCircle2, DatabaseZap, Trash2, X } from "lucide-react";

type ActionKey = "inject" | "clear";
interface DialogState { action: ActionKey; title: string; message: string; }
interface FeedbackState { type: "success" | "error"; message: string; }

function ConfirmDialog({ state, onConfirm, onCancel }: { state: DialogState; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/80 backdrop-blur-md p-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/[0.10] bg-[#0F172A] p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            </div>
            <h3 className="text-base font-bold text-[#E2E8F0]">{state.title}</h3>
          </div>
          <button onClick={onCancel} className="rounded-lg p-1 text-[#94A3B8] hover:bg-white/[0.06] hover:text-[#E2E8F0] transition-colors" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mb-6 text-sm leading-relaxed text-[#94A3B8]">{state.message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-medium text-[#94A3B8] hover:bg-white/[0.06] hover:text-[#E2E8F0] transition-colors"><span className="btn-text">Cancel</span></button>
          <button onClick={onConfirm} className="rounded-xl bg-[#10B981] px-4 py-2 text-sm font-bold text-[#020817] hover:bg-[#0EA472] transition-colors"><span className="btn-text">Confirm</span></button>
        </div>
      </div>
    </div>
  );
}

export default function MockDataManager() {
  const { injectMockData, clearSystemData, addAuditLog } = useApp();
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleConfirm = () => {
    if (!dialog) return;
    if (dialog.action === "inject") {
      injectMockData();
      addAuditLog({ logId: `LOG-${Date.now()}`, timestamp: new Date().toISOString(), actionType: "MOCK_DATA_INJECTED", details: "Admin injected fresh mock dataset. All prior patient data replaced." });
      showFeedback("success", "Mock dataset injected successfully. All portals updated.");
    } else {
      clearSystemData();
      addAuditLog({ logId: `LOG-${Date.now()}`, timestamp: new Date().toISOString(), actionType: "SYSTEM_RESET", details: "Admin cleared all system data. Patients and audit logs wiped." });
      showFeedback("success", "System data cleared. localStorage has been wiped.");
    }
    setDialog(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Inject */}
        <div className="flex flex-col gap-4 rounded-2xl border border-[#10B981]/20 bg-[#10B981]/[0.04] backdrop-blur-md p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#10B981]/10">
            <DatabaseZap className="h-6 w-6 text-[#10B981]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#E2E8F0]">Inject Fresh Mock Dataset</h3>
            <p className="mt-1 text-sm text-[#94A3B8]">
              Replace all current patient data with the built-in mock dataset — 3 patients with multiple consultations including antibiotics, vitamins, gastric medicines, and test results.
            </p>
          </div>
          <button
            onClick={() => setDialog({ action: "inject", title: "Inject Mock Dataset", message: "This will replace all current patient data with the mock dataset. All existing records will be overwritten. Continue?" })}
            className="mt-auto flex items-center gap-2 self-start rounded-xl bg-[#10B981] px-4 py-2.5 text-sm font-bold text-[#020817] shadow-lg shadow-[#10B981]/20 transition-all hover:bg-[#0EA472] active:scale-95"
          >
            <DatabaseZap className="h-4 w-4" />
            <span className="btn-text">Inject Mock Data</span>
          </button>
        </div>

        {/* Clear */}
        <div className="flex flex-col gap-4 rounded-2xl border border-red-500/20 bg-red-500/[0.04] backdrop-blur-md p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10">
            <Trash2 className="h-6 w-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#E2E8F0]">Clear All System Data</h3>
            <p className="mt-1 text-sm text-[#94A3B8]">
              Permanently wipe all patients and audit logs from localStorage. The app will return to an empty state. This action cannot be undone.
            </p>
          </div>
          <button
            onClick={() => setDialog({ action: "clear", title: "Clear All System Data", message: "This will permanently delete ALL patients and audit logs. The app returns to an empty state. This cannot be undone. Are you sure?" })}
            className="mt-auto flex items-center gap-2 self-start rounded-xl bg-red-500/80 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-red-500 active:scale-95"
          >
            <Trash2 className="h-4 w-4" />
            <span className="btn-text">Clear System Data</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${feedback.type === "success" ? "border-[#10B981]/20 bg-[#10B981]/[0.08] text-[#10B981]" : "border-red-500/20 bg-red-500/[0.08] text-red-300"}`}>
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          {feedback.message}
        </div>
      )}

      {dialog && <ConfirmDialog state={dialog} onConfirm={handleConfirm} onCancel={() => setDialog(null)} />}
    </div>
  );
}
