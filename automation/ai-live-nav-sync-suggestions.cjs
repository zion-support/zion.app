#!/usr/bin/env node

/**
 * AI Live Nav Sync Suggestions
 *
 * Reads automation/reports/live-navigation-audit-latest.json and produces
 * suggested additions to app/constants/navigation.ts: high-value live links
 * that exist as local routes but are not in nav constants. Output is a JSON
 * report for manual review or future auto-apply. Does not modify navigation.ts.
 *
 * Usage:
 *   node automation/ai-live-nav-sync-suggestions.cjs
 *   node automation/ai-live-nav-sync-suggestions.cjs --report
 *
 * Output: automation/reports/live-nav-sync-suggestions-latest.json
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const NAV_AUDIT_PATH = path.join(REPORTS_DIR, 'live-navigation-audit-latest.json');
const OUT_PATH = path.join(REPORTS_DIR, 'live-nav-sync-suggestions-latest.json');

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[LiveNavSync] ${ts} | ${msg}`);
}

function pathToName(href) {
  if (href === '/' || !href) return 'Home';
  const segment = href.replace(/^\//, '').replace(/\/$/, '').split('/').pop();
  return segment
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

function run() {
  if (!fs.existsSync(NAV_AUDIT_PATH)) {
    log('No live-navigation-audit-latest.json found. Run: npm run nav:live-audit');
    const empty = {
      timestamp: new Date().toISOString(),
      message: 'Run npm run nav:live-audit first',
      suggestions: [],
      suggestedAdditions: [],
    };
    if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
    fs.writeFileSync(OUT_PATH, JSON.stringify(empty, null, 2));
    return empty;
  }

  const audit = JSON.parse(fs.readFileSync(NAV_AUDIT_PATH, 'utf8'));
  const liveNotInNav = audit.liveNotInNav || audit.liveNotInNavSample || audit.missingFromApp || [];
  const brokenOnLive = new Set(audit.brokenOnLive || []);
  const navBroken = audit.navBroken || [];

  const suggestions = [];
  const suggestedAdditions = [];

  for (const href of liveNotInNav) {
    const norm = (href || '').replace(/\/$/, '') || '/';
    if (norm === '/' || brokenOnLive.has(norm)) continue;
    const name = pathToName(norm);
    suggestedAdditions.push({ name, href: norm });
  }

  if (navBroken.length > 0) {
    suggestions.push({
      type: 'fix_nav_broken',
      description: `${navBroken.length} nav constant href(s) point to missing pages. Create pages or remove from navigation.`,
      hrefs: navBroken.slice(0, 30),
    });
  }

  if (suggestedAdditions.length > 0) {
    suggestions.push({
      type: 'add_to_nav',
      description: `${suggestedAdditions.length} link(s) on live site are not in nav constants. Consider adding high-value routes to RESOURCE_LINKS or appropriate section.`,
      sample: suggestedAdditions.slice(0, 25),
    });
  }

  const report = {
    timestamp: new Date().toISOString(),
    sourceReport: 'live-navigation-audit-latest.json',
    liveNotInNavCount: audit.liveNotInNavCount ?? suggestedAdditions.length,
    navBrokenCount: audit.navBrokenCount ?? navBroken.length,
    suggestions,
    suggestedAdditions,
  };

  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(report, null, 2));
  log(`Wrote ${OUT_PATH} (${suggestedAdditions.length} suggested additions, ${suggestions.length} suggestion groups)`);
  return report;
}

run();
