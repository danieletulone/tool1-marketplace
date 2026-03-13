# GDPR Code Compliance Checklist

Every GDPR article with technical implications, distilled into code-level checks.
Each item maps: **GDPR Article → Requirement → What to look for in code**.

Stack-agnostic — adapt search patterns to whatever technology you discover in the codebase.

Severity levels:
- **CRITICAL**: Fines up to 4% global turnover / €20M (Art. 83(5))
- **HIGH**: Fines up to 2% global turnover / €10M (Art. 83(4))
- **MEDIUM**: Regulatory best practice, lower direct fine risk
- **LOW**: Recommended measure, strengthens compliance posture

---

## 1. Lawful Basis & Consent
**Articles: 6, 7, 8 | Severity: CRITICAL**

Every processing operation needs a documented lawful basis (Art. 6(1)): consent, contract, legal obligation, vital interests, public interest, or legitimate interests. Consent must be freely given, specific, informed, unambiguous, and as easy to withdraw as to give (Art. 7).

### Checks
- [ ] Consent is captured via explicit opt-in (no pre-ticked boxes, no implied consent)
- [ ] Each processing purpose has a separate consent record
- [ ] Consent records store: who, when, what they were told, how they consented, version of consent text
- [ ] Consent withdrawal mechanism exists and is equally accessible as the opt-in
- [ ] Withdrawal triggers actual cessation of processing (not just a flag)
- [ ] No service access is gated on unnecessary consent (Art. 7(4))

### Discovery strategy
- Search data models for fields like: `consent`, `agreed`, `opt_in`, `terms_accepted`, `marketing_consent`
- Search frontend code for checkboxes, toggle components bound to consent
- Search for consent-related API endpoints (POST/PUT for granting, DELETE/PUT for withdrawing)
- Look for consent checks in processing logic (middleware, guards, conditionals before data use)
- Check for consent versioning (is the exact text stored or just a boolean?)

### Anti-patterns
- Boolean `consented: true` with no timestamp, purpose, or text version
- Single checkbox covering multiple unrelated processing purposes
- Consent bundled into general terms of service
- Tracking/analytics code that executes before consent interaction
- Withdrawal endpoint exists but doesn't propagate to downstream processing

---

## 2. Data Subject Rights
**Articles: 12-22 | Severity: CRITICAL**

### 2a. Right of Access (Art. 15)
- [ ] Mechanism for users to request all their personal data
- [ ] Response includes: purposes, categories, recipients, retention period, data source
- [ ] Data export in machine-readable format
- [ ] Identity verification before disclosure
- [ ] Response within 1 month (extendable by 2 for complex requests)

**Discovery**: Search for export endpoints, data download features, subject access request (SAR) handlers, admin tools for user data retrieval.

### 2b. Right to Rectification (Art. 16)
- [ ] Users can update/correct their personal data
- [ ] Changes propagate to ALL systems where data is stored (secondary stores, caches, search indices, replicas)

**Discovery**: Search for profile edit endpoints, PATCH/PUT operations on user resources. Check if updates trigger sync to secondary data stores.

### 2c. Right to Erasure (Art. 17)
- [ ] Hard delete or irreversible anonymisation capability exists
- [ ] Deletion cascades to ALL related data across ALL systems
- [ ] Secondary stores cleaned up: search indices, vector embeddings, caches, file storage, analytics, logs
- [ ] Third-party processors notified (Art. 17(2))
- [ ] Soft-delete alone is insufficient — must lead to hard erasure on a defined schedule
- [ ] Audit trail of the deletion itself is preserved

**Discovery**: Search for delete endpoints, account deletion UI, cleanup/purge jobs, cascade logic. Trace whether deletion reaches every store identified in the data map.

### 2d. Right to Restriction (Art. 18)
- [ ] Mechanism to "freeze" processing — data stored but not processed
- [ ] Restricted data clearly marked in the system
- [ ] Restricted records excluded from search, reporting, AI processing, etc.

**Discovery**: Search for status fields like `restricted`, `frozen`, `suspended`, `processing_paused`.

### 2e. Right to Portability (Art. 20)
- [ ] Export in structured, machine-readable format (JSON, CSV, XML — PDF alone is insufficient)
- [ ] Includes data the user provided (not derived/inferred data)

**Discovery**: Search for export/download functionality and inspect the output format.

### 2f. Right to Object (Art. 21)
- [ ] Object to processing based on legitimate interests
- [ ] For direct marketing: objection is absolute and immediate
- [ ] Objection mechanism clearly presented

**Discovery**: Search for unsubscribe logic, marketing preference centres, opt-out endpoints.

### 2g. Notification to Recipients (Art. 19)
- [ ] On rectification, erasure, or restriction: all recipients of that data are notified
- [ ] User can request a list of recipients

