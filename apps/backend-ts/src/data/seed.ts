import type { Doctor, TimeSlot } from "../types"

const now = "2025-02-01T00:00:00.000Z"

export const doctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Priya Sharma",
    specialty: "general-physician",
    qualifications: ["MBBS", "MD"],
    registrationNumber: "MH-12345",
    consultationFee: 500,
    hospitalId: "h1",
    departmentId: "dept1",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "d2",
    name: "Dr. Rajesh Kumar",
    specialty: "cardiologist",
    qualifications: ["MBBS", "MD", "DM Cardiology"],
    registrationNumber: "MH-12346",
    consultationFee: 800,
    hospitalId: "h1",
    departmentId: "dept1",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "d3",
    name: "Dr. Anjali Mehta",
    specialty: "pediatrician",
    qualifications: ["MBBS", "MD Pediatrics"],
    registrationNumber: "MH-12347",
    consultationFee: 600,
    hospitalId: "h1",
    departmentId: "dept1",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
]

export const timeSlots: TimeSlot[] = [
  { id: "slot1", doctorId: "d1", date: "2025-02-10", startTime: "09:00", endTime: "10:00", isAvailable: true, maxPatients: 5, bookedCount: 2 },
  { id: "slot2", doctorId: "d1", date: "2025-02-10", startTime: "10:00", endTime: "11:00", isAvailable: true, maxPatients: 5, bookedCount: 0 },
  { id: "slot3", doctorId: "d1", date: "2025-02-10", startTime: "11:00", endTime: "12:00", isAvailable: false, maxPatients: 5, bookedCount: 5 },
  { id: "slot4", doctorId: "d1", date: "2025-02-11", startTime: "09:00", endTime: "10:00", isAvailable: true, maxPatients: 5, bookedCount: 1 },
  { id: "slot5", doctorId: "d1", date: "2025-02-11", startTime: "14:00", endTime: "15:00", isAvailable: true, maxPatients: 5, bookedCount: 0 },
  { id: "slot6", doctorId: "d2", date: "2025-02-10", startTime: "10:00", endTime: "11:00", isAvailable: true, maxPatients: 3, bookedCount: 0 },
  { id: "slot7", doctorId: "d2", date: "2025-02-10", startTime: "11:00", endTime: "12:00", isAvailable: true, maxPatients: 3, bookedCount: 1 },
  { id: "slot8", doctorId: "d2", date: "2025-02-12", startTime: "09:00", endTime: "10:00", isAvailable: true, maxPatients: 3, bookedCount: 0 },
  { id: "slot9", doctorId: "d3", date: "2025-02-10", startTime: "09:00", endTime: "10:00", isAvailable: true, maxPatients: 4, bookedCount: 2 },
  { id: "slot10", doctorId: "d3", date: "2025-02-13", startTime: "10:00", endTime: "11:00", isAvailable: true, maxPatients: 4, bookedCount: 0 },
]
