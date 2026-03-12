---
name: create-plugin
description: Scaffold a new Claude Code plugin from the example template. Use when user wants to create, scaffold, or start a new plugin.
user-invocable: true
---

# Create Plugin

You are scaffolding a new Claude Code plugin for the marketplace at `this marketplace repository`.

## Steps

1. **Ask the user** for these details (skip any they already provided):

   - Plugin name (kebab-case, e.g. `hook-my-feature`)
   - One-line description
   - Author name
   - Category: `hooks`, `productivity`, `game-development`, `3d-development`
   - Which hook events the plugin needs: `SessionStart`, `Stop`, `PreToolUse`, `PostToolUse`
   - Keywords (comma-separated)

2. **Copy the template** from `plugins/example/` to `plugins/<plugin-name>/`.

3. **Replace all placeholders** in the copied files:

   - In `.claude-plugin/plugin.json`: set `name`, `description`, `author`, `keywords`.
   - In `hooks/hooks.json`: set `description`, `author`, `lastUpdated` (today's date). Configure only the hook events the user requested — remove unused hook event sections.
   - In `scripts/init-config.js`: set `PLUGIN_NAME` constant.
   - In `scripts/main.js`: set `PLUGIN_NAME` constant.
   - In `README.md`: update the title and description.

4. **Register the plugin** in `.claude-plugin/marketplace.json` by adding an entry to the `plugins` array:

   ```json
   {
     "name": "<plugin-name>",
     "source": "./plugins/<plugin-name>",
     "description": "<description>",
     "version": "1.0.0",
     "author": { "name": "<author>" },
     "category": "<category>",
     "homepage": "https://github.com/danieletulone/tool1-marketplace",
     "keywords": [<keywords>]
   }
   ```

5. **Bump the marketplace version** — increment the patch version in both `metadata.version` and the root `version` field of `marketplace.json`.

6. **Update READMEs** — run `/update-plugin-readme <plugin-name>` to generate the plugin's README, then run `/update-readme` to add the plugin to the marketplace README catalog.

7. **Tell the user** what was created and suggest next steps:
   - Implement the `run()` function in `scripts/main.js`
   - Add plugin-specific config defaults in `scripts/init-config.js`
   - Test with `/plugin validate`
   - Install with `/plugin install <plugin-name>@tool1-marketplace`

## Important Rules

- Never add concrete implementation logic — leave `run()` as a TODO for the user.
- Always use `node ${CLAUDE_PLUGIN_ROOT}/scripts/...` for command paths in hooks.json.
- Timeout should be 5000ms for SessionStart hooks, 10000ms for Stop hooks.
- Set `continueOnError: true` and `suppressOutput: true` for SessionStart init hooks.
- Hook priority defaults to 100.
