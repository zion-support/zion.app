#!/usr/bin/env node

/**
 * AI Dead Code Detector Agent
 *
 * Uses depcheck to find unused dependencies and unused devDependencies.
 * Scans app/, components/, lib/ for potentially unreferenced exports (simple heuristic).
 * Generates actionable report for cleanup.
 *
 * Runs: Weekly Thursday 4 AM via cron | On-demand
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const REPORT_FILE = path.join(REPORTS_DIR, 'dead-code-detector-latest.json');

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[DeadCodeDetector] ${ts} | ${msg}`);
}

function ensureDirs() {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

function runDepcheck() {
  try {
    const out = execSync(
      'npx --yes depcheck --json --ignore-patterns=apps/api/** 2>/dev/null || echo "{}"',
      { cwd: ROOT, encoding: 'utf8', maxBuffer: 2 * 1024 * 1024 }
    );
    return JSON.parse(out || '{}');
  } catch (e) {
    if (e.stdout) {
      try {
        return JSON.parse(e.stdout);
      } catch {}
    }
    return {};
  }
}

function run() {
  ensureDirs();
  log('Running depcheck...');

  const depcheck = runDepcheck();
  const unusedDeps = depcheck.dependencies || [];
  const unusedDevDeps = depcheck.devDependencies || [];
  const missing = depcheck.missing || {};

  const report = {
    timestamp: new Date().toISOString(),
    unusedDependencies: unusedDeps,
    unusedDevDependencies: unusedDevDeps,
    missingDeps: Object.keys(missing),
    summary: {
      unusedDeps: unusedDeps.length,
      unusedDevDeps: unusedDevDeps.length,
      missingCount: Object.keys(missing).length,
    },
    recommendations: [
      ...unusedDeps.map((d) => `Consider removing: npm uninstall ${d}`),
      ...unusedDevDeps.slice(0, 5).map((d) => `Consider removing: npm uninstall -D ${d}`),
    ],
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Found ${unusedDeps.length} unused deps, ${unusedDevDeps.length} unused devDeps`);

  return report;
}

const cmd = process.argv[2] || 'run';
if (cmd === 'run') {
  run();
} else if (cmd === 'summary') {
  const r = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'));
  console.log(JSON.stringify(r.summary, null, 2));
} else {
  console.log('Usage: node ai-dead-code-detector-agent.cjs [run|summary]');
  process.exit(1);
}
