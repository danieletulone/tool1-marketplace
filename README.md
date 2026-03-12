# tool1-marketplace

A Claude Code plugin marketplace. Build, publish, and install plugins that automate your development workflows.

## Getting Started

### Add the marketplace

```bash
/plugin marketplace add https://github.com/danieletulone/tool1-marketplace.git
```

### Install a plugin

```bash
/plugin install gstack@tool1-marketplace
```

```bash
/plugin install spec-docs@tool1-marketplace
```

### Restart Claude Code

```bash
claude
```

## Available Plugins

<!-- PLUGINS:START -->
| Plugin | Description | Version | Keywords |
| ------ | ----------- | ------- | -------- |
| [`gstack`](plugins/gstack/) | Six opinionated workflow skills for Claude Code: plan review (CEO + eng), code review, shipping, browser automation, and retrospectives | 1.0.0 | `claude-code`, `plugin`, `workflow`, `review`, `ship`, `browse`, `retro`, `plan`, `automation` |
| [`spec-docs`](plugins/spec-docs/) | Spec-driven development plugin with skills for generating structured documentation | 1.0.0 | `claude-code`, `plugin`, `spec`, `requirements`, `docs`, `workflow` |
<!-- PLUGINS:END -->

## Requirements

- Claude Code CLI
- Node.js

## License

Apache License 2.0 — see [LICENSE](LICENSE) and [NOTICE](NOTICE).
