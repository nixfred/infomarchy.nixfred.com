---
name: install-infomarchy
description: Install the Infomarchy plugin on an Omarchy desktop. Use when the user wants AI agent sessions, usage limits and machine stats drawn on their Omarchy wallpaper.
---

# Install Infomarchy

Infomarchy is an MIT licensed Omarchy plugin. It draws every AI agent running on the machine, what each is doing, what it cost, and how the machine is holding up, live on the desktop wallpaper in the current Omarchy theme.

Source: {{REPO}}
Site: {{ORIGIN}}/

## Requirements

{{REQUIREMENTS}}

{{REQUIREMENTS_OPTIONAL}}

## Install

Run these in a terminal on the Omarchy machine:

```bash
{{INSTALL}}
```

{{INSTALL_NOTE}}

## Check it worked

The cards appear on the wallpaper. If bun is missing, the desk shows a red message at the top. Install bun and the desk fills in on the next refresh.

## Optional shortcuts

SUPER + I hides the cards to show the plain wallpaper, and brings them back. Add the shortcuts first: {{SHORTCUTS_URL}}

## Notes for agents

- Do not run the commands without the user's approval. They install a package and a shell plugin.
- The commands are copied from the project README at {{REPO}}. If they differ, trust the README.
