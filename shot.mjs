import { chromium } from '@playwright/test';
const OUT = process.argv[2];
const targets = JSON.parse(process.argv[3]);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
p.on('pageerror', (e) => errs.push(String(e.message)));
await p.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await p.waitForTimeout(4600);
for (const [sel, off, name, wait] of targets) {
  const y = await p.evaluate((s) => {
    const el = document.querySelector(s);
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  }, sel);
  await p.evaluate((v) => window.scrollTo(0, v), y + off);
  await p.waitForTimeout(wait ?? 2200);
  await p.screenshot({ path: `${OUT}/${name}.png` });
}
console.log('errors:', errs.length ? errs : 'none');
await b.close();
