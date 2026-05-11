#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * PR-mode report budget: if *all changed files vs base* are automation/reports/*.json,
 * apply the same allow rules as openclaw-report-commit-budget.cjs (for bots/CI).
 *
 * Env:
 *   PR_BUDGET_BASE — ref to diff against (default origin/main), e.g. origin/main
 *   REPORT_COMMIT_ALLOW, REPORT_BUDGET_DISABLED — same as commit budget
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const OUTPUT = path.join(REPORTS, 'openclaw-report-commit-budget-pr-latest.json');

const REPORT_PATH_RE = /^automation\/reports\/.*\.json$/;

function readJson(p, fallback) {
  try {
    if (!fs.existsSync(p)) return fallback;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return fallback;
  }
}

function changedFilesVsBase(baseRef) {
  try {
    const out = execSync(`git diff --name-only ${baseRef}...HEAD`, {
      cwd: ROOT,
      encoding: 'utf8',
    });
    return out
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  } catch (e) {
    console.warn('openclaw PR report budget: git diff failed:', e.message);
    return null;
  }
}

function main() {
  if (process.env.REPORT_BUDGET_DISABLED === '1') {
    console.log('PR report budget disabled; allowing.');
    process.exit(0);
  }
  if (process.env.REPORT_COMMIT_ALLOW === '1') {
    console.log('PR report budget: REPORT_COMMIT_ALLOW=1');
    process.exit(0);
  }

  const base = process.env.PR_BUDGET_BASE || 'origin/main';
  const changed = changedFilesVsBase(base);
  if (changed === null) {
    process.exit(0);
  }
  if (changed.length === 0) {
    console.log('PR report budget: no changed files vs base; pass.');
    process.exit(0);
  }

  const allReports = changed.every((f) => REPORT_PATH_RE.test(f.replace(/\\/g, '/')));
  if (!allReports) {
    console.log('PR report budget: non-report paths in PR; pass.');
    process.exit(0);
  }

  const regression = readJson(path.join(REPORTS, 'openclaw-regression-memory-latest.json'), {});
  const gate = readJson(path.join(REPORTS, 'openclaw-deploy-confidence-gate-latest.json'), {});
  const coalesce = readJson(path.join(REPORTS, 'report-write-coalescer-latest.json'), {});

  const incidents = Array.isArray(regression.incidents) ? regression.incidents.length : 0;
  const holdDeploy = gate.decision === 'hold_deploy';
  const coalesced = Number(coalesce.coalescedCount || 0);
  const coalesceMin = Number.parseInt(process.env.REPORT_BUDGET_COALESCE_MIN || '3', 10);

  const allowReasons = [];
  if (incidents > 0) allowReasons.push(`regression_incidents(${incidents})`);
  if (holdDeploy) allowReasons.push('deploy_gate_hold');
  if (coalesced >= coalesceMin) allowReasons.push(`coalesce_churn(${coalesced}>=${coalesceMin})`);

  const allowed = allowReasons.length > 0;
  const payload = {
    generatedAt: new Date().toISOString(),
    mode: 'pr',
    baseRef: base,
    prOnlyReports: true,
    changedFiles: changed,
    allowed,
    allowReasons,
    thresholds: { coalesceMin },
  };
  if (!fs.existsSync(REPORTS)) fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(payload, null, 2));

  if (!allowed) {
    console.error(
      'PR report budget: blocked report-only PR (no drift/incident/coalesce signal). ' +
        'Add non-report changes, set REPORT_COMMIT_ALLOW=1, or satisfy thresholds. See:',
      OUTPUT,
    );
    process.exit(1);
  }
  console.log('PR report budget: allowed.', allowReasons.join(', '));
}

main();
