import { MedicalRecord } from "./medical-record";

export type UserStatus = "active" | "suspended";

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  contactNumber: string;
  email: string;
  bloodGroup: string;
  status: UserStatus;
  records: MedicalRecord[];
}
