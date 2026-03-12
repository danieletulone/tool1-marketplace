---
name: update-readme
description: Regenerate the marketplace README.md with the current plugin catalog. Use when user wants to update, refresh, or sync the README after adding, removing, or modifying plugins.
user-invocable: true
---

# Update README

You are regenerating the marketplace `README.md` by reading the template and injecting the current plugin catalog from `marketplace.json`.

## Steps

1. **Read** `README.md.template`.

2. **Read** `.claude-plugin/marketplace.json` to get the list of registered plugins.

3. **Build the plugin catalog** from the `plugins` array. For each plugin, also read its `plugins/<name>/.claude-plugin/plugin.json` to get the full description and keywords.

4. **Generate the plugins section** to replace the content between `<!-- PLUGINS:START -->` and `<!-- PLUGINS:END -->` markers in the template:

   - If there are **no plugins**, use:

     ```
     No plugins registered yet. Use `/create-plugin` to get started.
     ```

   - If there **are plugins**, generate a markdown table:
     ```markdown
     | Plugin                                | Description  | Version | Keywords               |
     | ------------------------------------- | ------------ | ------- | ---------------------- |
     | [`plugin-name`](plugins/plugin-name/) | What it does | 1.0.0   | `keyword1`, `keyword2` |
     ```

5. **Write** the result to `README.md`, replacing the existing file.

6. **Confirm** the update and list which plugins are now in the catalog.

## Rules

- Always preserve everything outside the `<!-- PLUGINS:START -->` / `<!-- PLUGINS:END -->` markers exactly as-is from the template.
- The plugin table must be sorted alphabetically by plugin name.
- Link each plugin name to its directory (`plugins/<name>/`).
- Format keywords as inline code (backtick-wrapped), comma-separated.
- Do NOT modify `README.md.template` — it is the source of truth.
