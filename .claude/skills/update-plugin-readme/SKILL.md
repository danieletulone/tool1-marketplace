---
name: update-plugin-readme
description: Regenerate a plugin's README.md from its metadata and hook configuration. Use when user wants to update, refresh, or sync a plugin's README after making changes.
user-invocable: true
---

# Update Plugin README

You are regenerating a plugin's `README.md` from its current metadata files.

## Input

The user provides a plugin name or path. If just a name, look in `plugins/<name>/`.

## Steps

1. **Read** `plugins/<name>/.claude-plugin/plugin.json` to get: name, description, version, author, keywords, homepage.

2. **Read** `plugins/<name>/hooks/hooks.json` to get: hook events configured, descriptions, timeouts.

3. **Read** `plugins/<name>/scripts/init-config.js` to extract the `defaultConfig` object (the configuration options available to users).

4. **Generate** the `README.md` with this structure:

   ````markdown
   # <plugin-name>

   > <description>

   **Version:** <version> | **Author:** <author-name> | **License:** <license>

   ## Installation

   ```bash
   /plugin install <plugin-name>@<marketplace-name>
   ```
   ````

   ## What it does

   <Explain what the plugin does based on the hook events and script logic. Keep it to 2-3 sentences.>

   ## Hook Events

   | Event   | Description   | Timeout     |
   | ------- | ------------- | ----------- |
   | <event> | <description> | <timeout>ms |

   ## Configuration

   After installation, configuration is stored in `.plugin-config/<plugin-name>.json`.

   | Option  | Default   | Description            |
   | ------- | --------- | ---------------------- |
   | `<key>` | `<value>` | <inferred description> |

   ## Keywords

   `keyword1`, `keyword2`, `keyword3`

   ```

   ```

5. **Read** `.claude-plugin/marketplace.json` to get the marketplace name for the install command.

6. **Write** the generated content to `plugins/<name>/README.md`.

7. **Confirm** the update.

## Rules

- Always read the actual metadata files — never guess or use stale data.
- If `defaultConfig` cannot be parsed from `init-config.js`, omit the Configuration section.
- If the plugin has no hook events configured, omit the Hook Events table.
- Keep the "What it does" section factual — derive it from the hook events and script descriptions, not from speculation.
- The marketplace name comes from `.claude-plugin/marketplace.json` → `name` field.
