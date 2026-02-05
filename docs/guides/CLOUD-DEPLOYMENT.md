# ☁️ Cloud Deployment Guide

Learn how to deploy the Appointment Booking system to production.

---

## Deployment Options Overview

```mermaid
flowchart TD
    subgraph Options["Deployment Options"]
        DEV[Local Docker<br/>Development]
        STAGING[Hetzner Cloud<br/>Cost-Effective]
        PROD[AWS<br/>Enterprise Scale]
    end

    DEV -->|"Promote"| STAGING
    STAGING -->|"Promote"| PROD

    style DEV fill:#26de81
    style STAGING fill:#feca57
    style PROD fill:#48dbfb
```

| Environment | Platform | Cost | Use Case |
|-------------|----------|------|----------|
| **Development** | Local Docker | Free | Daily development |
| **Staging** | Hetzner Cloud | ~€20/month | Testing, demos |
| **Production** | AWS | ~$200-500/month | Live users |

---

## Option 1: Hetzner Cloud (Recommended for Learning)

Hetzner offers excellent value for learning and staging environments.

### Architecture

```mermaid
flowchart TB
    subgraph Hetzner["Hetzner Cloud"]
        LB[Load Balancer<br/>€5.83/mo]

        subgraph Servers["Cloud Servers"]
            APP1[CX21 Server<br/>2 vCPU, 4GB RAM<br/>€4.85/mo]
            APP2[CX21 Server<br/>2 vCPU, 4GB RAM<br/>€4.85/mo]
        end

        subgraph Managed["Managed Services"]
            DB[(Managed PostgreSQL<br/>€4.90/mo)]
        end

        VOLUME[(Block Storage<br/>20GB €0.96/mo)]
    end

    USERS[👥 Users] --> LB
    LB --> APP1
    LB --> APP2
    APP1 --> DB
    APP2 --> DB
    APP1 --> VOLUME
```

**Total Cost: ~€21/month**

### Step-by-Step Setup

#### 1. Create Hetzner Account

