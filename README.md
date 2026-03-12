# Claude Code Marketplace Template

A template for creating your own Claude Code plugin marketplace. Use it as a GitHub template or clone it, personalize it, and start building and distributing plugins.

## Quick Start

### 1. Create your marketplace

**Option A — Use as GitHub template (recommended)**

Click the **"Use this template"** button on GitHub to create your own repository. This gives you a clean repo without the template's git history.

**Option B — Clone directly**

```bash
git clone https://github.com/anthropics/claude-code-marketplace-template.git my-marketplace
cd my-marketplace
```

### 2. Personalize

Open Claude Code and run the setup skill:

```
/rename-marketplace
```

This replaces all template placeholders (`your-marketplace`, `your-name`) with your actual marketplace name and GitHub username across the entire repo.

### 3. Generate your README

```
/generate-readme
```

This creates a proper `README.md` for your marketplace from the included template.

### 4. Create your first plugin

```
/create-plugin
```

Follow the prompts to scaffold a new plugin with the correct structure, then implement your logic in `scripts/main.js`.

### 5. Publish

Commit and push to GitHub. Users can then add your marketplace and install plugins:

```bash
/plugin marketplace add https://github.com/<your-name>/<your-marketplace>.git
/plugin install <plugin-name>@<your-marketplace>
```

## What's Included

### Skills

| Skill                   | Description                                               |
| ----------------------- | --------------------------------------------------------- |
| `/rename-marketplace`   | Replace template placeholders with your own values        |
| `/generate-readme`      | Generate `README.md` from the template for the first time |
| `/update-readme`        | Regenerate `README.md` with the current plugin catalog    |
| `/update-plugin-readme` | Regenerate a plugin's `README.md` from its metadata       |
| `/create-plugin`        | Scaffold a new plugin from the example template           |
| `/validate-plugin`      | Validate a plugin's structure and configuration           |
| `/register-plugin`      | Register a plugin in the marketplace                      |
| `/bump-plugin`          | Bump a plugin's version                                   |

### Files

| File                              | Purpose                                    |
| --------------------------------- | ------------------------------------------ |
| `README.md.template`              | Template for your marketplace's README     |
| `.claude-plugin/marketplace.json` | Marketplace registry (plugins listed here) |
| `plugins/example/`                | Example plugin to use as a starting point  |
| `GUIDE.md`                        | Detailed plugin development guide          |

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

## Requirements

- Claude Code CLI
- Node.js

## License

Apache License 2.0 — see [LICENSE](LICENSE) and [NOTICE](NOTICE).
