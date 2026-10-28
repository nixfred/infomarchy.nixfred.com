<p align="center">
  <img src="src/public/nixfred-logo.svg" alt="nixfred" width="228" height="88">
</p>

# infomarchy.io

The one-page site for [Infomarchy](https://github.com/nixfred/infomarchy), an Omarchy plugin that draws AI agent sessions, usage limits and machine stats on the desktop wallpaper. Part of [nixfred.com](https://nixfred.com/).

<p align="center">
  <img src="src/public/assets/preview-1600.webp" alt="Infomarchy running on an empty Omarchy desktop, rendered with demo data" width="800">
</p>

The image above is demo data from the plugin's built-in demo mode.

## Status

Live at https://infomarchy.io/ (infomarchy.com, www.infomarchy.com, www.infomarchy.io and infomarchy.nixfred.com all 301 to it) on Cloudflare Pages (project `infomarchy-nixfred-com`, direct upload with wrangler). The visual design is provisional and not yet approved. All design tokens live in one file, `src/site.css`, so a re-skin is a one-file change.

## Build

Needs [bun](https://bun.sh). No runtime dependencies.

```bash
bun build.ts          # fetch GitHub stats, write dist/
bun build.ts --stats-only
python3 -m http.server 8080 --directory dist
python3 tools/verify.py   # links, assets, dashes, overflow, screenshots (needs playwright and Chrome)
```

The build never fails when the GitHub fetch fails and `src/data/github-stats.json` is committed. Set `GITHUB_TOKEN` to avoid rate limits. Star, fork and contributor numbers are always rendered from that JSON, never typed into HTML.

## Layout

- `src/content.ts`: all copy, taken from the public Infomarchy README
- `src/site.css`, `src/site.js`: styles and the small script (Copy button, WebMCP tool)
- `src/public/`: logo and favicon masters (byte copies, never edited), Kanit 500 font, preview images
- `src/skills/`: agent skills, rendered into `/.well-known/agent-skills/` with sha256 digests
- `build.ts`: the build script
- `dist/`: build output (ignored by git)

## Agent readiness

`/index.md` is a static markdown copy of the page. `robots.txt` carries a Content-Signal line. `_headers` adds Link headers, security headers and cache rules. `/.well-known/agent-skills/index.json` lists one skill, `install-infomarchy`. There are no Pages Functions.

## Licenses

Kanit is licensed under the SIL Open Font License, see `src/public/fonts/OFL.txt`. Infomarchy itself is MIT licensed.
