# gdpr

> Analyse any codebase for GDPR compliance gaps and risks

**Version:** 1.0.0 | **Author:** danieletulone | **License:** Apache-2.0

## Installation

```bash
/plugin install gdpr@tool1-marketplace
```

## What it does

Provides the `gdpr-audit` skill that analyses any codebase for GDPR compliance. It auto-detects the tech stack, maps PII data flows, scans 16 compliance categories, and generates a structured report with severity-rated findings and remediation steps. Works with any technology stack.

## Skills

| Skill | Description |
| --- | --- |
| `gdpr-audit` | Analyse any codebase for GDPR compliance, identifying violations, risks, and gaps. Invoke with `/gdpr-audit` or let Claude trigger it automatically on GDPR-related questions. |

## Usage

- **Full audit**: `/gdpr-audit` or `/gdpr-audit full`
- **Quick scan**: `/gdpr-audit quick`
- **Specific category**: `/gdpr-audit consent`, `/gdpr-audit deletion`, `/gdpr-audit transfers`

## Keywords

`claude-code`, `plugin`, `gdpr`, `compliance`, `privacy`, `audit`, `data-protection`
