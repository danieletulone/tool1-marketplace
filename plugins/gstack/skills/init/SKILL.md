---
name: init
version: 1.0.0
description: |
  Initialize gstack in the current project. Runs setup (installs Playwright Chromium
  and builds the browse binary), then adds a gstack section to the project's CLAUDE.md
  with available skills, browse path, and troubleshooting. Run once after installing.
allowed-tools:
  - Bash
  - Read
  - Edit
  - Write
  - Glob
  - AskUserQuestion
---

# /init — Initialize gstack in the current project

Sets up gstack: installs dependencies, builds the browse binary, installs Playwright Chromium, and configures CLAUDE.md.

## User-invocable

When the user types `/init`, run this skill.

## Instructions

### Step 1: Locate the gstack plugin directory

```bash
GSTACK_DIR=""
for candidate in \
  "$(pwd)/plugins/gstack" \
  "$(pwd)/.claude/plugins/gstack" \
  "$HOME/.claude/plugins/gstack"; do
  if [ -f "$candidate/package.json" ] && grep -q '"gstack"' "$candidate/package.json" 2>/dev/null; then
    GSTACK_DIR="$candidate"
    break
  fi
done

if [ -z "$GSTACK_DIR" ]; then
  echo "NOT_FOUND"
else
  echo "FOUND:$GSTACK_DIR"
fi
```

If `NOT_FOUND`, tell the user the gstack plugin could not be located and stop.

Store the resolved `GSTACK_DIR` path for all subsequent steps.

### Step 2: Check prerequisites

```bash
command -v bun >/dev/null 2>&1 && echo "BUN_OK" || echo "BUN_MISSING"
```

If `BUN_MISSING`, tell the user: "Bun is required for the `/browse` skill. Install it with: `curl -fsSL https://bun.sh/install | bash`" and use AskUserQuestion with options:
- A) I'll install bun now — wait for me, then continue
- B) Skip browse setup — I only need the other skills

If user chooses B, skip to Step 4.

### Step 3: Run setup (dependencies + Playwright + binary)

Check if the browse binary already exists:

```bash
test -x "$GSTACK_DIR/skills/browse/dist/browse" && echo "BINARY_EXISTS" || echo "NEEDS_BUILD"
```

If `NEEDS_BUILD`, tell the user: "Setting up gstack — this will install dependencies, download Playwright Chromium, and compile the browse binary (~30 seconds)." Then run:

```bash
cd <GSTACK_DIR> && ./setup
```

The `setup` script handles:
1. `bun install` — installs npm dependencies (playwright, diff)
2. `bunx playwright install chromium` — downloads the headless Chromium browser (~150MB, cached per user)
3. `bun run build` — compiles the CLI binary to `skills/browse/dist/browse`

If the setup script fails, show the error output and suggest the user check:
- That bun v1.0+ is installed
- That they have disk space for Chromium (~150MB)
- Network connectivity for downloading Chromium

If `BINARY_EXISTS`, tell the user the browse binary is already built and skip to Step 4.

### Step 4: Update CLAUDE.md

Check if a `CLAUDE.md` file exists in the project root:

```bash
test -f CLAUDE.md && echo "EXISTS" || echo "MISSING"
```

- If `EXISTS`: read the file and check if it already contains a `## gstack` section.
  - If it already has a gstack section, use AskUserQuestion: "CLAUDE.md already has a gstack section." Options: A) Replace it with updated config, B) Keep existing — skip.
  - If no gstack section, proceed to append.
- If `MISSING`: create a new `CLAUDE.md`.

Add/replace the following section (substitute `<GSTACK_DIR>` with the actual resolved absolute path):

```markdown
## gstack

Use gstack skills for specialized workflow modes. Available skills:

| Skill | What it does |
|-------|--------------|
| `/plan-ceo-review` | Founder/CEO-mode plan review — rethink the problem, find the 10-star product |
| `/plan-eng-review` | Eng manager-mode plan review — lock in architecture, data flow, diagrams, edge cases |
| `/review` | Paranoid staff engineer PR review — structural audit for bugs that pass CI |
| `/ship` | Release engineer — sync main, run tests, push, open PR (fully automated) |
| `/browse` | QA engineer — headless browser for navigating, clicking, screenshotting, and testing web pages |
| `/retro` | Engineering manager — weekly retrospective from commit history and work patterns |

### Browse configuration

- Use the `/browse` skill for all web browsing tasks
- NEVER use `mcp__claude-in-chrome__*` tools — use the gstack browse binary instead
- Browse binary: `<GSTACK_DIR>/skills/browse/dist/browse`

### Troubleshooting

If gstack skills aren't working or the browse binary is missing, run:
```
cd <GSTACK_DIR> && ./setup
```
```

### Step 5: Confirm

Output a summary:
- The gstack plugin path
- Whether the browse binary is ready (and Chromium installed)
- Which CLAUDE.md was updated (new or existing)
- List the 7 available slash commands

Do NOT make any other changes to the project.
