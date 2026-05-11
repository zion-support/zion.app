#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Optional Telegram ping when deploy contention is high but deploy is not blocked.
 * Reads automation/reports/pm2-deploy-contention-latest.json (from contention guard).
 *
 * Env:
 *   DEPLOY_CONTENTION_NOTIFY_TELEGRAM=1   — also set from deploy.cjs when same
 *   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID  — same as ai-telegram-notification-agent
 *   PM2_CONTENTION_NOTIFY_COOLDOWN_HOURS  — min hours between sends (default 6)
 *   DEPLOY_CONTENTION_NOTIFY_ON_MEDIUM=1  — also notify when riskLevel is medium
 *   SLACK_WEBHOOK_URL / DISCORD_WEBHOOK_URL — optional fan-out (plain text; same cooldown as Telegram)
 *   PAGERDUTY_ROUTING_KEY — Events API v2 trigger (summary = plain text)
 *   GENERIC_WEBHOOK_URL — POST JSON { "text": "<plain>" } (Slack-compatible; same cooldown)
 *   DEPLOY_CONTENTION_NOTIFY_WEBHOOKS_ONLY=1 — skip Telegram; only webhooks (if any hook configured)
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const REPORT_PATH = path.join(ROOT, 'automation', 'reports', 'pm2-deploy-contention-latest.json');
const STATE_PATH = path.join(ROOT, 'automation', 'reports', 'pm2-deploy-contention-notify-state.json');
const COOLDOWN_H = Number(process.env.PM2_CONTENTION_NOTIFY_COOLDOWN_HOURS || '6');

function readJson(p) {
  try {
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function shouldNotify(report) {
  if (!report || typeof report.riskScore !== 'number') return false;
  if (report.blockOnRisk === true) {
    console.log('[contention-notify] blockOnRisk=true (deploy would fail); skip duplicate Telegram.');
    return false;
  }
  const mediumOk =
    process.env.DEPLOY_CONTENTION_NOTIFY_ON_MEDIUM === '1' ||
    process.env.DEPLOY_CONTENTION_NOTIFY_ON_MEDIUM === 'true';
  if (report.riskLevel === 'high') return true;
  if (mediumOk && report.riskLevel === 'medium') return true;
  return false;
}

function cooldownAllows() {
  const state = readJson(STATE_PATH);
  const last = state && state.lastSentAt ? Date.parse(state.lastSentAt) : 0;
  if (!last) return true;
  const hours = (Date.now() - last) / 3600000;
  if (hours < COOLDOWN_H) {
    console.log(`[contention-notify] Cooldown active (${hours.toFixed(2)}h < ${COOLDOWN_H}h).`);
    return false;
  }
  return true;
}

function writeState() {
  fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true });
  fs.writeFileSync(
    STATE_PATH,
    JSON.stringify({ lastSentAt: new Date().toISOString() }, null, 2),
  );
}

function postJsonWebhook(url, bodyObj) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const body = JSON.stringify(bodyObj);
      const req = https.request(
        {
          hostname: u.hostname,
          path: u.pathname + u.search,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
          },
        },
        (res) => {
          res.on('data', () => {});
          res.on('end', () => resolve(res.statusCode >= 200 && res.statusCode < 300));
        },
      );
      req.on('error', () => resolve(false));
      req.write(body);
      req.end();
    } catch {
      resolve(false);
    }
  });
}

async function notifyWebhooks(plainText) {
  const slack = process.env.SLACK_WEBHOOK_URL;
  const discord = process.env.DISCORD_WEBHOOK_URL;
  const generic = process.env.GENERIC_WEBHOOK_URL;
  const pdKey = process.env.PAGERDUTY_ROUTING_KEY;

  const pairs = [];
  if (slack) pairs.push(['slack', slack, { text: plainText.slice(0, 4000) }]);
  if (discord) pairs.push(['discord', discord, { content: plainText.slice(0, 2000) }]);
  if (generic) pairs.push(['generic', generic, { text: plainText.slice(0, 4000) }]);

  for (const [name, url, body] of pairs) {
    const ok = await postJsonWebhook(url, body);
    console.log(`[contention-notify] ${name}: ${ok ? 'ok' : 'failed'}`);
  }

  if (pdKey) {
    const pdBody = {
      routing_key: pdKey,
      event_action: 'trigger',
      payload: {
        summary: plainText.slice(0, 1024),
        source: 'zion-pm2-deploy-contention',
        severity: 'warning',
      },
    };
    const ok = await postJsonWebhook('https://events.pagerduty.com/v2/enqueue', pdBody);
    console.log(`[contention-notify] pagerduty: ${ok ? 'ok' : 'failed'}`);
  }
}

function main() {
  const report = readJson(REPORT_PATH);
  if (!report) {
    console.log('[contention-notify] No contention report yet.');
    process.exit(0);
  }
  if (!shouldNotify(report)) {
    process.exit(0);
  }
  if (!cooldownAllows()) {
    process.exit(0);
  }

  const msgHtml = [
    '⚠️ <b>Deploy contention</b>',
    `riskScore=${report.riskScore} level=${report.riskLevel}`,
    `threshold=${report.threshold ?? '—'}`,
    report.recommendation ? `Tip: ${report.recommendation}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const plain = msgHtml.replace(/<[^>]+>/g, '');

  const webhooksOnly =
    process.env.DEPLOY_CONTENTION_NOTIFY_WEBHOOKS_ONLY === '1' ||
    process.env.DEPLOY_CONTENTION_NOTIFY_WEBHOOKS_ONLY === 'true';
  const hasHook = !!(
    process.env.SLACK_WEBHOOK_URL ||
    process.env.DISCORD_WEBHOOK_URL ||
    process.env.GENERIC_WEBHOOK_URL ||
    process.env.PAGERDUTY_ROUTING_KEY
  );

  (async () => {
    if (hasHook) {
      await notifyWebhooks(`Deploy contention: ${plain}`);
    }

    if (webhooksOnly && !hasHook) {
      console.error('[contention-notify] WEBHOOKS_ONLY set but no webhook URLs configured');
      process.exit(1);
      return;
    }

    if (!webhooksOnly) {
      const r = spawnSync(
        process.execPath,
        [path.join(ROOT, 'automation', 'ai-telegram-notification-agent.cjs'), 'send', msgHtml],
        { cwd: ROOT, stdio: 'inherit', env: process.env },
      );
      if (r.status !== 0) {
        console.error('[contention-notify] Telegram send exited', r.status);
        process.exit(1);
        return;
      }
    }

    writeState();
  })().catch(() => process.exit(1));
}

main();
