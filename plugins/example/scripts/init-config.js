#!/usr/bin/env node

/**
 * Configuration initialization script.
 * Runs at SessionStart to ensure the plugin config file exists
 * and performs automatic migration when the plugin version changes.
 *
 * Replace PLUGIN_NAME and defaultConfig with your plugin's values.
 */

const fs = require('fs');
const path = require('path');

// ── Customize these ─────────────────────────────────────────────
const PLUGIN_NAME = 'my-plugin-name'; // must match plugin.json "name"

const defaultConfig = {
  showLogs: false
  // Add your plugin-specific defaults here
};
// ────────────────────────────────────────────────────────────────

const projectRoot = process.cwd();
const configDir = path.join(projectRoot, '.plugin-config');
const configPath = path.join(configDir, `${PLUGIN_NAME}.json`);

function getPluginVersion() {
  try {
    const pluginJsonPath = path.join(__dirname, '..', '.claude-plugin', 'plugin.json');
    const pluginJson = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
    return pluginJson.version || '1.0.0';
  } catch {
    return '1.0.0';
  }
}

const PLUGIN_VERSION = getPluginVersion();

function initializeConfig() {
  try {
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    if (fs.existsSync(configPath)) {
      const existing = JSON.parse(fs.readFileSync(configPath, 'utf8'));

      // Skip if version hasn't changed
      if (existing._pluginVersion === PLUGIN_VERSION) {
        process.exit(0);
      }

      // Migrate: keep user settings, add new defaults
      const migrated = {
        ...defaultConfig,
        ...existing,
        _pluginVersion: PLUGIN_VERSION
      };
      fs.writeFileSync(configPath, JSON.stringify(migrated, null, 2), 'utf8');
    } else {
      fs.writeFileSync(configPath, JSON.stringify({
        ...defaultConfig,
        _pluginVersion: PLUGIN_VERSION
      }, null, 2), 'utf8');
    }
  } catch {
    // Fail silently — don't block session start
  }
}

initializeConfig();
process.exit(0);
