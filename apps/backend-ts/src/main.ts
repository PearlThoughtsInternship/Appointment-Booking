import { HttpRouter, HttpServer, HttpServerResponse } from "@effect/platform"
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { Layer } from "effect"
import { createServer } from "node:http"

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
      endpoints: ["/health", "/api/v1"],
    })
  )
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
