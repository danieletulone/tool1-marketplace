---
name: top10-2025-audit
description: >
  Analyse any codebase for compliance with the OWASP Top 10 2025 web application
  security risks. Use this skill whenever the user asks to audit, scan, review, or
  check a codebase for security issues, OWASP compliance, web application vulnerabilities,
  security posture, secure coding practices, or application security risks. Also trigger
  when the user mentions broken access control, injection, cryptographic failures,
  security misconfiguration, supply chain, authentication, integrity, logging, or
  exception handling in the context of code review. Works on any tech stack.
allowed-tools: Read, Grep, Glob, Bash(find:*), Bash(wc:*), Bash(head:*), Bash(tail:*), Bash(cat:*)
---

# OWASP Top 10 2025 — Codebase Security Audit

## Usage

`/owasp-audit [mode] [category]`

| Argument   | Values                                    | Default |
| ---------- | ----------------------------------------- | ------- |
| `mode`     | `full` · `quick` · `category`             | `full`  |
| `category` | `A01`–`A10` (only when mode = `category`) | —       |

- **full**: all 10 categories, deep scan (~15-25 min)
- **quick**: red-flags scan only — load `references/red-flags.md` and run the universal grep patterns
- **category**: deep-dive on one OWASP category

---

## Workflow

### Phase 0 — Stack Discovery

Identify the tech stack before scanning. Run these discovery steps:

1. **Glob** for dependency manifests:
   `package.json`, `pubspec.yaml`, `Gemfile`, `requirements.txt`, `pyproject.toml`,
   `go.mod`, `Cargo.toml`, `pom.xml`, `build.gradle`, `composer.json`, `*.csproj`, `mix.exs`
2. **Glob** for infra / CI configs:
   `Dockerfile*`, `docker-compose*`, `*.tf`, `*.yaml` in `.github/workflows/`,
   `.gitlab-ci.yml`, `Jenkinsfile`, `cloudbuild.yaml`, `serverless.yml`, `fly.toml`
3. **Glob** for framework markers:
   `next.config.*`, `nuxt.config.*`, `angular.json`, `vite.config.*`, `firebase.json`,
   `app/config/*.yml`, `config/routes.rb`, `manage.py`, `main.go`, `Program.cs`
4. **Read** the top-level directory listing and note the primary language(s) and framework(s).
5. Produce a short **Stack Summary** (language, framework, database, cloud, CI/CD).

This summary informs which grep patterns are most relevant in later phases.

### Phase 1 — Domain Mapping

Load `references/data-flows.md` and use its strategies to locate:

- **Entry points**: routes, controllers, API handlers, serverless functions
- **Data models**: ORM models, schemas, database migration files
- **Authentication modules**: auth middleware, login handlers, session config
- **Configuration files**: environment configs, secrets management
- **Build & deploy pipeline**: CI/CD files, Dockerfiles, IaC templates

Record file paths for each domain — these become the scan targets for Phase 2.

### Phase 2 — Category Scan

Load `references/checklist.md`. For each of the 10 OWASP categories:

1. Read the category's **Discovery Strategy** to know what to grep/read.
2. Run the grep patterns and read flagged files.
3. Cross-reference with `references/technical-measures.md` for expected safeguards.
4. Record findings with severity, file path, line reference, and OWASP category.

In `quick` mode, skip this phase — use `references/red-flags.md` instead.
In `category` mode, scan only the requested category.

### Phase 3 — Report Generation

Produce a structured markdown report:

```
# OWASP Top 10 2025 — Security Audit Report

## Stack Summary
(from Phase 0)

## Overall Score: X / 100

## Findings by Category

### A01: Broken Access Control — Score: X/10
| # | Severity | Finding | File | Line | Remediation |
|---|----------|---------|------|------|-------------|
| 1 | CRITICAL | ...     | ...  | ...  | ...         |

(repeat for each category)

## Risk Summary
- Critical: N findings
- High: N findings
- Medium: N findings
- Low: N findings

## Caveats
(what static analysis cannot verify)
```

### Scoring Methodology

Each category scores 0–10 (10 = fully compliant, 0 = critical violations found).

**Category weights** (sum = 100):

| Category | Weight | Rationale                            |
| -------- | ------ | ------------------------------------ |
| A01      | 15     | #1 risk, highest real-world impact   |
| A02      | 10     | Ops-heavy, common root cause         |
| A03      | 12     | Supply chain = growing attack vector |
| A04      | 10     | Data breach enabler                  |
| A05      | 12     | Classic, high-exploitability         |
| A06      | 8      | Design-level, harder to detect       |
| A07      | 10     | Auth = front door                    |
| A08      | 8      | CI/CD & integrity                    |
| A09      | 8      | Visibility & incident response       |
| A10      | 7      | New category, error handling         |

**Overall score** = Σ (category_score × weight) / 10

### Severity Mapping

| Severity | Description                                 |
| -------- | ------------------------------------------- |
| CRITICAL | Actively exploitable, immediate remediation |
| HIGH     | Significant risk, fix within current sprint |
| MEDIUM   | Best practice gap, plan remediation         |
| LOW      | Hardening opportunity, backlog              |
| INFO     | Observation, no direct risk                 |

---

## Caveats

Static code analysis **can** detect: hardcoded secrets, missing input validation patterns,
weak crypto usage, missing auth checks in routes, dependency versions, error handling gaps,
logging patterns, configuration issues.

Static code analysis **cannot** verify: runtime behavior, actual access control enforcement,
network-level protections, WAF rules, cloud IAM policies, whether logging is actually
monitored, penetration test results, threat model completeness.

Always recommend complementary dynamic testing (DAST), penetration testing, and
manual security review for a complete assessment.

---

## Reference Files

Load these on demand — do NOT read all at once:

| File                               | When to load                    | Lines |
| ---------------------------------- | ------------------------------- | ----- |
| `references/checklist.md`          | Phase 2 (full/category mode)    | ~380  |
| `references/data-flows.md`         | Phase 1 (domain mapping)        | ~200  |
| `references/technical-measures.md` | Phase 2 (cross-reference)       | ~200  |
| `references/red-flags.md`          | Quick mode, or Phase 2 pre-scan | ~200  |
