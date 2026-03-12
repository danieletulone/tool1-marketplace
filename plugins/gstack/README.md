# gstack

**gstack turns Claude Code from one generic assistant into a team of specialists you can summon on demand.**

Seven opinionated workflow skills for [Claude Code](https://docs.anthropic.com/en/docs/claude-code). Plan review, code review, one-command shipping, browser automation, engineering retrospectives, and project initialization — all as slash commands.

Originally created by [Garry Tan](https://x.com/garrytan). Packaged as a plugin for the tool1 marketplace.

## Skills

| Skill | Mode | What it does |
|-------|------|--------------|
| `/init` | Setup | Configure CLAUDE.md with gstack skills, browse path, and troubleshooting. Run once after install. |
| `/plan-ceo-review` | Founder / CEO | Rethink the problem. Find the 10-star product hiding inside the request. |
| `/plan-eng-review` | Eng manager / tech lead | Lock in architecture, data flow, diagrams, edge cases, and tests. |
| `/review` | Paranoid staff engineer | Find the bugs that pass CI but blow up in production. Not a style nitpick pass. |
| `/ship` | Release engineer | Sync main, run tests, push, open PR. For a ready branch, not for deciding what to build. |
| `/browse` | QA engineer | Give the agent eyes. Headless browser for navigating, clicking, screenshotting, and testing web pages. |
| `/retro` | Engineering manager | Analyze commit history, work patterns, and shipping velocity for the week. |

## Getting started

After installing the plugin, run `/init` in Claude Code. This will:

1. Add a `## gstack` section to your project's `CLAUDE.md` with all available skills and browse configuration
2. Build the `/browse` binary if needed (one-time, requires [Bun](https://bun.sh/) v1.0+)
3. Configure Claude Code to use the gstack browse binary instead of `mcp__claude-in-chrome__*` tools

## Requirements

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- [Bun](https://bun.sh/) v1.0+ (only for `/browse` — other skills work without it)

## Troubleshooting

**`/browse` fails or binary not found?**
Run `/init` again, or manually build: `cd <plugin-path>/skills/browse && bun install && bun run build`

**`bun` not installed?**
Install it: `curl -fsSL https://bun.sh/install | bash`

## License

MIT — original source: [garrytan/gstack](https://github.com/garrytan/gstack)
