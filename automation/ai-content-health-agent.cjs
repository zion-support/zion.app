#!/usr/bin/env node

/**
 * AI Content Health Agent
 *
 * Aggregates content health checks: freshness, site links, and metadata.
 * Runs content freshness scan and optionally site link audit.
 * No LLM required.
 *
 * Output: automation/reports/content-health-latest.json
 *
 * Runs: Weekly via automation improvements or standalone
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const REPORT_FILE = path.join(REPORTS_DIR, 'content-health-latest.json');

const SKIP_SITE_LINKS = process.env.SKIP_SITE_LINKS === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[ContentHealth] ${ts} | ${msg}`);
}

function run(cmd) {
  try {
    execSync(cmd, { cwd: ROOT, stdio: 'pipe' });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function readJsonSafe(filePath, def = null) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (_) {}
  return def;
}

function main() {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  log('Running content health checks...');

  run('node automation/ai-content-freshness-agent.cjs');
  const freshness = readJsonSafe(path.join(REPORTS_DIR, 'content-freshness-latest.json'));

  let siteLinks = null;
  if (!SKIP_SITE_LINKS) {
    run('node automation/ai-site-link-audit-automation.cjs audit');
    siteLinks = readJsonSafe(path.join(REPORTS_DIR, 'site-link-audit-latest.json'));
  }

  const report = {
    timestamp: new Date().toISOString(),
    freshness: freshness
      ? {
          staleCount: freshness.stale?.length ?? 0,
          warnCount: freshness.warn?.length ?? 0,
          totalScanned: freshness.totalScanned ?? 0,
        }
      : null,
    siteLinks: siteLinks
      ? {
          total: siteLinks.totalLinks ?? siteLinks.total ?? 0,
          ok: siteLinks.ok ?? 0,
          broken: siteLinks.broken ?? siteLinks.brokenLinks ?? 0,
        }
      : null,
    summary: {
      healthy: true,
      issues: [],
    },
  };

  if (report.freshness && (report.freshness.staleCount > 0 || report.freshness.warnCount > 0)) {
    report.summary.healthy = false;
    report.summary.issues.push(
      `Stale content: ${report.freshness.staleCount} stale, ${report.freshness.warnCount} warning`
    );
  }
  if (report.siteLinks && report.siteLinks.broken > 0) {
    report.summary.healthy = false;
    report.summary.issues.push(`Broken links: ${report.siteLinks.broken}`);
  }

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Report: ${REPORT_FILE}`);
  log(`Healthy: ${report.summary.healthy} | Issues: ${report.summary.issues.length}`);

  process.exit(0);
}

main();
