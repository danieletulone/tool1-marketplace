---
name: validate-plugin
description: Validate a Claude Code plugin's structure, configuration, and marketplace registration. Use when user wants to check, validate, or verify a plugin.
user-invocable: true
---

# Validate Plugin

You are validating a Claude Code plugin in the marketplace at `this marketplace repository`.

## Input

The user provides a plugin name or path. If just a name, look in `plugins/<name>/`.

## Validation Checks

Run ALL of the following checks and report results as a checklist:

### 1. File Structure

- [ ] `plugins/<name>/` directory exists
- [ ] `.claude-plugin/plugin.json` exists and is valid JSON
- [ ] `hooks/hooks.json` exists and is valid JSON
- [ ] `scripts/` directory exists
- [ ] All script files referenced in `hooks.json` commands exist
- [ ] `README.md` exists

### 2. plugin.json

- [ ] Has required fields: `name`, `version`, `description`, `author`
- [ ] `name` matches the directory name
- [ ] `version` follows semver format (e.g. `1.0.0`)
- [ ] `author` has at least `name` field
- [ ] `keywords` is an array of strings

### 3. hooks.json

- [ ] Has `description`, `version`, `author`, `hooks` fields
- [ ] `version` matches `plugin.json` version
- [ ] Each hook event is valid: `SessionStart`, `Stop`, `PreToolUse`, `PostToolUse`
- [ ] Each hook entry has: `description`, `priority`, `enabled`, `hooks` array
- [ ] Each command hook has: `type: "command"`, `command`, `timeout`
- [ ] Commands use `${CLAUDE_PLUGIN_ROOT}` for paths (not hardcoded)

### 4. Scripts

- [ ] All `.js` files have `#!/usr/bin/env node` shebang
- [ ] `PLUGIN_NAME` constant matches `plugin.json` name
- [ ] Scripts end with `process.exit(0)` or `process.exit()`
- [ ] Stop hook scripts have the re-entry guard (`STOP_HOOK_ACTIVE` check)
- [ ] Stop hook scripts have the duplicate execution guard (lock file pattern)

### 5. Marketplace Registration

- [ ] Plugin is listed in `.claude-plugin/marketplace.json`
- [ ] `name` in marketplace matches `plugin.json` name
- [ ] `source` path is correct (`./plugins/<name>`)
- [ ] `version` in marketplace matches `plugin.json` version

## Output

Present results as a checklist with pass/fail status. For any failures, explain what's wrong and suggest the fix. If everything passes, confirm the plugin is ready.
