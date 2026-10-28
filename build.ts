// Static build: src/ -> dist/. No framework. Run with `bun build.ts`.
// 1. refresh GitHub stats (never fails the build if a committed file exists)
// 2. copy src/public as is, hash-name css/js/images under /assets
// 3. render index.html, 404.html, index.md, robots, sitemap, _headers
// 4. render agent skills and compute sha256 digests for index.json
import { createHash } from 'node:crypto'
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { basename, extname, join } from 'node:path'
import * as C from './src/content.ts'

const ROOT = import.meta.dir
const SRC = join(ROOT, 'src')
const DIST = join(ROOT, 'dist')
const STATS_FILE = join(SRC, 'data', 'github-stats.json')
const { SITE } = C

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const sha256 = (b: string | Uint8Array) => createHash('sha256').update(b).digest('hex')
const nyDate = (d = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)
const longDate = (iso: string) =>
  new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(iso + 'T12:00:00Z'))

/* ---------------------------------------------------------------- stats */
type Stats = { stars: number; forks: number; contributors: number; fetched: string }

async function fetchStats(): Promise<Stats> {
  const headers: Record<string, string> = { accept: 'application/vnd.github+json', 'user-agent': 'infomarchy.nixfred.com-build' }
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  const api = `https://api.github.com/repos/${SITE.repoSlug}`
  const repo = await fetch(api, { headers, signal: AbortSignal.timeout(15000) })
  if (!repo.ok) throw new Error(`repo ${repo.status}`)
  const r = (await repo.json()) as { stargazers_count: number; forks_count: number }
  const con = await fetch(`${api}/contributors?per_page=1`, { headers, signal: AbortSignal.timeout(15000) })
  if (!con.ok) throw new Error(`contributors ${con.status}`)
  const link = con.headers.get('link') ?? ''
  const last = link.match(/<[^>]*[?&]page=(\d+)[^>]*>;\s*rel="last"/)
  const contributors = last ? Number(last[1]) : ((await con.json()) as unknown[]).length
  if (![r.stargazers_count, r.forks_count, contributors].every((n) => Number.isInteger(n) && n >= 0)) throw new Error('bad numbers')
  return { stars: r.stargazers_count, forks: r.forks_count, contributors, fetched: nyDate() }
}

async function loadStats(): Promise<Stats> {
  try {
    const s = await fetchStats()
    mkdirSync(join(SRC, 'data'), { recursive: true })
    writeFileSync(STATS_FILE, JSON.stringify(s, null, 2) + '\n')
    console.log('stats: fetched', s)
    return s
  } catch (e) {
    if (!existsSync(STATS_FILE)) throw new Error(`stats fetch failed (${e}) and no committed ${STATS_FILE}`)
    const s = JSON.parse(readFileSync(STATS_FILE, 'utf8')) as Stats
    console.warn(`stats: fetch failed (${e}); using committed numbers from ${s.fetched}`)
    return s
  }
}

