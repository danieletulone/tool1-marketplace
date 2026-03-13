---
name: eu-ai-act-audit
description: >
  Analyse any codebase for compliance with the EU Artificial Intelligence Act (Regulation 2024/1689).
  Use this skill whenever the user mentions EU AI Act, AI Act compliance, AI regulation audit,
  AI system compliance check, high-risk AI assessment, AI Act readiness, GPAI model obligations,
  prohibited AI practices scan, Article 5 audit, Article 50 transparency check, or any variant of
  "check my code against the AI Act". Also trigger when the user asks about AI system risk classification,
  AI transparency requirements, AI logging obligations, human oversight compliance, or AI documentation
  requirements in a European regulatory context. Works on any tech stack.
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash(find:*)
  - Bash(wc:*)
  - Bash(head:*)
  - Bash(tail:*)
  - Bash(cat:*)
---

# EU AI Act Compliance Audit

Analyse a codebase for compliance with Regulation (EU) 2024/1689 (the AI Act).

## Usage

`/eu-ai-act-audit [mode] [category]`

| Argument | Options | Default |
|----------|---------|---------|
| mode | `full`, `quick`, `category` | `full` |
| category | See checklist categories (e.g. `transparency`, `logging`, `human-oversight`) | all |

- **full**: All four phases, every checklist category, scored report (~15-25 min)
- **quick**: Phase 0 + red-flags scan only, summary findings (~3-5 min)
- **category**: Phase 0 + targeted scan of one checklist category

## Phase 0 — Stack Discovery

Before any compliance check, understand what you're looking at.

1. Read the project root: `README*`, `package.json`, `requirements.txt`, `pubspec.yaml`, `go.mod`, `Cargo.toml`, `*.csproj`, `pom.xml`, `build.gradle`, `Gemfile`, `Makefile`, `docker-compose*`, `Dockerfile*`
2. Scan for infra-as-code: `Glob("**/terraform/**")`, `Glob("**/pulumi/**")`, `Glob("**/cdk/**")`, `Glob("**/.github/workflows/**")`, `Glob("**/azure-pipelines*")`
3. Identify AI/ML components: `Glob("**/model*/**")`, `Glob("**/ml/**")`, `Glob("**/ai/**")`, search for imports of `openai`, `anthropic`, `langchain`, `tensorflow`, `pytorch`, `transformers`, `sklearn`, `huggingface`
4. Identify data stores: search for database connection strings, ORM models, migration files
5. Summarise: tech stack, AI components found, data stores, deployment target

**Output**: A brief stack profile that informs which checks are relevant.

## Phase 1 — Domain Mapping

Read `references/data-flows.md` for detailed guidance.

Map the regulation's subject matter onto this specific codebase:
1. **AI system boundaries**: What constitutes an "AI system" in this codebase per Art. 3(1)?
2. **Risk classification**: Could any component fall under Annex III high-risk categories?
3. **GPAI model usage**: Does the system use or provide general-purpose AI models?
4. **Data subjects**: Who are the natural persons affected by the system's outputs?
5. **Decision impact**: Do AI outputs influence decisions about natural persons?
6. **Prohibited practice proximity**: Any features close to Art. 5 prohibited practices?

**Output**: A domain map listing each AI component, its risk tier, and relevant articles.

## Phase 2 — Category Scan

Read `references/checklist.md` and work through each category.

For each checklist category:
1. Read the category's discovery strategy
2. Execute the grep patterns and file searches described
3. Read the relevant source files found
4. Evaluate each check item as ✅ PASS, ⚠️ PARTIAL, ❌ FAIL, or ⬜ N/A
5. Note specific file:line references for findings
6. Cross-reference with `references/technical-measures.md` for implementation gaps
7. Check `references/red-flags.md` for anti-pattern matches

**For quick mode**: Read only `references/red-flags.md` and run the universal grep patterns.

## Phase 3 — Report Generation

Generate a structured markdown report:

```markdown
# EU AI Act Compliance Report
## Codebase: [name]
## Date: [date]
## Mode: [full|quick|category]

### Executive Summary
- Overall score: X/100
- Risk tier: [Prohibited | High-Risk | Limited-Risk | Minimal-Risk]
- Critical findings: N
- High findings: N

### Stack Profile
[from Phase 0]

### AI System Classification
[from Phase 1 — which articles apply and why]

### Findings by Category
[for each category with findings]
#### Category Name (Score: X/Y)
| # | Check | Status | Article | Severity | File | Remediation |
|---|-------|--------|---------|----------|------|-------------|

### Scoring Summary
[category scores with weights]

### Recommended Actions
[prioritised by severity × effort]
```

## Scoring Methodology

| Category | Weight | Penalty Tier |
|----------|--------|-------------|
| Prohibited practices (Art. 5) | 20% | €35M / 7% turnover |
| Risk management (Art. 9) | 12% | €15M / 3% turnover |
| Data governance (Art. 10) | 12% | €15M / 3% turnover |
| Transparency (Art. 13, 50) | 12% | €15M / 3% turnover |
| Human oversight (Art. 14) | 12% | €15M / 3% turnover |
| Logging & traceability (Art. 12) | 10% | €15M / 3% turnover |
| Accuracy & robustness (Art. 15) | 10% | €15M / 3% turnover |
| Documentation (Art. 11, 17, 53) | 6% | €15M / 3% turnover |
| GPAI obligations (Art. 53-55) | 6% | €15M / 3% turnover |

Score = weighted average of (category_pass_rate × category_weight).
SME cap on fines applies per Art. 99(6).

## Caveats

This audit analyses **code-level evidence only**. It cannot verify:
- Organisational policies, governance structures, or contractual arrangements
- Conformity assessment procedures or CE marking processes
- Quality management system documentation outside the repository
- Regulatory sandbox participation or real-world testing plans
- National transposition rules that may impose stricter requirements
- Whether the AI system is actually placed on the EU market

Findings are indicators, not legal determinations. Engage qualified legal counsel for formal compliance assessment.
