import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/home/imamura/.cache/ms-playwright/chromium-1200/chrome-linux64/chrome' });
const p = await b.newPage({ viewport: { width: 400, height: 800 } });
await p.goto('http://localhost:4399/');
const r = await p.evaluate(() => {
  const out = { docScrollW: document.documentElement.scrollWidth, bodyW: document.body.scrollWidth };
  const wide = [];
  for (const el of document.querySelectorAll('body *')) {
    const w = el.getBoundingClientRect().width;
    if (w > 400) wide.push(`${el.tagName}.${el.className} ${Math.round(w)}`);
  }
  out.wide = wide.slice(0, 15);
  return out;
});
console.log(JSON.stringify(r, null, 1));
await b.close();