/* ------------------------------------------------- README install check */
async function checkReadme() {
  try {
    const res = await fetch(SITE.readmeRaw, { signal: AbortSignal.timeout(15000) })
    if (!res.ok) throw new Error(String(res.status))
    const md = await res.text()
    const block = md.match(/## Install\s+```bash\n([\s\S]*?)\n```/)?.[1]
    if (!block) return console.warn('readme check: install block not found')
    if (block.trim() !== C.INSTALL.trim()) {
      console.warn('readme check: INSTALL DIFFERS from the live README. Update src/content.ts.\n--- README ---\n' + block + '\n--- site ---\n' + C.INSTALL)
    } else console.log('readme check: install block matches the README')
  } catch (e) {
    console.warn(`readme check skipped (${e})`)
  }
}

/* --------------------------------------------------------------- assets */
const assetMap = new Map<string, string>() // "assets/site.css" -> "/assets/site.<hash>.css"
function emitAsset(name: string, bytes: Uint8Array) {
  const ext = extname(name)
  const hashed = `${basename(name, ext)}.${sha256(bytes).slice(0, 10)}${ext}`
  writeFileSync(join(DIST, 'assets', hashed), bytes)
  assetMap.set(name, `/assets/${hashed}`)
}
const A = (name: string) => assetMap.get(name) ?? (() => { throw new Error('missing asset ' + name) })()

/* ----------------------------------------------------------------- html */
function head(o: { title: string; desc: string; path: string; index: boolean }) {
  const url = SITE.origin + o.path
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.desc)}">
<meta name="theme-color" content="#0C0C0C">
<meta name="color-scheme" content="dark">
${o.index ? '' : '<meta name="robots" content="noindex">\n'}<link rel="canonical" href="${url}">
<meta property="og:site_name" content="Infomarchy">
<meta property="og:title" content="${esc(o.title)}">
<meta property="og:description" content="${esc(o.desc)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE.origin}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="nixfred logo">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(o.title)}">
<meta name="twitter:description" content="${esc(o.desc)}">
<meta name="twitter:image" content="${SITE.origin}/og.png">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
${o.index ? `<link rel="alternate" type="text/markdown" href="/index.md">\n` : ''}<link rel="preload" href="/fonts/kanit-500.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${A('site.css')}">
<script src="${A('site.js')}" defer></script>
</head>
`
}

const header = `<a class="skip" href="#main">Skip to content</a>
<header>
<div class="wrap bar-in">
<a class="logo" href="${SITE.home}" aria-label="nixfred, home"><img src="/nixfred-logo.svg" width="114" height="44" alt=""></a>
<nav class="nav" aria-label="Primary">
<a href="/#install">Install</a>
<a href="/#features">Features</a>
<a href="${SITE.repo}">GitHub</a>
</nav>
</div>
</header>
`

const footer = `<footer class="foot">
<div class="wrap">
<a class="foot-link" href="${SITE.home}">nixfred.com</a>
<p>Fred Nix, Atlanta, GA${SITE.email ? ` · <a href="mailto:${SITE.email}">${SITE.email}</a>` : ''}</p>
<p>Infomarchy is open source under the MIT license. <a href="${SITE.repo}">Source on GitHub</a>.</p>
</div>
</footer>
`

function installHtml() {
  return C.INSTALL_LINES.map((l) => {
    const i = l.indexOf('#')
    return i < 0 ? esc(l) : `${esc(l.slice(0, i))}<span class="cm">${esc(l.slice(i))}</span>`
  }).join('\n')
}

function indexHtml(s: Stats) {
  const date = longDate(s.fetched)
  const nf = new Intl.NumberFormat('en-US')
  const cards = C.FEATURES.map(
    (f) => `<li class="card">
<span class="tag">${esc(f.tag)}</span>
<h3>${esc(f.title)}</h3>
<p class="long">${esc(f.body)}</p>
<p class="short">${esc(f.short)}</p>
</li>`,
  ).join('\n')
  const q = C.QUOTE
  return (
    head({ title: SITE.title, desc: SITE.description, path: '/', index: true }) +
    `<body>
${header}<main id="main">
<section class="hero">
<div class="wrap hero-in">
<p class="eyebrow">Omarchy plugin</p>
<h1>Infomarchy</h1>
<p class="lead">${esc(C.TAGLINE)}</p>
<p class="sub">${esc(C.SUB)}</p>
<div class="links">
<a class="btn btn-primary" href="${SITE.repo}">View on GitHub</a>
<a class="btn btn-ghost" href="${SITE.home}">Back to nixfred.com</a>
<a class="link-quiet" href="#install">Install</a>
</div>
</div>
</section>

<section class="sec" id="install">
<div class="wrap">
<h2>Install</h2>
<p>Three commands, copied from the project README.</p>
<div class="code">
<pre><code id="install-code">${installHtml()}</code></pre>
<button class="copy" id="copy-install" type="button" aria-label="Copy the install commands">Copy</button>
</div>
<p class="lbl">Requirements</p>
<ul class="reqs" id="install-reqs">
${C.REQUIREMENTS.map((r) => `<li>${esc(r)}</li>`).join('\n')}
</ul>
<p class="note">${esc(C.REQUIREMENTS_OPTIONAL)}</p>
<p class="note">${esc(C.INSTALL_NOTE)}</p>
<p class="note">${esc(C.COMPAT)}</p>
</div>
</section>

