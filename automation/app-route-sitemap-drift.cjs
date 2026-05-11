#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Compares static app routes (page.tsx) to production sitemap.xml locs.
 */
const https = require('https');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const ROOT = process.cwd();
const SITEMAP_URL = process.env.SITEMAP_URL || 'https://ziontechgroup.com/sitemap.xml';
const OUT = path.join(ROOT, 'automation', 'reports', 'app-route-sitemap-drift-latest.json');

function staticAppRoutes() {
  const files = glob.sync('app/**/page.tsx', { cwd: ROOT, nodir: true });
  const routes = new Set();
  for (const file of files) {
    const rel = file
      .replace(/^app\//, '')
      .replace(/(^|\/)page\.tsx$/, '');
    const route = rel ? `/${rel}` : '/';
    if (route.includes('[') || route.includes(']') || route.startsWith('/api')) continue;
    routes.add(route);
  }
  return routes;
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = '';
        res.on('data', (c) => {
          data += c;
        });
        res.on('end', () => resolve(data));
      })
      .on('error', reject);
  });
}

function pathsFromSitemap(xml) {
  const set = new Set();
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/gi;
  let m;
  while ((m = re.exec(xml)) !== null) {
    try {
      const u = new URL(m[1]);
      const p = u.pathname.replace(/\/$/, '') || '/';
      set.add(p);
    } catch {
      /* skip */
    }
  }
  return set;
}

async function main() {
  let sitemapPaths = new Set();
  let sitemapError = null;
  try {
    const xml = await fetchText(SITEMAP_URL);
    sitemapPaths = pathsFromSitemap(xml);
  } catch (e) {
    sitemapError = e.message || String(e);
  }
  const app = staticAppRoutes();
  const inAppNotSitemap = [...app].filter((r) => !sitemapPaths.has(r)).sort();
  const inSitemapNotApp = [...sitemapPaths].filter((r) => !app.has(r) && r.startsWith('/')).sort().slice(0, 200);

  const payload = {
    generatedAt: new Date().toISOString(),
    sitemapUrl: SITEMAP_URL,
    sitemapError,
    counts: {
      appStaticRoutes: app.size,
      sitemapPaths: sitemapPaths.size,
      inAppNotSitemap: inAppNotSitemap.length,
      inSitemapNotAppSample: inSitemapNotApp.length,
    },
    inAppNotSitemap: inAppNotSitemap.slice(0, 100),
    inSitemapNotAppSample: inSitemapNotApp.slice(0, 50),
    status: sitemapError ? 'error' : inAppNotSitemap.length > 25 ? 'warning' : 'ok',
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log(`Route/sitemap drift: ${payload.status} -> ${OUT}`);
  if (process.env.ROUTE_SITEMAP_DRIFT_STRICT === '1' && payload.status === 'warning') {
    process.exit(1);
  }
}

main();
