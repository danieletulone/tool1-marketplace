# Technical Measures Reference

Art. 32 requirements translated into concrete code-level verification steps.
Stack-agnostic — adapt to whatever technology the codebase uses.

---

## 1. Encryption

### At rest (Art. 32(1)(a))

**Database level:**
- Check cloud/infrastructure configuration for disk-level or database-level encryption
- Look in infra-as-code (Terraform, Bicep, CloudFormation) for encryption settings
- Check database connection strings or config for encryption-related parameters

**Field level (for high-sensitivity data):**
- National IDs, financial data, health data, biometric data should have application-level encryption
- Look for encryption/decryption utility functions wrapping specific fields before storage
- Check for crypto library imports and where they're used

**File storage:**
- Uploaded files containing PII stored in encrypted buckets/containers
- Check storage configuration for server-side encryption settings
- Check for client-side encryption before upload

**Key management:**
- Keys must NOT be hardcoded in source code
- Look for: key rotation configuration, references to KMS/secret managers
- Anti-patterns: keys in `.env` files committed to git, hardcoded strings in source, keys in CI logs

### In transit

**TLS enforcement:**
- All endpoints must use HTTPS
- Check for HSTS headers in server/middleware configuration
- TLS 1.2+ required (no fallback to older versions)
- Check: load balancer/proxy config, web server config, certificate management

**Internal communication:**
- Service-to-service calls should use TLS
- Database connections should require TLS
- Look for: `ssl=true`, `sslmode=require`, TLS config in connection strings

**Anti-patterns to flag:**
- `http://` URLs in production configuration (except localhost/127.0.0.1)
- TLS verification disabled (`rejectUnauthorized: false`, `verify=False`, `InsecureSkipVerify: true`)
- Mixed content (HTTP resources on HTTPS pages)
- Outbound API calls over plain HTTP

---

## 2. Pseudonymisation

### What qualifies (Art. 4(5))
Data processed so it can't be attributed to a person WITHOUT additional information, where that additional information is stored separately with access controls.

### Verification
- [ ] Internal processing uses opaque IDs (UUIDs, hashes) rather than real names/emails
- [ ] Mapping between pseudonyms and real identity has restricted access
- [ ] Analytics and reporting use pseudonymised or anonymised data
- [ ] Logs use user IDs, not names or emails
- [ ] AI/ML training data pseudonymised where possible

### Anti-patterns
- Real names or emails used as primary keys or in URLs
- PII in URL paths or query strings
- PII in log messages, error reports, or stack traces
- Full PII passed to analytics event properties
- PII used as cache keys

---

## 3. Access Control

### Authentication
- [ ] All PII-serving endpoints require authentication
- [ ] Tokens/sessions have expiry
- [ ] Session management is secure (HttpOnly, Secure, SameSite flags on cookies)
- [ ] Password storage uses strong adaptive hashing (bcrypt, argon2, scrypt)
- [ ] Brute force protection (rate limiting, account lockout, CAPTCHA)
- [ ] MFA available for admin/sensitive operations

**Anti-patterns:**
- Endpoints serving PII without auth middleware
- Passwords stored with MD5, SHA1, SHA256 without salting/stretching
- No rate limiting on authentication endpoints
- Session tokens that never expire

### Authorisation
- [ ] Role-based (RBAC) or attribute-based (ABAC) access control implemented
- [ ] Users can only access their OWN data (object-level authorisation)
- [ ] API endpoints verify ownership, not just authentication
- [ ] Horizontal privilege escalation prevented (user A can't access user B's data)
- [ ] Vertical privilege escalation prevented (regular user can't access admin functions)
- [ ] Admin roles clearly defined and limited

**Anti-patterns:**
- Endpoints accept user/record ID as parameter without verifying the requester owns it (IDOR)
- Missing ownership check in query logic
- Over-permissive access rules (e.g., "allow all authenticated users to read all data")
- Admin endpoints without role verification

### Least privilege
- [ ] Service accounts have minimum necessary permissions
- [ ] Database connections use appropriately scoped credentials (not root)
- [ ] Cloud IAM roles are scoped to actual needs
- [ ] API keys scoped to specific services/operations
- [ ] Environment separation: dev/staging cannot access production PII

---

## 4. Multi-Tenancy Isolation

If the application serves multiple organisations/customers on shared infrastructure, tenant isolation is a GDPR security requirement.

### Database level
- [ ] ALL queries scoped by tenant identifier
- [ ] Tenant ID derived from authenticated session, NOT from request parameters
- [ ] No query path can return cross-tenant data
- [ ] Database indexes include tenant ID for efficient scoping

### Search / secondary store level
- [ ] Search queries filtered by tenant
- [ ] API keys or access tokens scoped to tenant data
- [ ] No search result can leak another tenant's data

### File storage level
- [ ] Files stored in tenant-scoped paths or containers
- [ ] File access requires authentication (not just URL obscurity)
- [ ] Signed/temporary URLs expire appropriately

### API level
- [ ] Middleware extracts tenant from auth token, not from URL or request body
- [ ] Bulk operations are tenant-scoped
- [ ] Cross-tenant admin access is logged and auditable

### Anti-patterns
- Tenant ID taken from request body or query parameters (spoofable)
- Queries missing tenant filter
- Search results not scoped by tenant
- Files accessible by guessing URL paths
- Admin endpoints querying across tenants without audit

---

## 5. Audit Logging

### What to log (Art. 5(2) — accountability)
- Access to personal data (who, when, what data, what action)
- Modifications to personal data
- Deletions of personal data
- Consent grants and withdrawals
- Data exports (SARs)
- Authentication events (login, logout, failures)
- Permission/role changes
- Data breach indicators (unusual patterns)

### What NOT to log
- Passwords (even hashed)
- Full credit card numbers
- Excessive PII in log messages (use IDs + action description, not "John Doe changed email to john@new.com")

### Verification
- [ ] Audit log entries are immutable (append-only)
- [ ] Stored separately from application data
- [ ] Retention period defined
- [ ] Audit logs themselves contain minimal PII (IDs, not names)
- [ ] Log access is restricted and auditable

### Anti-patterns
- `console.log(user)` or `logger.info(request.body)` dumping PII into logs
- No audit logging on CRUD operations for personal data
- Mutable audit logs
- Audit logs in same database as app data (single point of compromise)
- No log retention or rotation (growing forever)

---

## 6. Resilience & Availability (Art. 32(1)(b)(c))

- [ ] Database backups automated and tested
- [ ] Disaster recovery plan exists and is documented
- [ ] RTO and RPO defined
- [ ] Backup restoration tested periodically
- [ ] Critical system redundancy in place
- [ ] Monitoring and alerting on system availability

---

## 7. Regular Testing (Art. 32(1)(d))

- [ ] Dependency vulnerability scanning configured (e.g., Dependabot, Snyk, npm audit, pip-audit)
- [ ] Static code analysis for security issues
- [ ] Access control tested (unit/integration tests verifying auth and authz)
- [ ] Penetration testing on a schedule
- [ ] Database access rules tested (e.g., Firestore rules tests, RLS policy tests)
- [ ] Security-related test cases exist and run in CI
