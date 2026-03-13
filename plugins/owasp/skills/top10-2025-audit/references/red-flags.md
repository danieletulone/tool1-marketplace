# OWASP Top 10 2025 — Red Flags Quick-Scan Guide

Fast-detection anti-patterns organized by severity. Use this for the `quick` scan mode
or as a pre-scan before the full audit. Each pattern includes universal grep commands
that work across languages and frameworks.

---

## CRITICAL — Likely Exploitable Vulnerabilities

These patterns indicate immediately exploitable security flaws.

### RF-C1: SQL/NoSQL Injection via String Concatenation
**OWASP**: A05 | **Impact**: Full database compromise

```
Grep: SELECT.*\+|INSERT.*\+|UPDATE.*\+|DELETE.*\+|query\(.*\$\{|query\(.*\+|f"SELECT|f'SELECT|f"INSERT|f"UPDATE|f"DELETE
```
What it catches: Dynamic query construction with user input concatenated directly.

### RF-C2: Command Injection
**OWASP**: A05 | **Impact**: Remote code execution

```
Grep: exec\(.*req\.|exec\(.*request|system\(.*\$|popen\(.*\$|subprocess.*shell.*True|child_process.*exec\(.*\+
```
What it catches: OS command execution with user-controlled input.

### RF-C3: Hardcoded Secrets in Source Code
**OWASP**: A04 | **Impact**: Credential theft, unauthorized access

```
Grep: (password|secret|api_key|apikey|token|private_key)\s*[:=]\s*['"][A-Za-z0-9+/=_-]{8,}
```
What it catches: Passwords, API keys, tokens hardcoded as string literals.

### RF-C4: Disabled Certificate Validation
**OWASP**: A04 | **Impact**: Man-in-the-middle attacks

```
Grep: rejectUnauthorized\s*:\s*false|verify\s*=\s*False|InsecureSkipVerify\s*:\s*true|VERIFY_NONE|SSL_VERIFY_NONE
```
What it catches: TLS/SSL certificate validation explicitly disabled.

### RF-C5: Unsafe Deserialization
**OWASP**: A08 | **Impact**: Remote code execution

```
Grep: pickle\.load|pickle\.loads|yaml\.load\((?!.*SafeLoader)|yaml\.load\((?!.*safe)|unserialize\(|readObject\(
```
What it catches: Deserialization of untrusted data without safe loaders.

### RF-C6: eval() with External Input
**OWASP**: A05 | **Impact**: Arbitrary code execution

```
Grep: eval\(.*req|eval\(.*request|eval\(.*user|eval\(.*param|eval\(.*input|new Function\(.*req
```
What it catches: Dynamic code evaluation with user-controlled input.

---

## HIGH — Significant Security Risk

These patterns indicate serious security gaps that require prompt remediation.

### RF-H1: Missing Auth Middleware on Routes
**OWASP**: A01 | **Impact**: Unauthorized access to functionality

```
Grep: (\.get|\.post|\.put|\.delete|\.patch)\s*\(\s*['"/]
```
Strategy: Find all route definitions, then check if auth middleware is attached.
Compare count of total routes vs routes with auth middleware.

### RF-H2: Weak Password Hashing
**OWASP**: A04 | **Impact**: Mass credential compromise on breach

```
Grep: md5\(|MD5\.|sha1\(|SHA1\.|createHash\(['"]md5|createHash\(['"]sha1|hashlib\.md5|hashlib\.sha1|Digest::MD5|Digest::SHA1
```
What it catches: Use of MD5 or SHA1 for password hashing or security tokens.

### RF-H3: XSS via Unsafe HTML Rendering
**OWASP**: A05 | **Impact**: Session hijacking, data theft

```
Grep: innerHTML\s*=|dangerouslySetInnerHTML|v-html|{!!\s*\$|\|raw\b|\|safe\b|<%=.*raw|html_safe
```
What it catches: Rendering user content as raw HTML without sanitization.

### RF-H4: Debug Mode in Production Config
**OWASP**: A02 | **Impact**: Information disclosure, expanded attack surface