<section class="sec" id="demo">
<div class="wrap">
<h2>What it looks like</h2>
<figure class="shot">
<div class="frame">
<img src="${A('preview-1600.webp')}" srcset="${A('preview-800.webp')} 800w, ${A('preview-1600.webp')} 1600w" sizes="(max-width: 1080px) 100vw, 1080px" width="1600" height="900" loading="lazy" decoding="async" alt="${esc(C.DEMO_ALT)}">
</div>
<figcaption><strong>Demo data.</strong> ${esc(C.DEMO_CAPTION.replace(/^Demo data\. /, ''))}</figcaption>
</figure>
</div>
</section>

<section class="sec" id="features">
<div class="wrap">
<h2>Features</h2>
<ul class="grid">
${cards}
</ul>
</div>
</section>

<section class="sec" id="stats">
<div class="wrap">
<h2>On GitHub</h2>
<ul class="stats">
<li><b>${nf.format(s.stars)}</b> stars</li>
<li><b>${nf.format(s.forks)}</b> forks</li>
<li><b>${nf.format(s.contributors)}</b> contributors</li>
<li>MIT license</li>
</ul>
<p class="note">Star and contributor counts are from GitHub, ${date}.</p>
</div>
</section>

<section class="sec" id="proof">
<div class="wrap">
<h2>In the wild</h2>
<figure class="quote">
<blockquote><p>${esc(q.text)}</p></blockquote>
<figcaption><a href="${q.url}">${esc(q.who)} (@${q.handle}) on X, about ${q.about}</a></figcaption>
</figure>
</div>
</section>

<section class="sec" id="more">
<div class="wrap">
<h2>Part of nixfred.com</h2>
<p class="back"><span>Infomarchy is one of Fred Nix's projects.</span> <a class="ul-link" href="${SITE.home}">See the rest at nixfred.com</a></p>
</div>
</section>
</main>
${footer}<noscript><!-- Everything on this page is plain HTML. JavaScript only adds the Copy button. --></noscript>
</body>
</html>
`
  )
}

function notFoundHtml() {
  return (
    head({ title: 'Page not found | Infomarchy', desc: 'That page does not exist.', path: '/404.html', index: false }) +
    `<body>
${header}<main id="main" class="nf">
<div class="wrap hero-in">
<p class="eyebrow">404</p>
<h1>Page not found</h1>
<p class="lead">That page does not exist.</p>
<div class="links">
<a class="btn btn-primary" href="/">Infomarchy home</a>
<a class="btn btn-ghost" href="${SITE.home}">Back to nixfred.com</a>
</div>
</div>
</main>
${footer}</body>
</html>
`
  )
}

/* ------------------------------------------------------------- markdown */
function indexMd(s: Stats) {
  const q = C.QUOTE
  return `# Infomarchy

${C.TAGLINE}

${C.SUB}

- Source: ${SITE.repo}
- Site: ${SITE.origin}/
- Back to nixfred.com: ${SITE.home}

## Install

Three commands, copied from the project README.

\`\`\`bash
${C.INSTALL}
\`\`\`

Requirements:

${C.REQUIREMENTS.map((r) => `- ${r}`).join('\n')}

${C.REQUIREMENTS_OPTIONAL}

${C.INSTALL_NOTE}

${C.COMPAT}

## What it looks like

![${C.DEMO_ALT}](${SITE.origin}${A('preview-1600.webp')})

${C.DEMO_CAPTION}

## Features

${C.FEATURES.map((f) => `### ${f.title}\n\n${f.body}`).join('\n\n')}

## On GitHub

${s.stars} stars, ${s.forks} forks, ${s.contributors} contributors. MIT license.

Star and contributor counts are from GitHub, ${longDate(s.fetched)}.

## In the wild

> ${q.text}

${q.who} (@${q.handle}) on X, about ${q.about}: ${q.url}

## Part of nixfred.com

Infomarchy is one of Fred Nix's projects. See the rest at ${SITE.home}

---

