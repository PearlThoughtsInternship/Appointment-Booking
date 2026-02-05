package com.appointment.backendkotlin

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import java.time.Instant

@RestController
class HelloController {

    @GetMapping("/")
    fun root(): Map<String, Any> = mapOf(
        "name" to "Appointment Booking API (Kotlin/Spring Boot)",
        "version" to "0.1.0",
        "endpoints" to listOf("/health", "/api/v1")
    )

    @GetMapping("/health")
    fun health(): Map<String, Any> = mapOf(
        "status" to "healthy",
        "service" to "backend-kotlin",
        "timestamp" to Instant.now().toString()
    )
}
