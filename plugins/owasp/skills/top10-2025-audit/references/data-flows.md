# OWASP Top 10 2025 — Security-Relevant Data Flow Tracing

How to trace security-sensitive flows through any codebase. Use this guide during
Phase 1 (Domain Mapping) to locate the code constructs that OWASP categories care about.

---

## 1. Entry Point Identification

Entry points are where external input enters the application. Every entry point is a
potential attack surface.

**Patterns to search for** (case-insensitive):

| Pattern | What it finds |
|---------|---------------|
| `route\|router\|@Get\|@Post\|@Put\|@Delete\|@Patch` | HTTP route definitions |
| `app\.(get\|post\|put\|delete\|patch\|use)` | Express-style route handlers |
| `@RequestMapping\|@RestController\|@Controller` | Java/Spring controllers |
| `def (index\|show\|create\|update\|destroy)` | Rails-style controller actions |
| `@app\.(route\|get\|post)` | Flask/FastAPI route decorators |
| `exports\.handler\|onRequest\|onCall` | Serverless function handlers |
| `GraphQL\|resolver\|mutation\|query\|subscription` | GraphQL entry points |
| `WebSocket\|socket\.on\|ws\.on` | WebSocket handlers |
| `addEventListener\|onMessage\|consumer` | Message queue consumers |
| `cron\|schedule\|@Scheduled` | Scheduled tasks (indirect entry) |

**Strategy**: Glob for route files first (`**/routes/**`, `**/controllers/**`, `**/handlers/**`,
`**/api/**`, `**/pages/api/**`), then grep within those directories.

---

## 2. User Input Collection Points

Where user-supplied data is read from requests.

**Patterns to search for**:

| Pattern | What it finds |
|---------|---------------|
| `req\.body\|req\.params\|req\.query\|req\.headers` | Express-style request data |
| `request\.(form\|args\|json\|data\|files)` | Flask/Django request data |
| `@RequestBody\|@PathVariable\|@RequestParam` | Spring parameter binding |
| `params\[:\|params\.permit\|params\.require` | Rails strong parameters |
| `getParameter\|getHeader\|getCookie` | Java Servlet input |
| `context\.args\|context\.params\|input` | GraphQL resolver inputs |
| `FormData\|useFormState\|e\.target\.value` | Frontend form collection |
| `upload\|multipart\|multer\|formidable` | File upload handlers |

**What to trace**: Follow each input variable from collection → validation → usage.
An input that reaches a database query, command execution, or HTML output without
validation is a potential injection or XSS vector.

---

## 3. Authentication Flow

Trace how identity is established and maintained.

**Login flow**:
- Search for: `login\|signin\|signIn\|authenticate\|auth/callback`
- Follow: credential input → validation → session/token creation → response

**Session management**:
- Search for: `session\|cookie\|jwt\|token\|bearer`
- Follow: token creation → storage → validation on each request → expiry/renewal

**Authorization checks**:
- Search for: `authorize\|isAuth\|guard\|policy\|canActivate\|middleware.*auth\|@Roles`
- Map: which routes have auth middleware and which don't

**Password handling**:
- Search for: `password\|credential\|hash\|bcrypt\|argon`
- Follow: password input → hashing → storage → comparison on login

---

## 4. Sensitive Data Mapping

Identify where sensitive data lives and flows.

**What counts as sensitive**:
- PII: names, emails, phone numbers, addresses, SSNs, national IDs
- Financial: credit card numbers, bank accounts, transaction data
- Authentication: passwords, tokens, API keys, session IDs
- Health: medical records, health data
- Business: trade secrets, proprietary algorithms

**Identification patterns**:

| Pattern | Data type |
|---------|-----------|
| `email\|phone\|address\|ssn\|national_id\|passport` | PII fields |
| `credit_card\|card_number\|cvv\|expiry\|iban\|account_number` | Financial |
| `password\|secret\|token\|api_key\|private_key\|credential` | Auth material |
| `health\|medical\|diagnosis\|patient\|prescription` | Health data |
| `salary\|compensation\|revenue\|profit` | Business sensitive |

**Storage mapping**:
- Search for database schemas/models containing sensitive fields
- Check if encryption is applied at the field/column level
- Verify sensitive data is not cached or logged

**Transfer mapping**:
- Search for API responses that include sensitive fields
- Check if sensitive data is transmitted over HTTPS only
- Verify sensitive fields are excluded from serialization where not needed

---

## 5. Configuration & Secrets Flow

Where secrets are stored, loaded, and used.

**Secret sources** (search for these files):
- `.env`, `.env.*`, `*.env` — environment files
- `secrets.yml`, `secrets.json`, `credentials.yml.enc` — secret stores
- `vault`, `ssm`, `secretsmanager` — cloud secret managers
- `docker-compose*.yml` — look for `environment:` blocks

**Secret usage** (search for these patterns):
- `process\.env\.|os\.environ\|ENV\[|System\.getenv|Configuration\[`
- `getSecret\|fetchSecret\|vault\.read`

**What to verify**:
- Secrets are NOT hardcoded in source files
- `.env` is in `.gitignore`
- Secret values are not logged or included in error messages
- Different secrets used per environment (dev/staging/prod)

---

## 6. Dependency & Build Pipeline Flow

Trace how external code enters and gets deployed.

**Dependency ingestion**:
- Read dependency manifests for version pinning
- Check lock files for integrity hashes
- Search for CDN imports in HTML/frontend code

**Build pipeline**:
- Read CI/CD configs (`.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`)
- Trace: code push → build → test → deploy
- Check for: security scanning steps, code review gates, secret handling

**Deployment flow**:
- Search for deployment configs: `Dockerfile`, `docker-compose`, `*.tf`, `serverless.yml`
- Check for: image pinning, minimal base images, non-root users
- Verify: production configs differ from development configs

---

## 7. Error & Exception Flow

Trace how errors propagate and are handled.

**Error boundaries**:
- Search for global error handlers in the app entry point
- Map: error occurrence → catch → logging → user response
- Verify: errors don't leak internal details to users

**Patterns to trace**:
- `try\|catch\|except\|rescue\|recover` — error handling blocks
- `throw\|raise\|panic` — error generation
- `ErrorBoundary\|errorHandler\|@ExceptionHandler` — framework handlers
- `500\|InternalServerError\|error\.html` — error response templates

**What to verify**:
- Every async operation has error handling
- Error responses are generic to users, detailed to logs
- Failed operations don't leave system in inconsistent state

---

## 8. Logging & Monitoring Flow

Trace what gets logged and where logs go.

**Logging points**:
- Search for: `logger\.\|log\.\|console\.(log\|warn\|error)\|logging\.\|Log\.`
- Map: which security events are logged (auth, access control, errors)

**Log destination**:
- Search for: logging library configuration, transport/appender setup
- Verify: logs go to centralized system, not just local files

**Alert pipeline**:
- Search for: alerting configuration, webhook integrations, monitoring setup
- Verify: alerts exist for security events (failed logins, access violations)

**What to verify**:
- Sensitive data is NOT logged (passwords, tokens, PII)
- Log format includes: timestamp, user ID, event type, outcome, source IP
- Log injection is prevented (user input sanitized before logging)
