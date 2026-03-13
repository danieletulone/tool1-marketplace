---
name: gdpr-audit
description: Analyse any codebase for GDPR compliance, identifying violations, risks, and gaps. Use this skill whenever the user asks about GDPR compliance, data protection, privacy audit, personal data handling, or data privacy in the context of code. Trigger on GDPR, right to erasure, data subject rights, consent mechanisms, data retention, privacy by design, DPA, DPIA, data breach, PII handling, personal data processing, or even casual requests like "check my code for privacy issues", "is my app GDPR compliant", "audit my data handling". Works with any tech stack — auto-detects technologies and adapts analysis. Invoke directly with /gdpr-audit or let Claude use it automatically when GDPR topics arise.
allowed-tools: Read, Grep, Glob, Bash(find:*), Bash(wc:*), Bash(head:*), Bash(tail:*), Bash(cat:*)
---

# GDPR Codebase Compliance Analyser

Analyse any codebase for GDPR compliance. Stack-agnostic — auto-detects technologies and adapts checks.

## Supporting files

This skill has reference files in the `references/` directory alongside this SKILL.md. Read them before starting analysis:

| File | When to read | Content |
|---|---|---|
| `references/checklist.md` | **Always** | 16 GDPR compliance categories with code-level checks |
| `references/data-flows.md` | Always for full audits | PII identification, data flow tracing, consent and deletion verification |
| `references/technical-measures.md` | When evaluating security | Encryption, access control, pseudonymisation, audit logging |
| `references/red-flags.md` | For quick scans | Common anti-patterns by severity, scanning strategy |

For a **full audit**, read all four. For a **quick scan**, read `red-flags.md` first.

## Usage

- **Full audit**: `/gdpr-audit` or `/gdpr-audit full` — runs all phases, produces a complete report
- **Quick scan**: `/gdpr-audit quick` — runs red-flag scan only, fast results
- **Specific category**: `/gdpr-audit consent` or `/gdpr-audit deletion` or `/gdpr-audit transfers` — focuses on one area
- **Auto-invoked**: Claude will use this skill automatically when GDPR-related questions arise about the codebase

If `$ARGUMENTS` is provided, use it to determine scope (full, quick, or specific category). Default to full audit if no argument.

## Analysis workflow

### Phase 0: Stack discovery

Before any GDPR-specific analysis, discover the tech stack to determine which checks apply.

**Explore the project root using Glob and Read:**
- `Glob` for dependency manifests: `package.json`, `requirements.txt`, `Pipfile`, `Gemfile`, `go.mod`, `Cargo.toml`, `composer.json`, `pubspec.yaml`, `build.gradle`, `pom.xml`, `*.csproj`
- `Glob` for config files: `.env.example`, `docker-compose.yml`, `terraform/**/*.tf`, `bicep/**/*.bicep`, `infrastructure/**/*`
- `Glob` for CI/CD: `.github/workflows/*.yml`, `Jenkinsfile`, `.gitlab-ci.yml`
- `Read` the key manifests to identify dependencies

**Record:**
1. Languages & frameworks
2. Databases (SQL, document, key-value, graph)
3. Search engines, vector databases
4. AI/ML services (LLM APIs, ML inference, embedding APIs)
5. Cloud provider & configured regions
6. Third-party services (auth, email, analytics, payment, CRM, monitoring)
7. File storage, message queues, caching layers
8. Multi-tenancy model

### Phase 1: Data model mapping

Using PII field patterns from `references/data-flows.md`:

1. `Grep` across the codebase for PII field names (name, email, phone, address, dob, ssn, etc.)
2. `Read` data model files, schema definitions, migration files, type definitions
3. Classify each PII field: direct identifier, indirect identifier, special category
4. `Grep` for secondary stores receiving PII: search index configurations, cache writes, analytics events, vector upserts, log statements with user data

### Phase 2: Category-by-category scan

Work through the 16 categories in `references/checklist.md`. For each:

1. `Grep` for relevant patterns (consent fields, delete endpoints, encryption config, auth middleware, etc.)
2. `Read` the files found to verify correct implementation
3. Flag missing mechanisms with appropriate severity

Key `Grep` patterns to run:

```
# Consent
Grep: consent|opt_in|opt_out|gdpr|privacy|marketing_consent|terms_accepted

# Deletion
Grep: delete_user|remove_account|erase|purge|anonymise|anonymize|right_to_be_forgotten

# Security
Grep: encrypt|decrypt|hash|bcrypt|argon|password|secret|api_key|apikey

# Access control
Grep: middleware|guard|interceptor|authorize|authenticate|permission|role|acl

# Logging PII (anti-pattern)
Grep: console\.log\(user|logger\.info\(req|print\(user|log\.debug\(request

# Data export
Grep: export|download|portability|subject_access|sar|data_request

# Retention
Grep: retention|ttl|expires_at|cleanup|purge|cron|schedule.*delete

# Third-party transfers
Grep: sendgrid|mailgun|stripe|analytics|sentry|datadog|mixpanel|amplitude|openai|anthropic
```

### Phase 3: Generate report

Output a structured compliance report as markdown. If the user wants a file, save it to the project (e.g., `docs/gdpr-compliance-report.md`).

## Report format

```markdown
# GDPR Compliance Report
**Application**: [name from package.json or project root]
**Date**: [today]
**Stack**: [detected technologies]
**Scope**: [what was analysed]

## Overall Score: [X/100]

## Executive Summary
[2-3 sentences: posture, biggest risks, top priorities]

## Detected Stack
[Technologies found with GDPR-relevant notes — cloud regions, third-party processors]

## Critical Findings
### Finding [N]: [Title]
- **Severity**: CRITICAL
- **GDPR Article**: Art. [X] — [name]
- **Location**: [file path : line number]
- **Issue**: [What's wrong]
- **Risk**: [Fine tier, breach risk, data subject impact]
- **Remediation**: [Concrete steps]

## High / Medium / Low Findings
[Same format per tier]

## Compliance by Category

| # | Category | Status | Key Issues |
|---|---|---|---|
| 1 | Lawful Basis & Consent | Compliant / Partial / Non-Compliant / N/A | ... |
| 2 | Data Subject Rights | ... | ... |
| ... | ... | ... | ... |

## Data Map
[PII found, where stored, where it flows externally]

## Recommended Priorities
[Ordered by risk × effort]

## Scope Limitations
[What couldn't be verified from code alone]
```

## Scoring

| Category | Weight |
|---|---|
| Lawful Basis & Consent | 12% |
| Data Subject Rights | 15% |
| Data Minimisation | 8% |
| Storage Limitation & Retention | 8% |
| Security of Processing | 12% |
| Breach Detection & Notification | 5% |
| Data Protection by Design & Default | 8% |
| Records of Processing | 4% |
| DPIA | 4% |
| International Data Transfers | 8% |
| Automated Decision-Making | 6% |
| Processor Management | 4% |
| Children's Data | 2% |
| Special Categories | 4% |

Compliant = full points, Partial = half, Non-compliant = 0, N/A = full.

## Caveats to always include

1. Code analysis cannot verify organisational measures (training, DPO appointment, policies)
2. DPA existence with third parties can be flagged but not verified from code
3. Legal adequacy of privacy notices requires legal review
4. Infrastructure config may need separate review beyond application code
5. This identifies technical gaps — legal interpretation should involve a privacy professional
