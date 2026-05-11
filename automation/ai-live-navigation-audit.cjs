#!/usr/bin/env node

/**
 * AI Live Navigation Audit
 *
 * Fetches the live site (ziontechgroup.com) homepage and key nav pages,
 * extracts internal links from nav/footer, and compares to app/constants/navigation
 * and discovered routes. Reports: links on live site that are broken (404),
 * links in nav constants that have no page, and suggestions to align live nav.
 *
 * Usage:
 *   node automation/ai-live-navigation-audit.cjs run
 *   BASE_URL=https://staging.example.com node automation/ai-live-navigation-audit.cjs run
 *
 * Output: automation/reports/live-navigation-audit-latest.json
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, 'app');
const AUTOMATION_DIR = path.join(ROOT, 'automation');
const REPORTS_DIR = path.join(AUTOMATION_DIR, 'reports');
const NAV_CONSTANTS = path.join(APP_DIR, 'constants', 'navigation.ts');

const BASE_URL = process.env.BASE_URL || 'https://ziontechgroup.com';
const REQUEST_TIMEOUT = 12000;

// Pages to crawl on live site to extract nav/footer links (path only)
const LIVE_CRAWL_PATHS = [
  '/',
  '/solutions',
  '/services',
  '/pricing',
  '/contact',
  '/about',
  '/blog',
  '/products',
  '/ai-services',
  '/industries',
  '/case-studies',
  '/consultation',
  '/site-map',
  '/innovation-bundles',
  '/partners',
  '/faq',
];

function log(msg, level = 'INFO') {
  const ts = new Date().toISOString();
  console.log(`[LiveNavAudit] ${ts} | ${msg}`);
}

function ensureDirs() {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

function fetchUrl(urlPath) {
  const url = urlPath.startsWith('http') ? urlPath : `${BASE_URL}${urlPath}`;
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: REQUEST_TIMEOUT }, (res) => {
      const isRedirect = res.statusCode >= 301 && res.statusCode <= 308 && res.headers.location;
      if (isRedirect && res.headers.location) {
        const next = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, BASE_URL).href;
        return fetchUrl(next.startsWith(BASE_URL) ? next.slice(BASE_URL.length) || '/' : next)
          .then(resolve)
          .catch(reject);
      }
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () =>
        resolve({
          status: res.statusCode,
          body,
          path: urlPath,
        })
      );
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

function extractInternalLinks(html) {
  const links = new Set();
  const hrefRegex = /href=["'](\/[^"'#?]*)/g;
  let m;
  while ((m = hrefRegex.exec(html)) !== null) {
    const raw = m[1];
    const clean = raw.split('?')[0].split('#')[0].replace(/\/$/, '') || '/';
    if (clean.startsWith('//') || clean.startsWith('/_next') || clean.startsWith('/static')) continue;
    if (/\.(svg|json|ico|png|jpg|jpeg|gif|webp|woff2?|ttf|css|js|xml)$/i.test(clean)) continue;
    links.add(clean || '/');
  }
  return Array.from(links);
}

function discoverLocalRoutes() {
  const routes = new Set();
  const dynamicPrefixes = new Set(); // e.g. /blog for app/blog/[slug]/page.tsx
  const scan = (dir, prefix = '') => {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name.startsWith('[') && entry.name.endsWith(']')) {
          const hasPage =
            fs.readdirSync(fullPath, { withFileTypes: false }).includes('page.tsx') ||
            fs.readdirSync(fullPath, { withFileTypes: false }).includes('page.js');
          if (hasPage) dynamicPrefixes.add(prefix || '/');
          continue;
        }
        scan(fullPath, `${prefix}/${entry.name}`);
      } else if (entry.name === 'page.tsx' || entry.name === 'page.js') {
        routes.add(prefix || '/');
      }
    }
  };
  scan(APP_DIR);
  return { routes, dynamicPrefixes };
}

function extractNavHrefsFromConstants() {
  const content = fs.readFileSync(NAV_CONSTANTS, 'utf8');
  const hrefRegex = /href:\s*['"]([^'"]+)['"]/g;
  const hrefs = new Set();
  let m;
  while ((m = hrefRegex.exec(content)) !== null) {
    const h = m[1].split('?')[0].split('#')[0].replace(/\/$/, '') || '/';
    if (h.startsWith('/')) hrefs.add(h);
  }
  return Array.from(hrefs);
}

async function run() {
  ensureDirs();
  log(`Base URL: ${BASE_URL}`);
  log(`Crawling ${LIVE_CRAWL_PATHS.length} live pages...`);

  const allLiveLinks = new Set();
  const failedFetches = [];
  for (const p of LIVE_CRAWL_PATHS) {
    try {
      const res = await fetchUrl(p);
      if (res.status !== 200) {
        failedFetches.push({ path: p, status: res.status });
        continue;
      }
      const links = extractInternalLinks(res.body);
      links.forEach((l) => allLiveLinks.add(l));
    } catch (err) {
      failedFetches.push({ path: p, error: err.message });
    }
  }

  const liveLinksArray = Array.from(allLiveLinks);
  log(`Collected ${liveLinksArray.length} unique internal links from live site`);

  const { routes, dynamicPrefixes } = discoverLocalRoutes();
  log(`Discovered ${routes.size} local routes, ${dynamicPrefixes.size} dynamic segment prefix(es)`);

  const navHrefs = extractNavHrefsFromConstants();
  log(`Nav constants reference ${navHrefs.length} hrefs`);

  const routeSet = routes;
  const hasRoute = (href) => {
    const norm = href.replace(/\/$/, '') || '/';
    if (routeSet.has(norm) || routeSet.has(norm + '/')) return true;
    for (const p of dynamicPrefixes) {
      if (p === '/') continue;
      if (norm === p || norm.startsWith(p + '/')) return true;
    }
    return false;
  };

  const brokenOnLive = [];
  const liveNotInNav = [];
  const navBroken = [];

  for (const href of liveLinksArray) {
    if (!hasRoute(href)) brokenOnLive.push(href);
    if (!navHrefs.includes(href) && href !== '/' && href.length > 1) {
      liveNotInNav.push(href);
    }
  }

  for (const href of navHrefs) {
    if (!hasRoute(href)) navBroken.push(href);
  }

  const report = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    crawledPaths: LIVE_CRAWL_PATHS,
    totalLiveLinks: liveLinksArray.length,
    totalLocalRoutes: routes.size,
    dynamicPrefixes: Array.from(dynamicPrefixes),
    totalNavHrefs: navHrefs.length,
    failedFetches,
    brokenOnLive: brokenOnLive.slice(0, 200),
    brokenOnLiveCount: brokenOnLive.length,
    liveNotInNav: liveNotInNav,
    liveNotInNavCount: liveNotInNav.length,
    liveNotInNavSample: liveNotInNav.slice(0, 50),
    missingFromApp: liveNotInNav.slice(0, 100),
    navBroken,
    navBrokenCount: navBroken.length,
    summary: {
      ok: failedFetches.length === 0 && navBroken.length === 0,
      crawlOk: failedFetches.length === 0,
      navSyncOk: navBroken.length === 0,
    },
  };

  const reportPath = path.join(REPORTS_DIR, 'live-navigation-audit-latest.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`Report written to ${reportPath}`);

  if (failedFetches.length > 0) {
    log(`❌ Failed fetches: ${failedFetches.length}`);
    failedFetches.forEach((f) => log(`   - ${f.path}: ${f.status || f.error}`));
  }
  if (navBroken.length > 0) {
    log(`❌ Nav constants point to missing pages: ${navBroken.length}`);
    navBroken.slice(0, 15).forEach((h) => log(`   - ${h}`));
  }
  if (brokenOnLive.length > 0) {
    log(`⚠️ Links on live site with no local route: ${brokenOnLive.length} (sample in report)`);
  }
  if (report.summary.ok) {
    log('✅ Live navigation audit OK: crawl succeeded, nav constants match local routes.');
  }

  return report;
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
