// Renders og-image.png (1200x630) from the timeline view (non-graphic; no child imagery).
const { chromium } = require('playwright-core'); const path = require('path');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await p.goto((process.env.BASE || 'http://127.0.0.1:8765/index.html') + '?cw=0#timeline?zoom=minutes'); await p.waitForTimeout(2500);
  await p.evaluate(() => { document.querySelector('.tl-filters').style.display = 'none'; document.querySelector('.neutral-bar').style.display = 'none'; });
  await p.waitForTimeout(600);
  await p.screenshot({ path: path.join(__dirname, '..', 'og-image.png') }); await b.close(); console.log('ok');
})();
