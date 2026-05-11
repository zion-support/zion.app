#!/usr/bin/env node

/**
 * AI SEO Content Refresh Agent
 *
 * Identifies high-value stale pages for content refresh.
 * Prioritizes by page type (blog, services, solutions) and staleness.
 * Generates actionable refresh recommendations for SEO improvement.
 *
 * Features:
 * - Uses content freshness data
 * - Prioritizes: blog > services > solutions > platform
 * - Generates refresh report with suggested actions
 * - Integrates with content freshness agent
 *
 * Runs: Weekly Wednesday 5 AM via cron | After content freshness
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const FRESHNESS_FILE = path.join(REPORTS_DIR, 'content-freshness-latest.json');
const REPORT_FILE = path.join(REPORTS_DIR, 'seo-content-refresh-latest.json');

const PRIORITY_WEIGHT = { blog: 4, 'case-study': 3, service: 3, solution: 2, platform: 2, page: 1 };

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[SEOContentRefresh] ${ts} | ${msg}`);
}

function run() {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

  log('Starting SEO content refresh analysis...');

  let freshness = null;
  try {
    if (fs.existsSync(FRESHNESS_FILE)) {
      freshness = JSON.parse(fs.readFileSync(FRESHNESS_FILE, 'utf8'));
    }
  } catch (e) {
    log(`Could not read freshness report: ${e.message}`);
  }

  if (!freshness || !freshness.stale) {
    log('No stale content found. Run content:freshness first.');
    const report = {
      timestamp: new Date().toISOString(),
      status: 'no_stale',
      recommendations: [],
      summary: { total: 0, byType: {} },
    };
    fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
    return report;
  }

  const stale = [...(freshness.stale || []), ...(freshness.warning || []).map((w) => ({ ...w, status: 'warning' }))];
  const recommendations = stale
    .map((item) => ({
      ...item,
      priority: PRIORITY_WEIGHT[item.type] || 1,
      score: (PRIORITY_WEIGHT[item.type] || 1) * (item.monthsOld || 1),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map((r) => ({
      path: r.path,
      type: r.type,
      monthsOld: r.monthsOld,
      action: r.type === 'blog' ? 'Update date, refresh intro, add new section' : 'Refresh copy, update stats, add CTA',
      seoImpact: r.type === 'blog' ? 'high' : r.type === 'service' ? 'high' : 'medium',
    }));

  const byType = {};
  for (const r of recommendations) {
    byType[r.type] = (byType[r.type] || 0) + 1;
  }

  const report = {
    timestamp: new Date().toISOString(),
    status: recommendations.length > 0 ? 'action_needed' : 'ok',
    recommendations,
    summary: {
      total: recommendations.length,
      byType,
      source: 'content-freshness-latest.json',
    },
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Report: ${REPORT_FILE}`);
  log(`Found ${recommendations.length} pages for refresh.`);
  return report;
}

const cmd = process.argv[2] || 'run';
if (cmd === 'run') {
  run();
} else if (cmd === 'summary') {
  let data = {};
  try {
    if (fs.existsSync(REPORT_FILE)) {
      data = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'));
    }
  } catch (e) { /* ignore */ }
  console.log(JSON.stringify(data.summary || {}, null, 2));
} else {
  console.log('Usage: node ai-seo-content-refresh-agent.cjs [run|summary]');
  process.exit(1);
}