nixfred.com: ${SITE.home}
Fred Nix, Atlanta, GA${SITE.email ? `, ${SITE.email}` : ''}
`
}

/* --------------------------------------------------------------- skills */
function renderSkills() {
  const dir = join(SRC, 'skills')
  const vars: Record<string, string> = {
    REPO: SITE.repo,
    ORIGIN: SITE.origin,
    INSTALL: C.INSTALL,
    INSTALL_NOTE: C.INSTALL_NOTE,
    REQUIREMENTS: C.REQUIREMENTS.map((r) => `- ${r}`).join('\n'),
    REQUIREMENTS_OPTIONAL: C.REQUIREMENTS_OPTIONAL,
    SHORTCUTS_URL: C.SHORTCUTS_URL,
  }
  const skills: { name: string; type: 'skill-md'; description: string; url: string; digest: string }[] = []
  for (const name of readdirSync(dir).sort()) {
    if (!statSync(join(dir, name)).isDirectory()) continue
    const raw = readFileSync(join(dir, name, 'SKILL.md'), 'utf8')
    const out = raw.replace(/\{\{(\w+)\}\}/g, (_, k) => {
      if (!(k in vars)) throw new Error(`unknown placeholder ${k} in ${name}/SKILL.md`)
      return vars[k]
    })
    const fm = out.match(/^---\nname: (.+)\ndescription: (.+)\n---\n/)
    if (!fm || fm[1] !== name) throw new Error(`bad frontmatter in ${name}/SKILL.md`)
    const target = join(DIST, '.well-known', 'agent-skills', name)
    mkdirSync(target, { recursive: true })
    writeFileSync(join(target, 'SKILL.md'), out)
    skills.push({
      name,
      type: 'skill-md',
      description: fm[2],
      url: `${SITE.origin}/.well-known/agent-skills/${name}/SKILL.md`,
      digest: `sha256:${sha256(out)}`,
    })
  }
  if (!skills.length) throw new Error('no skills found')
  const index = { $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json', skills }
  writeFileSync(join(DIST, '.well-known', 'agent-skills', 'index.json'), JSON.stringify(index, null, 2) + '\n')
  // every folder in dist/.well-known/agent-skills must be listed
  const listed = new Set(skills.map((x) => x.name))
  for (const d of readdirSync(join(DIST, '.well-known', 'agent-skills'))) {
    if (statSync(join(DIST, '.well-known', 'agent-skills', d)).isDirectory() && !listed.has(d)) throw new Error(`unlisted skill ${d}`)
  }
}

/* ----------------------------------------------------------------- main */
const statsOnly = process.argv.includes('--stats-only')
const stats = await loadStats()
if (statsOnly) process.exit(0)
await checkReadme()

rmSync(DIST, { recursive: true, force: true })
mkdirSync(join(DIST, 'assets'), { recursive: true })
const PUB_ASSETS = join(SRC, 'public', 'assets')
cpSync(join(SRC, 'public'), DIST, { recursive: true, filter: (p) => p !== PUB_ASSETS })
mkdirSync(join(DIST, 'assets'), { recursive: true })

for (const f of ['site.css', 'site.js']) emitAsset(f, readFileSync(join(SRC, f)))
for (const f of readdirSync(PUB_ASSETS)) emitAsset(f, readFileSync(join(PUB_ASSETS, f)))

writeFileSync(join(DIST, 'index.html'), indexHtml(stats))
writeFileSync(join(DIST, '404.html'), notFoundHtml())
writeFileSync(join(DIST, 'index.md'), indexMd(stats))
writeFileSync(
  join(DIST, 'robots.txt'),
  `User-agent: *\nContent-Signal: ai-train=no, search=yes, ai-input=yes\nAllow: /\n\nSitemap: ${SITE.origin}/sitemap.xml\n`,
)
writeFileSync(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${SITE.origin}/</loc>\n    <lastmod>${stats.fetched}</lastmod>\n  </url>\n</urlset>\n`,
)
writeFileSync(
  join(DIST, '_headers'),
  `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/
  Link: </.well-known/agent-skills/index.json>; rel="describedby"; type="application/json"
  Link: </.well-known/agent-skills/install-infomarchy/SKILL.md>; rel="service-doc"; type="text/markdown"
  Link: </index.md>; rel="alternate"; type="text/markdown"

/.well-known/*
  Access-Control-Allow-Origin: *

/.well-known/agent-skills/index.json
  Content-Type: application/json; charset=utf-8

/.well-known/agent-skills/*/SKILL.md
  Content-Type: text/markdown; charset=utf-8

/index.md
  Content-Type: text/markdown; charset=utf-8
`,
)
renderSkills()
console.log('built dist/ ·', stats.stars, 'stars,', stats.forks, 'forks,', stats.contributors, 'contributors, fetched', stats.fetched)
