# OWASP Top 10 2025 — Required Technical Measures

For each OWASP category, the specific technical safeguards that should be present
in the codebase. Each measure includes verification steps and anti-patterns.

---

## A01: Access Control Measures

### Measure: Centralized Authorization Middleware
Every request to a protected resource must pass through a shared authorization layer.

**Verification**:
- Grep for a single auth middleware module: `auth.*middleware|authorize|guard|policy`
- Confirm it's imported and used across all route files
- Check that it's not duplicated (DRY principle)

**Anti-pattern**: Each controller implements its own auth check with different logic.

### Measure: Record Ownership Enforcement
Database queries for user-specific data must filter by the authenticated user's ID.

**Verification**:
- In data access layers, grep for queries that include: `user_id|owner_id|created_by|userId`
- Confirm user ID comes from the authenticated session, not from request parameters

**Anti-pattern**: `db.findById(req.params.id)` without checking if the record belongs to the user.

### Measure: Deny-by-Default Configuration
Access must be explicitly granted, not implicitly available.

**Verification**:
- Check if route registration requires explicit auth opt-in or opt-out
- Look for catch-all routes that might bypass auth
- Verify new routes require auth by default

**Anti-pattern**: Open-by-default with `@Public` annotations to make exceptions.

---

## A02: Configuration Hardening Measures

### Measure: Security Headers
HTTP responses must include protective headers.

**Verification**:
- Grep for: `helmet|SecurityHeaders|Content-Security-Policy|X-Frame-Options|X-Content-Type-Options|Strict-Transport-Security|Referrer-Policy|Permissions-Policy`
- Check framework-level middleware for header configuration
- Verify headers are set in production deployment configs (nginx, Apache, CDN)

**Anti-pattern**: No security header middleware; relying on framework defaults.

### Measure: Environment Separation
Production configuration must differ from development.

**Verification**:
- Confirm separate config files or env variables for each environment
- Verify debug features are off in production configs
- Check that development databases/services aren't referenced in production

**Anti-pattern**: Single config file used across all environments with `if (isDev)` toggles.

### Measure: Error Response Sanitization
Error responses must not leak implementation details.

**Verification**:
- Search for custom error handlers/middleware
- Confirm error responses in production return generic messages
- Verify stack traces are only logged server-side, not sent to client

**Anti-pattern**: `res.status(500).json({ error: err.message, stack: err.stack })`.

---

## A03: Supply Chain Security Measures

### Measure: Dependency Pinning and Locking
All dependency versions must be exact and reproducible.

**Verification**:
- Confirm lock files exist and are committed to version control
- Check for `^`, `~`, `>=`, `*`, or `latest` in dependency manifests
- Verify CI/CD uses `npm ci` (not `npm install`), `pip install --require-hashes`, etc.

**Anti-pattern**: `npm install` in CI (ignores lock file), broad version ranges.

### Measure: Automated Vulnerability Scanning
Dependencies must be scanned for known vulnerabilities regularly.

**Verification**:
- Search CI configs for: `audit|snyk|dependabot|renovate|trivy|grype|safety`
- Check for Dependabot/Renovate configuration files
- Verify scanning runs on every PR and on a schedule

**Anti-pattern**: No scanning configured; manual occasional checks only.

### Measure: Source Verification
Dependencies must come from trusted, authenticated sources.

**Verification**:
- Check registry configuration (`.npmrc`, `pip.conf`, `settings.xml`)
- Verify no dependencies fetched from arbitrary URLs or git repos
- Check for SRI attributes on CDN-loaded scripts

**Anti-pattern**: `pip install https://random-site.com/package.tar.gz`.

---

## A04: Cryptographic Measures

### Measure: Strong Password Hashing
Passwords must use adaptive hashing with salt and work factor.

**Verification**:
- Grep for: `bcrypt|argon2|scrypt|pbkdf2`
- Confirm work factor/cost is set (e.g., bcrypt rounds ≥ 10)
- Verify salt is auto-generated (not static)

**Anti-pattern**: `SHA256(password)` or `MD5(password + staticSalt)`.

### Measure: Encryption in Transit
All external communication must use TLS.

**Verification**:
- Search for `http://` URLs in API calls, configs, and frontend code
- Check TLS configuration for minimum version (TLS 1.2+)
- Verify certificate validation is not disabled

**Anti-pattern**: `rejectUnauthorized: false`, `verify=False`, `InsecureSkipVerify: true`.

### Measure: Secret Management
Secrets must not be stored in source code.

**Verification**:
- Grep for hardcoded patterns: `(?:password|secret|key|token)\s*[:=]\s*['"][^'"]{8,}`
- Check `.gitignore` includes `.env`, `*.pem`, `*.key`
- Verify secret management service integration (Vault, AWS SSM, etc.)

**Anti-pattern**: `const DB_PASSWORD = "hunter2"` in source code.

### Measure: Secure Randomness
Cryptographic operations must use CSPRNG.

**Verification**:
- Grep for insecure random: `Math\.random|rand\(\)|random\.random`
- Confirm crypto random is used: `crypto\.randomBytes|secrets\.|SecureRandom|RNGCryptoServiceProvider`
- Verify tokens/session IDs use secure generation

**Anti-pattern**: `Math.random().toString(36)` for session tokens.

---

