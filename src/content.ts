// All page copy and facts live here. The build renders index.html, index.md,
// the agent skill and the WebMCP tool text from this one file.
// Rules: short sentences, plain English, no dashes used as punctuation,
// nothing that is not in https://github.com/nixfred/infomarchy.

export const SITE = {
  origin: 'https://infomarchy.nixfred.com',
  name: 'Infomarchy',
  repo: 'https://github.com/nixfred/infomarchy',
  repoSlug: 'nixfred/infomarchy',
  readmeRaw: 'https://raw.githubusercontent.com/nixfred/infomarchy/master/README.md',
  home: 'https://nixfred.com/',
  email: 'frednix@gmail.com',
  title: 'Infomarchy: AI sessions, usage and machine stats on your Omarchy wallpaper',
  description:
    'Infomarchy is an MIT licensed Omarchy plugin. It draws every AI agent on your machine, what each is doing, what it cost, and how the box is holding up, live on your desktop.',
}

export const TAGLINE = 'Your wallpaper, promoted to information desk.'
export const SUB =
  'An Omarchy plugin under the MIT license. It draws every AI agent on your machine, what each is doing, what it cost, and how the box is holding up, live on your desktop in your current theme.'

// Verbatim from the repo README "Install" block. The build compares this to
// the live README and warns if it drifted.
export const INSTALL_LINES = [
  'sudo pacman -S --needed bun   # the collector runs on bun; Omarchy does not ship it',
  'omarchy plugin add https://github.com/nixfred/infomarchy.git --enable --yes',
  'omarchy restart shell    # first time only: services load at shell start',
]
export const INSTALL = INSTALL_LINES.join('\n')

export const REQUIREMENTS = [
  'Omarchy Quattro with third-party shell plugin support',
  'bun (not part of the Omarchy base install)',
  'iw, iproute2, and ping',
]
export const REQUIREMENTS_OPTIONAL =
  'Optional: nvidia-smi for the GPU row, the authenticated GitHub CLI (gh) for the latest CI result and the GitHub heatmap, the omarchy.agents bar widget for the usage card, and Ollama for the local AI card.'
export const INSTALL_NOTE =
  'If bun is missing, the desk says so in red at the top and in the sessions card. It fills in on the next refresh after you install bun, with no restart needed.'
export const COMPAT =
  'Ready for Omarchy 4.5: it reads the usage record from every agent collector Omarchy 4.5 ships. It also works on Qt 6.12.'

export const DEMO_ALT =
  'Infomarchy with sanitized demo data on an empty 1080p Omarchy desktop: live AI sessions, 7-day heatmap, recent tasks, usage limits, local AI, and machine stats'
export const DEMO_CAPTION =
  'Demo data. This is the real plugin on an empty Omarchy desktop in the Last Call theme, rendered with its built-in demo mode. It contains no live prompt, hostname, username, network, path, process, or session data.'

export const FEATURES = [
  {
    tag: 'Agents',
    title: 'Live AI sessions',
    body:
      'One card per running agent: Claude Code, Codex, Cursor, Grok, Gemini, Hermes, opencode, aider, Ollama chats. They are detected straight from /proc, with no agent-side hooks and nothing to configure. The dot pulses while the agent is thinking.',
    short: 'One card per running agent, detected from /proc with nothing to configure. The dot pulses while the agent is thinking.',
  },
  {
    tag: 'Limits',
    title: 'Usage and limits',
    body:
      'Session (5-hour) and weekly (7-day) rate limit meters with time to reset, plus today\'s prompt count and token volume. Meters turn yellow past 60% and red past 85%. It reuses the cache from Omarchy\'s own omarchy.agents widget, so there are no extra logins and no API keys.',
    short: 'Session and weekly limit meters with time to reset. No extra logins and no API keys.',
  },
  {
    tag: 'History',
    title: 'Activity and recent tasks',
    body:
      'An hour by hour heatmap of the last 7 days of prompts across every provider. Below it, the newest prompts from all providers. Click a task from a running session to jump to its terminal.',
    short: 'A 7-day heatmap of prompts across every provider, and the newest tasks. Click a running one to jump to its terminal.',
  },
  {
    tag: 'Machine',
    title: 'Machine stats',
    body:
      'CPU, RAM, disk, Wi-Fi, WAN, live throughput, ping latency and battery. Any meter goes red when it is in real trouble.',
    short: 'CPU, RAM, disk, Wi-Fi, WAN, throughput, latency and battery. A meter goes red when it is in real trouble.',
  },
  {
    tag: 'Remote hosts',
    title: 'Hermes hosts',
    body:
      'A read-only card for remote Hermes agent hosts. Each row shows whether the host is connected, its current task, and any pending approvals. Rows dim after 5 minutes without fresh data and turn red after 30. Unreachable hosts are flagged. Nothing on the card can approve, deny or control a host.',
    short: 'A read-only card for remote Hermes hosts: connection status, current task, pending approvals. Stale rows dim, then turn red. Unreachable hosts are flagged.',
  },
  {
    tag: 'Desktop',
    title: 'Follows your theme',
    body:
      'There are no colors in the plugin. It reads your active Omarchy theme, so switching themes re-skins the desk in place. After you add the shortcuts from the README, SUPER + I hides the cards to show your plain wallpaper, and again to bring them back.',
    short: 'It reads your active Omarchy theme and re-skins when you switch. After setup, SUPER + I toggles the desk.',
  },
]

export const QUOTE = {
  text: "I use the Infomarchy plugin from @NixFred to visualize my bots (and he PR'd my collapsed mode contribution ...)",
  who: 'John Trainor',
  handle: 'jttraino',
  url: 'https://x.com/jttraino/status/2108604386481971253',
  about: 'Infomarchy',
}

export const SHORTCUTS_URL = 'https://github.com/nixfred/infomarchy#configure-keyboard-shortcuts'
