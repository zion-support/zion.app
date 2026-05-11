#!/usr/bin/env node

/**
 * AI Code Hygiene Agent
 *
 * Proactive daily agent that runs lint:fix and type-check, then commits
 * auto-fixable changes. Catches issues before they reach CI.
 * Complements ai-ci-failure-recovery-agent (which runs on CI failure).
 *
 * Features:
 * - Runs npm run lint:fix
 * - Runs npm run type-check (reports only; TS errors need manual fix)
 * - Commits only when lint:fix made changes (AUTO_COMMIT=1)
 * - Generates hygiene report
 *
 * Runs: Daily 5:30 AM via cron (before daily pipeline at 6 AM)
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const REPORT_FILE = path.join(REPORTS_DIR, 'code-hygiene-latest.json');
const AUTO_COMMIT = process.env.AUTO_COMMIT === '1';
const DRY_RUN = process.env.DRY_RUN === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[CodeHygiene] ${ts} | ${msg}`);
}

function runCmd(cmd, opts = {}) {
  try {
    const result = spawnSync(cmd, { shell: true, cwd: ROOT, encoding: 'utf8', ...opts });
    return { ok: result.status === 0, stdout: result.stdout || '', stderr: result.stderr || '', code: result.status };
  } catch (e) {
    return { ok: false, stdout: '', stderr: e.message, code: -1 };
  }
}

function hasStagedChanges() {
  const r = runCmd('git diff --staged --quiet 2>/dev/null');
  return !r.ok;
}

function hasUnstagedChanges() {
  const r = runCmd('git status --porcelain');
  return r.stdout.trim().length > 0;
}

function run() {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

  log('=== Code Hygiene Agent Started ===');
  const report = {
    timestamp: new Date().toISOString(),
    steps: [],
    lintFixed: false,
    typeOk: false,
    committed: false,
    status: 'unknown',
  };

  // 1. Lint fix
  log('Running lint:fix...');
  const beforeLint = hasUnstagedChanges();
  const lintResult = runCmd('npm run lint:fix');
  const afterLint = hasUnstagedChanges();
  report.steps.push({ name: 'lint:fix', ok: lintResult.ok, code: lintResult.code });
  report.lintFixed = lintResult.ok && beforeLint !== afterLint;
  if (lintResult.ok) {
    log(report.lintFixed ? 'Lint fix made changes.' : 'Lint fix completed (no changes).');
  } else {
    log(`Lint fix failed: ${lintResult.stderr.slice(0, 200)}`);
  }

  // 2. Type check
  log('Running type-check...');
  const typeResult = runCmd('npm run type-check');
  report.steps.push({ name: 'type-check', ok: typeResult.ok, code: typeResult.code });
  report.typeOk = typeResult.ok;
  if (!typeResult.ok) {
    log(`Type check failed: ${typeResult.stderr.slice(0, 200)}`);
  }

  report.status = report.typeOk ? (report.lintFixed ? 'fixed' : 'clean') : 'needs_manual';

  // Commit only if lint made changes and type-check passes
  if (report.lintFixed && report.typeOk && AUTO_COMMIT && !DRY_RUN) {
    const status = runCmd('git status --porcelain');
    if (status.stdout.trim()) {
      log('Committing lint fixes...');
      runCmd('git add -A');
      runCmd('git diff --staged --quiet || git commit -m "chore: code hygiene - lint fixes"');
      const pushResult = runCmd('git push origin HEAD 2>/dev/null || true');
      report.committed = pushResult.ok;
      log(report.committed ? 'Changes committed and pushed.' : 'Commit done, push may need manual run.');
    }
  }

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Report: ${REPORT_FILE}`);
  log(`Status: ${report.status}`);
  log('=== Code Hygiene Agent Finished ===');
  return report;
}

const cmd = process.argv[2] || 'run';
if (cmd === 'run') {
  run();
} else {
  console.log('Usage: node ai-code-hygiene-agent.cjs [run]');
  console.log('Env: AUTO_COMMIT=1 to commit lint fixes, DRY_RUN=1 to skip commits');
  process.exit(1);
}
