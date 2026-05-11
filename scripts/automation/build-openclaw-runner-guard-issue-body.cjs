#!/usr/bin/env node
/**
 * Writes markdown for OpenClaw runner-guard deduped GitHub issues.
 *
 * Env:
 *   ISSUE_BODY_FILE — output path (default: automation/reports/openclaw-runner-guard-issue.md)
 *   ISSUE_FINGERPRINT — shown in body (optional)
 *   GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_RUN_ID — workflow link (optional)
 */

const fs = require('fs');
const path = require('path');

const REPORTS = path.join(process.cwd(), 'automation', 'reports');
const outFile = process.env.ISSUE_BODY_FILE || path.join(REPORTS, 'openclaw-runner-guard-issue.md');
const fp = process.env.ISSUE_FINGERPRINT || 'openclaw-runner-guard|dry-run-fail|v2';
const server = (process.env.GITHUB_SERVER_URL || 'https://github.com').replace(/\/$/, '');
const repo = process.env.GITHUB_REPOSITORY || '';
const runId = process.env.GITHUB_RUN_ID || '';
const runnerJson = path.join(REPORTS, 'openclaw-runner-latest.json');
const reasonClass = String(process.env.OPENCLAW_RUNNER_REASON_CLASS || 'unknown');
const reasonRepeats = String(process.env.OPENCLAW_RUNNER_REASON_REPEATS || '0');
const cooldownHours = String(process.env.OPENCLAW_RUNNER_COOLDOWN_HOURS || process.env.COOLDOWN_HOURS || '6');
const selfHealAttempted = ['1', 'true', 'yes'].includes(
  String(process.env.OPENCLAW_RUNNER_SELF_HEAL_ATTEMPTED || '').toLowerCase(),
);
const remediationSummaryPath = String(process.env.OPENCLAW_RUNNER_REMEDIATION_SUMMARY_FILE || '').trim();

const lines = [];
lines.push('## OpenClaw approved-action runner dry-run failed');
lines.push('');
lines.push('The scheduled `ai-openclaw-runner-guard` job detected `npm run openclaw:runner` exit non-zero.');
lines.push('');
lines.push(
  'Common causes: stale `openclaw-action-approved-queue-latest.json` vs `openclaw-action-policy-latest.json`, or missing policy snapshot.',
);
lines.push('');
if (repo && runId) {
  lines.push(`Workflow: ${server}/${repo}/actions/runs/${runId}`);
} else {
  lines.push('*Workflow run URL unavailable in this environment.*');
}
lines.push('');
lines.push(`**Dedupe key:** \`${fp}\``);
lines.push(`**Reason class:** \`${reasonClass}\``);
lines.push(`**Consecutive same-class failures:** \`${reasonRepeats}\``);
lines.push(`**Self-heal retry attempted:** ${selfHealAttempted ? 'yes' : 'no'}`);
lines.push(`**Adaptive cooldown window:** \`${cooldownHours}h\``);

if (remediationSummaryPath && fs.existsSync(remediationSummaryPath)) {
  try {
    const rem = fs.readFileSync(remediationSummaryPath, 'utf8').trim();
    if (rem) {
      lines.push('');
      lines.push(rem);
    }
  } catch {
    /* ignore remediation read errors */
  }
}

if (fs.existsSync(runnerJson)) {
  let raw;
  try {
    raw = fs.readFileSync(runnerJson, 'utf8');
  } catch {
    raw = '';
  }
  const clipped = raw.length > 12000 ? `${raw.slice(0, 12000)}\n… (truncated)` : raw;
  if (clipped.trim()) {
    lines.push('');
    lines.push('```json');
    lines.push(clipped);
    lines.push('```');
  }
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, `${lines.join('\n')}\n`, 'utf8');
console.log(`Wrote ${outFile}`);
