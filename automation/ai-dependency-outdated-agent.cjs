#!/usr/bin/env node

/**
 * AI Dependency Outdated Agent
 *
 * Runs npm outdated and generates a report of available updates.
 * Categorizes by major/minor/patch for safe automation decisions.
 * Complements ai-smart-dependency-manager (heavier) with lightweight checks.
 *
 * Runs: Weekly Thursday 5 AM via cron | On-demand
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const REPORT_FILE = path.join(REPORTS_DIR, 'dependency-outdated-latest.json');
const DATA_DIR = path.join(ROOT, 'automation', 'data');
const HISTORY_FILE = path.join(DATA_DIR, 'dependency-outdated-history.json');

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[DependencyOutdated] ${ts} | ${msg}`);
}

function ensureDirs() {
  [REPORTS_DIR, DATA_DIR].forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });
}

function parseOutdated() {
  try {
    const out = execSync('npm outdated --json 2>/dev/null || true', {
      cwd: ROOT,
      encoding: 'utf8',
      maxBuffer: 2 * 1024 * 1024,
    });
    if (!out.trim()) return {};
    return JSON.parse(out);
  } catch (e) {
    if (e.stdout) {
      try {
        return JSON.parse(e.stdout);
      } catch {}
    }
    return {};
  }
}

function categorize(pkg, data) {
  const { current, wanted, latest } = data;
  const cur = (current || '0.0.0').split('.').map(Number);
  const lat = (latest || wanted || current || '0.0.0').split('.').map(Number);
  if (cur[0] !== lat[0]) return 'major';
  if (cur[1] !== lat[1]) return 'minor';
  if (cur[2] !== lat[2]) return 'patch';
  return 'none';
}

function run() {
  ensureDirs();
  log('Checking npm outdated...');

  const raw = parseOutdated();
  const packages = Object.entries(raw).map(([name, data]) => {
    const type = categorize(name, data);
    return {
      name,
      current: data.current,
      wanted: data.wanted,
      latest: data.latest,
      type,
    };
  });

  const byType = {
    major: packages.filter((p) => p.type === 'major'),
    minor: packages.filter((p) => p.type === 'minor'),
    patch: packages.filter((p) => p.type === 'patch'),
  };

  const report = {
    timestamp: new Date().toISOString(),
    total: packages.length,
    byType: {
      major: byType.major.length,
      minor: byType.minor.length,
      patch: byType.patch.length,
    },
    packages,
    safeRecommendations: [
      ...byType.patch.map((p) => `npm update ${p.name}`),
      ...byType.minor.map((p) => `npm update ${p.name}`),
    ],
    manualReview: byType.major.map((p) => p.name),
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Found ${packages.length} outdated packages: ${byType.major.length} major, ${byType.minor.length} minor, ${byType.patch.length} patch`);

  // Append to history (keep last 30 entries)
  let history = [];
  if (fs.existsSync(HISTORY_FILE)) {
    try {
      history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    } catch {}
  }
  history.push({
    timestamp: report.timestamp,
    total: report.total,
    byType: report.byType,
  });
  if (history.length > 30) history = history.slice(-30);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));

  return report;
}

const cmd = process.argv[2] || 'run';
if (cmd === 'run') {
  run();
} else if (cmd === 'summary') {
  const r = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'));
  console.log(JSON.stringify({ total: r.total, byType: r.byType }, null, 2));
} else {
  console.log('Usage: node ai-dependency-outdated-agent.cjs [run|summary]');
  process.exit(1);
}
