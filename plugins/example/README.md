# Plugin Template

> A starting point for building Claude Code plugins.

This directory contains the minimal scaffolding for a fully functional plugin. Copy it, replace the placeholders, and implement your logic.

## Structure

```
my-plugin-name/
├── .claude-plugin/
│   └── plugin.json          # Plugin metadata (name, version, author, etc.)
├── hooks/
│   └── hooks.json           # Hook definitions (when scripts run)
├── scripts/
│   ├── init-config.js       # SessionStart — creates/migrates config
│   └── main.js              # Stop (or other hook) — your plugin logic
└── README.md
```

## Quick Start

1. **Copy** this `example/` directory and rename it to your plugin name.
2. **Update `plugin.json`** — set `name`, `description`, `author`, `keywords`.
3. **Update `hooks.json`** — set description, choose hook events, adjust timeouts.
4. **Edit `init-config.js`** — set `PLUGIN_NAME` and `defaultConfig`.
5. **Edit `main.js`** — set `PLUGIN_NAME` and implement the `run()` function.
6. **Register** your plugin in `.claude-plugin/marketplace.json` at the repo root.

## Available Hook Events

See the [official Claude Code hooks reference](https://code.claude.com/docs/en/hooks) for the full list of available events and their details.

## Script Output Format

Scripts communicate back to Claude Code by printing a single JSON line to stdout:

```json
{
  "systemMessage": "✓ Brief status message shown to the user",
  "continue": true
}
```

- `systemMessage` — displayed in the session (only when `showLogs` is enabled).
- `continue` — `true` to let the session proceed, `false` to halt.

## Configuration

Plugins auto-create a config file at `.plugin-config/<plugin-name>.json` on first run. The `init-config.js` script handles creation and version-based migration so user settings are preserved across updates.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `CLAUDE_PLUGIN_ROOT` | Absolute path to the plugin directory |
| `STOP_HOOK_ACTIVE` | Set to `"true"` inside Stop hooks (for loop prevention) |

## Tips

- Keep hook scripts **fast** — respect the timeout in `hooks.json`.
- Use `continueOnError: true` for non-critical hooks so they don't block the session.
- Use `suppressOutput: true` for silent initialization hooks.
- Always guard Stop hooks against re-entry (see the lock-file pattern in `main.js`).
- Add `.state/` to `.gitignore` — it holds transient lock files.
