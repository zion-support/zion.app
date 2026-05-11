#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const WATCHDOG_REPORT_PATH = path.join(REPORTS_DIR, 'deploy-watchdog-latest.json');
const HISTORY_PATH = path.join(REPORTS_DIR, 'promotion-health-history.json');
const OUTPUT_PATH = path.join(REPORTS_DIR, 'promotion-confidence-latest.json');
const HISTORY_OUTPUT_PATH = path.join(REPORTS_DIR, 'promotion-confidence-history.json');
const PAGE_PATH = path.join(ROOT, 'app', 'page.tsx');
const CATALOG_PATH = path.join(ROOT, 'app', 'config', 'aiCatalog.ts');

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function extractPromotedRoutes(homepageSource, catalogSource) {
  const routes = new Set();
  const hrefRegex = /href="(\/[^"#?]+)"/g;
  let hrefMatch = hrefRegex.exec(homepageSource);
  while (hrefMatch) {
    const route = hrefMatch[1].trim();
    if (route.startsWith('/')) routes.add(route);
    hrefMatch = hrefRegex.exec(homepageSource);
  }

  const catalogRegex = /href:\s*'([^']+)'/g;
  let catalogMatch = catalogRegex.exec(catalogSource);
  while (catalogMatch) {
    const route = catalogMatch[1].trim().split('#')[0].split('?')[0];
    if (route.startsWith('/')) routes.add(route);
    catalogMatch = catalogRegex.exec(catalogSource);
  }

  return [...routes];
}

function scoreRoute(route, watchdogResults, history) {
  const watchdog = watchdogResults.get(route);
  const hist = history[route] || {};
  const checks = Number(hist.totalChecks || 0);
  const totalFailures = Number(hist.totalFailures || 0);
  const consecutiveFailures = Number(hist.consecutiveFailures || 0);
  const failureRatio = checks > 0 ? totalFailures / checks : 0;

  let score = 100;
  if (watchdog && watchdog.healthy === false) score -= 55;
  score -= Math.min(consecutiveFailures * 15, 45);
  score -= Math.round(Math.min(failureRatio * 30, 30));
  if (watchdog && watchdog.healthy === true && checks > 0) score += 5;
  score = Math.max(0, Math.min(100, score));

  return {
    route,
    score,
    healthy: watchdog ? Boolean(watchdog.healthy) : true,
    consecutiveFailures,
    totalChecks: checks,
    totalFailures,
    status:
      score >= 80 ? 'high' : score >= 60 ? 'medium' : score >= 40 ? 'watch' : 'low',
  };
}

function main() {
  if (!fs.existsSync(PAGE_PATH) || !fs.existsSync(CATALOG_PATH)) {
    throw new Error('Homepage or catalog source missing.');
  }

  const homepageSource = fs.readFileSync(PAGE_PATH, 'utf8');
  const catalogSource = fs.readFileSync(CATALOG_PATH, 'utf8');
  const promotedRoutes = extractPromotedRoutes(homepageSource, catalogSource);
  const watchdog = readJson(WATCHDOG_REPORT_PATH, {});
  const history = readJson(HISTORY_PATH, {});

  const watchdogResults = new Map(
    (watchdog.results || []).map((entry) => [entry.route, { healthy: Boolean(entry.healthy) }]),
  );
  const routeScores = promotedRoutes
    .map((route) => scoreRoute(route, watchdogResults, history))
    .sort((a, b) => a.score - b.score);

  const report = {
    generatedAt: new Date().toISOString(),
    promotedCount: promotedRoutes.length,
    gatedThreshold: 60,
    summary: {
      high: routeScores.filter((item) => item.status === 'high').length,
      medium: routeScores.filter((item) => item.status === 'medium').length,
      watch: routeScores.filter((item) => item.status === 'watch').length,
      low: routeScores.filter((item) => item.status === 'low').length,
    },
    lowestConfidenceRoutes: routeScores.slice(0, 10),
    routeScores,
  };

  const previous = readJson(HISTORY_OUTPUT_PATH, []);
  const entry = {
    timestamp: report.generatedAt,
    avgScore:
      routeScores.length > 0
        ? Math.round(routeScores.reduce((sum, item) => sum + item.score, 0) / routeScores.length)
        : 100,
    lowCount: report.summary.low,
    watchOrLowCount: report.summary.watch + report.summary.low,
  };
  const historySeries = [...previous, entry].slice(-180);

  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(report, null, 2));
  fs.writeFileSync(HISTORY_OUTPUT_PATH, JSON.stringify(historySeries, null, 2));
  console.log(`Promotion confidence report generated: ${OUTPUT_PATH}`);
}

main();

