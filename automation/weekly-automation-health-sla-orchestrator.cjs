#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Weekly automation health SLA orchestrator.
 *
 * Goals:
 * - Confidence gate: skip noisy escalation on low digest quality
 * - Severity aging: apply warning/critical labels as issue ages
 * - Retry cadence tiers: comment + optional webhook on tier transitions
 * - Cross-incident linking: add sibling links to release-risk / fingerprint digest issues
 *
 * Env:
 *   GH_TOKEN / GITHUB_TOKEN
 *   WEEKLY_HEALTH_CONFIDENCE_MIN (default 55)
 *   WEEKLY_HEALTH_TIER1_DAYS (default 2)
 *   WEEKLY_HEALTH_TIER2_DAYS (default 5)
 *   WEEKLY_HEALTH_TIER3_DAYS (default 9)
 *   WEEKLY_HEALTH_SIBLING_WINDOW_HOURS (default 168)
 *   AUTOMATION_DIGEST_SLACK_WEBHOOK / SLACK_WEBHOOK_URL / DISCORD_WEBHOOK_URL / GENERIC_WEBHOOK_URL
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const DIGEST = path.join(REPORTS, 'weekly-automation-health-digest-latest.json');
const STATE = path.join(REPORTS, 'weekly-automation-health-sla-orchestrator-state.json');
const FP = 'automation-health-weekly-regression-digest';

function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function postJson(urlStr, bodyObj) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(bodyObj);
    const u = new URL(urlStr);
    const req = https.request(
      {
        hostname: u.hostname,
        path: `${u.pathname}${u.search}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        res.on('data', () => {});
        res.on('end', () => resolve(res.statusCode));
      },
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function gh(args) {
  return spawnSync('gh', args, {
    cwd: ROOT,
    env: process.env,
    encoding: 'utf8',
  });
}

function fpLabel(fp) {
  const h = crypto.createHash('sha256').update(String(fp)).digest('hex').slice(0, 12);
  return `automation-fp-${h}`;
}

function listOpenByFingerprint(fp) {
  const r = gh([
    'issue',
    'list',
    '--state',
    'open',
    '--label',
    fpLabel(fp),
    '--json',
    'number,title,url,createdAt,labels',
    '--limit',
    '20',
  ]);
  if (r.status !== 0) return [];
  try {
    return JSON.parse(r.stdout || '[]');
  } catch {
    return [];
  }
}

function addLabel(issueNum, label) {
  gh(['issue', 'edit', String(issueNum), '--add-label', label]);
}

function comment(issueNum, text) {
  gh(['issue', 'comment', String(issueNum), '--body', text]);
}

async function notifyTier(issue, tier, ageDays, qualityScore) {
  const text = [
    '[Zion weekly health SLA tier]',
    `issue: #${issue.number}`,
    `tier: ${tier}`,
    `ageDays: ${ageDays.toFixed(1)}`,
    `qualityScore: ${qualityScore}`,
    issue.url || '',
  ]
    .filter(Boolean)
    .join('\n');

  const slack = process.env.AUTOMATION_DIGEST_SLACK_WEBHOOK || process.env.SLACK_WEBHOOK_URL;
  const discord = process.env.DISCORD_WEBHOOK_URL;
  const generic = process.env.GENERIC_WEBHOOK_URL;
  const tasks = [];
  if (slack) tasks.push(postJson(slack, { text }));
  if (discord) tasks.push(postJson(discord, { content: text.slice(0, 2000) }));
  if (generic) tasks.push(postJson(generic, { text }));
  if (tasks.length) await Promise.all(tasks);
}

