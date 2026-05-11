#!/usr/bin/env node
/**
 * Fails CI when aggregate dashboard reports openclaw_runner_failure.
 *
 * Env:
 *   AGGREGATE_JSON — path (default: automation/reports/aggregate-dashboard.json)
 */

const fs = require('fs');
const path = require('path');

const p =
  process.env.AGGREGATE_JSON ||
  path.join(process.cwd(), 'automation', 'reports', 'aggregate-dashboard.json');

let payload;
try {
  payload = JSON.parse(fs.readFileSync(p, 'utf8'));
} catch (e) {
  console.error(`check-aggregate-openclaw-runner: cannot read ${p}:`, e.message);
  process.exit(2);
}

const issues = payload.summary && Array.isArray(payload.summary.issues) ? payload.summary.issues : [];
if (issues.includes('openclaw_runner_failure')) {
  console.error(
    'Aggregate dashboard reports openclaw_runner_failure. Remediate OpenClaw runner / policy drift and re-run.',
  );
  console.error(`Issues: ${issues.join(', ')}`);
  process.exit(1);
}

console.log('Aggregate dashboard: no openclaw_runner_failure signal.');
process.exit(0);
