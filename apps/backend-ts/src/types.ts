/**
 * Local types matching libs/shared/types for Doctor and TimeSlot.
 * Keeps backend-ts build within rootDir.
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
  | "psychiatrist"

export interface Doctor {
  id: string
  name: string
  specialty: Specialty
  qualifications: string[]
  registrationNumber: string
  consultationFee: number
  hospitalId: string
  departmentId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface TimeSlot {
  id: string
  doctorId: string
  date: string
  startTime: string
  endTime: string
  isAvailable: boolean
  maxPatients: number
  bookedCount: number
}
