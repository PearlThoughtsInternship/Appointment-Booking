import { HttpRouter, HttpServer, HttpServerResponse } from "@effect/platform"
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { Effect, Layer } from "effect"
import { createServer } from "node:http"
import { doctors, timeSlots } from "./data/seed"

// Helpers for doctor and availability
function getDoctorById(id: string) {
  return doctors.find((d) => d.id === id)
}

function getSlotsByDoctorId(doctorId: string, date?: string): typeof timeSlots {
  return timeSlots.filter(
    (s) => s.doctorId === doctorId && (date === undefined || s.date === date)
  )
}

// Handler for GET /api/v1/doctors/:id/availability
const doctorAvailabilityHandler = Effect.gen(function* () {
  const pathParams = yield* HttpRouter.params
  const id = pathParams["id"]
  if (id === undefined || id === "") {
    const response = yield* HttpServerResponse.json({ error: "Missing doctor id" })
    return HttpServerResponse.setStatus(response, 400)
  }
  const doctor = getDoctorById(id)
  if (doctor === undefined) {
    const response = yield* HttpServerResponse.json({
      error: "Doctor not found",
      doctorId: id,
    })
    return HttpServerResponse.setStatus(response, 404)
  }
  const slots = getSlotsByDoctorId(id)
  return yield* HttpServerResponse.json(slots)
})

// Define the router with routes
const router = HttpRouter.empty.pipe(
  HttpRouter.get(
    "/health",
    HttpServerResponse.json({
      status: "healthy",
      service: "backend-ts",
      timestamp: new Date().toISOString(),
    })
  ),
  HttpRouter.get(
    "/",
    HttpServerResponse.json({
      name: "Appointment Booking API (Effect-TS)",
      version: "0.1.0",
      endpoints: ["/health", "/api/v1", "/api/v1/doctors", "/api/v1/doctors/:id/availability"],
    })
  ),
  HttpRouter.get("/api/v1/doctors", HttpServerResponse.json(doctors)),
  HttpRouter.get("/api/v1/doctors/:id/availability", doctorAvailabilityHandler)
)

// Set up the application server with logging
const app = router.pipe(HttpServer.serve(), HttpServer.withLogAddress)

// Specify the port
const port = 3001

// Create a server layer with the specified port
const ServerLive = NodeHttpServer.layer(() => createServer(), { port })

// Run the application
console.log("🚀 Effect-TS backend starting on http://localhost:3001")
NodeRuntime.runMain(Layer.launch(Layer.provide(app, ServerLive)))