## A05: Injection Prevention Measures

### Measure: Parameterized Queries
All database interactions must use parameterized statements.

**Verification**:
- Search for raw query patterns: `query\(.*\$\{|query\(.*\+|"SELECT.*" \+|f"SELECT`
- Confirm ORM usage avoids raw SQL: `.raw(`, `.execute(` with string concatenation
- Verify prepared statement patterns: `?` placeholders, `:param`, `$1`

**Anti-pattern**: `db.query("SELECT * FROM users WHERE id = " + userId)`.

### Measure: Output Encoding
Data rendered in HTML must be properly encoded.

**Verification**:
- Check template engine auto-escaping is enabled
- Search for unsafe output: `innerHTML|dangerouslySetInnerHTML|v-html|{!!|raw|safe`
- Verify user content is sanitized before rendering: `DOMPurify|sanitize-html|bleach`

**Anti-pattern**: `element.innerHTML = userInput` without sanitization.

### Measure: Input Validation
All user input must be validated against expected schemas.

**Verification**:
- Search for validation libraries: `joi|yup|zod|class-validator|marshmallow|pydantic`
- Check API endpoints for request body validation
- Verify validation happens server-side, not only client-side

**Anti-pattern**: No validation on API request bodies; trusting frontend validation alone.

---

## A06: Secure Design Measures

### Measure: Rate Limiting
Sensitive endpoints must enforce request rate limits.

**Verification**:
- Search for: `rateLimit|rate-limit|throttle|@Throttle|express-rate-limit|slowDown`
- Confirm rate limits on: login, registration, password reset, API endpoints
- Check for distributed rate limiting in multi-instance deployments

**Anti-pattern**: No rate limiting; or rate limiting only at the load balancer without app-level limits.

### Measure: Resource Consumption Limits
The application must bound resource usage per request and per user.

**Verification**:
- Search for file upload limits: `maxFileSize|fileSizeLimit|multer.*limits`
- Check request body size limits: `bodyParser.*limit|express\.json.*limit`
- Verify timeout configurations on external calls

**Anti-pattern**: Unbounded file uploads; no timeout on database queries.

---

## A07: Authentication Measures

### Measure: Secure Session Management
Sessions must be managed securely server-side.

**Verification**:
- Check cookie configuration: `httpOnly|secure|sameSite|domain|path|maxAge`
- Confirm session regeneration after login
- Verify session invalidation on logout
- Check for session timeout configuration

**Anti-pattern**: Cookies without `HttpOnly` or `Secure`; no session timeout.

### Measure: Credential Security
Password policies must meet NIST 800-63b guidance.

**Verification**:
- Check minimum password length (≥ 8 characters, ideally ≥ 12)
- Search for common password checking: `haveibeenpwned|common-passwords|10000.*worst`
- Verify no password composition rules that reduce entropy (no "must have symbol" without length)

**Anti-pattern**: `minLength: 6` with no maximum or complexity guidance.

---

## A08: Integrity Measures

### Measure: CI/CD Pipeline Security
Build and deploy pipelines must enforce integrity.

**Verification**:
- Check for branch protection: `CODEOWNERS|required_reviews|branch_protection`
- Verify PR review requirements in CI config
- Check for signed commits or verified builds
- Confirm secrets aren't exposed in build logs

**Anti-pattern**: Direct push to main; no review gates; secrets echoed in CI output.

### Measure: Deserialization Safety
Untrusted data must not be deserialized without validation.

**Verification**:
- Grep for unsafe deserialization: `pickle\.load|yaml\.load\((?!.*Loader)|unserialize|readObject`
- Confirm safe alternatives: `yaml.safe_load`, `JSON.parse` (with validation)
- Check for type-checking after deserialization

**Anti-pattern**: `pickle.load(request.data)`, `yaml.load(user_yaml)`.

---

## A09: Logging Measures

### Measure: Security Event Logging
All security-relevant events must be logged with context.

**Verification**:
- Confirm logging on: login success, login failure, privilege escalation, access denied
- Check log format includes: timestamp, user identity, action, outcome, IP
- Verify structured logging (JSON or key-value, not free-form strings)

**Anti-pattern**: Only logging `console.log("user logged in")`; no structured context.

### Measure: Centralized Log Aggregation
Logs must be shipped to a central store.

**Verification**:
- Search for log transport config: `elasticsearch|logstash|fluentd|cloudwatch|datadog|splunk`
- Check for log rotation and retention configuration
- Verify log access is restricted (not world-readable)

**Anti-pattern**: Logs only in `/var/log/app.log` on the server filesystem.

---

## A10: Exception Handling Measures

### Measure: Global Error Handler
A centralized error handler must catch all unhandled exceptions.

**Verification**:
- Search for framework-level error middleware or handlers
- Confirm global handlers for: `uncaughtException`, `unhandledRejection` (Node.js), etc.
- Verify error handler logs error and returns safe response

**Anti-pattern**: No global handler; each route catches its own errors (or doesn't).

### Measure: Fail-Safe Defaults
When errors occur, the system must default to a secure state.

**Verification**:
- Check that auth failures result in access denial (not access grant)
- Verify database transaction rollback on error
- Confirm external service failures trigger safe fallbacks

**Anti-pattern**: `catch(e) { return true; }` in authorization check (grants access on error).
