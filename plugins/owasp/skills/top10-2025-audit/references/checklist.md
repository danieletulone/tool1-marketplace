# OWASP Top 10 2025 — Compliance Checklist

Each category includes: what the standard requires, concrete checks, discovery strategy,
and anti-patterns to look for. Severity tiers reflect OWASP ranking (A01 = highest risk).

---

## A01: Broken Access Control

**OWASP Ref**: A01:2025 | **Severity Tier**: CRITICAL | **Responsibility**: Dev

**What it requires**: Every resource must enforce access control. Default should be deny.
Access control checks must happen server-side, not rely on client-side enforcement.
Record ownership must be validated. Least privilege must be applied.

**Checks**:
- [ ] All API endpoints have server-side authorization checks
- [ ] Default-deny pattern: resources inaccessible unless explicitly allowed
- [ ] Record-level ownership validated (user can only access own data)
- [ ] No direct object references without authorization (IDOR prevention)
- [ ] Role checks on POST/PUT/DELETE, not just GET
- [ ] JWT/token validation includes signature verification and expiry checks
- [ ] Admin functions protected by role-based access control
- [ ] Directory listing disabled on web servers
- [ ] Access control failures are logged
- [ ] Rate limiting applied to sensitive endpoints

**Discovery Strategy**:
- Grep for route/controller definitions: `route|router|controller|handler|endpoint|@Get|@Post|@Put|@Delete|@RequestMapping`
- Grep for auth middleware usage: `auth|authorize|guard|policy|middleware|interceptor|@Roles|@Auth`
- Grep for direct ID usage in queries: `params\.id|req\.params|request\.params|pathVariable`
- Read API route files and check if auth middleware is applied to each route
- Search for admin-only routes and verify role checks

**Anti-patterns**:
- Routes defined without any auth middleware attached
- Database queries using user-supplied IDs without ownership checks
- Client-side role checks (checking role in frontend JS, not backend)
- `isAdmin` checks in frontend code only
- JWT decoded but signature not verified (`decode` without `verify`)
- Wildcard CORS (`Access-Control-Allow-Origin: *`) on authenticated endpoints

---

## A02: Security Misconfiguration

**OWASP Ref**: A02:2025 | **Severity Tier**: HIGH | **Responsibility**: Ops

**What it requires**: Systems must be hardened with secure defaults. Unnecessary features
disabled. Error messages must not leak internal details. Security headers must be set.
Software must be kept current.

