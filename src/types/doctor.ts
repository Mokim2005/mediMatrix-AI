export type DoctorStatus = "active" | "suspended";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  contactNumber: string;
  status: DoctorStatus;
}
