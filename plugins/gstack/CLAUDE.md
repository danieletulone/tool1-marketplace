# gstack plugin

## Structure

```
gstack/
├── skills/
│   ├── init/            # /init — configure CLAUDE.md for gstack
│   ├── browse/          # /browse — headless browser CLI (Playwright)
│   │   ├── src/         # CLI + server + commands (TypeScript)
│   │   ├── test/        # Integration tests + fixtures
│   │   └── dist/        # Compiled binary (gitignored)
│   ├── ship/            # /ship — automated release workflow
│   ├── review/          # /review — pre-landing PR review
│   │   └── checklist.md # Review checklist used by /review and /ship
│   ├── plan-ceo-review/ # /plan-ceo-review — founder-mode plan review
│   ├── plan-eng-review/ # /plan-eng-review — eng manager-mode plan review
│   └── retro/           # /retro — weekly engineering retrospective
├── setup                # One-time setup: build browse binary
├── package.json         # Build scripts for browse
├── BROWSER.md           # Full browse command reference
└── SKILL.md             # Root browse skill (Claude discovers this)
```

## Browse binary

The `/browse` skill requires a compiled binary and Playwright Chromium. Full setup:

```bash
./setup              # one command: installs deps, Chromium, and builds binary
```

Or manually:

```bash
bun install                       # install npm dependencies
bunx playwright install chromium  # download headless Chromium (~150MB)
bun run build                     # compile binary to skills/browse/dist/browse
```

## Development commands

```bash
bun install          # install dependencies
bun test             # run integration tests (browse + snapshot)
bun run dev <cmd>    # run CLI in dev mode
bun run build        # compile binary to skills/browse/dist/browse
```
