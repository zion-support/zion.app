#!/usr/bin/env node
/**
 * After a runner-guard incident is opened/updated, apply reason-class routing:
 * optional GitHub assignee + optional webhook POST from env named in routing config.
 *
 * Env:
 *   ISSUE_FINGERPRINT (required)
 *   REASON_CLASS — policy|artifact|runner|unknown
 *   ROUTING_CONFIG — path (default: automation/config/openclaw-runner-routing.json)
 *   NOTIFY_TITLE — short title for webhook body
 *   NOTIFY_BODY — markdown/plain detail for webhook
 *   NOTIFY_FORMAT — override routing JSON: generic | slack | discord
 *   NOTIFY_CRITICAL_FORMAT — override critical routing format
 *   CODEOWNERS_FILE — default .github/CODEOWNERS (runbook owner fallback)
 *   ROUTE_NOTIFY_ON_DELTA_ONLY — default true; only notify when repeat/severity/issue delta
 *   ROUTE_NOTIFY_MIN_HOURS — default 6; suppress non-delta repeats within window
 *   ROUTE_STATE_TTL_DAYS — default 14; expire stale per-reason route state
 *   ROUTE_STATE_FILE — default automation/reports/openclaw-runner-route-state.json
 *   DRY_RUN — if "1"/"true", skip mutations
 *
 * Requires: gh + GH_TOKEN or GITHUB_TOKEN for assignee
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const http = require('http');
const https = require('https');
const { spawnSync } = require('child_process');

function gh(args) {
  return spawnSync('gh', args, {
    encoding: 'utf8',
    env: process.env,
  });
}

function fingerprintLabel(fp) {
  const hash = crypto.createHash('sha256').update(String(fp)).digest('hex').slice(0, 12);
  return `automation-fp-${hash}`;
}

function readRouting(configPath) {
  try {
    const j = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return j;
  } catch {
    return {};
  }
}

function readJsonMaybe(p) {
  try {
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function writeJsonSafe(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf8');
}

function truthy(v) {
  return ['1', 'true', 'yes'].includes(String(v || '').toLowerCase());
}

function parseFiniteNumber(v, fallback) {
  const n = Number.parseFloat(String(v));
  return Number.isFinite(n) ? n : fallback;
}

function firstCodeownersUserForPath(codeownersPath, routePath) {
  try {
    const rows = fs.readFileSync(codeownersPath, 'utf8').split(/\r?\n/);
    let bestUser = '';
    let bestMatchLen = -1;
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
        if (user && normalized.length >= bestMatchLen) {
          bestUser = user.replace(/^@/, '');
          bestMatchLen = normalized.length;
        }
      }
    }
    return bestUser;
  } catch {
    return '';
  }
}

function findOpenFingerprintIssue(fpLabel) {
  const list = gh([
    'issue',
    'list',
    '--state',
    'open',
    '--label',
    fpLabel,
    '--json',
    'number,title',
    '--limit',
    '5',
  ]);
  if (list.status !== 0) return null;
  try {
    const arr = JSON.parse(list.stdout || '[]');
    return arr[0] || null;
  } catch {
    return null;
  }
}

function buildNotifyPayload(format, title, body, issueNum) {
  const extra = issueNum ? `\nIssue: #${issueNum}` : '';
  const plain = `${title}\n${body}${extra}`.trim();
  const fmt = String(format || 'generic').toLowerCase();
  if (fmt === 'slack') return { text: plain.slice(0, 39000) };
  if (fmt === 'discord') return { content: plain.slice(0, 2000) };
  return { text: plain.slice(0, 3500) };
}

function postWebhook(url, payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const u = new URL(url);
    const isHttp = u.protocol === 'http:';
    const lib = isHttp ? http : https;
    const port = u.port ? Number(u.port) : isHttp ? 80 : 443;
    const req = lib.request(
      {
        hostname: u.hostname,
        port,
        path: u.pathname + u.search,
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

async function main() {
  const fp = process.env.ISSUE_FINGERPRINT;
  const reasonClass = String(process.env.REASON_CLASS || process.env.RUNNER_REASON_CLASS || 'unknown').toLowerCase();
  const dry = ['1', 'true', 'yes'].includes(String(process.env.DRY_RUN || '').toLowerCase());
  const root = process.cwd();
  const configPath = path.isAbsolute(process.env.ROUTING_CONFIG || '')
    ? process.env.ROUTING_CONFIG
    : path.join(root, process.env.ROUTING_CONFIG || 'automation/config/openclaw-runner-routing.json');

  if (!fp) {
    console.error('openclaw-runner-route-incident: ISSUE_FINGERPRINT is required.');
    process.exit(2);
  }

  const routing = readRouting(configPath);
  const bucket = routing[reasonClass] || routing.unknown || {};
  const assignee = String(bucket.assignee || '').trim();
  const codeownersPath = path.isAbsolute(process.env.CODEOWNERS_FILE || '')
    ? process.env.CODEOWNERS_FILE
    : path.join(root, process.env.CODEOWNERS_FILE || '.github/CODEOWNERS');
  const runbookPath = String(bucket.runbookPath || '/automation/').trim() || '/automation/';
  const codeownersFallback = firstCodeownersUserForPath(codeownersPath, runbookPath);
  const runbookOwner = String(bucket.runbookOwner || codeownersFallback || '').replace(/^@/, '').trim();
  const notifyEnvVar = String(bucket.notifyEnvVar || '').trim();
  const notifyUrl = notifyEnvVar ? String(process.env[notifyEnvVar] || '').trim() : '';
  const criticalNotifyEnvVar = String(bucket.notifyCriticalEnvVar || '').trim();
  const criticalNotifyUrl = criticalNotifyEnvVar ? String(process.env[criticalNotifyEnvVar] || '').trim() : '';
  const notifyFormat = String(process.env.NOTIFY_FORMAT || bucket.notifyFormat || 'generic').trim() || 'generic';
  const notifyCriticalFormat =
    String(process.env.NOTIFY_CRITICAL_FORMAT || bucket.notifyCriticalFormat || notifyFormat).trim() || notifyFormat;
  const runbookUrl = String(bucket.runbookUrl || '').trim();
  const repeats = Number.parseInt(String(process.env.RUNNER_REASON_REPEATS || '0'), 10) || 0;
  const severityLabel = String(process.env.RUNNER_SEVERITY_LABEL || '').trim();
  const routeStateFile = path.isAbsolute(process.env.ROUTE_STATE_FILE || '')
    ? process.env.ROUTE_STATE_FILE
    : path.join(root, process.env.ROUTE_STATE_FILE || 'automation/reports/openclaw-runner-route-state.json');
  const routeState = readJsonMaybe(routeStateFile) || {};
  const stateTtlDays = parseFiniteNumber(
    process.env.ROUTE_STATE_TTL_DAYS || bucket.routeStateTtlDays || '14',
    14,
  );
  const stateTtlMs = stateTtlDays > 0 ? stateTtlDays * 86400000 : 0;
  if (stateTtlMs > 0) {
    const now = Date.now();
    for (const [k, row] of Object.entries(routeState)) {
      const ts = row && row.lastNotifiedAt ? Date.parse(String(row.lastNotifiedAt)) : NaN;
      if (!Number.isFinite(ts) || now - ts > stateTtlMs) {
        delete routeState[k];
      }
    }
  }
  const deltaOnly = process.env.ROUTE_NOTIFY_ON_DELTA_ONLY
    ? truthy(process.env.ROUTE_NOTIFY_ON_DELTA_ONLY)
    : bucket.notifyOnDeltaOnly !== false;
  const minHoursRaw = Number.parseFloat(String(process.env.ROUTE_NOTIFY_MIN_HOURS || bucket.notifyMinHours || '6'));
  const minHours = Number.isFinite(minHoursRaw) && minHoursRaw > 0 ? minHoursRaw : 0;

  const fpLabel = fingerprintLabel(fp);
  const issue = findOpenFingerprintIssue(fpLabel);
  if (!issue) {
    console.log('openclaw-runner-route-incident: no open fingerprint issue found; skipping.');
    process.exit(0);
  }

  const num = issue.number;
  const prev = routeState[reasonClass] || {};
  const prevRepeats = Number.parseInt(String(prev.lastRepeats || '0'), 10) || 0;
  const prevSeverity = String(prev.lastSeverity || '');
  const prevIssue = Number.parseInt(String(prev.lastIssueNumber || '0'), 10) || 0;
  const prevNotifiedAt = prev.lastNotifiedAt ? Date.parse(String(prev.lastNotifiedAt)) : NaN;
  const ageHours = Number.isFinite(prevNotifiedAt) ? (Date.now() - prevNotifiedAt) / 3600000 : null;
  const hasDelta = prevIssue !== num || repeats > prevRepeats || severityLabel !== prevSeverity;

  if (assignee && !dry) {
    const ed = gh(['issue', 'edit', String(num), '--add-assignee', assignee]);
    if (ed.status !== 0) {
      console.warn('assignee add (non-fatal):', ed.stderr || ed.stdout);
    } else {
      console.log(`Added assignee @${assignee} to #${num}.`);
    }
  } else if (assignee && dry) {
    console.log(`DRY_RUN: would add assignee @${assignee} to #${num}`);
  }

  if (notifyUrl && !dry) {
    if (deltaOnly && !hasDelta) {
      console.log(`route notify skipped: no delta for reason=${reasonClass} issue=#${num}.`);
    } else if (!hasDelta && ageHours != null && minHours > 0 && ageHours < minHours) {
      console.log(
        `route notify cooldown: ${ageHours.toFixed(2)}h < ${minHours}h for reason=${reasonClass} issue=#${num}; skipping.`,
      );
    } else {
      const title = process.env.NOTIFY_TITLE || 'OpenClaw runner incident';
      const body = process.env.NOTIFY_BODY || `Reason class: ${reasonClass} · issue #${num}`;
      const payload = buildNotifyPayload(notifyFormat, title, body, num);
      try {
        const code = await postWebhook(notifyUrl, payload);
        console.log(`notify webhook (${notifyEnvVar}, ${notifyFormat}): ${code}`);
        routeState[reasonClass] = {
          lastIssueNumber: num,
          lastNotifiedAt: new Date().toISOString(),
          lastRepeats: repeats,
          lastSeverity: severityLabel || null,
        };
        writeJsonSafe(routeStateFile, routeState);
      } catch (e) {
        console.warn('notify webhook failed:', e && e.message ? e.message : e);
      }
    }
  } else if (notifyEnvVar && !notifyUrl) {
    console.log(`notify env ${notifyEnvVar} not set; skipping webhook.`);
  }

  const isCriticalSeverity = /critical/i.test(severityLabel);
  if (criticalNotifyUrl && isCriticalSeverity && !dry) {
    const title = process.env.NOTIFY_TITLE || 'OpenClaw runner incident';
    const body = `${process.env.NOTIFY_BODY || `Reason class: ${reasonClass} · issue #${num}`}\nSeverity tier: critical`;
    const payload = buildNotifyPayload(notifyCriticalFormat, `[critical] ${title}`, body, num);
    try {
      const code = await postWebhook(criticalNotifyUrl, payload);
      console.log(`critical notify webhook (${criticalNotifyEnvVar}, ${notifyCriticalFormat}): ${code}`);
    } catch (e) {
      console.warn('critical notify webhook failed:', e && e.message ? e.message : e);
    }
  } else if (criticalNotifyEnvVar && !criticalNotifyUrl) {
    console.log(`critical notify env ${criticalNotifyEnvVar} not set; skipping webhook.`);
  }

  if (runbookUrl && !dry && hasDelta) {
    const marker = `<!-- openclaw-runner-route-runbook:${reasonClass} -->`;
    const body = `${marker}\n\nRunbook for \`${reasonClass}\` incidents: ${runbookUrl}`;
    const c = gh(['issue', 'comment', String(num), '--body', body]);
    if (c.status !== 0) {
      console.warn('runbook comment failed (non-fatal):', c.stderr || c.stdout);
    } else {
      console.log(`Posted runbook hint for #${num}.`);
    }
  }

  if (runbookOwner && !dry && hasDelta) {
    const ed = gh(['issue', 'edit', String(num), '--add-assignee', runbookOwner]);
    if (ed.status !== 0) {
      console.warn('runbookOwner add (non-fatal):', ed.stderr || ed.stdout);
    } else {
      console.log(`Added runbook owner @${runbookOwner} to #${num}.`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