**Discovery**: Search for downstream notification logic triggered by data changes.

---

## 3. Data Minimisation & Purpose Limitation
**Articles: 5(1)(b), 5(1)(c) | Severity: CRITICAL**

Collect only what's necessary. Don't repurpose data without a compatible lawful basis.

### Checks
- [ ] Each collected data field has a documented purpose
- [ ] No "just in case" collection (mandatory fields that aren't actually needed)
- [ ] API responses don't over-expose data (full objects when only specific fields needed)
- [ ] No unused database columns that still collect data
- [ ] Analytics/tracking collects only what's stated in the privacy notice

### Discovery strategy
- Review data models for fields with no obvious processing purpose
- Check API serialisers/response builders for over-exposure
- Look for `SELECT *` patterns or equivalent (returning entire records)
- Check form definitions for mandatory vs optional fields
- Review analytics event payloads for unnecessary PII

---

## 4. Storage Limitation & Retention
**Articles: 5(1)(e), 17 | Severity: CRITICAL**

Data kept no longer than necessary. Time limits for erasure or periodic review required.

### Checks
- [ ] Retention policy defined per data category
- [ ] Automated cleanup jobs enforce retention periods
- [ ] Soft-deleted data has a hard-delete schedule
- [ ] Log rotation with PII-aware retention limits
- [ ] Backup expiration policies defined
- [ ] Session and temporary data cleaned up
- [ ] Analytics data anonymised or deleted after retention period

### Discovery strategy
- Search for scheduled tasks, cron jobs, background workers with cleanup logic
- Search for TTL settings on records (database-level or application-level)
- Check log configuration for retention/rotation settings
- Check backup configuration for expiry
- Look for data that grows indefinitely without cleanup

---

## 5. Security of Processing
**Articles: 32, 5(1)(f) | Severity: HIGH**

Appropriate technical measures: encryption, confidentiality, integrity, availability, resilience, regular testing.

### Checks
See `references/technical-measures.md` for detailed checks covering:
- Encryption at rest and in transit
- Access control and authentication
- Pseudonymisation
- Multi-tenancy isolation
- Audit logging
- Resilience and availability
- Regular security testing

### Quick scan
- [ ] PII encrypted at rest (database or field level)
- [ ] TLS enforced on all endpoints
- [ ] No hardcoded secrets in source
- [ ] Authentication required on PII-serving endpoints
- [ ] No PII in log output
- [ ] Tenant isolation enforced (if multi-tenant)

---

## 6. Breach Detection & Notification
**Articles: 33, 34 | Severity: HIGH**

Notify supervisory authority within 72 hours. Notify data subjects if high risk. Document all breaches.

### Checks
- [ ] Audit logging for access to personal data
- [ ] Alerting on unusual data access patterns
- [ ] Breach documentation mechanism exists
- [ ] Error handling doesn't silently swallow security exceptions

### Discovery strategy
- Search for audit log implementations
- Search for monitoring/alerting configuration
- Check error handling for security-relevant exceptions
- Look for bulk data access endpoints and whether they have rate limiting or alerting

---

## 7. Data Protection by Design & Default
**Articles: 25 | Severity: HIGH**

Privacy built in from the start. Default settings are the most restrictive.

### Checks
- [ ] Default privacy settings are the most restrictive (opt-in, not opt-out)
- [ ] User profiles/data private by default
- [ ] Public APIs don't expose PII without authentication
- [ ] Search/index configuration excludes PII by default (explicit inclusion needed)
- [ ] New data collection requires explicit justification

### Discovery strategy
- Check default values for visibility/privacy settings
- Look for public endpoints returning PII without auth
- Check search configurations for which fields are indexed
- Review whether user-generated content is public by default

---

## 8. Records of Processing
**Articles: 30 | Severity: HIGH**

Maintain records of all processing activities: purposes, data categories, recipients, transfers, retention, security measures.

### Checks
- [ ] Processing activities inventory exists (documentation, config, or database)
- [ ] Each data flow documented: what data, why, where it goes, how long kept
- [ ] Third-party processors and sub-processors documented

### Discovery strategy
- Look for data flow documentation, architecture docs, README sections
- Check for configuration files mapping data to purposes/retention
- Identify undocumented third-party integrations

---

## 9. Data Protection Impact Assessment
**Articles: 35, 36 | Severity: HIGH**

DPIA required for: systematic profiling with legal effects, large-scale special category processing, systematic public area monitoring.

### Checks
- [ ] AI/ML features making decisions about people have documented DPIAs
- [ ] Scoring/ranking/matching algorithms that affect outcomes are assessed
- [ ] Large-scale processing pipelines have documented risk assessments

### Discovery strategy
- Search for ML model training/inference on personal data
- Search for scoring, ranking, matching, or prediction logic
- Search for automated filtering or decision logic affecting users
- Check if DPIA documentation exists for identified high-risk processing

---

## 10. International Data Transfers
**Articles: 44-49 | Severity: CRITICAL**

Personal data can only leave the EEA with adequate safeguards: adequacy decision, SCCs, BCRs, or explicit consent.

### Checks
- [ ] Cloud infrastructure region identified (EEA or not)
- [ ] Third-party services and their processing locations documented
- [ ] Transfer mechanisms documented for non-EEA processors
- [ ] Database replication doesn't cross to non-EEA regions without safeguards
- [ ] CDN configuration doesn't route PII through non-EEA nodes without safeguards

### Discovery strategy
- Check cloud provider region settings in configuration and infra-as-code
- For each third-party service identified in Phase 0, determine processing location
- Check database replication configuration
- Check CDN configuration
- Check AI/ML API configurations (where do they process data?)

---

## 11. Automated Decision-Making & Profiling
**Articles: 22, 21(1) | Severity: CRITICAL**

Users have the right NOT to be subject to decisions based solely on automated processing with legal or significant effects. Must provide: human intervention, right to express views, right to contest.

### Checks
- [ ] Automated decisions affecting users have a human review option
- [ ] Users informed about automated decision logic (Art. 13(2)(f), 14(2)(g))
- [ ] Mechanism to request human intervention exists
- [ ] No automated decisions based on special category data without Art. 9 exception

### Discovery strategy
- Search for any logic that automatically determines user eligibility, access, scoring, ranking, or rejection
- Look for ML inference endpoints feeding into decision logic
- Search for threshold/cutoff patterns that auto-approve or auto-reject
- Check if any such automated path has a human override mechanism

---

## 12. Processor & Sub-Processor Management
**Articles: 28, 29 | Severity: HIGH**

DPAs with all processors. Processors act only on instructions. Sub-processors require prior authorisation.

### Checks
- [ ] All third-party services processing PII are documented
- [ ] DPAs referenced or noted for each
- [ ] Sub-processor changes trackable

### Discovery strategy
- Enumerate all third-party API integrations
- Check SDK imports, environment variables for external services
- Review webhook configurations sending data externally
- Cross-reference with the data map to see what PII reaches each

---

## 13. Children's Data
**Articles: 8 | Severity: CRITICAL**

For services offered to children: consent valid at 16+ (member states may lower to 13). Below threshold: parental consent with reasonable verification.

### Checks
- [ ] Age verification if service may be used by minors
- [ ] Parental consent flow for under-age users
- [ ] Enhanced deletion for data collected during childhood

### Discovery strategy
- Search for date of birth collection and age calculation
- Look for age gate implementations
- Check if the service's audience could include minors

---

## 14. Special Categories of Data
**Articles: 9, 10 | Severity: CRITICAL**

Processing of sensitive data (race, religion, health, biometrics, sex life, political opinions, union membership, genetics) is prohibited unless explicit exceptions apply.

### Checks
- [ ] Identify any fields constituting special category data
- [ ] Explicit consent obtained specifically for special category processing
- [ ] Enhanced security for special category data
- [ ] Not used in automated decisions without Art. 9 exception

### Discovery strategy
- Search for fields matching special category patterns (see data-flows.md)
- Check if any processing extracts such data indirectly (e.g., NLP on free text, image analysis)
- Check for biometric processing (facial recognition, fingerprints)

---

## 15. Data Protection Officer
**Articles: 37-39 | Severity: HIGH**

DPO required when: core activities involve large-scale monitoring or large-scale special category processing. DPO contact must be published.

### Checks
- [ ] DPO contact in privacy policy and application
- [ ] Contact mechanism accessible

### Discovery strategy
- Search privacy policy content, footer links, contact pages for DPO details

---

## 16. Accountability & Documentation
**Articles: 5(2), 24 | Severity: HIGH**

Controller must DEMONSTRATE compliance — not just be compliant.

### Checks
- [ ] Audit trails for processing operations
- [ ] Version-controlled privacy policies
- [ ] Documented data flows and purposes
- [ ] Evidence of security testing
- [ ] Consent records with full provenance

### Discovery strategy
- Search for audit log implementations
- Check version history on privacy-related files
- Look for security test suites, dependency scanning config
- Check for documentation directories covering data processing

---

## Quick Reference: Fine Tiers

**Tier 1 — Up to €20M or 4% turnover (Art. 83(5)):**
Art. 5, 6, 7, 9 (lawful basis, consent, special categories), Art. 12-22 (data subject rights), Art. 44-49 (international transfers)

**Tier 2 — Up to €10M or 2% turnover (Art. 83(4)):**
Art. 8, 11, 25-39, 42-43 (controller/processor obligations: security, breach notification, DPIA, DPO, records)
