#!/usr/bin/env python3
"""Generate SEO head tags, a static crawlable text version of the timeline, robots.txt and sitemap.xml.
Usage:  python3 tools/build_static.py [--url https://owner.github.io/repo/]
The URL is saved to site.json. With no URL, canonical/og:url/sitemap are omitted (no placeholders are published)."""
import json, os, re, sys, html
from datetime import datetime
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cfg_path = os.path.join(ROOT, 'site.json')
cfg = json.load(open(cfg_path))
if '--url' in sys.argv:
    u = sys.argv[sys.argv.index('--url') + 1].strip()
    if u and not u.endswith('/'): u += '/'
    cfg['url'] = u
    json.dump(cfg, open(cfg_path, 'w'), indent=2); open(cfg_path, 'a').write('\n')
URL = cfg.get('url', '')
ev = json.load(open(os.path.join(ROOT, 'data', 'events.json')))
md = json.load(open(os.path.join(ROOT, 'data', 'media.json')))
E = html.escape
MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
CAT = {'medical-history':'Medical history','day-of':'Day of (Jan 24, 2023)','investigation':'Investigation','legal':'Legal','trial-testimony':'Trial testimony','media':'Media'}
POV = {'lindsay':"Lindsay's account / defense", 'patrick':"Patrick's account", 'evidence':'Evidence'}

def when(e):
    dt, p = e['datetime'], e['precision']
    m = re.match(r'(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?(?:T(\d{2}):(\d{2}))?', dt)
    y, mo, d, hh, mi = m.groups()
    mo = int(mo or 1)
    if p == 'month': return f'{MON[mo-1]} {y} (exact date not reported)'
    if not d: return f'{MON[mo-1]} {y} (approximate)'
    date = f'{MON[mo-1]} {int(d or 1)}, {y}'
    if p == 'day' or not hh: return date
    h = int(hh); ap = 'p.m.' if h >= 12 else 'a.m.'; h = h % 12 or 12
    tz = 'EDT' if dt.endswith('-04:00') else 'EST'
    t = f'{h}:{mi} {ap} {tz}'
    return f'{date}, ≈ {t} (approximate)' if p == 'approximate' else f'{date}, {t}'

def status_cls(s):
    return {'established fact':'s-fact','defense claim':'s-defense','prosecution claim':'s-prosecution'}.get(s, 's-testimony')

# ---------- static text version ----------
by_id = {e['id']: e for e in ev['events']}
out = []
out.append('<h2>Text version: case summary and full timeline</h2>')
out.append('<p class="cw-static"><strong>Content warning:</strong> this page covers the deaths of three young children, a suicide attempt, and severe postpartum mental illness. Descriptions are factual and non-graphic. Help: Postpartum Support International <a href="tel:18009444773">1-800-944-4773</a> · National Maternal Mental Health Hotline <a href="tel:18338526262">1-833-TLC-MAMA</a> · 988 Suicide &amp; Crisis Lifeline <a href="tel:988">988</a>.</p>')
out.append('<h3>Case summary</h3>')
out.append('<p>On January 24, 2023, at the family home in Duxbury, Massachusetts, Cora (5), Dawson (3) and Callan (8 months) Clancy died. Their mother, Lindsay Clancy, a labor-and-delivery nurse, then went out a second-floor window and was left paralyzed. She was charged with murder and related offenses in Plymouth County. It was not disputed at trial that she caused the deaths. The question was her mental state. The defense argued she was legally insane because of postpartum psychosis and overmedication. The prosecution argued she was criminally responsible and planned the killings. The 2026 trial in Plymouth County Superior Court ended in a <strong>mistrial on Sept. 4, 2026</strong> after the jury could not reach a unanimous verdict. At a status hearing on <strong>Sept. 29, 2026</strong>, no retrial decision was announced, and further motions were set for Nov. 2, 2026. Lindsay Clancy is legally presumed innocent.</p>')
out.append('<p><strong>Neutrality note:</strong> this is a neutral case study built only from public reporting, official releases and public court documents. It takes no side. Statements are labeled <span class="badge s-fact">established fact</span>, <span class="badge s-testimony">testimony by a named person</span>, <span class="badge s-defense">defense claim</span> or <span class="badge s-prosecution">prosecution claim</span>. Times are Eastern Time. Many times on Jan. 24, 2023 are approximate. The site contains no images of the children and no scene or autopsy material.</p>')
out.append(f'<h3>Timeline ({len(ev["events"])} events)</h3>')
out.append('<ol class="static-events">')
for e in ev['events']:
    povs = ', '.join(POV[p] for p in e['pov']) or 'Other: prosecution / third-party'
    iso = re.sub(r'T(\d\d:\d\d)', r'T\1', e['datetime'])
    srcs = '; '.join(f'<a href="{E(s["url"])}" rel="noopener">{E(s["title"])}</a> ({E(s["outlet"])}, {E(s["date"])})' for s in e['sources'])
    extra = ''
    if e.get('timeNote'): extra += f'<p class="small"><em>Timing:</em> {E(e["timeNote"])}</p>'
    if e.get('note'): extra += f'<p class="small">{E(e["note"])}</p>'
    out.append(f'<li id="ev-{E(e["id"])}"><article><h4>{E(e["title"])}</h4>'
               f'<p class="meta"><time datetime="{E(iso)}">{E(when(e))}</time> · <span class="badge {status_cls(e["status"])}">{E(e["status"])}</span> · {E(e["location"])} · {E(CAT.get(e["category"], e["category"]))} · {E(povs)}</p>'
               f'<p>{E(e["description"])}</p>{extra}<p class="small">Sources: {srcs}</p></article></li>')
