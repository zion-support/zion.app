#!/usr/bin/env node

/**
 * AI CI Failure Recovery Agent
 *
 * Diagnoses CI failures and attempts automated recovery.
 * Runs lint fix, type-check, and reports actionable fixes.
 * Can be triggered by GitHub Actions when CI fails on main.
 *
 * Features:
 * - Runs npm run lint:fix
 * - Runs npm run type-check (reports errors)
 * - Runs npm run test:ci (reports failures)
 * - Generates recovery report with next steps
 * - Optionally commits fixes when AUTO_COMMIT=1
 *
 * Runs: On-demand | workflow_dispatch | After CI failure
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const REPORT_FILE = path.join(REPORTS_DIR, 'ci-recovery-latest.json');
const AUTO_COMMIT = process.env.AUTO_COMMIT === '1';
const DRY_RUN = process.env.DRY_RUN === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[CIRecovery] ${ts} | ${msg}`);
}

function runCmd(cmd, opts = {}) {
  try {
    const result = spawnSync(cmd, { shell: true, cwd: ROOT, encoding: 'utf8', ...opts });
    return { ok: result.status === 0, stdout: result.stdout || '', stderr: result.stderr || '', code: result.status };
  } catch (e) {
    return { ok: false, stdout: '', stderr: e.message, code: -1 };
  }
}

function run() {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

  log('=== CI Failure Recovery Started ===');
  const report = {
    timestamp: new Date().toISOString(),
    steps: [],
    fixes: [],
    status: 'unknown',
    autoCommit: AUTO_COMMIT,
  };

  // 1. Lint fix
  log('Running lint:fix...');
  const lintResult = runCmd('npm run lint:fix');
  report.steps.push({ name: 'lint:fix', ok: lintResult.ok, code: lintResult.code });
  if (lintResult.ok) {
    log('Lint fix completed.');
  } else {
    report.fixes.push({ type: 'lint', action: 'Run npm run lint:fix manually' });
    log(`Lint fix failed: ${lintResult.stderr.slice(0, 200)}`);
  }

  // 2. Type check
  log('Running type-check...');
  const typeResult = runCmd('npm run type-check');
  report.steps.push({ name: 'type-check', ok: typeResult.ok, code: typeResult.code });
  if (!typeResult.ok) {
    report.fixes.push({
      type: 'type',
      action: 'Fix TypeScript errors',
      hint: typeResult.stderr.slice(0, 500),
    });
    log(`Type check failed: ${typeResult.stderr.slice(0, 200)}`);
  }

  // 3. Tests
  log('Running test:ci...');
  const testResult = runCmd('npm run test:ci');
  report.steps.push({ name: 'test:ci', ok: testResult.ok, code: testResult.code });
  if (!testResult.ok) {
    report.fixes.push({
      type: 'test',
      action: 'Fix failing tests',
      hint: testResult.stderr.slice(0, 500),
    });
    log(`Tests failed: ${testResult.stderr.slice(0, 200)}`);
  }

  // 4. Build (optional, can be slow)
  const skipBuild = process.env.SKIP_BUILD === '1';
  if (!skipBuild && report.steps.every((s) => s.ok)) {
    log('Running build...');
    const buildResult = runCmd('npm run build');
    report.steps.push({ name: 'build', ok: buildResult.ok, code: buildResult.code });
    if (!buildResult.ok) {
      report.fixes.push({ type: 'build', action: 'Fix build errors', hint: buildResult.stderr.slice(0, 500) });
    }
  }

  const allOk = report.steps.every((s) => s.ok);
  report.status = allOk ? 'recovered' : 'needs_manual';

  if (allOk && AUTO_COMMIT && !DRY_RUN) {
    log('All checks passed. Committing fixes...');
    const gitStatus = runCmd('git status --porcelain');
    if (gitStatus.stdout.trim()) {
      runCmd('git add -A');
      runCmd('git commit -m "fix: CI recovery - lint and type fixes"');
      runCmd('git push origin HEAD 2>/dev/null || true');
      report.autoCommitted = true;
    }
  }

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Report: ${REPORT_FILE}`);
  log(`Status: ${report.status}`);
  log('=== CI Failure Recovery Finished ===');
  return report;
}

const cmd = process.argv[2] || 'run';
if (cmd === 'run') {
  run();
} else {
  console.log('Usage: node ai-ci-failure-recovery-agent.cjs [run]');
  console.log('Env: AUTO_COMMIT=1 to commit fixes, SKIP_BUILD=1 to skip build, DRY_RUN=1 to skip commits');
  process.exit(1);
}
