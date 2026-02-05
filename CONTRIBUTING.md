# 🤝 Contributing Guide

Welcome to the Appointment Booking project! We're excited to have you contribute.

---

## Getting Started

### 1. Fork & Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR-USERNAME/Appointment-Booking.git
cd Appointment-Booking

# Add upstream remote
git remote add upstream https://github.com/PearlThoughtsInternship/Appointment-Booking.git
```

### 2. Set Up Development Environment

Follow the [Local Setup Guide](docs/guides/LOCAL-SETUP.md) to set up your environment.

### 3. Create a Branch

```bash
# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feat/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-description
```

---

## Branch Naming Convention

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feat/description` | `feat/patient-registration` |
| Bug Fix | `fix/description` | `fix/appointment-validation` |
| Documentation | `docs/description` | `docs/api-testing-guide` |
| Refactor | `refactor/description` | `refactor/patient-service` |
| Test | `test/description` | `test/integration-tests` |

---

## Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `test` | Adding/updating tests |
| `refactor` | Code refactoring |
| `style` | Formatting, no code change |
| `chore` | Maintenance tasks |

### Examples

```bash
# Feature
git commit -m "feat(patient): add mobile number validation"

# Bug fix
git commit -m "fix(appointment): resolve double booking issue"

# Documentation
git commit -m "docs(api): add OpenAPI specification for patients"

# Test
git commit -m "test(patient): add unit tests for registration"
```

---

## Pull Request Process

### 1. Before Submitting

- [ ] Code builds without errors (`npx nx run-many --target=build`)
- [ ] All tests pass (`npx nx run-many --target=test`)
- [ ] Code follows existing patterns
- [ ] New code has tests
- [ ] Documentation is updated if needed

### 2. PR Title Format

```
<type>(<scope>): <description>
```

Example: `feat(backend-ts): implement patient registration endpoint`

### 3. PR Description Template

```markdown
## Summary

Brief description of changes.

## Changes

- Added X
- Updated Y
- Fixed Z

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Screenshots (if applicable)

## Related Issues

Closes #123
```

### 4. Code Review

- Wait for at least 1 approval
- Address all review comments
- Keep discussions constructive

---

## Code Style

### TypeScript (Effect-TS Backend)

```typescript
// ✅ Good: Use pipe pattern
const result = pipe(
  value,
  Effect.map(transform),
  Effect.flatMap(process)
)

// ❌ Avoid: Nested callbacks
const result = Effect.flatMap(
  Effect.map(value, transform),
  process
)
```

### Kotlin (Spring Boot Backend)

```kotlin
// ✅ Good: Use data classes
data class PatientCreateRequest(
    val name: String,
    val mobile: String,
    val gender: String
)

// ❌ Avoid: Java-style POJOs
class PatientCreateRequest {
    private var name: String? = null
    fun getName(): String? = name
    fun setName(name: String?) { this.name = name }
}
```

---

## Testing Guidelines

### Unit Tests

Every new function should have unit tests:

```typescript
// ✅ Good: Comprehensive tests
describe("validateMobile", () => {
  it("should accept valid Indian numbers", () => {})
  it("should reject invalid format", () => {})
  it("should reject empty input", () => {})
  it("should reject non-numeric input", () => {})
})
```

### Integration Tests

For API endpoints:

```typescript
describe("POST /api/v1/patients", () => {
  it("should create patient with valid data", async () => {})
  it("should return 400 for invalid data", async () => {})
  it("should return 409 for duplicate mobile", async () => {})
})
```

---

## Good First Issues

Looking for something to work on? Check out:

- Issues labeled `good-first-issue`
- Issues labeled `help-wanted`
- Issues labeled `documentation`

### Suggested First Contributions

1. **Add validation** - Implement ABHA ID format validation
2. **Write tests** - Add missing unit tests
3. **Improve docs** - Add examples to API documentation
4. **Fix typos** - Help improve our documentation

---

## Project Structure Guide

```
apps/
├── backend-ts/          # Effect-TS backend
│   ├── src/
│   │   ├── api/         # HTTP handlers ← Add endpoints here
│   │   ├── services/    # Business logic ← Add services here
│   │   └── repositories/# Data access ← Add repos here
│   └── src/*.test.ts    # Tests ← Add tests here
│
├── backend-kotlin/      # Spring Boot backend
│   └── src/main/kotlin/
│       ├── controller/  # REST controllers ← Add endpoints here
│       ├── service/     # Business logic ← Add services here
│       └── repository/  # JPA repositories ← Add repos here
│
└── web/                 # Next.js frontend
    └── src/app/         # Pages ← Add pages here
```

---

## Getting Help

- 💬 **Slack**: `#internship-backend`
- 📧 **Email**: Your mentor
- 🐛 **Issues**: [GitHub Issues](https://github.com/PearlThoughtsInternship/Appointment-Booking/issues)
- 💡 **Discussions**: [GitHub Discussions](https://github.com/PearlThoughtsInternship/Appointment-Booking/discussions)

---

## Recognition

Contributors will be:

- 🏆 Added to the Contributors list
- 📜 Mentioned in release notes
- 🎉 Celebrated in team meetings

---

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn
- Ask questions freely
- Celebrate successes together

---

Thank you for contributing! 🎉
