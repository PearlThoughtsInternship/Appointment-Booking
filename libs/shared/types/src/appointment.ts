/**
 * Appointment types for the OPD Booking system.
 */
export type AppointmentStatus =
  | "scheduled"
  | "checked-in"
  | "in-consultation"
  | "completed"
  | "cancelled"
  | "no-show";

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  slotId: string;
  status: AppointmentStatus;
  tokenNumber?: number; // Queue token for OPD
  consultationFee: number; // INR
  paymentStatus: "pending" | "paid" | "refunded";
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentCreateRequest {
  patientId: string;
  doctorId: string;
  slotId: string;
  notes?: string;
}

export interface AppointmentResponse extends Appointment {
  patient?: {
    name: string;
    mobile: string;
  };
  doctor?: {
    name: string;
    specialty: string;
  };
  slot?: {
    date: string;
    startTime: string;
    endTime: string;
  };
}
