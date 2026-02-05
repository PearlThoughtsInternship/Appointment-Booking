# 🛠️ Local Development Setup Guide

A comprehensive guide to setting up the Appointment Booking system on your local machine.

---

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] macOS, Linux, or Windows with WSL2
- [ ] Terminal access (iTerm2, Warp, or default)
- [ ] Git installed and configured
- [ ] GitHub account with access to the repository

---

## Step 1: Install Required Tools

### macOS (using Homebrew)

```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js 20+
brew install node

# Install Bun (fast JavaScript runtime)
brew install oven-sh/bun/bun

# Install Java 21 (required for Kotlin backend)
brew install openjdk@21

# Symlink Java for system discovery
sudo ln -sfn /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-21.jdk

# Install Docker Desktop
brew install --cask docker
```

### Ubuntu/Debian

```bash
# Install Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Bun
curl -fsSL https://bun.sh/install | bash

# Install Java 21
sudo apt-get install openjdk-21-jdk

# Install Docker
sudo apt-get install docker.io docker-compose-v2
sudo usermod -aG docker $USER
```

### Windows (WSL2)

```powershell
# First, install WSL2
wsl --install

# Then follow Ubuntu instructions inside WSL2
```

---

## Step 2: Verify Installations

```bash
# Check Node.js
node --version  # Should be v20.x or higher

# Check npm
npm --version   # Should be v10.x or higher

# Check Bun
bun --version   # Should be v1.x

# Check Java
java -version   # Should be openjdk 21.x

# Check Docker
docker --version
docker compose version
```

### Expected Output

```
$ node --version
v20.11.0

$ java -version
openjdk version "21.0.10" 2026-01-20

$ docker --version
Docker version 24.0.7
```

---

## Step 3: Clone the Repository

```bash
# Clone with HTTPS
git clone https://github.com/PearlThoughtsInternship/Appointment-Booking.git

# Or clone with SSH (if you have SSH keys set up)
git clone git@github.com:PearlThoughtsInternship/Appointment-Booking.git

# Navigate to the project
cd Appointment-Booking
```

---

## Step 4: Install Dependencies

```bash
# Install npm dependencies (this will take a few minutes)
npm install

# Verify Nx is installed
npx nx --version
```

### What Gets Installed

| Package | Purpose |
|---------|---------|
| `nx` | Monorepo task orchestration |
| `@nx/next` | Next.js integration |
| `@nx/node` | Node.js app support |
| `@jnxplus/nx-gradle` | Kotlin/Gradle integration |
| `effect` | Effect-TS runtime |
| `vitest` | Testing framework |

---

## Step 5: Start Infrastructure Services

```bash
# Start PostgreSQL and Redis in Docker
docker compose -f tools/docker/docker-compose.yml up -d

# Verify services are running
docker compose -f tools/docker/docker-compose.yml ps
```

### Expected Output

```
NAME               STATUS          PORTS
appointment-db     Up (healthy)    0.0.0.0:5432->5432/tcp
appointment-redis  Up (healthy)    0.0.0.0:6379->6379/tcp
```

### Database Connection Details

| Property | Value |
|----------|-------|
| Host | `localhost` |
| Port | `5432` |
| Database | `appointment_booking` |
| Username | `appointment` |
| Password | `appointment_dev` |

---

## Step 6: Build All Applications

```bash
# Build everything (first build takes longer due to Gradle)
npx nx run-many --target=build

# Or build individually
npx nx build web
npx nx build backend-ts
npx nx build backend-kotlin
```

### Build Times (Approximate)

| Application | First Build | Subsequent |
|-------------|-------------|------------|
| `web` | ~30s | ~5s |
| `backend-ts` | ~10s | ~2s |
| `backend-kotlin` | ~2-4min | ~30s |

---

## Step 7: Run Applications

### Option A: Run All Services (Recommended)

Open **3 terminal windows/tabs**:

```bash
# Terminal 1: Effect-TS Backend
npx nx serve backend-ts

# Terminal 2: Kotlin Backend
npx nx serve backend-kotlin

# Terminal 3: Next.js Frontend
npx nx dev web
```

### Option B: Run in Background

```bash
# Start services in background
npx nx serve backend-ts &
npx nx serve backend-kotlin &
npx nx dev web &

# View logs
tail -f /tmp/backend-ts.log
```

---

## Step 8: Verify Everything Works

### Health Checks

```bash
# Effect-TS Backend (port 3001)
curl http://localhost:3001/health | jq
# Expected: {"status":"healthy","service":"backend-ts",...}

# Kotlin Backend (port 3002)
curl http://localhost:3002/health | jq
# Expected: {"status":"healthy","service":"backend-kotlin",...}

# Frontend (port 3000)
open http://localhost:3000
# Should see Next.js welcome page
```

### Run Tests

```bash
# Run all tests
npx nx run-many --target=test

# Run specific backend tests
npx nx test backend-ts
npx nx test backend-kotlin
```

---

## Common Issues & Troubleshooting

### Issue: "Java not found" during Kotlin build

**Symptom:**
```
Unable to locate a Java Runtime.
```

**Solution:**
```bash
# macOS: Ensure Java is symlinked
sudo ln -sfn /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-21.jdk

# Verify
java -version
```

### Issue: "Port already in use"

**Symptom:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**
```bash
# Find process using the port
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3010 npx nx serve backend-ts
```

### Issue: Docker containers not starting

**Symptom:**
```
Cannot connect to the Docker daemon
```

**Solution:**
```bash
# macOS: Start Docker Desktop application

# Linux: Start Docker service
sudo systemctl start docker

# Verify Docker is running
docker ps
```

### Issue: "Module not found" errors

**Symptom:**
```
Cannot find module '@effect/platform'
```

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Reset Nx cache
npx nx reset
```

### Issue: Kotlin build takes forever

**Symptom:** Gradle build hangs or takes >10 minutes

**Solution:**
```bash
# Increase Gradle memory in gradle.properties
# org.gradle.jvmargs=-Xmx4096m

# Use Gradle daemon
./gradlew --daemon build

# Check for zombie Gradle processes
ps aux | grep gradle
pkill -f gradle
```

### Issue: Database connection refused

**Symptom:**
```
ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
```bash
# Check if PostgreSQL container is running
docker compose -f tools/docker/docker-compose.yml ps

# Restart the containers
docker compose -f tools/docker/docker-compose.yml restart

# Check logs
docker compose -f tools/docker/docker-compose.yml logs postgres
```

---

## IDE Setup

### VS Code (Recommended)

1. Install extensions:
   - **ESLint** - Code linting
   - **Prettier** - Code formatting
   - **Nx Console** - Nx task runner UI
   - **Kotlin** - Kotlin language support
   - **Effect** - Effect-TS snippets

2. Open workspace:
   ```bash
   code Appointment-Booking
   ```

### IntelliJ IDEA (For Kotlin)

1. Open as Gradle project
2. Import settings from `.idea/` (if available)
3. Enable Kotlin plugin

---

## Daily Workflow

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install any new dependencies
npm install

# 3. Start infrastructure
docker compose -f tools/docker/docker-compose.yml up -d

# 4. Start your backend
npx nx serve backend-ts  # or backend-kotlin

# 5. Run tests before committing
npx nx test backend-ts
```

---

## Next Steps

- 📖 Read [API Design Guide](./API-DESIGN.md)
- 🧪 Learn [API Testing](./API-TESTING.md)
- 🤖 Try [AI-Assisted Development](./AI-ASSISTED-DEV.md)

---

## Need Help?

- 💬 Ask in Slack `#internship-backend`
- 🐛 Create a GitHub issue
- 📧 Email your mentor
