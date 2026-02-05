package com.appointment.backendkotlin

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication(scanBasePackages = arrayOf("com.appointment"))
class BackendKotlinApplication

fun main(args: Array<String>) {
  runApplication<BackendKotlinApplication>(*args)
}


