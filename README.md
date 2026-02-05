# Appointment Booking System

An **Outpatient (OPD) Appointment Scheduling System** for Indian hospitals.

## Overview

This project evaluates two backend approaches:
- **Effect-TS + Bun** - Functional programming, type-safe
- **Kotlin + Spring Boot** - Enterprise patterns, JVM ecosystem

Both backends implement identical API contracts and can be used interchangeably.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19 |
| Backend A | Effect-TS, @effect/platform, Bun |
| Backend B | Kotlin, Spring Boot 3, Gradle |
| Database | PostgreSQL 16 |
| Monorepo | Nx 22 |
| Testing | Vitest (TS), JUnit 5 (Kotlin) |

## Quick Start

### Prerequisites

- Node.js 20+
- Bun 1.x
- Java 21 (OpenJDK)
- Docker

### Setup

```bash
# Install dependencies
npm install

# Start database
docker compose -f tools/docker/docker-compose.yml up -d

# Build all apps
npx nx run-many --target=build

# Run tests
npx nx run-many --target=test
```

### Running Backends

```bash
# Effect-TS backend (port 3001)
npx nx serve backend-ts

# Kotlin backend (port 3002)
npx nx serve backend-kotlin

# Next.js frontend (port 3000)
npx nx dev web
```

### Health Checks

```bash
# Effect-TS
curl http://localhost:3001/health

# Kotlin
curl http://localhost:3002/health
```

## Project Structure

```
Appointment-Booking/
├── apps/
│   ├── web/                    # Next.js frontend
│   ├── backend-ts/             # Effect-TS backend
│   └── backend-kotlin/         # Spring Boot backend
├── libs/
│   └── shared/types/           # Shared TypeScript types
├── tools/docker/               # Docker Compose
├── docs/specs/                 # Feature specifications
└── .speckit/                   # Spec-kit configuration
```

## Feature Roadmap

### Phase 1: Core Booking (MVP)
- [ ] Patient registration
- [ ] Doctor directory
- [ ] Slot booking
- [ ] Appointment management

### Phase 2: Hospital Operations
- [ ] Queue management
- [ ] Doctor dashboard
- [ ] Walk-in registration
- [ ] Payment integration (Razorpay)

### Phase 3: ABDM Integration
- [ ] ABHA linking
- [ ] Scan and Share
- [ ] Health records exchange

## Development

### Spec-Driven Development

This project uses [GitHub Spec-Kit](https://github.com/github/spec-kit) for specification-driven development.

### API Contracts

Shared types in `libs/shared/types/` define the API contracts:

```typescript
import { Patient, Appointment, Doctor } from "@appointment-booking/shared-types"
```

## License

Private - PearlThoughts Internship Demo
