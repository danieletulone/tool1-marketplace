# owasp

> Analyse any codebase for OWASP Top 10 2025 security risks and vulnerabilities

**Version:** 1.0.0 | **Author:** danieletulone | **License:** Apache-2.0

## Installation

```bash
/plugin install owasp@tool1-marketplace
```

## What it does

Provides the `top10-2025-audit` skill that analyses any codebase against the OWASP Top 10 2025 web application security risks. It auto-detects the tech stack, scans for vulnerabilities like broken access control, injection, cryptographic failures, and security misconfigurations, then generates a structured report with severity-rated findings and remediation steps. Works with any technology stack.

## Skills

| Skill | Description |
| --- | --- |
| `top10-2025-audit` | Analyse any codebase for OWASP Top 10 2025 compliance, identifying security vulnerabilities and risks. Invoke with `/top10-2025-audit` or let Claude trigger it automatically on security-related questions. |

## Usage

- **Full audit**: `/top10-2025-audit` or `/top10-2025-audit full`
- **Quick scan**: `/top10-2025-audit quick`
- **Specific category**: `/top10-2025-audit injection`, `/top10-2025-audit access-control`, `/top10-2025-audit crypto`

## Keywords

`claude-code`, `plugin`, `owasp`, `security`, `audit`, `vulnerabilities`, `web-application`
