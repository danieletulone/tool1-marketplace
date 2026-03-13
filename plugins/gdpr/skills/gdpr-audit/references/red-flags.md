# GDPR Red Flags — Code Anti-Patterns

Common patterns indicating likely GDPR violations. Stack-agnostic — these apply to any codebase.
Use this for quick scans before a full audit.

---

## 1. Critical Red Flags
*Any of these likely constitutes a violation carrying maximum fines (Art. 83(5)).*

### No consent mechanism
- No consent model, table, or collection in the database
- No consent-related UI components
- No consent API endpoints
- **Violation**: Art. 6, 7

### Pre-ticked or implied consent
- Checkboxes with `checked`, `defaultChecked`, `selected`, or equivalent default-true
- Consent inferred from continued use without explicit action
- **Violation**: Recital 32, Art. 7

### No data deletion capability
- No delete endpoint for user accounts or personal data
- Only soft-delete with no hard-delete follow-up mechanism
- No account deletion option in the UI
- **Violation**: Art. 17

### PII sent outside EEA without safeguards
- API calls to services known to process in non-EEA regions (check documentation of each third-party)
- Cloud resources provisioned in non-EEA regions
- No documentation of transfer mechanisms (SCCs, adequacy decisions)
- **Violation**: Art. 44-49

### Automated decisions without human review
- Scoring, ranking, or matching logic that directly determines outcomes (approval, rejection, access, eligibility) with no human override path
- AI/ML inference feeding directly into decision logic with no intervention point
- **Violation**: Art. 22

### Special category data without explicit consent
- Health, biometric, ethnic, religious, political, genetic, sexual orientation, or union data collected or processed without a dedicated consent flow or documented Art. 9 exception
- **Violation**: Art. 9

### No privacy notice at collection
- Forms collecting PII with no link to privacy policy or inline disclosure
- No information about processing purposes at the point of data collection
- **Violation**: Art. 13

---

## 2. High-Severity Red Flags
*Likely violations with significant fine exposure (Art. 83(4)).*

### Unbounded data retention
- No scheduled cleanup or expiry mechanism for any data category
- No TTL, no `expires_at`, no cleanup jobs, no retention configuration
- Data grows indefinitely

### PII in logs
- Log statements containing user objects, request bodies, email addresses, names
- Error reports sent to monitoring services with full request context including PII
- Stack traces containing user data

### Missing encryption at rest
- Database provisioned without encryption (check infra config)
- Sensitive files stored in unencrypted storage
- PII in plain text in configuration files

### Hardcoded secrets
- API keys, passwords, encryption keys in source code
- `.env` files committed to version control
- Secrets visible in CI/CD logs

### Cross-tenant data leakage (multi-tenant apps)
- Queries not scoped by tenant
- Tenant ID from request body/params instead of auth token
- Search results mixing tenants

### No breach detection capability
- No audit logging for data access
- No alerting on unusual patterns (bulk exports, off-hours access)
- Error handling silently swallowing security exceptions

### Incomplete deletion cascades
- User deletion removes primary record but orphans: search entries, vector embeddings, cached data, uploaded files, analytics events, third-party copies

### Consent withdrawal doesn't propagate
- Unsubscribe/withdrawal action exists but downstream processing continues
- No notification to third parties on withdrawal
- Marketing continues after opt-out

---

## 3. Medium-Severity Red Flags
*Best practice violations with regulatory risk.*

### Over-collection
- Mandatory form fields for data that isn't necessary for the stated purpose
- Collecting detailed data when aggregated data would suffice

### API over-exposure
- Endpoints returning full user objects when callers only need specific fields
- `SELECT *` or full-model serialisation in API responses
- GraphQL without field-level authorisation

### No data export capability
- No way for users to download their data in machine-readable format (JSON, CSV)
- Only PDF export (not machine-readable under Art. 20)

### Public-by-default data
- User profiles, content, or personal data visible to all users by default
- Privacy settings default to "public" rather than "private"

### No identity verification on data requests
- Data export or deletion triggered without verifying requester identity
- SAR endpoint accessible without adequate authentication

### No DPAs documented for third-party processors
- Third-party APIs processing PII with no referenced data processing agreement

### Tracking before consent
- Analytics, cookies, or advertising scripts executing before consent interaction
- Third-party tracking pixels loading on page load

### No DPIA for high-risk processing
- AI/ML features, profiling, or large-scale processing deployed without documented impact assessment

---

## 4. Low-Severity Red Flags
*Compliance hardening opportunities.*

### Missing data flow documentation
- No README, wiki, or doc describing what PII the system handles and where it goes
- No architecture diagram showing data flows

### No DPO contact visible
- Privacy policy exists but no DPO or data protection contact provided
- No contact mechanism for data protection queries

### No consent versioning
- Consent is recorded as a boolean without reference to what the user actually saw
- Privacy policy changes don't trigger re-consent

### Stale dependencies with known vulnerabilities
- No dependency scanning configured
- Outdated libraries with known security issues

---

## 5. Agentic Scanning Strategy

### Quick scan (< 30 min)
Good for an initial pass or when time is limited.

1. **Discover the stack**: read `package.json` / `requirements.txt` / equivalent, `.env.example`, infrastructure files
2. **Grep for the critical red flags**:
   - Consent: search for `consent`, `opt_in`, `agreed`, `marketing` in models and forms
   - Deletion: search for `delete`, `remove`, `erase`, `purge` in API routes and controllers
   - Secrets: search for hardcoded strings matching API key patterns, `password =`, `secret =`
   - Logging: search for `console.log`, `logger.info`, `print` near user/request objects
   - Auth: search for route/endpoint definitions and check for auth middleware
3. **Check cloud regions**: search infra config for region strings
4. **Report the top findings**

### Full audit (2-4 hours)
Comprehensive analysis following all four phases.

1. **Phase 0 — Stack discovery**: full technology inventory
2. **Phase 1 — Data model mapping**: complete PII map across all stores
3. **Phase 2 — Category-by-category**: all 16 categories from `checklist.md`
4. **Phase 3 — Report**: structured findings with scores

### Incremental audit (ongoing)
For repeat analysis or monitoring:

1. Focus on changes since last audit (new endpoints, new models, new third-party integrations)
2. Re-check previously flagged items for remediation
3. Scan new dependencies for processor/transfer implications
4. Update the data map with any new data flows

### What to search for — universal grep patterns

These patterns work across most codebases regardless of language or framework:

**Consent-related:**
`consent`, `gdpr`, `privacy`, `opt_in`, `opt_out`, `subscribe`, `unsubscribe`, `marketing`, `terms_accepted`

**Deletion-related:**
`delete_user`, `remove_account`, `erase`, `purge`, `destroy`, `forget`, `anonymise`, `anonymize`, `cleanup`, `retention`

**Security-related:**
`password`, `secret`, `api_key`, `apikey`, `token`, `credential`, `auth`, `encrypt`, `decrypt`, `hash`, `salt`

**PII in logs (anti-pattern):**
`console.log(user`, `logger.info(req.body`, `print(user`, `log.debug(request`, `console.log(email`

**Access control:**
`middleware`, `guard`, `interceptor`, `policy`, `authorize`, `authenticate`, `permission`, `role`, `acl`

**Data export:**
`export`, `download`, `portability`, `sar`, `subject_access`, `data_request`
