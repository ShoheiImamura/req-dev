import { chromium } from 'playwright-core';
const S = process.argv[2];
const b = await chromium.launch({ executablePath: '/home/imamura/.cache/ms-playwright/chromium-1200/chrome-linux64/chrome' });
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('http://localhost:4399/docs/value/');
await p.screenshot({ path: `${S}/s8-value.png`, clip: { x: 260, y: 200, width: 1020, height: 600 } });
await p.goto('http://localhost:4399/docs/usecase/');
await p.screenshot({ path: `${S}/s8-usecase.png`, clip: { x: 260, y: 0, width: 1020, height: 900 } });
await b.close();
