---
name: register-plugin
description: Register an existing plugin in the marketplace.json. Use when user wants to add, register, or publish a plugin to the marketplace.
user-invocable: true
---

# Register Plugin

You are adding a plugin to the marketplace registry at `this marketplace repository`.

## Steps

1. **Read the plugin's** `.claude-plugin/plugin.json` to get metadata.

2. **Check** that the plugin isn't already registered in `.claude-plugin/marketplace.json`.

3. **Ask the user** for the category if not obvious from the plugin content:

   - `hooks` — session lifecycle automation
   - `productivity` — development workflow tools
   - `game-development` — game engine toolkits
   - `3d-development` — 3D software automation

4. **Add the entry** to the `plugins` array in `.claude-plugin/marketplace.json`:

   ```json
   {
     "name": "<from plugin.json>",
     "source": "./plugins/<plugin-directory-name>",
     "description": "<from plugin.json>",
     "version": "<from plugin.json>",
     "author": { "name": "<from plugin.json>" },
     "category": "<category>",
     "homepage": "<from plugin.json or marketplace default>",
     "keywords": [<from plugin.json>]
   }
   ```

5. **Bump the marketplace version** — increment the patch version in both `metadata.version` and the root `version` field.

6. **Update READMEs** — run `/update-plugin-readme <plugin-name>` to generate the plugin's README, then run `/update-readme` to add the plugin to the marketplace README catalog.

7. **Confirm** registration and show the install command:
   ```
   /plugin install <plugin-name>@your-marketplace
   ```
