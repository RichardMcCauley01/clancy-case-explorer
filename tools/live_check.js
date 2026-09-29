const { chromium } = require('playwright-core'); const path = require('path');
const BASE = 'https://richardmccauley01.github.io/clancy-case-explorer/';
const OUT = path.join(__dirname, '..', 'screenshots');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } }); const errs = [], failed = [];
  p.on('console', m => { if (['error','warning'].includes(m.type())) errs.push(m.text()); }); p.on('pageerror', e => errs.push(e.message));
  p.on('requestfailed', r => failed.push(r.url())); p.on('response', r => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url()); });
  await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
  const cw = await p.isVisible('#cw'); await p.screenshot({ path: path.join(OUT, 'live-00-content-warning.png') }); await p.click('#cw-ok');
  const res = {};
  for (const pov of ['lindsay', 'patrick', 'evidence']){
    await p.goto(BASE + '#scene?pov=' + pov); await p.waitForTimeout(1500);
    await p.mouse.move(700, 520); for (let i = 0; i < 5; i++){ await p.mouse.wheel(0, 100); await p.waitForTimeout(80); }
    await p.waitForTimeout(2500);
    res[pov] = await p.evaluate(() => ({ canvas: !!document.querySelector('#scene-canvas canvas'), q: Math.round(window.SCENE_STATE.q), step: window.SCENE_STATE.activeIdx + 1, title: document.querySelector('#scene-panel h3').textContent }));
    if (pov === 'patrick') await p.screenshot({ path: path.join(OUT, 'live-01-scene-patrick.png') });
  }
  await p.goto(BASE + '#timeline?zoom=day'); await p.waitForTimeout(2000);
  const tl = await p.$$eval('#tl-chart g.ev', n => n.length);
  await p.screenshot({ path: path.join(OUT, 'live-02-timeline.png') });
  await p.evaluate(() => window.CASE.openEvent('d-911')); await p.waitForTimeout(600);
  const drawer = await p.evaluate(() => document.getElementById('drawer').classList.contains('open') && document.querySelector('#drawer-body h2').textContent);
  for (const h of ['#media', '#sources', '#about', '#text']){ await p.goto(BASE + h); await p.waitForTimeout(800); }
  const srcCount = await p.$$eval('#sources-list .src-item', n => n.length);
  const textItems = await p.$$eval('#view-text .static-events li', n => n.length);
  const og = await p.evaluate(async () => { const u = document.querySelector('meta[property="og:image"]').content; const r = await fetch(u); return { u, status: r.status, type: r.headers.get('content-type') }; });
  console.log(JSON.stringify({ cw, res, timelineMarkers: tl, drawer, srcCount, textItems, og, errs, failed }, null, 1));
  await b.close();
})();
