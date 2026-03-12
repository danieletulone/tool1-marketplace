---
name: rename-marketplace
description: Rename all template placeholders after cloning. Use when user wants to personalize, rename, initialize, or set up their marketplace with their own name and GitHub username.
user-invocable: true
---

# Rename Marketplace

You are helping the user personalize this marketplace template by replacing all placeholder values with their own.

## Input

Ask the user for (skip any they already provided):

1. **Marketplace name** — kebab-case (e.g. `my-awesome-marketplace`)
2. **GitHub username or org** — (e.g. `octocat`)

## Placeholders to replace

Perform the following replacements across the entire repository:

| Placeholder        | Replace with            |
| ------------------ | ----------------------- |
| `your-marketplace` | the marketplace name    |
| `your-name`        | the GitHub username/org |

## Files to update

Apply replacements in ALL of these files:

- `.claude-plugin/marketplace.json`
- `README.md.template`
- `GUIDE.md`
- `NOTICE`
- `LICENSE`
- `.claude/skills/create-plugin/SKILL.md`
- `.claude/skills/bump-plugin/SKILL.md`
- `.claude/skills/validate-plugin/SKILL.md`
- `.claude/skills/register-plugin/SKILL.md`

## Steps

1. **Ask** the user for marketplace name and GitHub username (if not already provided).
2. **Read** each file listed above.
3. **Replace** all occurrences of each placeholder with the user's values.
4. **Run** `/generate-readme` to generate the final `README.md` from the template.
5. **Show** a summary of all files modified and the replacements made.

## Rules

- Use `replace_all: true` when editing to catch every occurrence in each file.
- Do NOT modify any other content in the files — only replace the placeholders listed above.
- If a placeholder does not appear in a file, skip it silently.
- The marketplace name must be kebab-case. If the user provides something else, convert it.
