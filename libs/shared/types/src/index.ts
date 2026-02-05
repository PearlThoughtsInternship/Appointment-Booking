/**
 * Shared types for Appointment Booking system.
 * These types define the API contracts between frontend and backends.
 */
export * from "./patient";
export * from "./doctor";
export * from "./appointment";

// Common response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Health check response
export interface HealthResponse {
  status: "healthy" | "degraded" | "unhealthy";
  service: string;
  timestamp: string;
  version?: string;
}
