const { chromium } = require('playwright-core');
const path = require('path');
const BASE = process.env.BASE || 'http://127.0.0.1:8765/index.html';
const OUT = path.join(__dirname, '..', 'screenshots');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('requestfailed', r => errors.push('requestfailed: ' + r.url()));
  const shots = [];
  async function shot(name){ const p = path.join(OUT, name); await page.screenshot({ path: p }); shots.push(p); }
  // Content warning first
  await page.goto(BASE + '#scene?pov=lindsay', { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  await shot('00-content-warning.png');
  await page.click('#cw-ok');
  const sceneShots = [['lindsay', 'd-basement-account', '01-scene-lindsay.png'], ['lindsay', 'd-jump', '02-scene-lindsay-window.png'],
    ['patrick', 'd-cvs', '03-scene-patrick-cvs.png'], ['patrick', 'd-yard', '04-scene-patrick.png'],
    ['evidence', 'd-stairs', '05-scene-evidence.png'], ['evidence', 'd-screen', '06-scene-evidence-window.png'], ['evidence', 'd-snowman', '07-scene-evidence-start.png']];
  for (const [pov, step, name] of sceneShots){
    await page.goto(BASE + '#scene?pov=' + pov + '&step=' + step); await page.waitForTimeout(2500); await shot(name);
  }
  // scroll test: wheel moves progress
  await page.goto(BASE + '#scene?pov=patrick&step=d-best-day'); await page.waitForTimeout(1200);
  await page.mouse.move(700, 500);
  for (let i = 0; i < 6; i++){ await page.mouse.wheel(0, 120); await page.waitForTimeout(120); }
  await page.waitForTimeout(600);
  const mid = await page.evaluate(() => ({ q: window.SCENE_STATE.q, qt: window.SCENE_STATE.qt }));
  await shot('08-scene-patrick-transit.png');
  await page.waitForTimeout(1500);
  const after = await page.evaluate(() => ({ q: window.SCENE_STATE.q, idx: window.SCENE_STATE.activeIdx, title: document.querySelector('#scene-panel h3').textContent }));
  // timeline
  await page.goto(BASE + '#timeline'); await page.waitForTimeout(1500); await shot('10-timeline-all.png');
  await page.click('.zbtn[data-zoom="history"]'); await page.waitForTimeout(1200); await shot('11-timeline-history.png');
  await page.click('.zbtn[data-zoom="day"]'); await page.waitForTimeout(1200); await shot('12-timeline-day.png');
  await page.click('.zbtn[data-zoom="minutes"]'); await page.waitForTimeout(1200); await shot('13-timeline-minutes.png');
  const evCount = await page.$$eval('#tl-chart g.ev', n => n.length);
  await page.click('#tl-chart g.ev:nth-of-type(20)', { force: true }).catch(async () => { await page.evaluate(() => window.CASE.openEvent('d-call-534')); });
  await page.waitForTimeout(600); await shot('14-timeline-drawer.png');
  await page.keyboard.press('Escape');
  await page.click('.zbtn[data-zoom="trial"]'); await page.waitForTimeout(1200); await shot('15-timeline-trial.png');
  await page.fill('#tl-search', '911'); await page.click('#tl-listtoggle'); await page.waitForTimeout(500); await shot('16-timeline-search-list.png');
  await page.fill('#tl-search', ''); await page.click('#tl-listtoggle');
  await page.evaluate(() => document.querySelector('.media-inline').scrollIntoView()); await page.waitForTimeout(300); await shot('17-timeline-media-panel.png');
  await page.goto(BASE + '#media'); await page.waitForTimeout(800); await page.screenshot({ path: path.join(OUT, '20-media.png'), fullPage: true }); shots.push(path.join(OUT, '20-media.png'));
  await page.goto(BASE + '#sources'); await page.waitForTimeout(800); await shot('21-sources.png');
  await page.goto(BASE + '#about'); await page.waitForTimeout(800); await shot('22-about.png');
  console.log(JSON.stringify({ shots, errors, mid, after, evCount }, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
