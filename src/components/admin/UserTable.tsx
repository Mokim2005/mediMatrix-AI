"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Patient } from "@/types/patient";
import { Doctor } from "@/types/doctor";
import { cn } from "@/lib/utils";
import { Users, ShieldOff, ShieldCheck, Trash2, AlertTriangle, X, UserPlus } from "lucide-react";
import { toast } from "sonner";

type TabType = "patients" | "doctors";

function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/80 backdrop-blur-md p-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/[0.10] bg-[#0F172A] p-6 shadow-2xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <h3 className="text-base font-bold text-[#E2E8F0]">Confirm Action</h3>
        </div>
        <p className="mb-6 text-sm text-[#94A3B8]">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-medium text-[#94A3B8] hover:bg-white/[0.06] hover:text-[#E2E8F0] transition-colors">Cancel</button>
          <button onClick={onConfirm} className="rounded-xl bg-red-500/80 px-4 py-2 text-sm font-bold text-white hover:bg-red-500 transition-colors">Confirm</button>
        </div>
      </div>
    </div>
  );
}

function PatientRow({ patient, onToggle, onDelete }: { patient: Patient; onToggle: (id: string, name: string) => void; onDelete: (id: string, name: string) => void }) {
  const isActive = patient.status === "active";
  return (
    <tr className="hover:bg-white/[0.02] transition-colors">
      <td className="px-4 py-3.5">
        <span className="font-mono text-xs font-semibold text-[#10B981] border border-[#10B981]/20 bg-[#10B981]/10 px-2 py-1 rounded">{patient.id}</span>
      </td>
      <td className="px-4 py-3.5 text-sm font-medium text-[#E2E8F0]">{patient.name}</td>
      <td className="px-4 py-3.5">
        <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
          isActive ? "border-[#10B981]/20 bg-[#10B981]/10 text-[#10B981]" : "border-amber-500/20 bg-amber-500/10 text-amber-400"
        )}>
          <span className={cn("h-1.5 w-1.5 rounded-full", isActive ? "bg-[#10B981]" : "bg-amber-400")} />
          {isActive ? "Active" : "Suspended"}
        </span>
      </td>
      <td className="px-4 py-3.5 text-sm text-[#94A3B8]">Patient</td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <button onClick={() => onToggle(patient.id, patient.name)}
            className={cn("flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors",
              isActive ? "border-amber-500/20 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20" : "border-[#10B981]/20 bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20"
            )}>
            {isActive ? <><ShieldOff className="h-3.5 w-3.5" /> Suspend</> : <><ShieldCheck className="h-3.5 w-3.5" /> Activate</>}
          </button>
          <button onClick={() => onDelete(patient.id, patient.name)}
            className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors">
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function UserTable() {
  const { patients, doctors, toggleUserStatus, deleteUser, addAuditLog, addDoctor } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>("patients");
  const [confirm, setConfirm] = useState<{ message: string; action: () => void } | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [regForm, setRegForm] = useState({ name: "", specialty: "", email: "", contactNumber: "" });

  const handleToggle = (id: string, name: string) => {
    const patient = patients.find((p) => p.id === id);
    const nextStatus = patient?.status === "active" ? "suspended" : "active";
    setConfirm({
      message: `Are you sure you want to ${nextStatus === "suspended" ? "suspend" : "activate"} ${name}?`,
      action: () => {
        toggleUserStatus(id);
        if (nextStatus === "suspended") addAuditLog({ logId: `LOG-${Date.now()}`, timestamp: new Date().toISOString(), actionType: "USER_SUSPENDED", details: `Patient ${name} (${id}) was suspended by admin.` });
        setConfirm(null);
      },
    });
  };

  const handleDelete = (id: string, name: string) => {
    setConfirm({
      message: `Permanently delete ${name}? This cannot be undone.`,
      action: () => {
        deleteUser(id);
        addAuditLog({ logId: `LOG-${Date.now()}`, timestamp: new Date().toISOString(), actionType: "USER_SUSPENDED", details: `Patient ${name} (${id}) was deleted by admin.` });
        setConfirm(null);
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-white/[0.06]">
        <div className="flex gap-1">
          {(["patients", "doctors"] as TabType[]).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={cn("flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold capitalize transition-colors",
                activeTab === tab ? "border-[#10B981] text-[#10B981]" : "border-transparent text-[#94A3B8] hover:text-[#E2E8F0]"
              )}>
              <Users className="h-4 w-4" />
              {tab}
              <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-xs font-bold text-[#94A3B8]">
                {tab === "patients" ? patients.length : doctors.length}
              </span>
            </button>
          ))}
        </div>
        {activeTab === "doctors" && (
          <button
            onClick={() => setShowRegister(true)}
            className="flex items-center gap-2 rounded-xl bg-[#10B981] px-3 py-1.5 text-xs font-bold text-[#020817] transition-all hover:bg-[#0EA472]"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Register Doctor
          </button>
        )}
      </div>

      {/* Registration form */}
      {showRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/[0.10] bg-[#0F172A] p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#E2E8F0]">Register New Doctor</h3>
              <button onClick={() => setShowRegister(false)} className="rounded-lg p-1 text-[#94A3B8] hover:bg-white/[0.06] hover:text-[#E2E8F0]"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3">
              {(["name", "specialty", "email", "contactNumber"] as const).map((field) => (
                <div key={field}>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] capitalize">{field === "contactNumber" ? "Contact Number" : field}</label>
                  <input type={field === "email" ? "email" : "text"} value={regForm[field]}
                    onChange={(e) => setRegForm((f) => ({ ...f, [field]: e.target.value }))}
                    placeholder={`Enter ${field === "contactNumber" ? "contact number" : field}`}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-[#E2E8F0] outline-none placeholder:text-[#94A3B8] focus:border-[#10B981]/40"
                  />
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setShowRegister(false)} className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-medium text-[#94A3B8] hover:bg-white/[0.06]">Cancel</button>
              <button onClick={() => {
                if (!regForm.name.trim()) { toast.error("Doctor name is required"); return; }
                const nextId = `D-${String(1001 + doctors.length).padStart(4, "0")}`;
                addDoctor({ id: nextId, name: regForm.name.trim(), specialty: regForm.specialty.trim() || "General", email: regForm.email.trim() || `${regForm.name.trim().toLowerCase().replace(/\s+/g, ".")}@medimatrix.ai`, contactNumber: regForm.contactNumber.trim() || "+966-50-0000000", status: "active" });
                addAuditLog({ logId: `LOG-${Date.now()}`, timestamp: new Date().toISOString(), actionType: "MOCK_DATA_INJECTED", details: `Admin registered new doctor: ${regForm.name.trim()}` });
                toast.success("Doctor registered successfully");
                setRegForm({ name: "", specialty: "", email: "", contactNumber: "" }); setShowRegister(false);
              }} className="rounded-xl bg-[#10B981] px-4 py-2 text-sm font-bold text-[#020817] hover:bg-[#0EA472]">Register</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                {["ID", "Name", "Status", "Role", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {activeTab === "patients" ? (
                patients.length > 0 ? patients.map((p) => (
                  <PatientRow key={p.id} patient={p} onToggle={handleToggle} onDelete={handleDelete} />
                )) : (
                  <tr><td colSpan={5} className="py-12 text-center text-sm text-[#94A3B8]">No patients in the system.</td></tr>
                )
              ) : (
                doctors.length > 0 ? doctors.map((doc: Doctor) => (
                  <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs font-semibold text-purple-400 border border-purple-500/20 bg-purple-500/10 px-2 py-1 rounded">{doc.id}</span>
                    </td>
                    <td className="px-4 py-3.5 text-sm font-medium text-[#E2E8F0]">{doc.name}</td>
                    <td className="px-4 py-3.5">
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                        doc.status === "active" ? "border-[#10B981]/20 bg-[#10B981]/10 text-[#10B981]" : "border-amber-500/20 bg-amber-500/10 text-amber-400"
                      )}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", doc.status === "active" ? "bg-[#10B981]" : "bg-amber-400")} />
                        {doc.status === "active" ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-[#94A3B8]">{doc.specialty || "Doctor"}</td>
                    <td className="px-4 py-3.5 text-xs text-[#94A3B8] italic">Read-only</td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="py-12 text-center text-sm text-[#94A3B8]">No doctors in the system.</td></tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {confirm && <ConfirmDialog message={confirm.message} onConfirm={confirm.action} onCancel={() => setConfirm(null)} />}
    </div>
  );
}

export { X };
