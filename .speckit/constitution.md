# Appointment Booking System - Constitution

## Project Identity

An **Outpatient (OPD) Appointment Scheduling System** for Indian hospitals, built to evaluate Effect-TS vs Kotlin/Spring Boot approaches.

## Governing Principles

These principles are immutable and govern all feature implementations:

### 1. ABDM-First

Design assumes Ayushman Bharat Digital Mission integration from day one:
- ABHA (health account) linking
- Scan & Share QR-based registration
- Health Facility Registry compliance

### 2. Queue-Centric

Indian OPD is about **queue management**, not just appointment booking:
- Token generation is core functionality
- Real-time queue status is essential
- Walk-in registration must be supported

### 3. Dual-Backend Parity

Both backends (Effect-TS and Kotlin/Spring Boot) must:
- Implement identical API contracts
- Pass the same integration tests
- Be independently deployable

### 4. Offline-Capable

Network unreliability is a given in Indian healthcare settings:
- Design for degraded operation
- Queue operations must work offline
- Sync when connectivity returns

### 5. Multi-Tenant Ready

Single deployment serving multiple facilities:
- Hospital/clinic isolation
- Shared infrastructure
- Per-tenant configuration

### 6. Hindi + English

First-class i18n support:
- All user-facing text must be translatable
- RTL-ready for future expansion
- Regional language support planned

## Technical Constraints

| Constraint | Rationale |
|------------|-----------|
| PostgreSQL only | Single database engine for both backends |
| OpenAPI contracts | Source of truth for API compatibility |
| Nx monorepo | Unified build and test orchestration |
| Vitest / JUnit 5 | Standardized testing per stack |

## Out of Scope (For Now)

- Telemedicine/video consultation
- Electronic Health Records (EHR) beyond ABDM
- Insurance claim processing
- Pharmacy integration

## Decision Rights

| Domain | Decision Maker |
|--------|----------------|
| API contracts | Shared types library |
| UI/UX patterns | Design system (Shadcn/ui) |
| Data models | Domain-driven design |
| Infrastructure | Docker Compose (dev), TBD (prod) |
