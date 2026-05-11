#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Optional Slack/Discord/generic webhook when release risk band is high/critical.
 *
 * Env:
 *   RELEASE_RISK_WEBHOOK_MIN_SCORE (default 50) — notify when riskScore >= this
 *   RELEASE_RISK_WEBHOOK_COOLDOWN_HOURS (default 12)
 *   RELEASE_RISK_WEBHOOK_FORCE — set 1 to bypass cooldown
 *   AUTOMATION_DIGEST_SLACK_WEBHOOK, DISCORD_WEBHOOK_URL, GENERIC_WEBHOOK_URL
 *   OBSERVABILITY_PAGERDUTY_ROUTING_KEY / PAGERDUTY_ROUTING_KEY (optional)
 *   OBSERVABILITY_OPSGENIE_WEBHOOK_URL (optional)
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

let recordEscalation = () => {};
try {
  ({ recordEscalation } = require('./lib/incident-cooldown-mesh.cjs'));
} catch {
  /* optional */
}

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const SCORE = path.join(REPORTS, 'release-risk-score-latest.json');
const STATE = path.join(REPORTS, 'release-risk-webhook-state.json');

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function postJson(urlStr, bodyObj) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(bodyObj);
    const u = new URL(urlStr);
    const req = https.request(
      {
        hostname: u.hostname,
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

function main() {
  const minScore = Number(process.env.RELEASE_RISK_WEBHOOK_MIN_SCORE ?? 50);
  const coolH = Number(process.env.RELEASE_RISK_WEBHOOK_COOLDOWN_HOURS ?? 12);
  const force = process.env.RELEASE_RISK_WEBHOOK_FORCE === '1';

  const score = readJson(SCORE);
  if (!score || typeof score.riskScore !== 'number') {
    console.log('[release-risk-webhook] no score; skip.');
    process.exit(0);
  }

  const risk = Number(score.riskScore);
  if (!Number.isFinite(risk) || risk < minScore) {
    console.log('[release-risk-webhook] below threshold', { risk, minScore });
    process.exit(0);
  }

  const st = readJson(STATE) || {};
  const lastAt = st.lastNotifyAt ? new Date(st.lastNotifyAt).getTime() : 0;
  const ageH = (Date.now() - lastAt) / 3600000;
  if (!force && lastAt && ageH < coolH) {
    console.log('[release-risk-webhook] cooldown', ageH.toFixed(1), 'h');
    process.exit(0);
  }

  const text = [
    '[Zion release risk]',
    `riskScore: ${risk} (${score.band || 'n/a'})`,
    `health: ${score.healthScore ?? 'n/a'} | reg ${score.components?.regression ?? '—'} · route ${score.components?.routeDrift ?? '—'} · smoke ${score.components?.smoke ?? '—'}`,
    score.detail?.smokeStreak ? `prod smoke fail streak: ${score.detail.smokeStreak}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const slack = process.env.AUTOMATION_DIGEST_SLACK_WEBHOOK || process.env.SLACK_WEBHOOK_URL;
  const discord = process.env.DISCORD_WEBHOOK_URL;
  const generic = process.env.GENERIC_WEBHOOK_URL;
  const pagerDuty =
    process.env.OBSERVABILITY_PAGERDUTY_ROUTING_KEY || process.env.PAGERDUTY_ROUTING_KEY;
  const opsgenie = process.env.OBSERVABILITY_OPSGENIE_WEBHOOK_URL;
  const critical = String(score.band || '').toLowerCase() === 'critical';
  const unhealthyDeploy = score?.detail?.scheduledSmoke?.allOk === false;

  const tasks = [];
  if (slack) tasks.push(postJson(slack, { text }));
  if (discord) tasks.push(postJson(discord, { content: text.slice(0, 2000) }));
  if (generic) tasks.push(postJson(generic, { text }));
  if (critical && unhealthyDeploy && pagerDuty) {
    tasks.push(
      postJson('https://events.pagerduty.com/v2/enqueue', {
        routing_key: pagerDuty,
        event_action: 'trigger',
        payload: {
          summary: text.slice(0, 1024),
          source: 'zion-release-risk',
          severity: 'critical',
        },
      }),
    );
  }
  if (critical && unhealthyDeploy && opsgenie) {
    tasks.push(
      postJson(opsgenie, {
        message: '[Zion release risk] critical + unhealthy deploy smoke',
        description: text.slice(0, 12000),
        priority: 'P2',
      }),
    );
  }

  if (tasks.length === 0) {
    console.log('[release-risk-webhook] no webhooks configured; would send:\n', text);
    process.exit(0);
  }

  Promise.all(tasks)
    .then(() => {
      fs.mkdirSync(path.dirname(STATE), { recursive: true });
      fs.writeFileSync(
        STATE,
        `${JSON.stringify({ lastNotifyAt: new Date().toISOString(), riskScore: risk, band: score.band }, null, 2)}\n`,
        'utf8',
      );
      try {
        recordEscalation('release-risk-webhook', { meta: { riskScore: risk, band: score.band } });
      } catch {
        /* ignore */
      }
      console.log('[release-risk-webhook] sent');
      process.exit(0);
    })
    .catch((e) => {
      console.warn('[release-risk-webhook]', e.message);
      process.exit(1);
    });
}

main();
