# 🏗️ System Architecture

Comprehensive architecture documentation for the Appointment Booking system.

---

## High-Level Overview

```mermaid
C4Context
    title System Context Diagram

    Person(patient, "Patient", "Books appointments")
    Person(doctor, "Doctor", "Manages schedule")
    Person(admin, "Admin", "System administration")

    System(system, "Appointment Booking System", "OPD scheduling platform")

    System_Ext(abdm, "ABDM", "Health records")
    System_Ext(sms, "SMS Gateway", "Notifications")
    System_Ext(payment, "Razorpay", "Payments")

    Rel(patient, system, "Uses")
    Rel(doctor, system, "Uses")
    Rel(admin, system, "Administers")
    Rel(system, abdm, "Integrates")
    Rel(system, sms, "Sends SMS")
    Rel(system, payment, "Processes payments")
```

---

## Container Architecture

```mermaid
C4Container
    title Container Diagram

    Person(user, "User", "Patient/Doctor/Admin")

    Container_Boundary(system, "Appointment Booking System") {
        Container(web, "Web Application", "Next.js", "User interface")
        Container(api_ts, "API (Effect-TS)", "Bun + Effect", "REST API on port 3001")
        Container(api_kt, "API (Kotlin)", "Spring Boot", "REST API on port 3002")
        ContainerDb(db, "Database", "PostgreSQL", "Stores all data")
        ContainerDb(cache, "Cache", "Redis", "Session & caching")
    }

    Rel(user, web, "HTTPS")
    Rel(web, api_ts, "REST API")
    Rel(web, api_kt, "REST API")
    Rel(api_ts, db, "SQL")
    Rel(api_kt, db, "JDBC")
    Rel(api_ts, cache, "Redis Protocol")
    Rel(api_kt, cache, "Redis Protocol")
```

---

## Domain Model

```mermaid
erDiagram
    PATIENT ||--o{ APPOINTMENT : books
    DOCTOR ||--o{ APPOINTMENT : has
    DOCTOR ||--o{ TIME_SLOT : manages
    DEPARTMENT ||--o{ DOCTOR : contains
    HOSPITAL ||--o{ DEPARTMENT : has

    PATIENT {
        uuid id PK
        string name
        string mobile UK
        string email
        date date_of_birth
        enum gender
        string abha_id
        timestamp created_at
    }

    DOCTOR {
        uuid id PK
        string name
        string specialty
        string registration_number UK
        decimal consultation_fee
        uuid department_id FK
        boolean is_active
    }

    DEPARTMENT {
        uuid id PK
        string name
        uuid hospital_id FK
    }

    TIME_SLOT {
        uuid id PK
        uuid doctor_id FK
        date slot_date
        time start_time
        time end_time
        int max_patients
        int booked_count
    }

    APPOINTMENT {
        uuid id PK
        uuid patient_id FK
        uuid doctor_id FK
        uuid slot_id FK
        enum status
        int token_number
        decimal fee
        enum payment_status
        timestamp created_at
    }
```

---

## API Design

### Resource Hierarchy

```
/api/v1
├── /patients
│   ├── GET /              # List patients
│   ├── POST /             # Create patient
│   ├── GET /:id           # Get patient
│   ├── PUT /:id           # Update patient
│   └── DELETE /:id        # Delete patient
│
├── /doctors
│   ├── GET /              # List doctors
│   ├── GET /:id           # Get doctor
│   ├── GET /:id/slots     # Get available slots
│   └── PUT /:id/schedule  # Update schedule
│
├── /appointments
│   ├── GET /              # List appointments
│   ├── POST /             # Book appointment
│   ├── GET /:id           # Get appointment
│   ├── PUT /:id/cancel    # Cancel appointment
│   └── PUT /:id/reschedule # Reschedule
│
├── /queue
│   ├── GET /:doctor_id    # Current queue
│   ├── POST /check-in     # Patient check-in
│   └── PUT /call-next     # Call next patient
│
└── /health                # Health check
```

### Request/Response Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant G as API Gateway
    participant A as Auth
    participant S as Service
    participant D as Database
    participant E as Events

    C->>G: POST /api/v1/appointments
    G->>A: Validate JWT
    A-->>G: User context
    G->>S: Create appointment
    S->>D: Check slot availability
    D-->>S: Slot available
    S->>D: Create appointment
    D-->>S: Appointment created
    S->>E: Publish AppointmentCreated
    S-->>G: Response
    G-->>C: 201 Created
```

---

## Dual Backend Comparison

### Effect-TS Architecture

```mermaid
flowchart TB
    subgraph EffectTS["Effect-TS Backend"]
        REQ[HTTP Request]
        ROUTER[HttpRouter]
        HANDLER[Route Handler]
        SERVICE[Service Layer]
        REPO[Repository]
        DB[(PostgreSQL)]

        REQ --> ROUTER
        ROUTER --> HANDLER
        HANDLER --> SERVICE
        SERVICE --> REPO
        REPO --> DB
    end

    subgraph Layers["Effect Layers"]
        L1[HttpLive]
        L2[ServiceLive]
        L3[RepositoryLive]
        L4[DatabaseLive]

        L1 --> L2 --> L3 --> L4
    end
