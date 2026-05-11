#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Smoke-check /ai-lab hub + every catalog tool route with Playwright.
 * Writes: automation/reports/ai-lab-hub-links-smoke-latest.json
 */
const fs = require('fs');
const path = require('path');

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.error('[ai-lab-hub-links-playwright] Playwright is required.');
  process.exit(1);
}

const ROOT = process.cwd();
const TOOLS_TS = path.join(ROOT, 'app', 'ai-lab', 'ai-lab-tools.ts');
const OUT = path.join(ROOT, 'automation', 'reports', 'ai-lab-hub-links-smoke-latest.json');

function extractToolHrefs() {
  const text = fs.readFileSync(TOOLS_TS, 'utf8');
  const hrefs = new Set();
  const re = /href:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(text))) {
    if (m[1].startsWith('/ai-lab/')) hrefs.add(m[1]);
  }
  return [...hrefs].sort((a, b) => a.localeCompare(b));
}

async function main() {
  const baseRaw = process.env.ZION_BASE_URL || process.env.ZION_PRODUCTION_URL || 'https://ziontechgroup.com';
  const base = String(baseRaw).replace(/\/$/, '');
  const failOnError = String(process.env.AI_LAB_HUB_LINKS_FAIL_ON_ERROR || '1') !== '0';
  const routes = ['/ai-lab', ...extractToolHrefs()];
  const browser = await chromium.launch({ headless: true });
  const results = [];
  let allOk = true;
  try {
    const ctx = await browser.newContext({
      userAgent: 'Mozilla/5.0 (compatible; ZionAiLabHubLinksSmoke/1.0; +https://ziontechgroup.com)',
    });
    const page = await ctx.newPage();
    for (const p of routes) {
      const url = new URL(p, `${base}/`).href;
      let status = null;
      let ok = false;
      let error = null;
      try {
        const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        status = res ? res.status() : null;
        ok = status !== null && status >= 200 && status < 400;
      } catch (e) {
        error = e.message || String(e);
      }
      if (!ok || error) allOk = false;
      results.push({ path: p, url, status, ok: ok && !error, error });
    }
    await ctx.close();
  } finally {
    await browser.close();
  }
  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl: base,
    routeCount: routes.length,
    allOk,
    results,
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(`[ai-lab-hub-links-playwright] ${results.filter((r) => r.ok).length}/${routes.length} ok`);
  if (!allOk && failOnError) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