function findSiblingIssues(windowHours) {
  const r = gh([
    'issue',
    'list',
    '--state',
    'open',
    '--json',
    'number,title,url,createdAt,labels',
    '--limit',
    '200',
  ]);
  if (r.status !== 0) return [];
  let rows = [];
  try {
    rows = JSON.parse(r.stdout || '[]');
  } catch {
    rows = [];
  }
  const cutoff = Date.now() - Math.max(1, windowHours) * 3600000;
  return rows.filter((row) => {
    const ts = row.createdAt ? new Date(row.createdAt).getTime() : 0;
    if (!ts || ts < cutoff) return false;
    const labs = Array.isArray(row.labels) ? row.labels.map((l) => l.name) : [];
    const isReleaseRisk = labs.some((n) => n && n.startsWith(fpLabel('release-risk-elevated')));
    const isDigest = labs.some((n) => n && n.startsWith('automation-fp-'));
    return isReleaseRisk || isDigest;
  });
}

async function main() {
  const digest = readJson(DIGEST, null);
  if (!digest) {
    console.log('[weekly-health-sla-orchestrator] missing digest, skip.');
    process.exit(0);
  }
  if (!digest.regressionAlert) {
    console.log('[weekly-health-sla-orchestrator] no active regression alert.');
    process.exit(0);
  }

  const confMin = Number(process.env.WEEKLY_HEALTH_CONFIDENCE_MIN || 55);
  const qualityScore = Number(digest?.quality?.score || 0);
  if (qualityScore < confMin) {
    console.log('[weekly-health-sla-orchestrator] confidence gate active', { qualityScore, confMin });
    process.exit(0);
  }

  const tier1 = Math.max(1, Number(process.env.WEEKLY_HEALTH_TIER1_DAYS || 2));
  const tier2 = Math.max(tier1, Number(process.env.WEEKLY_HEALTH_TIER2_DAYS || 5));
  const tier3 = Math.max(tier2, Number(process.env.WEEKLY_HEALTH_TIER3_DAYS || 9));
  const issues = listOpenByFingerprint(FP);
  if (!issues.length) {
    console.log('[weekly-health-sla-orchestrator] no open weekly health fingerprint issue.');
    process.exit(0);
  }
  const issue = issues[0];
  const createdTs = issue.createdAt ? new Date(issue.createdAt).getTime() : 0;
  if (!createdTs) process.exit(0);
  const ageDays = (Date.now() - createdTs) / 86400000;
  const tier = ageDays >= tier3 ? 3 : ageDays >= tier2 ? 2 : ageDays >= tier1 ? 1 : 0;
  if (tier === 0) process.exit(0);

  const state = readJson(STATE, { byIssue: {} });
  const prevTier = Number(state.byIssue?.[issue.number]?.tier || 0);
  if (tier > prevTier) {
    if (tier === 1) addLabel(issue.number, 'automation-slo-warning');
    if (tier >= 2) addLabel(issue.number, 'automation-slo-critical');

    comment(
      issue.number,
      `SLA escalation tier ${tier} reached (age ${ageDays.toFixed(1)} days, quality ${qualityScore}).`,
    );
    await notifyTier(issue, tier, ageDays, qualityScore);

    const siblingWindow = Number(process.env.WEEKLY_HEALTH_SIBLING_WINDOW_HOURS || 168);
    const siblings = findSiblingIssues(siblingWindow)
      .filter((x) => x.number !== issue.number)
      .slice(0, 8);
    if (siblings.length) {
      const lines = siblings.map((s) => `- #${s.number} ${s.url || ''}`.trim());
      comment(
        issue.number,
        `Cross-incident links (same recent window):\n${lines.join('\n')}`,
      );
    }
  }

  state.byIssue = state.byIssue || {};
  state.byIssue[issue.number] = {
    tier,
    ageDays: Number(ageDays.toFixed(1)),
    updatedAt: new Date().toISOString(),
    qualityScore,
  };
  writeJson(STATE, state);
  console.log('[weekly-health-sla-orchestrator] done', { issue: issue.number, tier, ageDays, qualityScore });
}

main().catch((e) => {
  console.warn('[weekly-health-sla-orchestrator]', e.message || e);
  process.exit(1);
});
