#!/usr/bin/env node

/**
 * AI Performance Regression Agent
 *
 * Tracks Lighthouse scores over time and detects performance regressions.
 * Reads lighthouse-production-latest.json, appends to history, compares with previous.
 *
 * Outputs:
 *   automation/reports/performance-regression-latest.json
 *   automation/data/lighthouse-performance-history.json (last 30 entries)
 *
 * Run: npm run perf:regression
 * Env: REGRESSION_THRESHOLD (default 10) - score drop % to flag
 *      MAX_HISTORY (default 30) - entries to keep
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const DATA_DIR = path.join(ROOT, 'automation', 'data');
const LIGHTHOUSE_LATEST = path.join(REPORTS_DIR, 'lighthouse-production-latest.json');
const HISTORY_FILE = path.join(DATA_DIR, 'lighthouse-performance-history.json');
const REPORT_FILE = path.join(REPORTS_DIR, 'performance-regression-latest.json');

const REGRESSION_THRESHOLD = parseInt(process.env.REGRESSION_THRESHOLD || '10', 10);
const MAX_HISTORY = parseInt(process.env.MAX_HISTORY || '30', 10);

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[PerfRegression] ${ts} | ${msg}`);
}

function readJsonSafe(p, def = null) {
  try {
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    log(`Could not read ${p}: ${e.message}`);
  }
  return def;
}

function run() {
  [REPORTS_DIR, DATA_DIR].forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  log('Checking for Lighthouse report...');
  const latest = readJsonSafe(LIGHTHOUSE_LATEST);
  if (!latest || !latest.scores) {
    log('No Lighthouse report found. Run lighthouse:production first.');
    const report = {
      timestamp: new Date().toISOString(),
      ok: false,
      reason: 'no_lighthouse_report',
      message: 'Run npm run lighthouse:production first',
    };
    fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
    return report;
  }

  const entry = {
    timestamp: latest.timestamp || new Date().toISOString(),
    url: latest.url || 'https://ziontechgroup.com',
    scores: latest.scores,
  };

  let history = readJsonSafe(HISTORY_FILE, { entries: [] });
  if (!Array.isArray(history.entries)) history.entries = [];
  const prev = history.entries[history.entries.length - 1];
  history.entries.push(entry);
  if (history.entries.length > MAX_HISTORY) {
    history.entries = history.entries.slice(-MAX_HISTORY);
  }
  history.updatedAt = new Date().toISOString();
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));

  const regressions = [];
  if (prev && prev.scores) {
    for (const [key, val] of Object.entries(entry.scores)) {
      const prevVal = prev.scores[key];
      if (typeof prevVal === 'number' && typeof val === 'number' && prevVal > val) {
        const drop = prevVal - val;
        if (drop >= REGRESSION_THRESHOLD) {
          regressions.push({
            category: key,
            previous: prevVal,
            current: val,
            drop,
            threshold: REGRESSION_THRESHOLD,
          });
        }
      }
    }
  }

  const report = {
    timestamp: new Date().toISOString(),
    ok: regressions.length === 0,
    url: entry.url,
    currentScores: entry.scores,
    previousScores: prev?.scores || null,
    regressions,
    regressionThreshold: REGRESSION_THRESHOLD,
    historyCount: history.entries.length,
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`History: ${history.entries.length} entries`);
  if (regressions.length > 0) {
    log(`Regressions: ${regressions.map((r) => `${r.category} ${r.previous}→${r.current} (-${r.drop})`).join(', ')}`);
  } else {
    log('No regressions detected.');
  }
  return report;
}

const cmd = process.argv[2] || 'run';
if (cmd === 'run') {
  const report = run();
  // Exit 0 when run succeeded; regressions are reported, not fatal
  process.exit(0);
} else if (cmd === 'summary') {
  try {
    const data = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'));
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.log('No report found. Run with "run" first.');
  }
} else {
  console.log('Usage: node ai-performance-regression-agent.cjs [run|summary]');
  process.exit(1);
}
