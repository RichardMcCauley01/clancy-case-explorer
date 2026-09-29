const { chromium } = require('playwright-core');
const path = require('path');
const BASE = 'http://127.0.0.1:8765/index.html?cw=0';
const OUT = path.join(__dirname, '..', 'screenshots');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
  const page = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  const errs = []; page.on('console', m => { if (['error','warning'].includes(m.type())) errs.push(m.text()); }); page.on('pageerror', e => errs.push(e.message));
  // in-page recorder: q, camera position, active idx per rAF
  const rec = ms => page.evaluate(ms => new Promise(res => { const S = window.SCENE_STATE, out = []; const t0 = performance.now();
    (function f(){ const c = document.querySelector('#scene-canvas canvas'); out.push({ t: performance.now() - t0, q: S.q, qt: S.qt, idx: S.activeIdx, fps: S.fps, js: S.frameMs });
      if (performance.now() - t0 < ms) requestAnimationFrame(f); else res(out); })(); }), ms);
  const summarize = (name, r) => { let maxJump = 0; for (let i = 1; i < r.length; i++) maxJump = Math.max(maxJump, Math.abs(r[i].q - r[i - 1].q));
    const distinct = new Set(r.map(x => x.q.toFixed(1))).size; const js = r.map(x => x.js).sort((a, c) => a - c);
    return { name, frames: r.length, start: +r[0].q.toFixed(1), end: +r[r.length - 1].q.toFixed(1), distinctPositions: distinct, maxStepPerFrame: +maxJump.toFixed(1), fpsHeadless: +(r[r.length - 1].fps || 0).toFixed(1), jsMsMedian: +js[js.length >> 1].toFixed(2) }; };
  const results = [];
  for (const pov of ['lindsay', 'patrick', 'evidence']){
    await page.goto(BASE + '#scene?pov=' + pov); await page.waitForTimeout(1500);
    const info = await page.evaluate(() => { const S = window.SCENE_STATE; return { steps: S.steps.length, legTicks: S.legQ.map(x => +(x / 100).toFixed(1)), pathMeters: +S.path.L.toFixed(0) }; });
    await page.mouse.move(700, 520);
    // 3 mouse-wheel notches: should move ~300px of progress, glide, and NOT snap to the next event
    const p1 = rec(1800); for (let i = 0; i < 3; i++){ await page.mouse.wheel(0, 100); await page.waitForTimeout(60); }
    const r1 = await p1; const wheel = summarize(pov + ' 3 wheel notches', r1);
    // trackpad-like: 40 small deltas
    const p2 = rec(1800); for (let i = 0; i < 40; i++){ await page.mouse.wheel(0, 9); await page.waitForTimeout(16); }
    const trackpad = summarize(pov + ' trackpad 40x9px', await p2);
    // arrow key: animated glide to next event
    const p3 = rec(2600); await page.keyboard.press('ArrowRight'); const arrow = summarize(pov + ' ArrowRight', await p3);
    // tick click far ahead
    const p4 = rec(3000); await page.evaluate(() => document.querySelectorAll('#sc-ticks span')[7].click()); const tick = summarize(pov + ' click tick 8', await p4);
    const atEvent = await page.evaluate(() => { const S = window.SCENE_STATE; return { q: S.q, target: S.eventQ[7], idx: S.activeIdx }; });
    results.push({ pov, info, wheel, trackpad, arrow, tick, atEvent });
  }
  // mid-transit screenshots
  const mids = [['lindsay', 'd-snowman', 0.5, '30-scene-lindsay-midtransit.png'], ['lindsay', 'd-voice-loud', 0.45, '34-scene-lindsay-midtransit-stairs.png'], ['patrick', 'd-cvs-leave', 0.45, '31-scene-patrick-midtransit-road.png'], ['evidence', 'd-home', 0.5, '32-scene-evidence-midtransit.png'], ['patrick', 'd-home', 0.62, '33-scene-patrick-midtransit-inside.png']];
  const shots = [];
  for (const [pov, from, lt, name] of mids){
    await page.goto(BASE + '#scene?pov=' + pov + '&step=' + from); await page.waitForTimeout(1200);
    await page.evaluate(lt => { const S = window.SCENE_STATE, i = S.steps.findIndex(e => e.id === new URLSearchParams(location.hash.split('?')[1]).get('step')); S.nav = null; S.qt = S.eventQ[i] + S.legQ[i] * lt; }, lt);
    await page.waitForTimeout(3500);
    const st = await page.evaluate(() => { const S = window.SCENE_STATE; return { q: +S.q.toFixed(1), qt: +S.qt.toFixed(1), idx: S.activeIdx, time: document.getElementById('sc-time').textContent }; });
    await page.screenshot({ path: path.join(OUT, name) }); shots.push({ name, st });
  }
  console.log(JSON.stringify({ results, shots, errs }, null, 1));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
