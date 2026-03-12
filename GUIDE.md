# Plugin Development Guide

This guide walks you through creating, developing, and releasing a Claude Code plugin using the built-in skills.

## Prerequisites

- Claude Code CLI installed
- Node.js installed
- This marketplace cloned locally

## 1. Scaffold a new plugin

Run the skill inside Claude Code:

```
/create-plugin
```

Claude will ask you for:

- **Plugin name** — kebab-case (e.g. `hook-lint-on-save`)
- **Description** — one line explaining what it does
- **Author name**
- **Category** — `hooks`, `productivity`, `game-development`, or `3d-development`
- **Hook events** — which lifecycle events trigger your plugin
- **Keywords** — for marketplace discoverability

The skill copies the template from `plugins/example/`, replaces all placeholders, and registers the plugin in `marketplace.json`.

After scaffolding, your plugin looks like this:

```
plugins/hook-lint-on-save/
├── .claude-plugin/
│   └── plugin.json
├── hooks/
│   └── hooks.json
├── scripts/
│   ├── init-config.js
│   └── main.js
└── README.md
```

## 2. Implement your logic

Open `scripts/main.js` and fill in the `run()` function:

```javascript
function run() {
  try {
    // Your plugin logic here.
    // You have access to:
    //   - projectRoot  (the user's working directory)
    //   - config       (loaded from .plugin-config/<name>.json)
    //   - require('child_process').execSync(...)
    //   - require('fs'), require('path')

    if (config.showLogs) {
      console.log(JSON.stringify({
        systemMessage: '✓ hook-lint-on-save: completed',
        continue: true
      }));
    }
  } catch (error) {
    if (config.showLogs) {
      console.log(JSON.stringify({
        systemMessage: `⚠️ hook-lint-on-save: ${error.message}`,
        continue: true
      }));
    }
  }
}
```

### Adding configuration options

Edit `scripts/init-config.js` to define your plugin's defaults:

```javascript
const defaultConfig = {
  showLogs: false,
  // Add your own options:
  lintCommand: 'eslint .',
  autoFix: true
};
```

Users can override these in `.plugin-config/<plugin-name>.json`. The init script handles version-based migration automatically — existing user settings are preserved when you add new fields.

## 3. Choose hook events

Edit `hooks/hooks.json` to configure when your plugin runs. See the [official Claude Code hooks reference](https://code.claude.com/docs/en/hooks) for the full list of available events and their details.

Each hook entry supports these options:

```json
{
  "type": "command",
  "command": "node ${CLAUDE_PLUGIN_ROOT}/scripts/main.js",
  "description": "What this hook does",
  "timeout": 10000,
  "continueOnError": true,
  "suppressOutput": false
}
```

- **timeout** — max execution time in ms (5000 for init, 10000 for main logic)
- **continueOnError** — `true` to not block the session on failure
- **suppressOutput** — `true` to hide output from the user

## 4. Validate

Run the validation skill to catch issues before releasing:

```
/validate-plugin hook-lint-on-save
```

This checks:
- File structure completeness
- JSON validity in `plugin.json` and `hooks.json`
- Version consistency across all files
- Script guards (shebang, re-entry prevention, exit codes)
- Marketplace registration

Fix any reported issues before proceeding.

## 5. Test locally

Install your plugin from the local marketplace:

```bash
/plugin marketplace add tool1-marketplace ./path/to/.claude-plugin/marketplace.json
/plugin install hook-lint-on-save@tool1-marketplace
```

Restart Claude Code and verify the plugin works:

```bash
claude
```

Check installation status:

```bash
/plugin
```

## 6. Release

### First release

If you scaffolded with `/create-plugin`, your plugin is already registered at version `1.0.0`. Just commit and push:

```bash
git add plugins/hook-lint-on-save/ .claude-plugin/marketplace.json
git commit -m "Add hook-lint-on-save plugin"
git push
```

### If not yet registered

Use the registration skill:

```
/register-plugin hook-lint-on-save
```

This reads your `plugin.json`, adds the entry to `marketplace.json`, and bumps the marketplace version.

### Subsequent releases

After making changes to your plugin, bump the version:

```
/bump-plugin hook-lint-on-save patch
```

Bump types follow semver:
- **patch** (1.0.0 → 1.0.1) — bug fixes
- **minor** (1.0.0 → 1.1.0) — new features, backward compatible
- **major** (1.0.0 → 2.0.0) — breaking changes

The skill updates the version in `plugin.json`, `hooks.json`, and `marketplace.json` simultaneously.

Then commit and push:

```bash
git add plugins/hook-lint-on-save/ .claude-plugin/marketplace.json
git commit -m "Release hook-lint-on-save v1.0.1"
git push
```

### Users update by reinstalling

```bash
/plugin install hook-lint-on-save@tool1-marketplace
```

Their settings in `.plugin-config/` are preserved automatically through the config migration system.

## Skills reference

| Skill | Purpose |
|-------|---------|
| `/create-plugin` | Scaffold a new plugin from the template |
| `/validate-plugin <name>` | Validate structure, config, and registration |
| `/register-plugin <name>` | Add an existing plugin to the marketplace |
| `/bump-plugin <name> [patch\|minor\|major]` | Bump version across all files |

## Tips

- Keep scripts fast — long-running hooks degrade the Claude Code experience.
- Use `suppressOutput: true` for `SessionStart` init hooks.
- Guard `Stop` hooks against re-entry with the `STOP_HOOK_ACTIVE` env var check and the lock-file pattern (both included in the template).
- Add `.state/` to `.gitignore` — it stores transient lock files.
- Test with `showLogs: true` during development, then set it to `false` before release.
- Use `continueOnError: true` unless your plugin failing should block the session.