out.append('</ol>')
out.append('<h3>Media &amp; documents (outbound links)</h3><ul>')
for m in md['media']:
    out.append(f'<li><a href="{E(m["url"])}" rel="noopener">{E(m["title"])}</a> ({E(m["outlet"])}, {E(m["date"])}, {E(m["type"])}): {E(m["description"])}</li>')
out.append('</ul><h3>Not publicly available</h3><ul>' + ''.join(f'<li>{E(t)}</li>' for t in md['notPublic']) + '</ul>')
out.append(f'<p class="small">Last updated {E(cfg.get("lastUpdated",""))}. Generated from data/events.json and data/media.json.</p>')
static = '\n'.join(out)

# ---------- SEO head ----------
title, desc = cfg['title'], cfg['description']
img = (URL + cfg['ogImage']) if URL else cfg['ogImage']
head = [f'<title>{E(title)}</title>',
        f'<meta name="description" content="{E(desc)}">',
        '<meta name="robots" content="index,follow,max-image-preview:large">',
        '<meta name="author" content="Neutral case study compiled from public sources">',
        '<meta name="theme-color" content="#0d1014">']
if URL:
    head.append(f'<link rel="canonical" href="{E(URL)}">')
    head.append(f'<meta property="og:url" content="{E(URL)}">')
head += ['<meta property="og:type" content="website">', f'<meta property="og:title" content="{E(title)}">',
         f'<meta property="og:description" content="{E(desc)}">', '<meta property="og:locale" content="en_US">',
         f'<meta property="og:image" content="{E(img)}">', '<meta property="og:image:width" content="1200">', '<meta property="og:image:height" content="630">',
         '<meta property="og:image:alt" content="Screenshot of the case timeline with three perspective lanes (non-graphic)">',
         '<meta name="twitter:card" content="summary_large_image">', f'<meta name="twitter:title" content="{E(title)}">',
         f'<meta name="twitter:description" content="{E(desc)}">', f'<meta name="twitter:image" content="{E(img)}">',
         '<meta name="twitter:image:alt" content="Screenshot of the case timeline with three perspective lanes (non-graphic)">']
if cfg.get('googleSiteVerification'):
    head.append(f'<meta name="google-site-verification" content="{E(cfg["googleSiteVerification"])}">')
else:
    head.append('<!-- Google Search Console: set "googleSiteVerification" in site.json (or upload the googleXXXX.html file to the site root) -->')
ld = {"@context": "https://schema.org", "@type": "WebPage", "name": title, "description": desc, "inLanguage": "en",
      "dateModified": cfg.get('lastUpdated'), "isAccessibleForFree": True,
      "about": {"@type": "Thing", "name": "Commonwealth v. Lindsay Clancy (Plymouth County Superior Court)"}}
if URL: ld["url"] = URL; ld["image"] = img
head.append('<script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False) + '</script>')

p = os.path.join(ROOT, 'index.html'); s = open(p, encoding='utf-8').read()
s = re.sub(r'(<!-- SEO:BEGIN[^>]*-->\n).*?(<!-- SEO:END -->)', lambda m: m.group(1) + '\n'.join(head) + '\n' + m.group(2), s, flags=re.S)
s = re.sub(r'(<!-- STATIC:BEGIN[^>]*-->\n).*?(<!-- STATIC:END -->)', lambda m: m.group(1) + static + '\n' + m.group(2), s, flags=re.S)
open(p, 'w', encoding='utf-8').write(s)

# ---------- robots + sitemap ----------
robots = 'User-agent: *\nAllow: /\n'
if URL: robots += f'\nSitemap: {URL}sitemap.xml\n'
open(os.path.join(ROOT, 'robots.txt'), 'w').write(robots)
sm = os.path.join(ROOT, 'sitemap.xml')
if URL:
    open(sm, 'w').write(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                        f'  <url><loc>{E(URL)}</loc><lastmod>{cfg.get("lastUpdated")}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n</urlset>\n')
elif os.path.exists(sm): os.remove(sm)
print('url:', URL or '(not set)', '| events in static list:', len(ev['events']), '| index.html', len(s), 'bytes')
