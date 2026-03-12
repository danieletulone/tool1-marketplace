---
name: bump-plugin
description: Bump a plugin's version number. Use when user wants to bump, release, or update the version of a plugin.
user-invocable: true
---

# Bump Plugin Version

You are bumping the version of a Claude Code plugin in the marketplace at `this marketplace repository`.

## Input

The user provides:

- Plugin name (or path)
- Bump type: `patch` (default), `minor`, or `major`

## Steps

1. **Read** the current version from `plugins/<name>/.claude-plugin/plugin.json`.

2. **Calculate** the new version using semver rules:

   - `patch`: 1.0.0 → 1.0.1
   - `minor`: 1.0.0 → 1.1.0
   - `major`: 1.0.0 → 2.0.0

3. **Update the version** in ALL of these locations:

   - `plugins/<name>/.claude-plugin/plugin.json` → `version`
   - `plugins/<name>/hooks/hooks.json` → `version`
   - `.claude-plugin/marketplace.json` → matching plugin entry `version`

4. **Update `lastUpdated`** in `hooks/hooks.json` to today's date.

5. **Bump the marketplace version** (patch) in `marketplace.json`.

6. **Confirm** the version change and list all files modified.
