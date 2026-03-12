---
name: browse
version: 1.0.0
description: |
  Fast web browsing for Claude Code via persistent headless Chromium daemon. Navigate to any URL,
  read page content, click elements, fill forms, run JavaScript, take screenshots,
  inspect CSS/DOM, capture console/network logs, and more. ~100ms per command after
  first call. Use when you need to check a website, verify a deployment, read docs,
  or interact with any web page. No MCP, no Chrome extension — just fast CLI.
allowed-tools:
  - Bash
  - Read

---

# gstack: Persistent Browser for Claude Code

Persistent headless Chromium daemon. First call auto-starts the server (~3s).
Every subsequent call: ~100-200ms. Auto-shuts down after 30 min idle.

## SETUP (run this check BEFORE any browse command)

Before using any browse command, locate the plugin and check if the binary exists:

```bash
# Find the gstack plugin directory
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
  echo "GSTACK_NOT_FOUND"
elif test -x "$GSTACK_DIR/skills/browse/dist/browse"; then
  echo "READY:$GSTACK_DIR"
else
  echo "NEEDS_SETUP:$GSTACK_DIR"
fi
```

Set `B` to `$GSTACK_DIR/skills/browse/dist/browse` and use it for all commands.

If `NEEDS_SETUP`:
1. Tell the user: "gstack browse needs a one-time setup (~30 seconds). This will install Playwright Chromium and build the binary. OK to proceed?" Then STOP and wait for their response.
2. If they approve, run:
```bash
cd <GSTACK_DIR> && ./setup
```
3. If `bun` is not installed, tell the user to install it: `curl -fsSL https://bun.sh/install | bash`

Once setup is done, it never needs to run again (the compiled binary persists).

## IMPORTANT

- Use the compiled binary via Bash: `<GSTACK_DIR>/skills/browse/dist/browse`.
- NEVER use `mcp__claude-in-chrome__*` tools. They are slow and unreliable.
- The browser persists between calls — cookies, tabs, and state carry over.
- The server auto-starts on first command. No setup needed after initial build.

## Quick Reference

```bash
B=<GSTACK_DIR>/skills/browse/dist/browse

# Navigate to a page
$B goto https://example.com

# Read cleaned page text
$B text

# Take a screenshot (then Read the image)
$B screenshot /tmp/page.png

# Snapshot: accessibility tree with refs
$B snapshot -i

# Click by ref (after snapshot)
$B click @e3

# Fill by ref
$B fill @e4 "test@test.com"

# Run JavaScript
$B js "document.title"

# Get all links
$B links
```

## Command Reference

### Navigation
```
browse goto <url>         Navigate current tab
browse back               Go back
browse forward            Go forward
browse reload             Reload page
browse url                Print current URL
```

### Content extraction
```
browse text               Cleaned page text (no scripts/styles)
browse html [selector]    innerHTML of element, or full page HTML
browse links              All links as "text → href"
browse forms              All forms + fields as JSON
browse accessibility      Accessibility tree snapshot (ARIA)
```

### Snapshot (ref-based element selection)
```
browse snapshot           Full accessibility tree with @refs
browse snapshot -i        Interactive elements only (buttons, links, inputs)
browse snapshot -c        Compact (no empty structural elements)
browse snapshot -d <N>    Limit depth to N levels
browse snapshot -s <sel>  Scope to CSS selector
```

After snapshot, use @refs as selectors in any command:
```
browse click @e3          Click the element assigned ref @e3
browse fill @e4 "value"   Fill the input assigned ref @e4
browse hover @e1          Hover the element assigned ref @e1
browse html @e2           Get innerHTML of ref @e2
browse css @e5 "color"    Get computed CSS of ref @e5
browse attrs @e6          Get attributes of ref @e6
```

### Interaction
```
browse click <selector>        Click element (CSS selector or @ref)
browse fill <selector> <value> Fill input field
browse select <selector> <val> Select dropdown value
browse hover <selector>        Hover over element
browse type <text>             Type into focused element
browse press <key>             Press key (Enter, Tab, Escape, etc.)
browse scroll [selector]       Scroll element into view, or page bottom
browse wait <selector>         Wait for element to appear (max 10s)
browse viewport <WxH>          Set viewport size (e.g. 375x812)
```

### Inspection
```
browse js <expression>         Run JS, print result
browse eval <js-file>          Run JS file against page
browse css <selector> <prop>   Get computed CSS property
browse attrs <selector>        Get element attributes as JSON
browse console                 Dump captured console messages
browse network                 Dump captured network requests
browse cookies                 Dump all cookies as JSON
browse storage                 localStorage + sessionStorage as JSON
browse perf                    Page load performance timings
```

### Visual
```
browse screenshot [path]       Screenshot (default: /tmp/browse-screenshot.png)
browse pdf [path]              Save as PDF
browse responsive [prefix]     Screenshots at mobile/tablet/desktop
```

### Compare
```
browse diff <url1> <url2>      Text diff between two pages
```

### Tabs
```
browse tabs | tab <id> | newtab [url] | closetab [id]
```

### Server management
```
browse status | stop | restart
```

## Speed Rules

1. **Navigate once, query many times.** `goto` loads the page; then `text`, `js`, `css`, `screenshot` all run against the loaded page instantly.
2. **Use `snapshot -i` for interaction.** Get refs for all interactive elements, then click/fill by ref.
3. **Use `js` for precision.** Faster than parsing full page text.
4. **Use `chain` for multi-step flows.** Avoids CLI overhead per step.
5. **Use `responsive` for layout checks.** One command = 3 viewport screenshots.

## Architecture

- Persistent Chromium daemon on localhost (port 9400-9410)
- Bearer token auth per session
- State file: `/tmp/browse-server.json`
- Auto-shutdown after 30 min idle
- Chromium crash → server exits → auto-restarts on next command
