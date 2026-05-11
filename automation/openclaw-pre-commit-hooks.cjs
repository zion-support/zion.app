#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Cross-platform pre-commit entry: report budget + optional patch-router refresh.
 * Env: PATCH_ROUTER_AUTO_REFRESH=1 to regenerate conflict predictor + router when stale vs merge ledger.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const REPORTS = path.join(ROOT, 'automation', 'reports');
const PRED = path.join(REPORTS, 'openclaw-conflict-predictor-latest.json');
const LEDGER = path.join(REPORTS, 'merge-ledger-latest.json');

function run(label, cmd) {
  console.log(`openclaw pre-commit: ${label}`);
  execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
}

function readGeneratedAt(file) {
  try {
    const j = JSON.parse(fs.readFileSync(file, 'utf8'));
    return typeof j.generatedAt === 'string' ? j.generatedAt : null;
  } catch {
    return null;
  }
}

function maybeRefreshPatchRouter() {
  if (process.env.PATCH_ROUTER_AUTO_REFRESH !== '1') return;
  const p = readGeneratedAt(PRED);
  const l = readGeneratedAt(LEDGER);
  const stale = !p || (l && p < l);
  if (!stale) {
    console.log('openclaw pre-commit: patch router snapshot is fresh vs merge ledger.');
    return;
  }
  run('refresh conflict predictor (stale vs merge ledger)', 'node automation/openclaw-conflict-predictor.cjs');
  run('refresh hot-file patch router', 'node automation/openclaw-hot-file-patch-router.cjs');
}

function main() {
  run('merge conflict markers', 'node scripts/automation/check-merge-conflict-markers.cjs');
  run('report commit budget', 'node automation/openclaw-report-commit-budget.cjs');
  maybeRefreshPatchRouter();
}

main();
