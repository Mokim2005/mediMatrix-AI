"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Patient } from "@/types/patient";
import { Doctor } from "@/types/doctor";
import { MedicalRecord } from "@/types/medical-record";
import { AuditLog } from "@/types/admin";
import { STORAGE_KEYS } from "@/lib/constants";
import {
  getPatients,
  savePatients,
  initializeMockData,
  getDoctors,
  saveDoctors,
  initializeMockDoctors,
  getAuditLogs,
  saveAuditLogs,
  injectMockDataset,
  clearSystemStorage,
  migrateSchemaIfNeeded,
} from "@/services/storage.service";

const { SELECTED_PATIENT } = STORAGE_KEYS;

// ─── Context Shape ────────────────────────────────────────────────────────────

interface AppContextValue {
  // ── Hydration ────────────────────────────────────────────────────────────
  hydrated: boolean;

  // ── Patient / Doctor ──────────────────────────────────────────────────────
  patients: Patient[];
  selectedPatient: Patient | null;
  searchPatient: (id: string) => Patient | undefined;
  selectPatient: (patient: Patient) => void;
  addRecordToPatient: (patientId: string, record: MedicalRecord) => void;
  addPatient: (patient: Patient) => void;

  // ── Doctor ────────────────────────────────────────────────────────────────
  doctors: Doctor[];
  addDoctor: (doctor: Doctor) => void;

  // ── Admin ─────────────────────────────────────────────────────────────────
  auditLogs: AuditLog[];
  addAuditLog: (log: AuditLog) => void;
  toggleUserStatus: (userId: string) => void;
  deleteUser: (userId: string) => void;
  injectMockData: () => void;
  clearSystemData: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const initialized = initializeMockData();

    // Run schema migration for any stored records from older versions
    const migrated = migrateSchemaIfNeeded(initialized);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPatients(migrated);
    setDoctors(initializeMockDoctors());
    setAuditLogs(getAuditLogs());

    // Restore selected patient from persisted ID
    try {
      const savedId = localStorage.getItem(SELECTED_PATIENT);
      if (savedId) {
        const patient = migrated.find((p) => p.id === savedId);
        if (patient) setSelectedPatient(patient);
      }
    } catch {
      // ignore
    }

    setHydrated(true);
  }, []);

  // Sync patients from localStorage on tab focus (multi-tab safety)
  useEffect(() => {
    const handleFocus = () => {
      const fresh = getPatients();
      if (fresh.length > 0) setPatients(migrateSchemaIfNeeded(fresh));
      setAuditLogs(getAuditLogs());
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // ── Patient / Doctor methods ────────────────────────────────────────────────

  const searchPatient = useCallback(
    (id: string): Patient | undefined =>
      patients.find((p) => p.id.toLowerCase() === id.toLowerCase()),
    [patients]
  );

  const selectPatient = useCallback((patient: Patient) => {
    setSelectedPatient(patient);
    try {
      localStorage.setItem(SELECTED_PATIENT, patient.id);
    } catch {
      // ignore
    }
  }, []);

  const addRecordToPatient = useCallback(
    (patientId: string, record: MedicalRecord) => {
      setPatients((prev) => {
        const target = prev.find((p) => p.id === patientId);
        // Duplicate prevention: skip if same id already exists
        if (target?.records.some((r) => r.id === record.id)) return prev;

        const updated = prev.map((p) =>
          p.id === patientId
            ? { ...p, records: [...p.records, record] }
            : p
        );
        savePatients(updated);
        const updatedPatient = updated.find((p) => p.id === patientId);
        if (updatedPatient) {
          setSelectedPatient((sel) =>
            sel?.id === patientId ? updatedPatient : sel
          );
        }
        return updated;
      });
    },
    []
  );

  // ── Admin methods ───────────────────────────────────────────────────────────

  const addAuditLog = useCallback((log: AuditLog) => {
    setAuditLogs((prev) => {
      const updated = [log, ...prev];
      saveAuditLogs(updated);
      return updated;
    });
  }, []);

  const toggleUserStatus = useCallback(
    (userId: string) => {
      setPatients((prev) => {
        const updated = prev.map((p) => {
          if (p.id !== userId) return p;
          return {
            ...p,
            status: p.status === "active" ? "suspended" : "active",
          } satisfies Patient;
        });
        savePatients(updated);

        // Keep selectedPatient in sync
        const changedPatient = updated.find((p) => p.id === userId);
        if (changedPatient) {
          setSelectedPatient((sel) =>
            sel?.id === userId ? changedPatient : sel
          );
        }
        return updated;
      });
    },
    []
  );

  const addPatient = useCallback((patient: Patient) => {
    setPatients((prev) => {
      if (prev.some((p) => p.id === patient.id)) return prev;
      const updated = [...prev, patient];
      savePatients(updated);
      return updated;
    });
  }, []);

  const addDoctor = useCallback((doctor: Doctor) => {
    setDoctors((prev) => {
      if (prev.some((d) => d.id === doctor.id)) return prev;
      const updated = [...prev, doctor];
      saveDoctors(updated);
      return updated;
    });
  }, []);

  const deleteUser = useCallback(
    (userId: string) => {
      setPatients((prev) => {
        const updated = prev.filter((p) => p.id !== userId);
        savePatients(updated);
        return updated;
      });
      setSelectedPatient((prev) => {
        if (prev?.id === userId) {
          try { localStorage.removeItem(SELECTED_PATIENT); } catch {}
          return null;
        }
        return prev;
      });
    },
    []
  );

  const injectMockData = useCallback(() => {
    const fresh = injectMockDataset();
    setPatients(fresh);
    setDoctors(initializeMockDoctors());
    setSelectedPatient(null);
    try { localStorage.removeItem(SELECTED_PATIENT); } catch {}
  }, []);

  const clearSystemData = useCallback(() => {
    clearSystemStorage();
    try { localStorage.removeItem(SELECTED_PATIENT); } catch {}
    setPatients([]);
    setDoctors([]);
    setSelectedPatient(null);
    setAuditLogs([]);
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <AppContext.Provider
      value={{
        hydrated,
        patients,
        selectedPatient,
        searchPatient,
        selectPatient,
        addRecordToPatient,
        addPatient,
        doctors,
        addDoctor,
        auditLogs,
        addAuditLog,
        toggleUserStatus,
        deleteUser,
        injectMockData,
        clearSystemData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return ctx;
}
