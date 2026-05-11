#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Optional Slack / Discord / generic webhook for weekly triage digest markdown.
 *
 * Env:
 *   AUTOMATION_DIGEST_SLACK_WEBHOOK, DISCORD_WEBHOOK_URL, GENERIC_WEBHOOK_URL (same as other digests)
 *   WEEKLY_TRIAGE_WEBHOOK_COOLDOWN_HOURS (default 168 = 1 week)
 *   WEEKLY_TRIAGE_WEBHOOK_FORCE — set 1 to bypass cooldown
 *   WEEKLY_TRIAGE_WEBHOOK_DRY_RUN
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const MD = path.join(REPORTS, 'weekly-automation-triage-digest-latest.md');
const STATE = path.join(REPORTS, 'weekly-triage-webhook-state.json');

function readJson(p, fb) {
  try {
    if (!fs.existsSync(p)) return fb;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return fb;
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
  const dry = ['1', 'true', 'yes'].includes(String(process.env.WEEKLY_TRIAGE_WEBHOOK_DRY_RUN || '').toLowerCase());
  const coolH = Number(process.env.WEEKLY_TRIAGE_WEBHOOK_COOLDOWN_HOURS ?? 168);
  const force = process.env.WEEKLY_TRIAGE_WEBHOOK_FORCE === '1';

  if (!fs.existsSync(MD)) {
    console.log('[weekly-triage-webhook] no digest markdown; skip.');
    process.exit(0);
  }

  const text = fs.readFileSync(MD, 'utf8').trim();
  if (!text) {
    console.log('[weekly-triage-webhook] empty digest; skip.');
    process.exit(0);
  }

  const st = readJson(STATE, {});
  const lastAt = st.lastNotifyAt ? new Date(st.lastNotifyAt).getTime() : 0;
  const ageH = (Date.now() - lastAt) / 3600000;
  if (!force && lastAt && ageH < coolH) {
    console.log('[weekly-triage-webhook] cooldown', ageH.toFixed(1), 'h <', coolH);
    process.exit(0);
  }

  const slack = process.env.AUTOMATION_DIGEST_SLACK_WEBHOOK || process.env.SLACK_WEBHOOK_URL;
  const discord = process.env.DISCORD_WEBHOOK_URL;
  const generic = process.env.GENERIC_WEBHOOK_URL;

  const slackText = text.slice(0, 12000);
  const discordContent = text.slice(0, 2000);

  if (dry) {
    console.log('[weekly-triage-webhook] DRY_RUN: would notify', { slack: Boolean(slack), discord: Boolean(discord) });
    process.exit(0);
  }

  const tasks = [];
  if (slack) tasks.push(postJson(slack, { text: slackText }));
  if (discord) tasks.push(postJson(discord, { content: discordContent }));
  if (generic) tasks.push(postJson(generic, { text: slackText }));

  if (tasks.length === 0) {
    console.log('[weekly-triage-webhook] no webhooks configured; digest chars=', text.length);
    process.exit(0);
  }

  Promise.all(tasks)
    .then(() => {
      fs.mkdirSync(path.dirname(STATE), { recursive: true });
      fs.writeFileSync(
        STATE,
        `${JSON.stringify({ lastNotifyAt: new Date().toISOString(), digestChars: text.length }, null, 2)}\n`,
        'utf8',
      );
      console.log('[weekly-triage-webhook] sent');
      process.exit(0);
    })
    .catch((e) => {
      console.warn('[weekly-triage-webhook]', e.message);
      process.exit(1);
    });
}

main();
