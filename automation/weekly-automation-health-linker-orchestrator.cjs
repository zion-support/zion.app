#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const DIGEST_FILE = path.join(REPORTS, 'weekly-automation-health-digest-latest.json');
const STATE_FILE = path.join(REPORTS, 'weekly-automation-health-linker-state.json');
const WEEKLY_FP = 'automation-health-weekly-regression-digest';
const RELEASE_RISK_FP = 'release-risk-elevated';

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

function gh(args) {
  return spawnSync('gh', args, { cwd: ROOT, env: process.env, encoding: 'utf8' });
}

function fpLabel(fp) {
  const hash = crypto.createHash('sha256').update(String(fp)).digest('hex').slice(0, 12);
  return `automation-fp-${hash}`;
}

function listOpenByLabel(label) {
  const r = gh([
    'issue',
    'list',
    '--state',
    'open',
    '--label',
    label,
    '--json',
    'number,title,url,createdAt,labels',
    '--limit',
    '50',
  ]);
  if (r.status !== 0) return [];
  try {
    return JSON.parse(r.stdout || '[]');
  } catch {
    return [];
  }
}

function listRecentOpen(hours) {
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
  const cutoff = Date.now() - Math.max(1, Number(hours || 168)) * 3600000;
  try {
    return JSON.parse(r.stdout || '[]').filter((row) => {
      const ts = row.createdAt ? new Date(row.createdAt).getTime() : 0;
      return ts >= cutoff;
    });
  } catch {
    return [];
  }
}

function issueAddLabel(issueNumber, label) {
  gh(['issue', 'edit', String(issueNumber), '--add-label', label]);
}

function issueComment(issueNumber, body) {
  gh(['issue', 'comment', String(issueNumber), '--body', body]);
}

function main() {
  const digest = readJson(DIGEST_FILE, null);
  if (!digest || !digest.regressionAlert) {
    console.log('[weekly-health-linker] no active regression alert');
    process.exit(0);
  }

  const confMin = Number(process.env.WEEKLY_HEALTH_LINKER_CONFIDENCE_MIN || 60);
  const quality = Number(digest?.quality?.score || 0);
  if (quality < confMin) {
    console.log('[weekly-health-linker] confidence gate skip', { quality, confMin });
    process.exit(0);
  }

  const weeklyIssue = listOpenByLabel(fpLabel(WEEKLY_FP))[0];
  if (!weeklyIssue) {
    console.log('[weekly-health-linker] no open weekly fingerprint issue');
    process.exit(0);
  }

  const createdAtMs = weeklyIssue.createdAt ? new Date(weeklyIssue.createdAt).getTime() : 0;
  if (!createdAtMs) process.exit(0);
  const ageDays = (Date.now() - createdAtMs) / 86400000;
  const warnDays = Math.max(1, Number(process.env.WEEKLY_HEALTH_LINKER_WARN_DAYS || 2));
  const critDays = Math.max(warnDays, Number(process.env.WEEKLY_HEALTH_LINKER_CRIT_DAYS || 5));
  if (ageDays >= warnDays) issueAddLabel(weeklyIssue.number, 'automation-slo-warning');
  if (ageDays >= critDays) issueAddLabel(weeklyIssue.number, 'automation-slo-critical');

  const state = readJson(STATE_FILE, { byIssue: {} });
  const prev = state.byIssue[weeklyIssue.number] || { linked: [] };
  const recent = listRecentOpen(process.env.WEEKLY_HEALTH_LINKER_WINDOW_HOURS || 168);
  const siblings = recent
    .filter((x) => x.number !== weeklyIssue.number)
    .filter((x) => {
      const labels = Array.isArray(x.labels) ? x.labels.map((l) => l.name) : [];
      return (
        labels.some((n) => String(n).startsWith(fpLabel(RELEASE_RISK_FP))) ||
        labels.some((n) => String(n).startsWith('automation-fp-'))
      );
    })
    .slice(0, 10);

  const newLinks = siblings.filter((s) => !prev.linked.includes(s.number));
  if (newLinks.length > 0) {
    const body = [
      'Cross-incident links (recent related incidents):',
      ...newLinks.map((s) => `- #${s.number} ${s.url || ''}`.trim()),
    ].join('\n');
    issueComment(weeklyIssue.number, body);
  }

  state.byIssue[weeklyIssue.number] = {
    updatedAt: new Date().toISOString(),
    quality,
    ageDays: Number(ageDays.toFixed(1)),
    linked: siblings.map((s) => s.number),
  };
  writeJson(STATE_FILE, state);
  console.log('[weekly-health-linker] done', {
    issue: weeklyIssue.number,
    ageDays: Number(ageDays.toFixed(1)),
    links: siblings.length,
  });
}

main();
