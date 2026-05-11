#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const WF_DIR = path.join(ROOT, '.github', 'workflows');
const REPORT_DIR = path.join(ROOT, 'automation', 'reports');
const OUT_FILE = path.join(REPORT_DIR, 'github-actions-integrity-audit-latest.json');

function listWorkflowFiles() {
  try {
    return fs
      .readdirSync(WF_DIR)
      .filter((n) => n.endsWith('.yml') || n.endsWith('.yaml'))
      .sort()
      .map((n) => path.join(WF_DIR, n));
  } catch {
    return [];
  }
}

function countJobsWithKey(content, key) {
  const lines = String(content || '').split('\n');
  let jobs = 0;
  let jobsSection = false;
  let hasKeyInCurrentJob = false;
  let missing = 0;
  for (const raw of lines) {
    const line = raw.replace(/\t/g, '    ');
    if (/^jobs:\s*$/.test(line)) {
      jobsSection = true;
      continue;
    }
    if (!jobsSection) continue;
    if (/^[A-Za-z0-9_-]+:\s*$/.test(line.trim()) && /^\s{2}[A-Za-z0-9_-]+:\s*$/.test(line)) {
      if (jobs > 0 && !hasKeyInCurrentJob) missing += 1;
      jobs += 1;
      hasKeyInCurrentJob = false;
      continue;
    }
    if (new RegExp(`^\\s{4}${key}:\\s*$`).test(line) || new RegExp(`^\\s{4}${key}:\\b`).test(line)) {
      hasKeyInCurrentJob = true;
    }
  }
  if (jobs > 0 && !hasKeyInCurrentJob) missing += 1;
  return { jobs, missing };
}

function analyzeWorkflow(file) {
  const content = fs.readFileSync(file, 'utf8');
  const rel = path.relative(ROOT, file);
  const usesLines = String(content).split('\n').filter((l) => l.includes('uses:'));
  const unpinnedActions = usesLines
    .map((l) => l.trim())
    .filter((l) => /uses:\s*[^@\s]+@v?\d/.test(l) && !/#\s*v/.test(l));
  const hasPermissions = /^\s*permissions:\s*$/m.test(content);
  const hasTopTimeout = /^\s*timeout-minutes:\s*\d+/m.test(content);
  const timeoutStats = countJobsWithKey(content, 'timeout-minutes');

  return {
    file: rel,
    checks: {
      hasPermissions,
      unpinnedActionsCount: unpinnedActions.length,
      hasAnyTimeout: hasTopTimeout || timeoutStats.jobs === 0 || timeoutStats.missing < timeoutStats.jobs,
      missingJobTimeouts: timeoutStats.missing,
    },
    warnings: [
      ...(!hasPermissions ? ['missing permissions block'] : []),
      ...(unpinnedActions.length ? [`unpinned action refs (${unpinnedActions.length})`] : []),
      ...(timeoutStats.missing > 0 ? [`jobs missing timeout-minutes (${timeoutStats.missing})`] : []),
    ],
  };
}

function escalateIfNeeded(summary) {
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  if (!token) return;
  if (summary.criticalCount <= 0) return;
  const bodyFile = path.join(REPORT_DIR, 'github-actions-integrity-incident.md');
  const md = [
    '## GitHub Actions integrity audit regression',
    '',
    `- **Critical findings:** ${summary.criticalCount}`,
    `- **Warning findings:** ${summary.warningCount}`,
    `- **Generated at:** ${summary.generatedAt}`,
    '',
    'See `automation/reports/github-actions-integrity-audit-latest.json` for details.',
    '',
  ].join('\n');
  fs.writeFileSync(bodyFile, md, 'utf8');
  process.env.ISSUE_TITLE = `GitHub Actions integrity regressions detected (${summary.criticalCount})`;
  process.env.ISSUE_FINGERPRINT = 'github-actions-integrity-regression';
  process.env.ISSUE_LABELS = 'automation,ci';
  process.env.ISSUE_BODY_FILE = bodyFile;
  spawnSync('node', ['scripts/automation/gh-issue-dedupe-or-create.cjs'], {
    encoding: 'utf8',
    cwd: ROOT,
    env: process.env,
  });
}

function main() {
  const files = listWorkflowFiles();
  const results = files.map(analyzeWorkflow);
  const summary = {
    generatedAt: new Date().toISOString(),
    totalWorkflows: results.length,
    warningCount: 0,
    criticalCount: 0,
    totals: {
      missingPermissions: 0,
      unpinnedActions: 0,
      missingJobTimeouts: 0,
    },
  };
  for (const r of results) {
    summary.totals.missingPermissions += r.checks.hasPermissions ? 0 : 1;
    summary.totals.unpinnedActions += r.checks.unpinnedActionsCount;
    summary.totals.missingJobTimeouts += r.checks.missingJobTimeouts;
    if (!r.checks.hasPermissions || r.checks.unpinnedActionsCount > 0) summary.criticalCount += 1;
    else if (r.checks.missingJobTimeouts > 0) summary.warningCount += 1;
  }

  const out = { summary, workflows: results };
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, `${JSON.stringify(out, null, 2)}\n`, 'utf8');
  console.log('[github-actions-integrity-auditor] wrote', path.relative(ROOT, OUT_FILE));
  escalateIfNeeded(summary);
}

main();
