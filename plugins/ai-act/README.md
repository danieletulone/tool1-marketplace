# ai-act

> Analyse any codebase for EU AI Act compliance gaps and risks

**Version:** 1.0.0 | **Author:** danieletulone | **License:** Apache-2.0

## Installation

```bash
/plugin install ai-act@tool1-marketplace
```

## What it does

Provides the `eu-ai-act-audit` skill that analyses any codebase for compliance with the EU Artificial Intelligence Act (Regulation 2024/1689). It auto-detects the tech stack, classifies AI system risk levels, scans for prohibited practices, and generates a structured report with severity-rated findings and remediation steps. Works with any technology stack.

## Skills

| Skill | Description |
| --- | --- |
| `eu-ai-act-audit` | Analyse any codebase for EU AI Act compliance, identifying violations, risks, and gaps. Invoke with `/eu-ai-act-audit` or let Claude trigger it automatically on AI Act-related questions. |

## Usage

- **Full audit**: `/eu-ai-act-audit` or `/eu-ai-act-audit full`
- **Quick scan**: `/eu-ai-act-audit quick`
- **Specific category**: `/eu-ai-act-audit transparency`, `/eu-ai-act-audit high-risk`, `/eu-ai-act-audit prohibited`

## Keywords

`claude-code`, `plugin`, `ai-act`, `compliance`, `eu-regulation`, `audit`, `artificial-intelligence`
