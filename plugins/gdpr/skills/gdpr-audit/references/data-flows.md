# Data Flow Analysis Guide

How to identify, trace, and evaluate personal data flows in any codebase for GDPR compliance.
All patterns are technology-neutral — adapt to whatever stack you discover.

---

## 1. PII Field Identification

Use these patterns to search across data models, schemas, type definitions, and database configurations. Search is case-insensitive and should account for naming conventions (camelCase, snake_case, PascalCase, kebab-case).

### Direct identifiers (always PII)
- **Name**: `name`, `first_name`, `last_name`, `full_name`, `display_name`, `surname`, `given_name`
- **Email**: `email`, `email_address`, `mail`, `e_mail`
- **Phone**: `phone`, `phone_number`, `mobile`, `telephone`, `tel`, `cell`
- **Address**: `address`, `street`, `city`, `zip`, `postal_code`, `country`, `region`, `state`
- **National ID**: `ssn`, `social_security`, `national_id`, `fiscal_code`, `tax_id`, `passport`, `id_card`, `driver_license`, `personal_number`
- **Date of birth**: `date_of_birth`, `dob`, `birthday`, `birth_date`, `age`
- **Photo/image**: `photo`, `avatar`, `profile_image`, `picture`, `headshot`, `face`

### Indirect identifiers (PII when linkable to a person)
- **Network**: `ip_address`, `ip`, `remote_addr`, `client_ip`
- **Device**: `user_agent`, `device_id`, `device_fingerprint`, `browser_fingerprint`
- **Tracking**: `cookie`, `session_id`, `tracking_id`, `visitor_id`, `anonymous_id`
- **Location**: `location`, `latitude`, `longitude`, `geo`, `coordinates`, `gps`
- **Account**: `username`, `user_id`, `account_id`, `customer_id`, `member_id`
- **Financial**: `account_number`, `iban`, `card_number`, `bank`

### Special category data (Art. 9 — requires explicit consent or exception)
- **Ethnic/racial**: `ethnicity`, `race`, `racial_origin`, `ethnic_origin`, `nationality` (context-dependent)
- **Religion**: `religion`, `religious_belief`, `faith`, `denomination`
- **Political**: `political_opinion`, `political_party`, `political_affiliation`
- **Union**: `union_membership`, `trade_union`
- **Health**: `health`, `medical`, `diagnosis`, `disability`, `condition`, `medication`, `allergy`, `blood_type`
- **Genetic**: `genetic`, `dna`, `genome`, `hereditary`
- **Biometric**: `biometric`, `fingerprint`, `face_encoding`, `iris`, `voiceprint`, `face_id`
- **Sexual**: `sexual_orientation`, `gender_identity`, `sex_life`

### Contextual PII (depends on application domain)
These become PII when combined with other data or in specific contexts:
- **Employment**: `salary`, `compensation`, `job_title`, `employer`, `work_history`
- **Education**: `education`, `degree`, `university`, `gpa`, `grades`
- **Financial**: `income`, `credit_score`, `debt`, `transaction`
- **Behavioural**: `preferences`, `interests`, `browsing_history`, `purchase_history`
- **Communication**: `message`, `chat`, `comment`, `note` (when attributable)

---

## 2. Data Collection Points

Trace every entry point where personal data enters the system.

### User-facing input
- **Forms**: registration, profile edit, contact, application, upload, feedback, checkout
- **File uploads**: documents, images, media that may contain PII
- **OAuth/SSO flows**: what scopes are requested? What profile data is imported?
- **Import features**: CSV/Excel upload, bulk data import, migration tools

### Automated collection
- **Cookies and tracking**: what's set before vs after consent?
- **Analytics events**: which events include PII in properties?
- **Error/crash reporting**: do error payloads include request data, user context, PII?
- **Server logs**: IP addresses, request paths containing PII, query strings
- **Performance monitoring**: do traces include PII?

### Third-party ingest
- **Webhooks receiving external data**: what PII arrives via inbound webhooks?
- **API polling**: data pulled from external systems
- **Email/message parsing**: extracting data from inbound communications
- **Data enrichment**: third-party APIs that add PII to existing records

### For each collection point, verify:
- [ ] User informed BEFORE collection (Art. 13)
- [ ] Lawful basis identified
- [ ] Only necessary data collected (minimisation)
- [ ] Consent obtained where required
- [ ] Privacy notice accessible at the point of collection

---

## 3. Data Storage Mapping

