#!/usr/bin/env node
/**
 * Escalate repeated Netlify preview smoke failures as a deduped GitHub issue.
 *
 * Reads:
 * - automation/reports/netlify-preview-smoke-latest.json
 * Writes:
 * - automation/reports/netlify-preview-smoke-state.json (consecutive failures)
 *
 * Env:
 * - NETLIFY_PREVIEW_SMOKE_FAIL_STREAK (default: 3)
 * - NETLIFY_PREVIEW_SMOKE_RECOVERY_STREAK (default: 2) consecutive healthy runs to auto-close
 * - NETLIFY_PREVIEW_SMOKE_STREAK_AUTHORITY — set to "0" to update state only and skip issue escalation
 * - ISSUE_FINGERPRINT (default: netlify-preview-smoke-repeated) — must match gh-issue-dedupe fingerprint
 * - GITHUB_SHA, GITHUB_WORKFLOW
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const REPORT = path.join(ROOT, 'automation', 'reports', 'netlify-preview-smoke-latest.json');
const STATE = path.join(ROOT, 'automation', 'reports', 'netlify-preview-smoke-state.json');
const BODY = path.join(ROOT, 'automation', 'reports', 'netlify-preview-smoke-escalation-body.md');

const FP_DEFAULT = 'netlify-preview-smoke-repeated';

function fingerprintLabel(fp) {
  const h = crypto.createHash('sha256').update(String(fp)).digest('hex').slice(0, 12);
  return `automation-fp-${h}`;
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function gh(args) {
  return spawnSync('gh', args, { cwd: ROOT, encoding: 'utf8', env: process.env });
}

function listIssues(state, label, limit) {
  const r = gh([
    'issue',
    'list',
    '--state',
    state,
    '--label',
    label,
    '--json',
    'number,updatedAt,closedAt',
    '--limit',
    String(limit || 30),
  ]);
  if (r.status !== 0) return [];
  try {
    const rows = JSON.parse(r.stdout || '[]');
    if (state === 'closed' && Array.isArray(rows)) {
      return rows.sort((a, b) => {
        const ta = new Date(a.closedAt || a.updatedAt || 0).getTime();
        const tb = new Date(b.closedAt || b.updatedAt || 0).getTime();
        return tb - ta;
      });
    }
    return rows;
  } catch {
    return [];
  }
}

function main() {
  const threshold = Math.max(1, Number(process.env.NETLIFY_PREVIEW_SMOKE_FAIL_STREAK || 3));
  const recoveryStreak = Math.max(1, Number(process.env.NETLIFY_PREVIEW_SMOKE_RECOVERY_STREAK || 2));
  const fpString = String(process.env.ISSUE_FINGERPRINT || FP_DEFAULT).trim() || FP_DEFAULT;
  const fpLab = fingerprintLabel(fpString);

  const report = readJson(REPORT);
  if (!report || report.skipped) {
    process.exit(0);
  }

  const unhealthyCount = Number(report.unhealthyCount || 0);
  const prior = readJson(STATE) || { consecutiveFailures: 0, consecutiveHealthy: 0 };
  const nextFailures = unhealthyCount > 0 ? Number(prior.consecutiveFailures || 0) + 1 : 0;
  const nextHealthy = unhealthyCount === 0 ? Number(prior.consecutiveHealthy || 0) + 1 : 0;

  writeJson(STATE, {
    updatedAt: new Date().toISOString(),
    consecutiveFailures: nextFailures,
    consecutiveHealthy: nextHealthy,
    latestUnhealthyCount: unhealthyCount,
    baseUrl: report.baseUrl || null,
    fingerprintLabel: fpLab,
  });

  if (unhealthyCount === 0 && nextHealthy >= recoveryStreak) {
    const openList = listIssues('open', fpLab, 20);
    for (const row of openList) {
      const c = gh([
        'issue',
        'close',
        String(row.number),
        '--comment',
        `Auto-close: Netlify preview smoke recovered for ${nextHealthy} consecutive run(s).`,
      ]);
      if (c.status !== 0) {
        console.warn('preview-smoke-escalate: close failed', row.number, c.stderr);
      } else {
        console.log('preview-smoke-escalate: closed issue', row.number);
      }
    }
  }

  if (nextFailures < threshold || unhealthyCount === 0) {
    console.log('preview-smoke-escalate: below threshold', { nextFailures, nextHealthy, threshold, unhealthyCount });
    process.exit(0);
  }

  if (String(process.env.NETLIFY_PREVIEW_SMOKE_STREAK_AUTHORITY || '1').toLowerCase() === '0') {
    console.log('preview-smoke-escalate: streak authority disabled — state updated, skipping issue');
    process.exit(0);
  }

  const alreadyOpen = listIssues('open', fpLab, 5);
  if (alreadyOpen.length > 0) {
    console.log('preview-smoke-escalate: open fingerprint issue exists', alreadyOpen.map((x) => x.number).join(','));
    process.exit(0);
  }

  const closedSorted = listIssues('closed', fpLab, 10);
  if (closedSorted.length > 0) {
    const num = closedSorted[0].number;
    const reopen = gh([
      'issue',
      'reopen',
      String(num),
      '--comment',
      `Auto-reopen: Netlify preview smoke failure streak resumed (${nextFailures} consecutive unhealthy run(s), threshold ${threshold}).`,
    ]);
    if (reopen.status === 0) {
      console.log('preview-smoke-escalate: reopened issue', num);
      process.exit(0);
    }
    console.warn('preview-smoke-escalate: reopen failed, falling through to dedupe', reopen.stderr || reopen.stdout);
  }

  const unhealthy = Array.isArray(report.routes)
    ? report.routes
        .filter((r) => !r.ok)
        .slice(0, 20)
        .map((r) => `- ${r.path} (${r.status}) [${r.kind || 'n/a'}]`)
    : [];

  const md = [
    '## Netlify preview smoke repeated failures',
    '',
    `- **Dedupe key:** \`${fpString}\``,
    `- **Consecutive failures:** ${nextFailures}`,
    `- **Threshold:** ${threshold}`,
    `- **Preview URL:** ${report.baseUrl || 'n/a'}`,
    `- **Workflow:** ${process.env.GITHUB_WORKFLOW || 'unknown'}`,
    `- **SHA:** ${(process.env.GITHUB_SHA || 'unknown').slice(0, 12)}`,
    '',
    '### Latest unhealthy routes',
    unhealthy.length ? unhealthy.join('\n') : '- none',
  ].join('\n');

  fs.writeFileSync(BODY, `${md}\n`, 'utf8');
  const env = {
    ...process.env,
    ISSUE_TITLE: 'Netlify preview smoke failing repeatedly after deploy',
    ISSUE_BODY_FILE: BODY,
    ISSUE_LABELS: 'bug,automation,automation-slo-critical',
    ISSUE_FINGERPRINT: fpString,
    COOLDOWN_HOURS: '12',
  };
  const r = spawnSync('node', ['scripts/automation/gh-issue-dedupe-or-create.cjs'], {
    cwd: ROOT,
    encoding: 'utf8',
    env,
  });
  if (r.status !== 0) {
    console.warn('preview-smoke-escalate: issue create failed', r.stderr || r.stdout);
    process.exit(1);
  }
  console.log('preview-smoke-escalate: issue ensured');
}

main();