```
Grep: DEBUG\s*=\s*[Tt]rue|debug\s*:\s*true|FLASK_DEBUG\s*=\s*1|DJANGO_DEBUG\s*=\s*True|NODE_ENV\s*=\s*['"]development
```
What it catches: Debug/development mode enabled in production-like configs.

### RF-H5: Missing CORS Restrictions
**OWASP**: A02 | **Impact**: Cross-origin data theft

```
Grep: Access-Control-Allow-Origin\s*:\s*\*|cors\(\)|AllowAllOrigins\s*:\s*true|allow_origins\s*=\s*\[?\s*['"]\*
```
What it catches: Wildcard CORS or unrestricted cross-origin access.

### RF-H6: Default/Test Credentials
**OWASP**: A07 | **Impact**: Unauthorized admin access

```
Grep: admin.*admin|password123|changeme|test.*test|default.*password|P@ssw0rd
```
What it catches: Default credentials in configuration or seed files.

### RF-H7: No Rate Limiting on Auth Endpoints
**OWASP**: A07 | **Impact**: Credential stuffing, brute force

Strategy: Find login/auth endpoints, then search for rate limiting on those routes.
```
Grep: rateLimit|rate_limit|throttle|express-rate-limit|@Throttle
```
If no results, and login endpoints exist, flag as HIGH.

---

## MEDIUM — Best Practice Gaps

These patterns indicate security weaknesses that should be addressed.

### RF-M1: Missing Security Headers
**OWASP**: A02 | **Impact**: Clickjacking, content sniffing, protocol downgrade

```
Grep: helmet|Content-Security-Policy|X-Frame-Options|X-Content-Type-Options|Strict-Transport-Security
```
If none found, flag as MEDIUM — security headers are likely missing.

### RF-M2: Sensitive Data in Logs
**OWASP**: A09 | **Impact**: Credential exposure via log access

```
Grep: log.*(password|token|secret|credit|ssn|api_key)|console\.log.*(password|token|secret)
```
What it catches: Sensitive values being written to log output.

### RF-M3: Empty Catch Blocks
**OWASP**: A10 | **Impact**: Silent failures, bypassed security checks

```
Grep: catch\s*\([^)]*\)\s*\{\s*\}|except\s*:\s*pass|rescue\s*=>\s*nil|catch\s*\(_\)
```
What it catches: Exception handlers that swallow errors without any handling.

### RF-M4: Insecure Randomness for Security Purposes
**OWASP**: A04 | **Impact**: Predictable tokens

```
Grep: Math\.random|random\.random\(\)|rand\(\)|Random\(\)|srand
```
Context check: only flag if used near tokens, sessions, IDs, or crypto.

### RF-M5: No Lock File Committed
**OWASP**: A03 | **Impact**: Non-reproducible builds, supply chain risk

Strategy: Check for dependency manifests, then verify corresponding lock files exist.
Missing lock file with present manifest = MEDIUM finding.

### RF-M6: Missing Input Validation
**OWASP**: A05, A10 | **Impact**: Injection, data corruption

```
Grep: joi|yup|zod|class-validator|validate|marshmallow|pydantic|@Valid|@Validated
```
If no validation library found and API endpoints exist, flag as MEDIUM.

### RF-M7: Console.log as Only Logging
**OWASP**: A09 | **Impact**: No audit trail, no monitoring

```
Grep: winston|bunyan|pino|log4j|serilog|NLog|logging\.getLogger|structlog|morgan
```
If no structured logging library found, flag as MEDIUM.

---

## LOW — Hardening Opportunities

These patterns suggest areas for improvement but pose limited immediate risk.

### RF-L1: TODO/FIXME Security Notes
```
Grep: TODO.*secur|FIXME.*secur|HACK.*auth|TODO.*auth|FIXME.*encrypt|TODO.*password|XXX.*vuln
```
What it catches: Developer notes acknowledging unresolved security issues.

### RF-L2: Commented-Out Security Code
```
Grep: //.*auth|#.*authenticate|//.*csrf|#.*validate|//.*sanitize
```
What it catches: Security code that has been commented out (possibly for debugging).