```

### Kotlin/Spring Architecture

```mermaid
flowchart TB
    subgraph SpringBoot["Spring Boot Backend"]
        REQ[HTTP Request]
        FILTER[Filter Chain]
        CONTROLLER[Controller]
        SERVICE[Service]
        REPO[Repository]
        DB[(PostgreSQL)]

        REQ --> FILTER
        FILTER --> CONTROLLER
        CONTROLLER --> SERVICE
        SERVICE --> REPO
        REPO --> DB
    end

    subgraph DI["Dependency Injection"]
        B1[Controller Bean]
        B2[Service Bean]
        B3[Repository Bean]
        B4[DataSource Bean]

        B1 --> B2 --> B3 --> B4
    end
```

### Comparison Table

| Aspect | Effect-TS | Kotlin/Spring |
|--------|-----------|---------------|
| **Paradigm** | Functional | Object-Oriented |
| **Error Handling** | Typed errors (Effect<A, E, R>) | Exceptions |
| **DI Pattern** | Layer composition | Container injection |
| **Concurrency** | Fiber-based | Thread pools |
| **Type Safety** | Full (compile-time) | Partial (runtime nulls) |
| **Ecosystem** | Growing | Mature |
| **Learning Curve** | Steeper | Moderate |

---

## Data Flow

### Appointment Booking Flow

```mermaid
stateDiagram-v2
    [*] --> SelectDoctor
    SelectDoctor --> SelectSlot
    SelectSlot --> EnterDetails
    EnterDetails --> ConfirmBooking
    ConfirmBooking --> PaymentPending
    PaymentPending --> Scheduled: Payment Success
    PaymentPending --> [*]: Payment Failed
    Scheduled --> CheckedIn: Patient Arrives
    CheckedIn --> InConsultation: Doctor Calls
    InConsultation --> Completed: Consultation Done
    Scheduled --> Cancelled: Patient Cancels
    Scheduled --> NoShow: Patient No-Show

    Completed --> [*]
    Cancelled --> [*]
    NoShow --> [*]
```

### Queue Management Flow

```mermaid
sequenceDiagram
    participant P as Patient
    participant R as Reception
    participant S as System
    participant D as Doctor Display
    participant Dr as Doctor

    P->>R: Arrives at hospital
    R->>S: Check-in patient
    S->>S: Generate token
    S-->>P: Token #42
    S->>D: Update queue display

    loop Queue Processing
        Dr->>S: Call next patient
        S->>D: Display "Token #42"
        S-->>P: SMS notification
        P->>Dr: Enters consultation
    end
```

---

## Security Architecture

```mermaid
flowchart TB
    subgraph Security["Security Layers"]
        WAF[Web Application Firewall]
        TLS[TLS 1.3]
        AUTH[JWT Authentication]
        AUTHZ[RBAC Authorization]
        AUDIT[Audit Logging]
    end

    subgraph DataSecurity["Data Security"]
        ENC[Encryption at Rest]
        MASK[PII Masking]
        BACKUP[Encrypted Backups]
    end

    WAF --> TLS --> AUTH --> AUTHZ --> AUDIT
    AUDIT --> ENC
    AUDIT --> MASK
    AUDIT --> BACKUP
```

### Role-Based Access Control

| Role | Patients | Doctors | Appointments | Admin |
|------|----------|---------|--------------|-------|
| **Patient** | Own only | View | Own only | ❌ |
| **Doctor** | View assigned | Own only | View assigned | ❌ |
| **Receptionist** | All | View | All | ❌ |
| **Admin** | All | All | All | ✅ |

---

## Scalability Considerations

```mermaid
flowchart TB
    subgraph Scale["Horizontal Scaling"]
        LB[Load Balancer]

        subgraph Nodes["Application Nodes"]
            N1[Node 1]
            N2[Node 2]
            N3[Node N]
        end

        REDIS[(Redis Cluster)]
        PG[(PostgreSQL<br/>Read Replicas)]
    end

    LB --> N1
    LB --> N2
    LB --> N3
    N1 --> REDIS
    N2 --> REDIS
    N3 --> REDIS
    N1 --> PG
    N2 --> PG
    N3 --> PG
```

### Scaling Strategies

| Component | Strategy | Trigger |
|-----------|----------|---------|
| **API Servers** | Horizontal (add instances) | CPU > 70% |
| **Database** | Vertical + Read replicas | Connection limit |
| **Cache** | Redis Cluster | Memory > 80% |
| **Queue** | Partition by hospital | Message backlog |

---

## Monitoring & Observability

```mermaid
flowchart LR
    subgraph App["Applications"]
        TS[Effect-TS]
        KT[Kotlin]
        WEB[Next.js]
    end

    subgraph Collect["Collection"]
        OTEL[OpenTelemetry]
    end

    subgraph Store["Storage"]
        PROM[Prometheus]
        LOKI[Loki]
        TEMPO[Tempo]
    end

    subgraph Viz["Visualization"]
        GRAF[Grafana]
    end

    App --> OTEL
    OTEL --> PROM
    OTEL --> LOKI
    OTEL --> TEMPO
    PROM --> GRAF
    LOKI --> GRAF
    TEMPO --> GRAF
```

### Key Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| **Response Time (p99)** | < 500ms | > 1s |
| **Error Rate** | < 0.1% | > 1% |
| **Availability** | 99.9% | < 99.5% |
| **Queue Length** | < 100 | > 500 |

---

## 📚 Further Reading

- [12-Factor App](https://12factor.net/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Microservices Patterns](https://microservices.io/patterns/)
