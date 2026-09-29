const { chromium } = require('playwright-core'); const path = require('path');
const BASE = process.env.BASE || 'http://127.0.0.1:8765/index.html';
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
  const errs = [];
  const ctx = await b.newContext({ viewport: { width: 1600, height: 1000 } }); const p = await ctx.newPage();
  p.on('console', m => { if (['error','warning'].includes(m.type())) errs.push(m.text()); }); p.on('pageerror', e => errs.push(e.message));
  await p.goto(BASE); await p.waitForTimeout(1200);
  const cw = await p.isVisible('#cw'); await p.click('#cw-ok');
  for (const h of ['#scene?pov=lindsay', '#scene?pov=patrick', '#scene?pov=evidence', '#timeline', '#timeline?zoom=minutes', '#media', '#sources', '#about']){ await p.goto(BASE + h); await p.waitForTimeout(1300); }
  await p.goto(BASE + '#text'); await p.waitForTimeout(800);
  const textItems = await p.$$eval('#view-text .static-events li', n => n.length);
  await p.screenshot({ path: path.join(__dirname, '..', 'screenshots', '23-text-version.png') });
  const title = await p.title();
  // JS disabled: crawler-style view
  const ctx2 = await b.newContext({ javaScriptEnabled: false, viewport: { width: 1300, height: 900 } }); const p2 = await ctx2.newPage();
  await p2.goto(BASE); await p2.waitForTimeout(500);
  const nojs = await p2.evaluate(() => ({ textVisible: getComputedStyle(document.getElementById('view-text')).display, sceneVisible: getComputedStyle(document.getElementById('view-scene')).display, words: document.body.innerText.split(/\s+/).length }));
  await p2.screenshot({ path: path.join(__dirname, '..', 'screenshots', '24-no-js-crawler-view.png') });
  console.log(JSON.stringify({ title, cwShown: cw, textItems, nojs, errs }));
  await b.close();
})();