### RF-L3: Missing HTTPS Enforcement
```
Grep: http://localhost|http://127\.0\.0\.1|http://0\.0\.0\.0
```
Context: Only flag in production configs, not development configs.

### RF-L4: No CODEOWNERS or Branch Protection
Strategy: Check for `.github/CODEOWNERS`, branch protection config in CI.
If neither exists, flag as LOW.

### RF-L5: Overly Broad File Permissions
```
Grep: chmod\s*777|chmod\s*666|0777|0666|world.readable|world.writable
```
What it catches: Files or directories with overly permissive access.

---

## Universal Quick-Scan Strategy

### Approach: Concentric Rings

**Ring 1 — Critical scan** (~2 min):
Run all CRITICAL grep patterns. Any hit = stop and report immediately.

**Ring 2 — High scan** (~5 min):
Run all HIGH grep patterns. Cross-reference with route/controller inventory.

**Ring 3 — Medium/Low scan** (~5 min):
Run MEDIUM and LOW patterns. Check for missing safeguards (absence of
expected patterns like security headers, validation, logging).

### Execution Template

```bash
# Ring 1: Critical patterns (run first)
grep -rn --include="*.{js,ts,py,rb,java,go,cs,php}" -iE "SELECT.*\+|INSERT.*\+|query\(.*\\\$\{" .
grep -rn --include="*.{js,ts,py,rb,java,go,cs,php}" -iE "exec\(.*req\.|system\(.*\\\$" .
grep -rn --include="*.{js,ts,py,rb,java,go,cs,php}" -iE "(password|secret|api_key)\s*[:=]\s*['\"][A-Za-z0-9]{8,}" .
grep -rn --include="*.{js,ts,py,rb,java,go,cs,php}" -iE "rejectUnauthorized.*false|VERIFY_NONE" .
grep -rn --include="*.{js,ts,py,rb,java,go,cs,php}" -iE "pickle\.load|yaml\.load\(|unserialize\(" .
grep -rn --include="*.{js,ts,py,rb,java,go,cs,php}" -iE "eval\(.*req|eval\(.*user|new Function\(.*req" .

# Ring 2: High patterns
grep -rn --include="*.{js,ts,py,rb,java,go,cs,php}" -iE "md5\(|sha1\(|createHash.*md5|createHash.*sha1" .
grep -rn --include="*.{js,ts,py,rb,java,go,cs,php}" -iE "innerHTML\s*=|dangerouslySetInnerHTML|v-html" .
grep -rn --include="*.{env,yml,yaml,json,toml,cfg,ini}" -iE "DEBUG.*[Tt]rue|NODE_ENV.*develop" .
grep -rn --include="*.{js,ts,py,rb,java,go,cs,php}" -iE "cors\(\)|AllowAllOrigins.*true" .
grep -rn --include="*.{js,ts,py,rb,java,go,cs,php,yml,yaml}" -iE "admin.*admin|password123|changeme" .

# Ring 3: Medium/Low patterns
grep -rn --include="*.{js,ts,py,rb,java,go,cs,php}" -iE "catch\s*\([^)]*\)\s*\{\s*\}|except.*pass" .
grep -rn --include="*.{js,ts,py,rb,java,go,cs,php}" -iE "log.*(password|token|secret)" .
grep -rn --include="*.{js,ts,py,rb,java,go,cs,php}" -iE "TODO.*secur|FIXME.*auth|HACK.*auth" .
grep -rn --include="*.{sh,yml,yaml}" -iE "chmod\s*777|chmod\s*666" .
```

Adapt file extensions based on the stack discovered in Phase 0. Add framework-specific
extensions (`.vue`, `.jsx`, `.tsx`, `.dart`, `.kt`, `.swift`, `.ex`, `.rs`) as needed.

### Incremental Scan Strategy

For repeat audits or CI integration, focus on:
1. **Changed files only**: Run patterns on files modified since last audit
2. **New dependencies**: Check for newly added packages
3. **New routes**: Verify new endpoints have auth middleware
4. **Config changes**: Review any changes to environment or deployment configs
