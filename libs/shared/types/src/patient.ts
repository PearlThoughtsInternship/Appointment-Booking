/**
 * Patient entity for the Appointment Booking system.
 * Supports ABDM (Ayushman Bharat Digital Mission) integration.
 */
export interface Patient {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  dateOfBirth: string; // ISO date format
  gender: "male" | "female" | "other";
  abhaId?: string; // ABDM Health Account ID (14-digit)
  address?: Address;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string; // 6-digit Indian PIN code
}

export interface PatientCreateRequest {
  name: string;
  mobile: string;
  email?: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  abhaId?: string;
  address?: Address;
}
