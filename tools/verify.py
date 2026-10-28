#!/usr/bin/env python3
"""Local verification: serve dist/, check links/assets, external refs, dashes, overflow, shots."""
import re, subprocess, sys, time, urllib.request, urllib.error, pathlib
from html.parser import HTMLParser
ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = ROOT / 'dist'
PORT = 8765
B = f'http://127.0.0.1:{PORT}'
srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(PORT), '--bind', '127.0.0.1', '--directory', str(DIST)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)
fail = 0
def bad(m):
    global fail; fail += 1; print('FAIL', m)
try:
    class P(HTMLParser):
        def __init__(s): super().__init__(); s.urls = []
        def handle_starttag(s, t, a):
            a = dict(a)
            for k in ('href', 'src'):
                if k in a: s.urls.append(a[k])
            if 'srcset' in a: s.urls += [x.strip().split()[0] for x in a['srcset'].split(',')]
    seen = set()
    for page in ('index.html', '404.html'):
        p = P(); p.feed((DIST / page).read_text()); 
        for u in p.urls:
            if u.startswith('mailto:'): continue
            if u.startswith('http'):
                if u.startswith('https://infomarchy.io'): u = u.replace('https://infomarchy.io', B)
                else: print('  external link (navigation only):', u); continue
            elif u.startswith('#'): continue
            else: u = B + (u if u.startswith('/') else '/' + u)
            u = u.split('#')[0]
            if u in seen: continue
            seen.add(u)
            try: r = urllib.request.urlopen(u); code = r.status
            except urllib.error.HTTPError as e: code = e.code
            print(code, u)
            if code != 200: bad(u)
    # extra files
    for u in ('/robots.txt', '/sitemap.xml', '/index.md', '/404.html', '/.well-known/agent-skills/index.json', '/.well-known/agent-skills/install-infomarchy/SKILL.md', '/fonts/kanit-500.woff2', '/og.png', '/favicon.ico', '/favicon.svg', '/favicon-32.png', '/apple-touch-icon.png', '/nixfred-logo.svg'):
        try: code = urllib.request.urlopen(B + u).status
        except urllib.error.HTTPError as e: code = e.code
        print(code, B + u)
        if code != 200: bad(u)
    # no external runtime requests in html/css/js
    for f in list(DIST.rglob('*.html')) + list(DIST.rglob('*.css')) + list(DIST.rglob('*.js')):
        t = f.read_text()
        if f.suffix == '.html':
            # src= / link rel stylesheet|preload|icon must be local
            for m in re.finditer(r'<(?:script|img|link|source|iframe)\b[^>]*?(?:src|href)="(https?://[^"]+)"', t):
                if 'rel="canonical"' in m.group(0) or 'rel="alternate"' in m.group(0): continue
                bad(f'{f.name}: external runtime ref {m.group(1)}')
        else:
            for m in re.finditer(r'url\((https?:)?//|@import[^;]*https?:', t): bad(f'{f.name}: external css ref')
    # dashes
    for f in DIST.rglob('*'):
        if f.is_file() and f.suffix in ('.html', '.css', '.js', '.md', '.txt', '.xml', '.json') or f.name == '_headers':
            if re.search('[\u2014\u2013]', f.read_text()): bad(f'dash in {f}')
    for f in list(ROOT.glob('*.md')) + list((ROOT / 'src').rglob('*.ts')) + list((ROOT / 'src').rglob('*.md')) + [ROOT / 'build.ts']:
        if re.search('[\u2014\u2013]', f.read_text()): bad(f'dash in {f}')
    # browser checks
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        br = pw.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        for name, w, h in (('desktop', 1280, 900), ('phone', 390, 844), ('narrow', 320, 640)):
            for path in ('/', '/404.html'):
                ctx = br.new_context(viewport={'width': w, 'height': h}, device_scale_factor=1, is_mobile=(w < 500))
                pg = ctx.new_page()
                reqs = []; errs = []
                pg.on('request', lambda r: reqs.append(r.url))
                pg.on('console', lambda m: errs.append(m.text) if m.type in ('error', 'warning') else None)
                pg.goto(B + path, wait_until='networkidle')
                for y in range(0, pg.evaluate("document.body.scrollHeight") + 400, 300):
                    pg.evaluate(f"window.scrollTo(0, {y})"); pg.wait_for_timeout(80)
                pg.wait_for_function("[...document.images].every(i => i.complete && i.naturalWidth > 0)", timeout=5000)
                pg.evaluate("window.scrollTo(0, 0)"); pg.wait_for_timeout(200)
                ext = [u for u in reqs if not u.startswith(B) and not u.startswith('data:')]
                sw = pg.evaluate("document.documentElement.scrollWidth"); cw = pg.evaluate("document.documentElement.clientWidth")
                small = pg.evaluate("""() => [...document.querySelectorAll('a,button')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height<43.5&&!e.classList.contains('skip')}).map(e=>e.textContent.trim().slice(0,30)+' '+Math.round(e.getBoundingClientRect().height))""")
                font_ok = pg.evaluate("document.fonts.check('500 20px Kanit')")
                print(f'{name} {path}: scrollW={sw} clientW={cw} external={ext} console={errs} fontKanit={font_ok} tap<44={small if w<500 else "n/a"}')
                if sw > cw: bad(f'horizontal overflow {name} {path}')
                if ext: bad(f'external requests {ext}')
                if errs: bad(f'console {errs}')
                if path == '/' and name in ('desktop', 'phone'):
                    (ROOT / 'shots').mkdir(exist_ok=True)
                    pg.screenshot(path=str(ROOT / 'shots' / f'{name}.png'), full_page=True)
                ctx.close()
        br.close()
finally:
    srv.terminate()
print('RESULT:', 'FAIL' if fail else 'OK')
sys.exit(1 if fail else 0)
