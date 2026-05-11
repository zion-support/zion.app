#!/usr/bin/env node

/**
 * AI Project Improvement Radar
 *
 * Lightweight health pass for PM2: runs lint + type-check (+ optional tests), writes a JSON
 * report for dashboards and other automations. Does not modify source by default.
 *
 * Env:
 *   CONTINUOUS_MODE=true
 *   INTERVAL_MINUTES=120
 *   RUN_TESTS=1           — Also run npm run test:ci (slower)
 *   RUN_BUILD=1           — Also run npm run build (heavy; off by default)
 *
 * Run: node automation/ai-project-improvement-radar-agent.cjs
 *      npm run project:improvement-radar
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORT_PATH = path.join(ROOT, 'automation', 'reports', 'project-improvement-radar-latest.json');
const CONTINUOUS = process.env.CONTINUOUS_MODE === 'true' || process.env.CONTINUOUS_MODE === '1';
const INTERVAL_MINUTES = Math.max(30, parseInt(process.env.INTERVAL_MINUTES || '120', 10));
const RUN_TESTS = process.env.RUN_TESTS === '1';
const RUN_BUILD = process.env.RUN_BUILD === '1';

function log(msg) {
  console.log(`[ProjectRadar] ${new Date().toISOString()} | ${msg}`);
}

function runStep(label, cmd) {
  const started = Date.now();
  try {
    execSync(cmd, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 12 * 1024 * 1024,
    });
    return { ok: true, ms: Date.now() - started, label };
  } catch (e) {
    const stderr = (e.stderr && e.stderr.toString()) || e.message || 'error';
    const tail = stderr.split('\n').slice(-40).join('\n');
    return { ok: false, ms: Date.now() - started, label, tail };
  }
}

function runOnce() {
  const dir = path.dirname(REPORT_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const steps = [];
  steps.push(runStep('lint:check', 'npm run lint:check'));
  steps.push(runStep('type-check', 'npm run type-check'));
  if (RUN_TESTS) steps.push(runStep('test:ci', 'npm run test:ci'));
  if (RUN_BUILD) steps.push(runStep('build', 'npm run build'));

  const failed = steps.filter((s) => !s.ok).map((s) => s.label);
  const report = {
    at: new Date().toISOString(),
    ok: failed.length === 0,
    failedSteps: failed,
    steps: steps.map((s) => ({ label: s.label, ok: s.ok, ms: s.ms, tail: s.tail || undefined })),
    runTests: RUN_TESTS,
    runBuild: RUN_BUILD,
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  log(`Report → ${REPORT_PATH} | ok=${report.ok}`);
  if (!report.ok) {
    log(`Failed: ${failed.join(', ')}`);
  }
  return report;
}

async function main() {
  if (CONTINUOUS) {
    log(`Continuous: every ${INTERVAL_MINUTES}m (RUN_TESTS=${RUN_TESTS} RUN_BUILD=${RUN_BUILD})`);
    for (;;) {
      runOnce();
      await new Promise((r) => setTimeout(r, INTERVAL_MINUTES * 60 * 1000));
    }
  }
  const r = runOnce();
  process.exit(r.ok ? 0 : 1);
}

main().catch((e) => {
  log(`Fatal: ${e.message}`);
  process.exit(1);
});
