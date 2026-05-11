#!/usr/bin/env node

/**
 * AI Live Site Accessibility Audit Agent
 *
 * Runs axe-core against live ziontechgroup.com for accessibility compliance.
 * Audits homepage and key pages, stores violations in report.
 *
 * Outputs:
 *   automation/reports/live-site-accessibility-audit-latest.json
 *
 * Run: npm run a11y:live
 * Env: A11Y_URL (default https://ziontechgroup.com)
 *      A11Y_PAGES - comma-separated paths to audit (default: /, /contact, /services, /solutions, /about)
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const BASE_URL = process.env.A11Y_URL || 'https://ziontechgroup.com';
const PAGES_STR = process.env.A11Y_PAGES || '/,/contact,/services,/solutions,/about';
const PAGES = PAGES_STR.split(',').map((p) => p.trim()).filter(Boolean);
const REPORT_FILE = path.join(REPORTS_DIR, 'live-site-accessibility-audit-latest.json');
const TIMEOUT_MS = 60000;

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[LiveA11y] ${ts} | ${msg}`);
}

function auditPage(url) {
  const outDir = path.join(REPORTS_DIR, 'a11y-temp');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `a11y-${Date.now()}.json`);
  const result = spawnSync(
    'npx',
    [
      '@axe-core/cli',
      url,
      '--save',
      outFile,
      '--no-reporter',
      '--chrome-options=--headless --no-sandbox --disable-dev-shm-usage',
    ],
    { cwd: ROOT, encoding: 'utf8', timeout: TIMEOUT_MS }
  );
  if (fs.existsSync(outFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(outFile, 'utf8'));
      try {
        fs.unlinkSync(outFile);
      } catch (_) {}
      const violations = data.violations || [];
      return { url, ok: violations.length === 0, violations, passes: data.passes || [] };
    } catch (e) {
      return { url, ok: false, violations: [], passes: [], error: e.message };
    }
  }
  return { url, ok: false, violations: [], passes: [], error: result.stderr || result.error || 'No output file' };
}

function run() {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

  log(`Auditing ${PAGES.length} pages on ${BASE_URL}...`);
  const results = [];
  let totalViolations = 0;

  for (const pagePath of PAGES) {
    const url = pagePath.startsWith('http') ? pagePath : `${BASE_URL}${pagePath.startsWith('/') ? '' : '/'}${pagePath}`;
    log(`  ${url}`);
    const result = auditPage(url);
    const violationCount = (result.violations || []).length;
    totalViolations += violationCount;
    results.push({
      url: result.url,
      path: pagePath,
      violations: violationCount,
      details: (result.violations || []).map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: (v.nodes || []).length,
      })),
      error: result.error || null,
    });
  }

  const report = {
    timestamp: new Date().toISOString(),
    url: BASE_URL,
    pagesAudited: PAGES.length,
    totalViolations,
    passed: totalViolations === 0,
    results,
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Total violations: ${totalViolations}`);
  log(`Report: ${REPORT_FILE}`);
  return report;
}

const cmd = process.argv[2] || 'run';
if (cmd === 'run') {
  try {
    const report = run();
    // Exit 0 when audit completed; violations are reported, not fatal
    process.exit(0);
  } catch (e) {
    log(`Fatal: ${e.message}`);
    fs.writeFileSync(
      REPORT_FILE,
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          ok: false,
          error: e.message,
          passed: false,
        },
        null,
        2
      )
    );
    process.exit(1);
  }
} else if (cmd === 'summary') {
  try {
    const data = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'));
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.log('No report found. Run with "run" first.');
  }
} else {
  console.log('Usage: node ai-live-site-accessibility-audit-agent.cjs [run|summary]');
  process.exit(1);
}
