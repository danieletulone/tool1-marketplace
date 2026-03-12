---
name: generate-readme
description: Generate the marketplace README.md from the template. Use when user wants to generate, create, or initialize the README for the first time after personalizing the template.
user-invocable: true
---

# Generate README

You are generating the final `README.md` for this marketplace from the `README.md.template` file.

## Steps

1. **Read** `README.md.template`.
2. **Read** `.claude-plugin/marketplace.json` to get the marketplace name, owner, and homepage.
3. **Check** that the template placeholders (`your-marketplace`, `your-name`) have already been replaced with real values. If they haven't, tell the user to run `/rename-marketplace` first and stop.
4. **Run** `/update-readme` to generate the `README.md` with the current plugin catalog injected.
5. **Confirm** that `README.md` has been generated and show the marketplace name.

## Rules

- Delegate the actual generation to `/update-readme` — it handles reading the template, building the plugin catalog, and writing `README.md`.
- Do NOT delete `README.md.template` — it is kept as the source of truth for future regeneration.
- If placeholders are still present, do NOT generate the README. Prompt the user to run `/rename-marketplace` first.