1. Go to [hetzner.com/cloud](https://www.hetzner.com/cloud)
2. Sign up and add payment method
3. Create a new project

#### 2. Create Server

```bash
# Install Hetzner CLI
brew install hcloud

# Login
hcloud context create appointment-booking

# Create server
hcloud server create \
  --name app-server-1 \
  --type cx21 \
  --image docker-ce \
  --location fsn1 \
  --ssh-key your-ssh-key
```

#### 3. Deploy with Docker Compose

```yaml
# docker-compose.production.yml
version: "3.8"

services:
  traefik:
    image: traefik:v2.10
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=admin@example.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - letsencrypt:/letsencrypt

  backend-ts:
    image: ghcr.io/pearlthoughtsinternship/backend-ts:latest
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.backend-ts.rule=Host(`api-ts.appointment.example.com`)"
      - "traefik.http.routers.backend-ts.tls.certresolver=letsencrypt"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/appointment
      - REDIS_URL=redis://redis:6379

  backend-kotlin:
    image: ghcr.io/pearlthoughtsinternship/backend-kotlin:latest
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.backend-kotlin.rule=Host(`api-kt.appointment.example.com`)"
      - "traefik.http.routers.backend-kotlin.tls.certresolver=letsencrypt"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/appointment
      - SPRING_REDIS_HOST=redis

  web:
    image: ghcr.io/pearlthoughtsinternship/web:latest
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.web.rule=Host(`appointment.example.com`)"
      - "traefik.http.routers.web.tls.certresolver=letsencrypt"

  db:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=appointment
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=appointment

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
  letsencrypt:
```

#### 4. Deploy

```bash
# SSH into server
ssh root@your-server-ip

# Clone repository
git clone https://github.com/PearlThoughtsInternship/Appointment-Booking.git
cd Appointment-Booking

# Create .env file
cat > .env << EOF
DB_PASSWORD=your-secure-password
EOF

# Start services
docker compose -f docker-compose.production.yml up -d
```

---

## Option 2: AWS (Production-Grade)

### Architecture

```mermaid
flowchart TB
    subgraph AWS["AWS Cloud"]
        subgraph VPC["VPC (10.0.0.0/16)"]
            subgraph AZ1["Availability Zone 1"]
                subgraph Public1["Public Subnet"]
                    ALB[Application<br/>Load Balancer]
                    NAT1[NAT Gateway]
                end
                subgraph Private1["Private Subnet"]
                    ECS1[ECS Tasks]
                end
                subgraph Data1["Data Subnet"]
                    RDS1[(RDS Primary)]
                    REDIS1[(ElastiCache)]
                end
            end

            subgraph AZ2["Availability Zone 2"]
                subgraph Public2["Public Subnet"]
                    NAT2[NAT Gateway]
                end
                subgraph Private2["Private Subnet"]
                    ECS2[ECS Tasks]
                end
                subgraph Data2["Data Subnet"]
                    RDS2[(RDS Standby)]
                end
            end
        end

        R53[Route 53<br/>DNS]
        CF[CloudFront<br/>CDN]
        ECR[ECR<br/>Container Registry]
        SM[Secrets Manager]
    end

    USERS[👥 Users] --> CF --> ALB
    R53 --> CF
    ALB --> ECS1
    ALB --> ECS2
    ECS1 --> RDS1
    ECS2 --> RDS1
    RDS1 -.->|Replication| RDS2
    ECS1 --> REDIS1
    ECS2 --> REDIS1
    ECS1 --> SM
    ECS2 --> SM
```

### Cost Estimate

| Service | Configuration | Monthly Cost |
|---------|---------------|--------------|
| **ECS Fargate** | 2 tasks x 0.5 vCPU, 1GB | ~$30 |
| **RDS PostgreSQL** | db.t3.micro, Multi-AZ | ~$30 |
| **ElastiCache Redis** | cache.t3.micro | ~$15 |
| **ALB** | Application Load Balancer | ~$20 |
| **NAT Gateway** | 2 AZs | ~$65 |
| **CloudFront** | 100GB transfer | ~$10 |
| **Route 53** | Hosted zone | ~$1 |
| **ECR** | Container storage | ~$5 |
| **Secrets Manager** | 5 secrets | ~$2 |
| **Total** | | **~$178/month** |

### Terraform Configuration

```hcl
# infrastructure/aws/main.tf

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-south-1"  # Mumbai region for Indian users
}

# VPC
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "appointment-booking-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["ap-south-1a", "ap-south-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = false  # High availability

  tags = {
    Environment = "production"
    Project     = "appointment-booking"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "appointment-booking"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# RDS PostgreSQL
module "rds" {
  source = "terraform-aws-modules/rds/aws"

  identifier = "appointment-booking-db"

  engine               = "postgres"
  engine_version       = "16"
  family               = "postgres16"
  major_engine_version = "16"
  instance_class       = "db.t3.micro"

  allocated_storage = 20
  storage_encrypted = true

  db_name  = "appointment_booking"
  username = "appointment"
  port     = 5432

  multi_az               = true
  db_subnet_group_name   = module.vpc.database_subnet_group
  vpc_security_group_ids = [aws_security_group.rds.id]

  backup_retention_period = 7
  deletion_protection     = true
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "appointment-redis"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.main.name
  security_group_ids   = [aws_security_group.redis.id]
}
```

### GitHub Actions Deployment

```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS

on:
  push:
    branches: [main]

env:
  AWS_REGION: ap-south-1
  ECR_REPOSITORY: appointment-booking

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push backend-ts
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        run: |
          docker build -t $ECR_REGISTRY/backend-ts:${{ github.sha }} ./apps/backend-ts
          docker push $ECR_REGISTRY/backend-ts:${{ github.sha }}

      - name: Update ECS service
        run: |
          aws ecs update-service \
            --cluster appointment-booking \
            --service backend-ts \
            --force-new-deployment
```

---

## Docker Image Building

### Effect-TS Backend Dockerfile

```dockerfile
# apps/backend-ts/Dockerfile
FROM oven/bun:1 AS builder

WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM oven/bun:1-slim
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3001
ENV NODE_ENV=production

CMD ["bun", "run", "dist/main.js"]
```

### Kotlin Backend Dockerfile

```dockerfile
# apps/backend-kotlin/Dockerfile
FROM gradle:8-jdk21 AS builder

WORKDIR /app
COPY . .
RUN gradle bootJar --no-daemon

FROM eclipse-temurin:21-jre-jammy

WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 3002
ENV JAVA_OPTS="-Xmx512m -Xms256m"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

---

## Environment Management

### Development vs Production

| Setting | Development | Production |
|---------|-------------|------------|
| **Database** | Local Docker | Managed (RDS/Hetzner) |
| **SSL** | Self-signed | Let's Encrypt |
| **Logging** | Console | CloudWatch/Loki |
| **Secrets** | .env file | Secrets Manager |
| **Scaling** | Single instance | Auto-scaling |

### Environment Variables

```bash
# Production environment variables
DATABASE_URL=postgresql://user:${DB_PASSWORD}@db.internal:5432/appointment
REDIS_URL=redis://redis.internal:6379
NODE_ENV=production

# Secrets (never commit!)
DB_PASSWORD=<from-secrets-manager>
JWT_SECRET=<from-secrets-manager>
ABDM_API_KEY=<from-secrets-manager>
```

---

## Monitoring & Observability

```mermaid
flowchart LR
    subgraph App["Application"]
        TS[Effect-TS]
        KT[Kotlin]
    end

    subgraph Observability["Observability Stack"]
        PROM[Prometheus<br/>Metrics]
        LOKI[Loki<br/>Logs]
        TEMPO[Tempo<br/>Traces]
        GRAFANA[Grafana<br/>Dashboards]
    end

    TS --> PROM
    KT --> PROM
    TS --> LOKI
    KT --> LOKI
    TS --> TEMPO
    KT --> TEMPO
    PROM --> GRAFANA
    LOKI --> GRAFANA
    TEMPO --> GRAFANA
```

---

## 🏆 Challenge: Deploy to Hetzner

1. Create a Hetzner Cloud account
2. Set up a CX21 server
3. Deploy using Docker Compose
4. Configure SSL with Traefik
5. Document your deployment

Submit your deployment guide as a PR! 🚀

---

## 📚 Resources

- [Hetzner Cloud Documentation](https://docs.hetzner.com/cloud/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [Terraform AWS Modules](https://registry.terraform.io/namespaces/terraform-aws-modules)
- [Docker Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
