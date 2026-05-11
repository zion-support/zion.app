#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Escalate aggregate regression alerts to a deduped GitHub issue.
 * Reads automation/reports/aggregate-dashboard-regression-latest.json.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const REPORT = path.join(ROOT, 'automation', 'reports', 'aggregate-dashboard-regression-latest.json');
const FP = process.env.ISSUE_FINGERPRINT || 'aggregate-dashboard-regression';

function main() {
  if (!fs.existsSync(REPORT)) {
    console.log('[aggregate-regression-escalate] No report; skip.');
    process.exit(0);
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(REPORT, 'utf8'));
  } catch {
    console.warn('[aggregate-regression-escalate] Invalid report JSON; skip.');
    process.exit(0);
  }

  const alertCount = Number(data.alertCount || 0);
  if (alertCount <= 0) {
    console.log('[aggregate-regression-escalate] No alerts; skip.');
    process.exit(0);
  }

  const bodyPath = path.join(ROOT, 'aggregate-regression-alert.md');
  const lines = [
    '## Aggregate dashboard regression detected',
    '',
    `- **Dedupe key:** \`${FP}\``,
    `- **Alert count:** ${alertCount}`,
    `- **Summary status:** ${data.summaryStatus || 'unknown'}`,
    '',
    '```json',
    JSON.stringify(data, null, 2).slice(0, 12000),
    '```',
  ];
  fs.writeFileSync(bodyPath, lines.join('\n'));

  process.env.ISSUE_TITLE = process.env.ISSUE_TITLE || 'Aggregate dashboard regression detected';
  process.env.ISSUE_FINGERPRINT = FP;
  process.env.ISSUE_LABELS = process.env.ISSUE_LABELS || 'bug,automation';
  process.env.ISSUE_BODY_FILE = bodyPath;

  const script = path.join(ROOT, 'scripts', 'automation', 'gh-issue-dedupe-or-create.cjs');
  const r = spawnSync(process.execPath, [script], { cwd: ROOT, stdio: 'inherit', env: process.env });
  if (r.status !== 0) {
    console.warn('[aggregate-regression-escalate] dedupe helper failed (non-fatal).');
  }
  process.exit(0);
}

main();
