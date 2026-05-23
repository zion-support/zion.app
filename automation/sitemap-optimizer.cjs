#!/usr/bin/env node
/**
 * Autonomous Dynamic Sitemap & Route Priority Optimizer
 *
 * Generates sitemap.xml with intelligent priority and changeFreq based on
 * route type, content freshness, and navigation patterns.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const STATE_DIR = path.join(process.cwd(), '.hermes', 'memory', 'sitemap-optimizer');
const SITEMAP_PATH = path.join(process.cwd(), 'public', 'sitemap.xml');
const SITEMAP_INDEX_PATH = path.join(process.cwd(), 'public', 'sitemap-index.xml');

const DEFAULT_CHANGEFREQ = 'weekly';
const PRIORITY_HOME = 1.0;
const PRIORITY_SERVICES = 0.9;
const PRIORITY_AI_LAB = 0.8;
const PRIORITY_STATIC = 0.7;
const PRIORITY_DYNAMIC = 0.5;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function nowISO() { return new Date().toISOString(); }
function formatDate(d) { return d.toISOString().split('T')[0]; }

// Discover routes from app/ directory (Next.js App Router)
function discoverRoutes() {
  const routes = [];
  const appDir = path.join(process.cwd(), 'app');

  function walk(dir, segments = []) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const hasPage = entries.some(e => (e.name === 'page.tsx' || e.name === 'page.ts') && e.isFile());
    const routePath = '/' + segments.join('/');

    if (hasPage) {
      routes.push({ path: routePath.replace(/\/+$/, ''), segments: [...segments] });
      // keep walking subdirs for nested routes
    }

    for (const e of entries) {
      if (e.isDirectory()) walk(path.join(dir, e.name), [...segments, e.name]);
    }
  }

  if (fs.existsSync(appDir)) walk(appDir);
  return routes;
}

// Get last modified date for a route (walk up to find layout or root)
function getLastModified(route) {
  // Heuristic: find newest timestamp among files in route dir tree
  const routePath = path.join(process.cwd(), 'app', ...route.segments);
  let newest = null;

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.isFile()) {
        const s = fs.statSync(full);
        if (!newest || s.mtime > newest) newest = s.mtime;
      }
    }
  }

  walk(routePath || path.join(process.cwd(), 'app'));
  return newest ? formatDate(newest) : formatDate(new Date());
}

// Determine priority heuristically based on route path
function determinePriority(route) {
  const p = route.path;
  if (p === '/' || p === '') return PRIORITY_HOME;
  if (p.includes('/services')) return PRIORITY_SERVICES;
  if (p.includes('/ai-lab') || p.includes('/ai')) return PRIORITY_AI_LAB;
  if (p.startsWith('/blog') || p.startsWith('/articles')) return PRIORITY_STATIC;
  return PRIORITY_DYNAMIC;
}

// Determine change frequency based on route type and modification recency
function determineChangeFreq(route, lastMod) {
  const daysSinceMod = Math.floor((new Date() - new Date(lastMod)) / (1000 * 60 * 60 * 24));
  if (daysSinceMod < 7) return 'daily';
  if (daysSinceMod < 30) return 'weekly';
  return 'monthly';
}

// Generate sitemap XML for a set of URLs
function generateSitemap(urls, baseUrl = 'https://ziontechgroup.com') {
  const entries = urls.map(u => {
    return `  <url>
    <loc>${baseUrl}${u.path}</loc>
    <lastmod>${u.lastMod}</lastmod>
    <changefreq>${u.changeFreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}

function main() {
  console.log('🗺️  Dynamic Sitemap Optimizer — starting\n');
  ensureDir(STATE_DIR);

  const routes = discoverRoutes();
  console.log(`🛣️  Discovered ${routes.length} route(s)`);

  const sitemapEntries = [];

  for (const route of routes) {
    const lastMod = getLastModified(route);
    const priority = determinePriority(route);
    const changeFreq = determineChangeFreq(route, lastMod);

    console.log(`   ${route.path} — priority: ${priority}, freq: ${changeFreq}, lastmod: ${lastMod}`);

    sitemapEntries.push({
      path: route.path,
      lastMod,
      changeFreq,
      priority
    });
  }

  // Generate sitemap.xml
  const sitemapXml = generateSitemap(sitemapEntries);
  fs.writeFileSync(SITEMAP_PATH, sitemapXml, 'utf8');
  console.log(`\n✅ sitemap.xml written to ${SITEMAP_PATH}`);

  // Save state for history tracking
  const historyFile = path.join(STATE_DIR, 'history.json');
  const history = {
    timestamp: nowISO(),
    routesCount: routes.length,
    sitemapPath: SITEMAP_PATH
  };
  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
  console.log(`📄 State saved: ${historyFile}`);

  console.log('\n✅ Sitemap optimization complete.\n');
  process.exit(0);
}

main();
