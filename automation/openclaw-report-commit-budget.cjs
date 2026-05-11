#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Blocks report-only commits unless drift/incident/coalesce thresholds allow (reduces telemetry churn).
 * Set REPORT_COMMIT_ALLOW=1 to bypass. Set REPORT_BUDGET_DISABLED=1 to always pass.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const OUTPUT = path.join(REPORTS, 'openclaw-report-commit-budget-latest.json');

const REPORT_PATH_RE = /^automation\/reports\/.*\.json$/;

function readJson(p, fallback) {
  try {
    if (!fs.existsSync(p)) return fallback;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return fallback;
  }
}

function gitStagedFiles() {
  try {
    const out = execSync('git diff --cached --name-only', { cwd: ROOT, encoding: 'utf8' });
    return out
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function main() {
  if (process.env.REPORT_BUDGET_DISABLED === '1') {
    console.log('Report commit budget disabled via env; allowing.');
    process.exit(0);
  }
  if (process.env.REPORT_COMMIT_ALLOW === '1') {
    console.log('Report commit explicitly allowed via REPORT_COMMIT_ALLOW=1.');
    process.exit(0);
  }

  const staged = gitStagedFiles();
  if (staged.length === 0) {
    console.log('No staged files; budget check passes.');
    process.exit(0);
  }

  const allReports = staged.every((f) => REPORT_PATH_RE.test(f.replace(/\\/g, '/')));
  if (!allReports) {
    console.log('Staged changes include non-report paths; budget check passes.');
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
    stagedOnlyReports: true,
    stagedFiles: staged,
    allowed,
    allowReasons,
    thresholds: { coalesceMin },
  };
  if (!fs.existsSync(REPORTS)) fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(payload, null, 2));

  if (!allowed) {
    console.error(
      'Report commit budget: blocked report-only commit (no drift/incident/coalesce signal). ' +
        'Include non-report changes, set REPORT_COMMIT_ALLOW=1, or satisfy thresholds. See:',
      OUTPUT,
    );
    process.exit(1);
  }
  console.log('Report commit budget: allowed.', allowReasons.join(', '));
}

main();
