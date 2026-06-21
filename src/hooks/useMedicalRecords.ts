"use client";

import { useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { MedicalRecord, MedicineCategory } from "@/types/medical-record";

export interface MedicalRecordStats {
  totalRecords:       number;
  totalMedicines:     number;
  totalTests:         number;
  antibioticCount:    number;
  gastricCount:       number;
  vitaminCount:       number;
  calciumCount:       number;
  otherCount:         number;
  lastConsultation:   string | null;
  sortedByDateDesc:   MedicalRecord[];
}

/**
 * Computes analytics over the selected patient's medical records.
 * Returns zero-state when no patient is selected.
 */
export function useMedicalRecords(): MedicalRecordStats {
  const { selectedPatient } = useApp();
  const records = selectedPatient?.records ?? [];

  return useMemo(() => {
    if (records.length === 0) {
      return {
        totalRecords:     0,
        totalMedicines:   0,
        totalTests:       0,
        antibioticCount:  0,
        gastricCount:     0,
        vitaminCount:     0,
        calciumCount:     0,
        otherCount:       0,
        lastConsultation: null,
        sortedByDateDesc: [],
      };
    }

    const allMedicines = records.flatMap((r) => r.medicines);
    const countByCategory = (cat: MedicineCategory) =>
      allMedicines.filter((m) => m.category === cat).length;

    const sortedByDateDesc = [...records].sort(
      (a, b) =>
        new Date(b.consultationDate).getTime() -
        new Date(a.consultationDate).getTime()
    );

    return {
      totalRecords:     records.length,
      totalMedicines:   allMedicines.length,
      totalTests:       records.flatMap((r) => r.testResults).length,
      antibioticCount:  countByCategory("antibiotic"),
      gastricCount:     countByCategory("gastric"),
      vitaminCount:     countByCategory("vitamin"),
      calciumCount:     countByCategory("calcium"),
      otherCount:       countByCategory("other"),
      lastConsultation: sortedByDateDesc[0]?.consultationDate ?? null,
      sortedByDateDesc,
    };
  }, [records]);
}
