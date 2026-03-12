# tool1-marketplace

A Claude Code plugin marketplace. Build, publish, and install plugins that automate your development workflows.

## Getting Started

### Add the marketplace

```bash
/plugin marketplace add https://github.com/danieletulone/tool1-marketplace.git
```

### Install a plugin

```bash
/plugin install <plugin-name>@tool1-marketplace
```

### Restart Claude Code

```bash
claude
```

## Available Plugins

<!-- PLUGINS:START -->
| Plugin | Description | Version | Keywords |
| ------ | ----------- | ------- | -------- |
| [`spec-docs`](plugins/spec-docs/) | Spec-driven development plugin with skills for generating structured documentation | 1.0.0 | `claude-code`, `plugin`, `spec`, `requirements`, `docs`, `workflow` |
<!-- PLUGINS:END -->

## Creating a Plugin

Use the built-in skill to scaffold a new plugin:

```
/create-plugin
```

Or manually copy the template from `plugins/example/` and follow the [Plugin Template README](plugins/example/README.md).

### Available Skills

| Skill | Description |
|-------|-------------|
| `/create-plugin` | Scaffold a new plugin from the template |
| `/validate-plugin` | Validate a plugin's structure and configuration |
| `/register-plugin` | Register a plugin in the marketplace |
| `/bump-plugin` | Bump a plugin's version |
| `/update-readme` | Regenerate README.md with the current plugin catalog |
| `/update-plugin-readme` | Regenerate a plugin's README.md from its metadata |

## Plugin Structure

```
plugins/<plugin-name>/
├── .claude-plugin/
│   └── plugin.json          # Metadata (name, version, author, etc.)
├── hooks/
│   └── hooks.json           # Hook definitions (when scripts run)
├── scripts/
│   ├── init-config.js       # SessionStart — config initialization
│   └── main.js              # Your plugin logic
└── README.md
```

## Hook Events

See the [official Claude Code hooks reference](https://code.claude.com/docs/en/hooks) for the full list of available events and their details.

## Requirements

- Claude Code CLI
- Node.js

## License

Apache License 2.0 — see [LICENSE](LICENSE) and [NOTICE](NOTICE).
