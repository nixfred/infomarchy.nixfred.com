// All page copy and facts live here. The build renders index.html, index.md,
// the agent skill and the WebMCP tool text from this one file.
// Rules: short sentences, plain English, no dashes used as punctuation,
// nothing that is not in https://github.com/nixfred/infomarchy.

export const SITE = {
  origin: 'https://infomarchy.io',
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

// Public posts on X, quoted word for word. Replies are shown without the
// automatic leading @NixFred. Each url is the exact post.
export type Quote = { text: string; who: string; handle: string; url: string; about: string }
export const QUOTES: Quote[] = [
  {
    text: "I use the Infomarchy plugin from @NixFred to visualize my bots (and he PR'd my collapsed mode contribution ...)",
    who: 'John Trainor',
    handle: 'jttraino',
    url: 'https://x.com/jttraino/status/2108604386481971253',
    about: 'Infomarchy',
  },
  {
    text: 'Seeing the subscription burn right next to the running agents is the useful part. Most people have no idea what their agents cost until the bill shows up.',
    who: 'Sami Daar',
    handle: 'SamiDaarx',
    url: 'https://x.com/SamiDaarx/status/2114419418822271090',
    about: 'Infomarchy',
  },
  {
    text: 'wallpaper as agent status board is the correct 2026 desktop. pulsing dots > dock icons.',
    who: 'Guilty Geek',
    handle: 'Guilty0399887',
    url: 'https://x.com/Guilty0399887/status/2096120618986959228',
    about: 'Infomarchy',
  },
  {
    text: 'Infomarchy is a great tool for anyone wanting to keep track of their agents on Omarchy. Another great product from @NixFred.',
    who: 'John Trainor',
    handle: 'jttraino',
    url: 'https://x.com/jttraino/status/2101264273838153976',
    about: 'Infomarchy',
  },
  {
    text: "I'm still using 5 or 6 harnesses like a crazy person, before Infomarchy a reboot was a nightmare and now i just click back into anything and everything!",
    who: 'TechLuddite',
    handle: 'gh_TechLuddite',
    url: 'https://x.com/gh_TechLuddite/status/2108092026965410196',
    about: 'Infomarchy',
  },
  {
    text: 'dear god, this is so freaking cool. i am happy that i lived long enough to see computers become fun again.... while still being useful. thanks for your work, adding now',
    who: 'With Further Ado',
    handle: 'withfurtherado',
    url: 'https://x.com/withfurtherado/status/2096642488165363979',
    about: 'Infomarchy',
  },
  {
    text: 'My favorite plugin.  This one is a must-have.',
    who: 'Danny Welch',
    handle: 'dannyowelch',
    url: 'https://x.com/dannyowelch/status/2114535413427945664',
    about: 'Infomarchy',
  },
  {
    text: "the sub burn widget is the part i'd stare at all day",
    who: 'lowercase ceo',
    handle: 'lowercaseceo',
    url: 'https://x.com/lowercaseceo/status/2114396024731037937',
    about: 'Infomarchy',
  },
  {
    text: 'I run Infomarchy on my Omarchy installs. You should too',
    who: 'Mike Gannotti',
    handle: 'MichaelGannotti',
    url: 'https://x.com/MichaelGannotti/status/2114494849793851649',
    about: 'Infomarchy',
  },
]

// What each person added, written from their merged pull requests in
// nixfred/infomarchy and nothing else. Keyed by GitHub login. `featured` are the
// PR numbers to link (one or two). Anyone new who is not listed here still
// appears, with the titles of their merged pull requests instead of a write up.
export type Writeup = { name?: string; role?: string; text: string; featured: number[] }
export const CONTRIBUTOR_WRITEUPS: Record<string, Writeup> = {
  nixfred: {
    role: 'Author and maintainer',
    text: 'Created Infomarchy and maintains it. Reviews and merges every contributor pull request.',
    featured: [],
  },
  TechLuddite: {
    text: 'Added Web Mode, a browser view of the desk for phones and other computers over a trusted LAN, Tailscale or your own HTTPS certificate. Also added the optional media controls and containers cards, Pi session support, animated image wallpapers and hardening of the collector.',
    featured: [25, 19],
  },
  eternal4430: {
    text: 'Built the FLEET card, which shows AI agents running on other machines over SSH. Also read Hermes and OpenRouter usage into the Usage and Limits card.',
    featured: [35],
  },
  jttraino: {
    name: 'John Trainor',
    text: 'Added Cursor session detection from both the terminal and the Cursor IDE. Also grouped quiet agents of one kind into a single card, so a long Grok Bot roster no longer crowds the desk.',
    featured: [34, 33],
  },
  alinuxfan: {
    text: 'Added Antigravity (agy) as a recognised agent provider. Also removed an accidentally committed node_modules symlink that made plugin updates fail validation.',
    featured: [24, 27],
  },
  auggernaut: {
    text: 'Added the optional APPS module, which registers local development servers and manages them as systemd user services. Also made the SUPER+I shortcut setup explicit in the README.',
    featured: [36, 29],
  },
  reverb256: {
    text: 'Fixed live Hermes session detection when Hermes is launched as python -m hermes_cli.main. Also made the desk refresh sooner by watching Hermes state files on top of the regular poll.',
    featured: [11, 39],
  },
  Tech0001: {
    text: 'Fixed wallpaper stretching on ultrawide and portrait displays. Also added a Gitea activity card next to the GitHub one.',
    featured: [28, 30],
  },
  jaylfc: {
    text: 'Added Kimi Code as a tracked agent provider. Also made the desk stay clear of reserved background bands such as the hymission stage sidebar.',
    featured: [32, 31],
  },
  shieldsworks: {
    text: 'Added a setting that pins the desk to one workspace while the wallpaper stays on all of them.',
    featured: [38],
  },
  dannyowelch: {
    text: 'Fixed the desk so it keeps clear of the bar on whichever screen edge the bar sits, including when the bar moves or is hidden.',
    featured: [40],
  },
  GreyforgeLabs: {
    text: 'Fixed the disk card so volumes with spaces in their mount path are no longer dropped.',
    featured: [41],
  },
  sooners0: {
    text: 'Made Hermes sessions appear in Recent Tasks, read from the Hermes local session history.',
    featured: [10],
  },
  RidgetopAi: {
    text: 'Added FLEET sessions, which show which agent on a remote host is waiting on you and give a one click jump to it.',
    featured: [37],
  },
  wulfkaal: {
    name: 'Wulf Kaal',
    text: 'Added the REMOTE card, an optional read-only roster of agents on other machines. Also added a switch to turn off automatic topic refinement for people who tunnel to a remote Ollama.',
    featured: [13, 12],
  },
}

// Accounts that are never listed as contributors.
export const CONTRIBUTOR_EXCLUDE = /(\[bot\]$|^dependabot|^github-actions|^claude|^copilot|^anthropic|^renovate)/i

export const SHORTCUTS_URL = 'https://github.com/nixfred/infomarchy#configure-keyboard-shortcuts'
