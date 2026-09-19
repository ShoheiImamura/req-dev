import { chromium } from 'playwright-core';
const S = process.argv[2];
const b = await chromium.launch({ executablePath: '/home/imamura/.cache/ms-playwright/chromium-1200/chrome-linux64/chrome' });
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('http://localhost:4399/docs/flow/');
await p.screenshot({ path: `${S}/s20-flow.png`, fullPage: true });
await b.close();
