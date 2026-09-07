/**
 * Capture App Store screenshots from the Expo web build with Playwright at iPhone 6.7" scale (1290x2796).
 *   node store/shots.js   (expects expo web on http://localhost:8088 and playwright in $PW)
 */
const path = require('path');
const fs = require('fs');
const PW = process.env.PW || path.join(process.env.HOME, '.claude/jobs/5f43ca6b/tmp/pw/node_modules/playwright');
const { chromium } = require(PW);
const BASE = process.env.BASE || 'http://localhost:8088';
const OUT = path.join(__dirname, 'raw');
fs.mkdirSync(OUT, { recursive: true });

const SHOTS = [
  ['01', 'today', 'No streaks. No blockers.\nOne real thing a day.'],
  ['02', 'talk', 'Someone who came through it.\nNo name. No title.'],
  ['03', 'urge', 'When it is loud:\nninety seconds of company.'],
  ['04', 'dates', 'You are allowed\nto go on the date.'],
  ['05', 'scene', 'Lie down. Live the scene.\nThen sleep on it.'],
  ['06', 'fruits', 'The only thing it counts:\nwarmth that happened.'],
];

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  for (const [n, demo] of SHOTS) {
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?demo=${demo}&snap=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(OUT, `${n}.png`) });
    await page.close();
    console.log('captured', n, demo);
  }
  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'captions.json'), JSON.stringify(SHOTS.map(([n, , c]) => [n, c])));
})();
