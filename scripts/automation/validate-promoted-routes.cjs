#!/usr/bin/env node
 
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const PAGE_PATH = path.join(ROOT, 'app', 'page.tsx');
const AI_CATALOG_PATH = path.join(ROOT, 'app', 'config', 'aiCatalog.ts');
const APP_ROOT = path.join(ROOT, 'app');

function routeToPagePath(route) {
  const [pathOnly] = route.split('#')[0].split('?');
  if (pathOnly === '/') return path.join(APP_ROOT, 'page.tsx');
  const normalized = pathOnly.replace(/^\//, '');
  return path.join(APP_ROOT, normalized, 'page.tsx');
}

function extractPromotedRoutes(homepageSource) {
  const routeSet = new Set();
  const linkRegex = /href="(\/[^"#?]+)"/g;
  let match = linkRegex.exec(homepageSource);
  while (match) {
    const route = match[1].trim();
    if (route.startsWith('/_') || route.startsWith('/api/')) {
      match = linkRegex.exec(homepageSource);
      continue;
    }
    routeSet.add(route);
    match = linkRegex.exec(homepageSource);
  }
  return Array.from(routeSet);
}

function extractCatalogRoutes(aiCatalogSource) {
  const routeSet = new Set();
  const hrefRegex = /href:\s*'([^']+)'/g;
  let match = hrefRegex.exec(aiCatalogSource);
  while (match) {
    const route = match[1].trim();
    if (route.startsWith('/')) {
      routeSet.add(route);
    }
    match = hrefRegex.exec(aiCatalogSource);
  }
  return Array.from(routeSet);
}

function main() {
  if (!fs.existsSync(PAGE_PATH)) {
    console.error('Homepage file not found: app/page.tsx');
    process.exit(1);
  }

  const source = fs.readFileSync(PAGE_PATH, 'utf8');
  const promotedRoutes = extractPromotedRoutes(source);
  const catalogRoutes = fs.existsSync(AI_CATALOG_PATH)
    ? extractCatalogRoutes(fs.readFileSync(AI_CATALOG_PATH, 'utf8'))
    : [];
  const routes = Array.from(new Set([...promotedRoutes, ...catalogRoutes]));
  const missing = routes.filter((route) => !fs.existsSync(routeToPagePath(route)));

  if (missing.length > 0) {
    console.error('Promoted routes missing page files:');
    for (const route of missing) {
      console.error(`- ${route} -> ${routeToPagePath(route)}`);
    }
    process.exit(1);
  }

  console.log(
    `Promotion route validator passed (${promotedRoutes.length} homepage routes + ${catalogRoutes.length} catalog routes checked).`,
  );
}

main();
