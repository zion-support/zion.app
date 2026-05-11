#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Headless Chromium smoke via Playwright against Netlify deploy URL when present
 * (from automation/reports/deploy-status-latest.json), else production fallback.
 *
 * Writes automation/reports/netlify-playwright-smoke-latest.json
 *
 * Env:
 *   NETLIFY_DEPLOY_URL — override base URL
 *   ZION_PRODUCTION_URL — fallback when no Netlify URL (default https://ziontechgroup.com)
 *   NETLIFY_PLAYWRIGHT_MAX_ROUTES — default 6
 *   NETLIFY_PLAYWRIGHT_FAIL_ON_ERROR — 1 to exit non-zero if any route fails
 */
const fs = require('fs');
const path = require('path');

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch (e) {
  console.error('[netlify-playwright-smoke] Install devDependency: npm install playwright');
  process.exit(1);
}

const ROOT = process.cwd();
const DEPLOY = path.join(ROOT, 'automation', 'reports', 'deploy-status-latest.json');
const OUT = path.join(ROOT, 'automation', 'reports', 'netlify-playwright-smoke-latest.json');
const ROUTES_FILE = path.join(ROOT, 'config', 'smoke-routes.txt');

function readDeployUrl() {
  const env = (process.env.NETLIFY_DEPLOY_URL || '').trim();
  if (env) return { url: env.replace(/\/$/, ''), source: 'env' };
  try {
    const j = JSON.parse(fs.readFileSync(DEPLOY, 'utf8'));
    const u = (j.netlifyDeployUrl || '').trim();
    if (u) return { url: u.replace(/\/$/, ''), source: 'deploy-status' };
  } catch {
    /* ignore */
  }
  return { url: '', source: 'none' };
}

async function main() {
  const pick = readDeployUrl();
  let base = pick.url;
  let source = pick.source;
  if (!base) {
    base = (process.env.ZION_PRODUCTION_URL || 'https://ziontechgroup.com').replace(/\/$/, '');
    source = 'fallback';
    console.log('[netlify-playwright-smoke] no Netlify URL; using', base);
  } else {
    console.log('[netlify-playwright-smoke] base', base, 'via', source);
  }

  const maxR = Math.min(20, Math.max(1, Number(process.env.NETLIFY_PLAYWRIGHT_MAX_ROUTES || 6)));
  let routes = ['/', '/ai-lab', '/contact'];
  if (fs.existsSync(ROUTES_FILE)) {
    const lines = fs
      .readFileSync(ROUTES_FILE, 'utf8')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'));
    if (lines.length) routes = lines.slice(0, maxR);
  }

  const browser = await chromium.launch({ headless: true });
  const results = [];
  let allOk = true;
  try {
    const ctx = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (compatible; ZionPlaywrightSmoke/1.0; +https://ziontechgroup.com)',
    });
    const page = await ctx.newPage();
    for (const p of routes) {
      const url = new URL(p, `${base}/`).href;
      let ok = false;
      let status = null;
      let errMsg = null;
      try {
        const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        status = resp ? resp.status() : null;
        ok = Boolean(status && status >= 200 && status < 400);
      } catch (e) {
        ok = false;
        status = 'error';
        errMsg = e && e.message ? String(e.message) : 'error';
      }
      if (!ok) allOk = false;
      results.push({ path: p, url, status, ok, error: errMsg });
    }
    await ctx.close();
  } finally {
    await browser.close();
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    baseUrl: base,
    urlSource: source,
    allOk,
    results,
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log('[netlify-playwright-smoke] wrote', OUT, 'allOk=', allOk);

  const fail = process.env.NETLIFY_PLAYWRIGHT_FAIL_ON_ERROR === '1' || process.env.NETLIFY_PLAYWRIGHT_FAIL_ON_ERROR === 'true';
  if (fail && !allOk) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
