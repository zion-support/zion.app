#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Assign an owner to the open critical anomaly incident.
 *
 * Env:
 *   ISSUE_FINGERPRINT (required)
 *   ANOMALY_CRITICAL_ASSIGNEE (optional) - explicit @user or user
 *   CODEOWNERS_FILE (optional, default .github/CODEOWNERS)
 *   CODEOWNERS_PATH (optional, default /automation/)
 *   DRY_RUN
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

function gh(args) {
  return spawnSync('gh', args, { encoding: 'utf8', env: process.env });
}

function fingerprintLabel(fp) {
  const hash = crypto.createHash('sha256').update(String(fp)).digest('hex').slice(0, 12);
  return `automation-fp-${hash}`;
}

function firstCodeownersUserForPath(codeownersPath, routePath) {
  try {
    const rows = fs.readFileSync(codeownersPath, 'utf8').split(/\r?\n/);
    let bestUser = '';
    let bestLen = -1;
    for (const raw of rows) {
      const line = String(raw || '').trim();
      if (!line || line.startsWith('#')) continue;
      const parts = line.split(/\s+/).filter(Boolean);
      if (parts.length < 2) continue;
      const pattern = parts[0];
      const owners = parts.slice(1);
      const normalized = pattern.endsWith('*') ? pattern.slice(0, -1) : pattern;
      if (normalized === '*' || routePath.startsWith(normalized)) {
        const user = owners.find((o) => o.startsWith('@') && !o.includes('/'));
        if (user && normalized.length >= bestLen) {
          bestUser = user.replace(/^@/, '');
          bestLen = normalized.length;
        }
      }
    }
    return bestUser;
  } catch {
    return '';
  }
}

function main() {
  const fp = String(process.env.ISSUE_FINGERPRINT || '').trim();
  if (!fp) {
    console.error('openclaw-runner-anomaly-assign-owner: ISSUE_FINGERPRINT is required.');
    process.exit(2);
  }
  const dry = ['1', 'true', 'yes'].includes(String(process.env.DRY_RUN || '').toLowerCase());
  const root = process.cwd();
  const codeownersPath = path.isAbsolute(process.env.CODEOWNERS_FILE || '')
    ? process.env.CODEOWNERS_FILE
    : path.join(root, process.env.CODEOWNERS_FILE || '.github/CODEOWNERS');
  const routePath = String(process.env.CODEOWNERS_PATH || '/automation/').trim() || '/automation/';
  const assignee =
    String(process.env.ANOMALY_CRITICAL_ASSIGNEE || '').replace(/^@/, '').trim() ||
    firstCodeownersUserForPath(codeownersPath, routePath);
  if (!assignee) {
    console.log('openclaw-runner-anomaly-assign-owner: no assignee resolved; skipping.');
    process.exit(0);
  }

  const label = fingerprintLabel(fp);
  const list = gh(['issue', 'list', '--state', 'open', '--label', label, '--json', 'number', '--limit', '1']);
  if (list.status !== 0) {
    console.warn('openclaw-runner-anomaly-assign-owner: list failed:', list.stderr || list.stdout);
    process.exit(0);
  }
  let number = 0;
  try {
    number = Number.parseInt(String(JSON.parse(list.stdout || '[]')[0]?.number || '0'), 10) || 0;
  } catch {
    number = 0;
  }
  if (!number) {
    console.log('openclaw-runner-anomaly-assign-owner: no open issue found; skipping.');
    process.exit(0);
  }

  if (dry) {
    console.log(`DRY_RUN: would add assignee @${assignee} to #${number}`);
    process.exit(0);
  }
  const ed = gh(['issue', 'edit', String(number), '--add-assignee', assignee]);
  if (ed.status !== 0) {
    console.warn('openclaw-runner-anomaly-assign-owner: edit failed:', ed.stderr || ed.stdout);
    process.exit(0);
  }
  console.log(`Added anomaly owner @${assignee} to #${number}.`);
}

main();
