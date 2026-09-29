const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1400, height: 900 } }); const errs = [];
  p.on('console', m => { if (['error','warning'].includes(m.type())) errs.push(m.text()); }); p.on('pageerror', e => errs.push(e.message));
  const base = 'file:///workspace/clancy-case/index.html';
  for (const h of ['#scene?pov=lindsay', '#scene?pov=patrick&step=d-911', '#scene?pov=evidence&step=10', '#timeline?zoom=day', '#timeline?event=p-hearing', '#media', '#sources', '#about']){ await p.goto(base + '?cw=0' + h); await p.waitForTimeout(1500); }
  const ok = await p.evaluate(() => !!document.querySelector('#scene-canvas canvas') && document.querySelectorAll('#sources-list .src-item').length);
  console.log(JSON.stringify({ errs, ok })); await b.close();
})();
