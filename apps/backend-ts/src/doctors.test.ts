import { describe, it, expect } from "vitest"
import { doctors, timeSlots } from "./data/seed"

describe("Doctor availability seed data", () => {
  it("should have at least one doctor", () => {
    expect(doctors.length).toBeGreaterThanOrEqual(1)
  })

  it("each doctor should have required fields", () => {
    for (const d of doctors) {
      expect(d.id).toBeDefined()
      expect(d.name).toBeDefined()
      expect(d.specialty).toBeDefined()
      expect(d.qualifications).toBeInstanceOf(Array)
      expect(d.registrationNumber).toBeDefined()
      expect(typeof d.consultationFee).toBe("number")
      expect(d.hospitalId).toBeDefined()
      expect(d.departmentId).toBeDefined()
      expect(typeof d.isActive).toBe("boolean")
      expect(d.createdAt).toBeDefined()
      expect(d.updatedAt).toBeDefined()
    }
  })

  it("should have time slots for doctor d1", () => {
    const d1Slots = timeSlots.filter((s) => s.doctorId === "d1")
    expect(d1Slots.length).toBeGreaterThanOrEqual(1)
  })

  it("each time slot should have required fields", () => {
    for (const s of timeSlots) {
      expect(s.id).toBeDefined()
      expect(s.doctorId).toBeDefined()
      expect(s.date).toBeDefined()
      expect(s.startTime).toBeDefined()
      expect(s.endTime).toBeDefined()
      expect(typeof s.isAvailable).toBe("boolean")
      expect(typeof s.maxPatients).toBe("number")
      expect(typeof s.bookedCount).toBe("number")
    }
  })

  it("getDoctorById logic: d1 exists, invalid id does not", () => {
    const d1 = doctors.find((d) => d.id === "d1")
    expect(d1).toBeDefined()
    expect(d1?.name).toBe("Dr. Priya Sharma")
    const invalid = doctors.find((d) => d.id === "invalid-id")
    expect(invalid).toBeUndefined()
  })

  it("getSlotsByDoctorId logic: filtering by doctorId returns correct slots", () => {
    const slots = timeSlots.filter((s) => s.doctorId === "d1")
    expect(slots.every((s) => s.doctorId === "d1")).toBe(true)
  })
})
