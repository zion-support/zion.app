#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Follow-up actions for weekly automation health digest:
 * - Auto-assign digest issue to CODEOWNERS when escalation is active
 * - Send severity-banded webhook notifications
 * - Auto-close digest issue on recovery when no regression alert
 *
 * Env:
 *   GH_TOKEN / GITHUB_TOKEN
 *   AUTOMATION_DIGEST_SLACK_WEBHOOK / SLACK_WEBHOOK_URL
 *   DISCORD_WEBHOOK_URL
 *   GENERIC_WEBHOOK_URL
 *   WEEKLY_HEALTH_WEBHOOK_WARNING_ENABLED (default 1)
 *   WEEKLY_HEALTH_WEBHOOK_WARNING_COOLDOWN_HOURS (default 48)
 *   WEEKLY_HEALTH_WEBHOOK_CRITICAL_COOLDOWN_HOURS (default 24)
 *   WEEKLY_HEALTH_OWNER_SLA_DAYS (default 7)
 *   WEEKLY_HEALTH_OWNER_SLA_COOLDOWN_HOURS (default 24)
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const { spawnSync } = require('child_process');
const crypto = require('crypto');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const DIGEST_JSON = path.join(REPORTS, 'weekly-automation-health-digest-latest.json');
const WEBHOOK_STATE = path.join(REPORTS, 'weekly-automation-health-webhook-state.json');
const FINGERPRINT = 'automation-health-weekly-regression-digest';

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
    const body = JSON.stringify(bodyObj);
    const u = new URL(urlStr);
    const req = https.request(
      {
        hostname: u.hostname,
        path: `${u.pathname}${u.search}`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      },
      (res) => {
        res.on('data', () => {});
        res.on('end', () => resolve(res.statusCode));
      },
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function gh(args) {
  return spawnSync('gh', args, { cwd: ROOT, env: process.env, encoding: 'utf8' });
}

function fingerprintLabel(fp) {
  const hash = crypto.createHash('sha256').update(String(fp)).digest('hex').slice(0, 12);
  return `automation-fp-${hash}`;
}

function listOpenFingerprintIssues() {
  const label = fingerprintLabel(FINGERPRINT);
  const list = gh([
    'issue',
    'list',
    '--state',
    'open',
    '--label',
    label,
    '--json',
    'number,title,labels,url,createdAt,assignees',
    '--limit',
    '50',
  ]);
  if (list.status !== 0) return [];
  try {
    return JSON.parse(list.stdout || '[]');
  } catch {
    return [];
  }
}

function assignOwnersIfNeeded(digest) {
  const owners = Array.isArray(digest?.ownerEscalation?.owners) ? digest.ownerEscalation.owners : [];
  if (!digest?.ownerEscalation?.shouldMentionOwners || owners.length === 0) return;
  const issue = listOpenFingerprintIssues()[0];
  if (!issue) return;

  for (const owner of owners) {
    const user = String(owner || '').replace(/^@/, '').trim();
    if (!user) continue;
    gh(['issue', 'edit', String(issue.number), '--add-assignee', user]);
  }
}

function closeOnRecoveryIfNeeded(digest) {
  if (digest?.regressionAlert) return;
  spawnSync(
    'node',
    ['scripts/automation/gh-issue-close-on-recovery.cjs'],
    {
      cwd: ROOT,
      env: {
        ...process.env,
        ISSUE_FINGERPRINT: FINGERPRINT,
        CLOSE_COMMENT:
          'Auto-closing: weekly automation health digest has no active regression alert in the latest window.',
      },
      encoding: 'utf8',
    },
  );
}

async function maybeNotifyWebhooks(digest) {
  const sev = digest?.severityCounts || {};
  const critical = Number(sev.critical || 0);
  const warning = Number(sev.warning || 0);
  const regressionAlert = Boolean(digest?.regressionAlert);
  const warnEnabled = String(process.env.WEEKLY_HEALTH_WEBHOOK_WARNING_ENABLED || '1') !== '0';
  const slack = process.env.AUTOMATION_DIGEST_SLACK_WEBHOOK || process.env.SLACK_WEBHOOK_URL;
  const discord = process.env.DISCORD_WEBHOOK_URL;
  const generic = process.env.GENERIC_WEBHOOK_URL;
  if (!slack && !discord && !generic) return;

  let tier = null;
  if (critical > 0) tier = 'critical';
  else if (warnEnabled && (warning > 0 || regressionAlert)) tier = 'warning';
  if (!tier) return;

  const cooldownH =
    tier === 'critical'
      ? Number(process.env.WEEKLY_HEALTH_WEBHOOK_CRITICAL_COOLDOWN_HOURS || 24)
      : Number(process.env.WEEKLY_HEALTH_WEBHOOK_WARNING_COOLDOWN_HOURS || 48);
  const prev = readJson(WEBHOOK_STATE, {});
  const last = prev?.[tier]?.at ? new Date(prev[tier].at).getTime() : 0;
  if (last && Date.now() - last < cooldownH * 3600000) return;

  const text = [
    '[Zion weekly automation health]',
    `tier: ${tier}`,
    `regressionAlert: ${regressionAlert ? 'yes' : 'no'}`,
    `severity counts: critical=${critical} warning=${warning} nominal=${Number(sev.nominal || 0)}`,
    `slo delta: ${digest?.slo?.delta ?? 'n/a'}`,
    `generatedAt: ${digest?.generatedAt || 'n/a'}`,
  ].join('\n');

  const tasks = [];
  if (slack) tasks.push(postJson(slack, { text }));
  if (discord) tasks.push(postJson(discord, { content: text.slice(0, 2000) }));
  if (generic) tasks.push(postJson(generic, { text }));
  await Promise.all(tasks);

  const next = readJson(WEBHOOK_STATE, {});
  next[tier] = { at: new Date().toISOString(), critical, warning, regressionAlert };
  writeJson(WEBHOOK_STATE, next);
}

async function maybeEscalateOwnerSla(digest) {
  if (!digest?.regressionAlert) return;
  const issues = listOpenFingerprintIssues();
  const issue = issues[0];
  if (!issue) return;

  const slaDays = Math.max(1, Number(process.env.WEEKLY_HEALTH_OWNER_SLA_DAYS || 7));
  const cooldownH = Math.max(1, Number(process.env.WEEKLY_HEALTH_OWNER_SLA_COOLDOWN_HOURS || 24));
  const createdAt = issue.createdAt ? new Date(issue.createdAt).getTime() : 0;
  if (!createdAt) return;
  const ageDays = (Date.now() - createdAt) / 86400000;
  if (ageDays < slaDays) return;

  const state = readJson(WEBHOOK_STATE, {});
  const last = state?.ownerSla?.at ? new Date(state.ownerSla.at).getTime() : 0;
  if (last && Date.now() - last < cooldownH * 3600000) return;

  const assigned = Array.isArray(issue.assignees) ? issue.assignees.map((a) => `@${a.login}`) : [];
  const owners = Array.isArray(digest?.ownerEscalation?.owners) ? digest.ownerEscalation.owners : [];
  const ownerLine = owners.length ? owners.join(' ') : 'n/a';
  const assigneeLine = assigned.length ? assigned.join(' ') : 'none';
  const text = [
    '[Zion weekly automation health] owner SLA breach',
    `issue: #${issue.number} (${issue.url || 'n/a'})`,
    `ageDays: ${ageDays.toFixed(1)} (sla ${slaDays})`,
    `assigned: ${assigneeLine}`,
    `owner candidates: ${ownerLine}`,
  ].join('\n');

  const slack = process.env.AUTOMATION_DIGEST_SLACK_WEBHOOK || process.env.SLACK_WEBHOOK_URL;
  const discord = process.env.DISCORD_WEBHOOK_URL;
  const generic = process.env.GENERIC_WEBHOOK_URL;
  const tasks = [];
  if (slack) tasks.push(postJson(slack, { text }));
  if (discord) tasks.push(postJson(discord, { content: text.slice(0, 2000) }));
  if (generic) tasks.push(postJson(generic, { text }));
  if (tasks.length) await Promise.all(tasks);

  gh([
    'issue',
    'comment',
    String(issue.number),
    '--body',
    `Owner SLA breach: issue open for ${ageDays.toFixed(1)} days (target ${slaDays}) with owners ${ownerLine}.`,
  ]);

  const next = readJson(WEBHOOK_STATE, {});
  next.ownerSla = {
    at: new Date().toISOString(),
    issue: issue.number,
    ageDays: Number(ageDays.toFixed(1)),
    slaDays,
  };
  writeJson(WEBHOOK_STATE, next);
}

async function main() {
  const digest = readJson(DIGEST_JSON, null);
  if (!digest) {
    console.log('[weekly-health-followup] missing digest json; skip.');
    process.exit(0);
  }
  assignOwnersIfNeeded(digest);
  closeOnRecoveryIfNeeded(digest);
  await maybeEscalateOwnerSla(digest);
  await maybeNotifyWebhooks(digest);
  console.log('[weekly-health-followup] done.');
}

main().catch((e) => {
  console.warn('[weekly-health-followup]', e.message || e);
  process.exit(1);
});