### Primary data stores
For each database, collection, or table containing PII, document:
- What PII fields are stored
- Lawful basis for storage
- Retention period
- Encryption at rest (enabled or not)
- Access control (who/what can read/write)

### Secondary data stores
Personal data often replicates to systems that are forgotten during compliance reviews. For each, check whether it receives PII and whether it's covered by deletion/rectification flows:

- **Search indices**: full-text search engines indexing PII fields. Are they synced on update/delete?
- **Vector databases**: embeddings derived from PII. Can individual records be deleted? Can PII be reconstructed from vectors?
- **Caches**: in-memory or distributed caches storing user data. TTL set? Invalidated on changes?
- **File storage**: uploaded documents, generated reports, exports. Access-controlled? Deleted when user requests erasure?
- **Logs**: application logs containing PII in messages, request/response bodies, error contexts. Retention policy?
- **Analytics/data warehouse**: event data, metrics, reporting tables containing PII. Anonymised? Deletable?
- **Backups**: database and file backups. Encrypted? Retention period? Can individual records be erased? (If not, document backup TTL as maximum data retention.)
- **Message queues / event streams**: messages containing PII sitting in queues or streams. Retention? Consumption and deletion?
- **CDN / edge caches**: cached pages or API responses containing PII. Purge mechanism?
- **Email/notification systems**: contact lists, message history stored by third-party email services

---

## 4. Data Sharing & Transfer Mapping

### External recipients
For EVERY third-party service or external system that receives PII, document:
- What data is shared
- Purpose of sharing
- Where the service processes data (country/region)
- DPA status (signed or pending)
- Transfer mechanism if outside EEA (SCCs, adequacy decision, explicit consent, derogation)

### How to discover external recipients
- **Environment variables**: URLs, API keys, endpoints pointing to external services
- **SDK/library imports**: client libraries for third-party services
- **HTTP client calls**: outbound API requests in code
- **Webhook configurations**: outbound webhooks sending data externally
- **Infrastructure config**: cloud service integrations, managed services, SaaS tools
- **CI/CD pipelines**: deployment tools, monitoring services with access to production

### Internal data flows
- Replication between microservices or service boundaries
- Event-driven propagation (message queues, event buses)
- Batch synchronisation jobs (database → search index, database → warehouse)
- Data export/reporting pipelines
- Cross-environment flows (staging using production data = transfer risk)

---

## 5. Consent Flow Tracing

End-to-end verification — from UI to database to processing:

### Collection
- Where and how is consent obtained?
- What exactly is the user told (and is that text versioned)?
- Is consent granular per purpose?
- Does the UI prevent proceeding without affirmative action (no pre-ticked, no implied)?

### Storage
- Where is consent recorded? (dedicated model/table, or just a boolean on the user record?)
- Is timestamp, method, IP, and consent text version captured?
- Can you reconstruct exactly what the user agreed to and when?

### Enforcement
- Before sending marketing: is consent checked in code?
- Before AI processing: is consent or lawful basis verified?
- Before sharing with third parties: is consent verified?
- Are these checks enforced at a middleware/guard level, or just ad-hoc?

### Withdrawal
- Is there a clear UI for withdrawal (as accessible as granting)?
- Does withdrawal trigger actual cessation of processing?
- Is data deleted or retained under a different lawful basis?
- Are downstream systems and third parties notified?

---

## 6. Deletion Completeness Check

When a user requests deletion, trace data through every store identified in the data map:

```
User requests deletion
  → Primary database: record deleted or irreversibly anonymised
  → Search indices: entries removed
  → Vector database: embeddings removed
  → Caches: invalidated
  → File storage: uploaded files deleted
  → Analytics: events anonymised or deleted
  → Third-party services: deletion API called or manual process documented
  → Email/marketing lists: contact removed
  → Logs: PII removed or log retention period documented
  → Message queues: consumed messages with PII not indefinitely retained
  → Backups: backup retention period documented as maximum deletion timeline
  → Audit trail: the deletion event itself is logged (who, when, what scope)
```

### Verify for each store:
- [ ] Deletion mechanism exists
- [ ] Deletion is actually triggered by user erasure request
- [ ] Deletion is complete (not partial — e.g., user record gone but files remain)
- [ ] Deletion is timely (within response period or documented schedule)

### Retention enforcement
- [ ] Defined retention period exists per data category
- [ ] Automated job enforces it
- [ ] Job runs reliably (check execution history or schedule)
- [ ] Job handles edge cases (failures, partial data, orphaned records)