**Checks**:
- [ ] Debug mode disabled in production configs
- [ ] Stack traces not exposed to end users
- [ ] Security headers configured (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
- [ ] Default credentials removed or changed
- [ ] Unnecessary ports/services/features disabled
- [ ] Directory listing disabled
- [ ] CORS policy is restrictive (not wildcard for authenticated resources)
- [ ] TLS/SSL properly configured (no weak ciphers)
- [ ] Error pages are generic (no framework/version disclosure)
- [ ] Cloud storage buckets are not publicly accessible

**Discovery Strategy**:
- Grep for debug flags: `DEBUG\s*=\s*[Tt]rue|debug:\s*true|NODE_ENV.*develop|FLASK_DEBUG|DJANGO_DEBUG`
- Grep for CORS config: `Access-Control|cors|allowOrigin|AllowAllOrigins`
- Grep for security headers: `helmet|SecurityHeaders|X-Frame-Options|Content-Security-Policy|Strict-Transport`
- Read server/app config files for framework-specific settings
- Check Dockerfile for unnecessary packages or running as root
- Search for default credentials: `admin|password|changeme|default|secret`

**Anti-patterns**:
- `DEBUG = True` in production config or env files
- `app.use(cors())` with no options (allows all origins)
- Missing `helmet()` or equivalent security header middleware
- Error handlers returning full stack traces: `res.status(500).send(err.stack)`
- Running containers as root user
- Verbose error responses with framework version info
- `.env` files committed to version control

---

## A03: Software Supply Chain Failures

**OWASP Ref**: A03:2025 (New) | **Severity Tier**: CRITICAL | **Responsibility**: Dev

**What it requires**: All component versions must be known and tracked. Dependencies must
come from trusted sources. Vulnerability scanning must be regular. Outdated or
unmaintained libraries must be identified and replaced.

**Checks**:
- [ ] Lock files present and committed (package-lock.json, yarn.lock, Gemfile.lock, etc.)
- [ ] Dependency versions are pinned (not using `latest` or broad ranges)
- [ ] No known vulnerabilities in current dependencies
- [ ] Dependency audit command available in CI pipeline
- [ ] Dependencies sourced from official registries
- [ ] Unused dependencies removed
- [ ] Sub-dependency integrity verified (lock file integrity hashes)
- [ ] Private registry or scoped packages used for internal code
- [ ] No dependency confusion risk (internal package names don't shadow public ones)

**Discovery Strategy**:
- Glob for lock files: `*lock*`, `*.lock`, `shrinkwrap`
- Read dependency manifests and check for loose version ranges: `"*"|"latest"|">="|"^0\."` 
- Grep CI configs for audit steps: `npm audit|yarn audit|pip audit|bundle audit|snyk|dependabot|renovate`
- Search for `.npmrc`, `.yarnrc`, `pip.conf` for registry configuration
- Count total dependencies vs what's actually imported/used

**Anti-patterns**:
- No lock file in repository
- `"*"` or `"latest"` as version specifiers
- No vulnerability scanning in CI/CD pipeline
- Hundreds of dependencies with no audit trail
- Importing from unpinned CDN URLs in HTML
- No `.npmrc` or equivalent scoping for private packages
- `npm install --force` or `--legacy-peer-deps` used routinely

---

## A04: Cryptographic Failures

**OWASP Ref**: A04:2025 | **Severity Tier**: HIGH | **Responsibility**: Dev

**What it requires**: Sensitive data must be classified and protected. Encryption at rest
and in transit. No deprecated algorithms (MD5, SHA1 for security). Strong password
hashing (Argon2, bcrypt, scrypt). No hardcoded keys. Proper randomness for crypto.

**Checks**:
- [ ] All connections use TLS (no plaintext HTTP for sensitive data)
- [ ] Passwords hashed with Argon2, bcrypt, scrypt, or PBKDF2
- [ ] No MD5 or SHA1 used for security purposes
- [ ] No hardcoded encryption keys or secrets in source code
- [ ] Sensitive data encrypted at rest
- [ ] Caching disabled for responses containing sensitive data
- [ ] Cryptographic randomness uses secure sources (not Math.random)
- [ ] Certificate validation not disabled
- [ ] No FTP/SMTP for sensitive data transport
- [ ] Keys rotated and not committed to version control

**Discovery Strategy**:
- Grep for weak hashing: `md5|sha1|MD5|SHA1|createHash\(['"]md5|createHash\(['"]sha1`
- Grep for hardcoded secrets: `password\s*=\s*['"]|secret\s*=\s*['"]|api_key\s*=\s*['"]|private_key|BEGIN RSA`
- Grep for insecure random: `Math\.random|rand\(\)|random\(\)|Random\(\)` (context matters)
- Grep for password hashing: `bcrypt|argon2|scrypt|pbkdf2|hashpw`
- Grep for TLS config: `http://|rejectUnauthorized.*false|verify.*false|VERIFY_NONE|InsecureSkipVerify`
- Search for `.pem`, `.key`, `.p12` files in the repository
- Check for `no-cache` or `Cache-Control` headers on sensitive endpoints

**Anti-patterns**:
- `MD5(password)` or `SHA1(password)` for password storage
- `Math.random()` for tokens, session IDs, or any security purpose
- Hardcoded API keys: `const API_KEY = "sk-..."`
- `rejectUnauthorized: false` in HTTPS config
- `.pem` or `.key` files committed to the repo
- `http://` URLs for API calls handling sensitive data
- No `Strict-Transport-Security` header

---

## A05: Injection

**OWASP Ref**: A05:2025 | **Severity Tier**: CRITICAL | **Responsibility**: Dev

**What it requires**: All user-supplied data must be validated, filtered, and sanitized.
Queries must use parameterized statements. ORM usage must avoid raw query injection.
No direct concatenation of user input into commands or queries.

**Checks**:
- [ ] SQL queries use parameterized statements / prepared statements
- [ ] ORM queries don't concatenate user input into raw queries
- [ ] Template engines use auto-escaping (XSS prevention)
- [ ] User input is validated on the server side before use
- [ ] Command execution does not concatenate user input
- [ ] LDAP/XPath/NoSQL queries are parameterized
- [ ] Content-Type headers are validated
- [ ] Input length limits are enforced

**Discovery Strategy**:
- Grep for string concatenation in queries: `"SELECT.*\+|'SELECT.*\+|f"SELECT|f'SELECT|\$\{.*\}.*SELECT|query\(.*\+`
- Grep for raw queries: `raw\(|rawQuery|execute\(|exec\(|query\(`
- Grep for command execution: `exec\(|spawn\(|system\(|popen|subprocess|child_process|eval\(|Function\(`
- Grep for template rendering without escaping: `innerHTML|dangerouslySetInnerHTML|v-html|{!! |raw\|safe`
- Search for input validation: `validate|sanitize|escape|whitelist|allowlist|joi|yup|zod|class-validator`

**Anti-patterns**:
- `"SELECT * FROM users WHERE id = " + userId`
- `db.query(\`SELECT * FROM users WHERE id = ${req.params.id}\`)`
- `eval(userInput)` or `new Function(userInput)`
- `child_process.exec(userCommand)`
- `innerHTML = userContent` without sanitization
- `dangerouslySetInnerHTML={{ __html: userContent }}`
- Missing input validation on API endpoints

---

## A06: Insecure Design

**OWASP Ref**: A06:2025 | **Severity Tier**: HIGH | **Responsibility**: Dev

**What it requires**: Security must be designed in, not bolted on. Threat modeling should
be performed. Business logic must enforce limits. Multi-tier architecture should
segregate components. Rate limiting and resource consumption limits required.

**Checks**:
- [ ] Rate limiting implemented on authentication and sensitive endpoints
- [ ] Business logic enforces transaction limits
- [ ] Multi-tenancy properly isolated (tenant data segregation)
- [ ] Resource consumption limited per user/service
- [ ] Security tests exist (unit/integration tests for auth flows)
- [ ] Plausibility checks on critical operations (amount limits, frequency limits)
- [ ] Sensitive operations require re-authentication or step-up auth
- [ ] Threat model documentation exists

**Discovery Strategy**:
- Grep for rate limiting: `rateLimit|rate_limit|throttle|RateLimiter|@Throttle|express-rate-limit`
- Grep for business logic limits: `max_amount|limit|quota|MAX_|threshold`
- Grep for multi-tenancy: `tenant|organization|workspace|team_id|org_id`
- Search for security tests: `test.*auth|test.*access|test.*permission|spec.*security`
- Look for architectural documentation: `ARCHITECTURE.md|SECURITY.md|threat-model`

**Anti-patterns**:
- No rate limiting on login endpoint
- No transaction amount limits in payment flows
- Tenant data accessible by modifying a query parameter
- No security-focused tests in the test suite
- Critical business operations with no confirmation step
- Unbounded resource creation (no limits on file uploads, API calls)

---

## A07: Authentication Failures

**OWASP Ref**: A07:2025 | **Severity Tier**: HIGH | **Responsibility**: Dev

**What it requires**: Multi-factor authentication where possible. No default credentials.
Weak password checks enforced. Sessions managed securely server-side. Failed login
attempts rate-limited. Session IDs regenerated after login.

**Checks**:
- [ ] MFA implemented or available for sensitive accounts
- [ ] No default/hardcoded credentials in deployed code
- [ ] Password strength validation (length, complexity, common password check)
- [ ] Failed login rate limiting / account lockout
- [ ] Session IDs not exposed in URLs
- [ ] Session regenerated after successful authentication
- [ ] Session timeout and invalidation on logout
- [ ] Secure cookie attributes (HttpOnly, Secure, SameSite)
- [ ] Credential recovery is secure (no security questions, uses email/SMS verification)

**Discovery Strategy**:
- Grep for password validation: `password.*length|minLength|password.*policy|zxcvbn|strength`
- Grep for session config: `session|cookie|httpOnly|secure|sameSite|maxAge|expires`
- Grep for MFA: `mfa|totp|2fa|two.factor|authenticator|otp`
- Grep for login rate limiting: `loginAttempt|failedLogin|lockout|maxAttempts|brute`
- Grep for default creds: `admin.*admin|password123|changeme|default.*password`
- Search for session regeneration after login: `regenerate|rotateSession|newSession`

**Anti-patterns**:
- No password length/complexity requirements
- `password: "admin"` or similar defaults in seeds/configs
- Session ID in URL query parameters
- No session regeneration after login
- Missing `HttpOnly` or `Secure` flags on session cookies
- No rate limiting on login endpoint
- Password stored as plaintext or reversible encryption

---

## A08: Software and Data Integrity Failures

**OWASP Ref**: A08:2025 | **Severity Tier**: HIGH | **Responsibility**: Dev

**What it requires**: Code and infrastructure must protect against integrity violations.
Dependencies from trusted sources only. CI/CD pipelines secured. Auto-update mechanisms
verified. Digital signatures used for software verification.

**Checks**:
- [ ] CI/CD pipeline has code review requirements (no direct push to main)
- [ ] Dependencies verified with integrity hashes (SRI for CDN, lock file hashes)
- [ ] Deserialization of untrusted data is avoided or validated
- [ ] CI/CD secrets are not exposed in logs or configs
- [ ] Branch protection rules enabled
- [ ] Build artifacts signed or checksummed
- [ ] CDN resources use Subresource Integrity (SRI) tags
- [ ] No `eval()` or deserialization of untrusted data

**Discovery Strategy**:
- Grep for deserialization: `deserialize|unserialize|pickle\.load|yaml\.load|JSON\.parse.*eval|readObject`
- Grep for SRI: `integrity=|crossorigin`
- Grep for unsafe CDN usage: `<script src="http|<link href="http` without integrity
- Read CI/CD configs for branch protection, code review requirements
- Grep for eval patterns: `eval\(|Function\(|unserialize\(|pickle\.loads\(`
- Check for `.github/CODEOWNERS` or branch protection config

**Anti-patterns**:
- `pickle.load(untrusted_data)` or `yaml.load(data)` without `SafeLoader`
- CDN scripts without `integrity` attribute
- CI/CD pipeline with no branch protection or review gates
- Secrets printed in CI logs: `echo $SECRET` or verbose mode exposing env vars
- No integrity checks on downloaded artifacts
- Direct push to `main`/`master` branch allowed

---

## A09: Logging & Alerting Failures

**OWASP Ref**: A09:2025 | **Severity Tier**: MEDIUM | **Responsibility**: Ops

**What it requires**: All security-relevant events must be logged (logins, failures,
high-value transactions). Logs must be monitored. Alerts must trigger and escalate.
Logs stored centrally and securely. Real-time or near-real-time attack detection.

**Checks**:
- [ ] Login attempts (success and failure) are logged
- [ ] Access control failures are logged
- [ ] Input validation failures are logged
- [ ] High-value transactions are logged with sufficient detail
- [ ] Logs include timestamp, user identity, event type, outcome
- [ ] Logs are sent to a centralized system (not only local files)
- [ ] Sensitive data is NOT included in log messages
- [ ] Log injection is prevented (user input sanitized before logging)
- [ ] Alerting configured for suspicious patterns
- [ ] Incident response process is documented

**Discovery Strategy**:
- Grep for logging: `logger|log\.|console\.log|logging|winston|bunyan|pino|log4j|serilog|NLog`
- Grep for auth event logging: `login.*log|auth.*log|failed.*log|log.*login|log.*auth`
- Grep for centralized logging: `elasticsearch|logstash|fluentd|cloudwatch|datadog|splunk|sentry`
- Grep for sensitive data in logs: `log.*password|log.*token|log.*secret|log.*credit`
- Search for alerting config: `alert|alarm|notification|pagerduty|opsgenie|webhook.*alert`

**Anti-patterns**:
- `console.log` as the only logging mechanism in production
- No logging on authentication failures
- Passwords or tokens appearing in log output
- Logs stored only on the application server filesystem
- No alerting on repeated failed login attempts
- Catch blocks that swallow errors silently: `catch(e) {}`

---

## A10: Mishandling of Exceptional Conditions

**OWASP Ref**: A10:2025 (New) | **Severity Tier**: MEDIUM | **Responsibility**: Ops

**What it requires**: Software must properly prevent, detect, and recover from exceptional
conditions. Centralized error handling. Input validation. Resource limits. Errors must
not leak information or bypass security controls.

**Checks**:
- [ ] Global/centralized error handler exists
- [ ] All async operations have error handling (try/catch, .catch(), error callbacks)
- [ ] Error responses don't expose internal details (stack traces, SQL errors)
- [ ] Resource limits configured (request size, timeout, memory)
- [ ] Graceful degradation on external service failures
- [ ] Race conditions mitigated in concurrent operations
- [ ] Null/undefined checks on critical paths
- [ ] Validation errors return safe, informative messages
- [ ] Unhandled promise rejections are caught globally
- [ ] Process crash recovery is configured

**Discovery Strategy**:
- Grep for empty catch blocks: `catch\s*\(\s*\w*\s*\)\s*\{\s*\}`
- Grep for global error handlers: `uncaughtException|unhandledRejection|app\.use.*err|@ExceptionHandler|ErrorBoundary`
- Grep for resource limits: `maxFileSize|timeout|maxBodySize|bodyParser.*limit|multer.*limits`
- Grep for null safety: `\?\.|Optional|requireNonNull|guard let|if let`
- Search for error middleware in framework configs
- Look for retry/circuit-breaker patterns: `retry|circuitBreaker|fallback|resilience`

**Anti-patterns**:
- `catch(e) {}` — empty catch swallowing all errors
- `catch(e) { console.log(e) }` — logging but not handling
- No global error handler configured
- `JSON.parse()` without try/catch
- Missing `.catch()` on Promise chains
- No timeout on external HTTP requests
- Race conditions in database operations (read-modify-write without locks)
- `process.exit(1)` without cleanup on error
