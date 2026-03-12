#!/usr/bin/env node

/**
 * Main plugin script — runs on the configured hook event (e.g. Stop).
 *
 * Replace PLUGIN_NAME and implement your logic in the run() function.
 */

const fs = require('fs');
const path = require('path');

// ── Customize these ─────────────────────────────────────────────
const PLUGIN_NAME = 'my-plugin-name'; // must match plugin.json "name"
// ────────────────────────────────────────────────────────────────

const projectRoot = process.cwd();

// ── Stop-hook loop prevention ───────────────────────────────────
if (process.env.STOP_HOOK_ACTIVE === 'true') {
  process.exit(2);
}

// ── Duplicate execution guard (Issue #9602 workaround) ──────────
const stateDir = path.join(__dirname, '..', '.state');
const lockFile = path.join(stateDir, '.stop-hook.lock');
const now = Date.now();

try {
  if (!fs.existsSync(stateDir)) {
    fs.mkdirSync(stateDir, { recursive: true });
  }
  if (fs.existsSync(lockFile)) {
    const lastRun = parseInt(fs.readFileSync(lockFile, 'utf8'));
    if (!isNaN(lastRun) && (now - lastRun < 3000)) {
      process.exit(0);
    }
  }
  fs.writeFileSync(lockFile, now.toString(), 'utf8');
} catch {
  // Continue if lock handling fails
}

// ── Load plugin config ──────────────────────────────────────────
function loadConfig() {
  const configPath = path.join(projectRoot, '.plugin-config', `${PLUGIN_NAME}.json`);
  try {
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
  } catch {
    // Fall through to defaults
  }
  return { showLogs: false };
}

const config = loadConfig();

// ── Your plugin logic ───────────────────────────────────────────
function run() {
  try {
    // TODO: Implement your plugin logic here.
    //
    // Examples of what you might do:
    //   - Run shell commands with require('child_process').execSync(...)
    //   - Analyze files in projectRoot
    //   - Generate reports
    //   - Interact with external tools

    if (config.showLogs) {
      console.log(JSON.stringify({
        systemMessage: `✓ ${PLUGIN_NAME}: completed successfully`,
        continue: true
      }));
    }
  } catch (error) {
    if (config.showLogs) {
      console.log(JSON.stringify({
        systemMessage: `⚠️ ${PLUGIN_NAME}: ${error.message}`,
        continue: true
      }));
    }
  }
}

run();
process.exit(0);
