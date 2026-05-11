#!/usr/bin/env node
/**
 * Optional Slack/Discord alerts when suppression EMA or fingerprint incident load crosses thresholds.
 *
 * Env:
 *   OBSERVABILITY_EMA_THRESHOLD — default 3
 *   OBSERVABILITY_FP_THRESHOLD — default 3 (open automation-fp issues from index JSON)
 *   OBSERVABILITY_WEBHOOK_COOLDOWN_HOURS — default 12 (same alert tier re-post)
 *   AUTOMATION_DIGEST_SLACK_WEBHOOK, DISCORD_WEBHOOK_URL — optional (same as other automations)
 *   GENERIC_WEBHOOK_URL — optional JSON { "text": "..." }
 *   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID — optional Telegram sendMessage target
 *   OBSERVABILITY_PAGERDUTY_ROUTING_KEY — optional; used when EMA+fingerprint both breach
 *   OBSERVABILITY_OPSGENIE_WEBHOOK_URL — optional; used when EMA+fingerprint both breach
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const { recordEscalation } = require('./lib/incident-cooldown-mesh.cjs');

const root = process.cwd();
const STATE = path.join(root, 'automation', 'reports', 'observability-webhook-state.json');
const HISTORY = path.join(root, 'automation', 'reports', 'observability-ema-fp-history.json');

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

function postTelegram(token, chatId, text) {
  const url = `https://api.telegram.org/bot${encodeURIComponent(token)}/sendMessage`;
  return postJson(url, { chat_id: chatId, text: String(text).slice(0, 4096), disable_web_page_preview: true });
}

function appendHistory(entry) {
  let rows = [];
  try {
    rows = JSON.parse(fs.readFileSync(HISTORY, 'utf8'));
    if (!Array.isArray(rows)) rows = [];
  } catch {
    rows = [];
  }
  rows.push(entry);
  const maxRows = Math.max(30, Number(process.env.OBSERVABILITY_HISTORY_MAX || 180));
  if (rows.length > maxRows) {
    rows = rows.slice(rows.length - maxRows);
  }
  fs.mkdirSync(path.dirname(HISTORY), { recursive: true });
  fs.writeFileSync(HISTORY, `${JSON.stringify(rows, null, 2)}\n`, 'utf8');
}

function main() {
  const emaTh = Number(process.env.OBSERVABILITY_EMA_THRESHOLD || 3);
  const fpTh = Number(process.env.OBSERVABILITY_FP_THRESHOLD || 3);
  const coolH = Number(process.env.OBSERVABILITY_WEBHOOK_COOLDOWN_HOURS || 12);

  const reg = readJson(path.join(root, 'automation', 'reports', 'incident-suppression-registry-latest.json'));
  const idx = readJson(path.join(root, 'automation', 'reports', 'automation-open-issues-index-latest.json'));

  const ema = Number(reg?.noise?.emaOpenIncidents ?? 0);
  const fpCount = Number(idx?.openAutomationFingerprintIssues ?? (idx?.issues || []).length ?? 0);
  const topFingerprints = Array.isArray(idx?.issues)
    ? [...idx.issues]
        .sort((a, b) => Number(b.ageHours || 0) - Number(a.ageHours || 0))
        .slice(0, 3)
        .map((row) => {
          const fp = Array.isArray(row.fingerprintLabels) && row.fingerprintLabels.length ? row.fingerprintLabels[0] : 'n/a';
          return `${fp} (#${row.number}, age ${Math.round(Number(row.ageHours || 0))}h)`;
        })
    : [];
  const mttrTrend = idx?.mttr?.trend;

  const emaBreached = Number.isFinite(ema) && ema >= emaTh;
  const fpBreached = Number.isFinite(fpCount) && fpCount >= fpTh;

  if (!emaBreached && !fpBreached) {
    console.log('observability-ema-webhook-digest: no threshold breach', { ema, fpCount });
    process.exit(0);
  }

  const state = readJson(STATE) || {};
  const lastAt = state.lastAlertAt ? new Date(state.lastAlertAt).getTime() : 0;
  const ageH = (Date.now() - lastAt) / 3600000;
  const force = process.env.OBSERVABILITY_WEBHOOK_FORCE === '1';
  if (!force && lastAt && ageH < coolH) {
    console.log('observability-ema-webhook-digest: cooldown active', ageH.toFixed(1), 'h');
    process.exit(0);
  }

  const text = [
    '[Zion observability] Threshold alert',
    `EMA open incidents: ${ema} (threshold ${emaTh}) ${emaBreached ? '⚠️' : 'OK'}`,
    `Open fingerprint issues: ${fpCount} (threshold ${fpTh}) ${fpBreached ? '⚠️' : 'OK'}`,
    mttrTrend && typeof mttrTrend.deltaHours === 'number'
      ? `MTTR trend: ${mttrTrend.direction} (${mttrTrend.deltaHours > 0 ? '+' : ''}${mttrTrend.deltaHours}h vs previous)`
      : '',
    topFingerprints.length ? `Top aged fingerprints: ${topFingerprints.join(' | ')}` : '',
    reg?.correlation?.workflowRunUrl ? `Registry: ${reg.correlation.workflowRunUrl}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const slack = process.env.AUTOMATION_DIGEST_SLACK_WEBHOOK || process.env.SLACK_WEBHOOK_URL;
  const discord = process.env.DISCORD_WEBHOOK_URL;
  const generic = process.env.GENERIC_WEBHOOK_URL;
  const telegramToken = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
  const telegramChatId = (process.env.TELEGRAM_CHAT_ID || '').trim();
  const pagerDuty = process.env.OBSERVABILITY_PAGERDUTY_ROUTING_KEY || process.env.PAGERDUTY_ROUTING_KEY;
  const opsgenie = process.env.OBSERVABILITY_OPSGENIE_WEBHOOK_URL;

  const tasks = [];
  if (slack) {
    tasks.push(postJson(slack, { text }));
  }
  if (discord) {
    tasks.push(postJson(discord, { content: text.slice(0, 2000) }));
  }
  if (generic) {
    tasks.push(postJson(generic, { text }));
  }
  if (telegramToken && telegramChatId) {
    tasks.push(postTelegram(telegramToken, telegramChatId, text));
  }
  if (pagerDuty && emaBreached && fpBreached) {
    tasks.push(
      postJson('https://events.pagerduty.com/v2/enqueue', {
        routing_key: pagerDuty,
        event_action: 'trigger',
        payload: {
          summary: text.slice(0, 1024),
          source: 'zion-observability-ema-fingerprint',
          severity: 'critical',
        },
      }),
    );
  }
  if (opsgenie && emaBreached && fpBreached) {
    tasks.push(
      postJson(opsgenie, {
        message: '[Zion observability] EMA + fingerprint dual breach',
        description: text.slice(0, 12000),
        priority: 'P2',
      }),
    );
  }

  if (tasks.length === 0) {
    console.log('observability-ema-webhook-digest: no webhooks configured; would alert:', text);
    appendHistory({
      timestamp: new Date().toISOString(),
      ema,
      fpCount,
      emaBreached,
      fpBreached,
      sent: false,
      reason: 'no-webhook-configured',
    });
    process.exit(0);
  }

  Promise.all(tasks)
    .then(() => {
      fs.mkdirSync(path.dirname(STATE), { recursive: true });
      fs.writeFileSync(
        STATE,
        `${JSON.stringify(
          {
            lastAlertAt: new Date().toISOString(),
            lastEmaBreached: emaBreached,
            lastFpBreached: fpBreached,
            ema,
            fpCount,
          },
          null,
          2,
        )}\n`,
        'utf8',
      );
      recordEscalation('observability-ema-webhook', {
        meta: { ema, fpCount, emaBreached, fpBreached },
      });
      appendHistory({
        timestamp: new Date().toISOString(),
        ema,
        fpCount,
        emaBreached,
        fpBreached,
        sent: true,
      });
      console.log('observability-ema-webhook-digest: sent');
      process.exit(0);
    })
    .catch((e) => {
      console.warn('observability-ema-webhook-digest:', e.message);
      process.exit(1);
    });
}

main();
