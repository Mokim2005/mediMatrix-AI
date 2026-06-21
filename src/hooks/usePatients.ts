"use client";

import { useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { Patient } from "@/types/patient";

export interface UsePatientsReturn {
  patients:          Patient[];
  activePatients:    Patient[];
  suspendedPatients: Patient[];
  totalCount:        number;
  activeCount:       number;
  suspendedCount:    number;
  getPatientById:    (id: string) => Patient | undefined;
}

/**
 * Derived patient statistics computed from AppContext.
 * Uses useMemo to prevent expensive recalculations.
 */
export function usePatients(): UsePatientsReturn {
  const { patients } = useApp();

  const activePatients = useMemo(
    () => patients.filter((p) => p.status === "active"),
    [patients]
  );

  const suspendedPatients = useMemo(
    () => patients.filter((p) => p.status === "suspended"),
    [patients]
  );

  const getPatientById = useMemo(
    () => (id: string) => patients.find((p) => p.id === id),
    [patients]
  );

  return {
    patients,
    activePatients,
    suspendedPatients,
    totalCount:      patients.length,
    activeCount:     activePatients.length,
    suspendedCount:  suspendedPatients.length,
    getPatientById,
  };
}
