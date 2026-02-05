/**
 * Doctor and scheduling types for the Appointment Booking system.
 */
export type Specialty =
  | "general-physician"
  | "cardiologist"
  | "dermatologist"
  | "orthopedic"
  | "pediatrician"
  | "gynecologist"
  | "ent"
  | "ophthalmologist"
  | "neurologist"
  | "psychiatrist";

export interface Doctor {
  id: string;
  name: string;
  specialty: Specialty;
  qualifications: string[];
  registrationNumber: string; // Medical Council registration
  consultationFee: number; // INR
  hospitalId: string;
  departmentId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  hospitalId: string;
  description?: string;
}

export interface TimeSlot {
  id: string;
  doctorId: string;
  date: string; // ISO date (YYYY-MM-DD)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isAvailable: boolean;
  maxPatients: number;
  bookedCount: number;
}
