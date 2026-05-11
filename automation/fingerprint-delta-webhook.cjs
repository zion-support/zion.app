#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Notifies Slack/Discord when new automation-fp-* issues appear (vs last snapshot),
 * and optionally flags MTTR trend worsening from issue index.
 *
 * Requires: automation/reports/automation-open-issues-index-latest.json
 * State: automation/reports/fingerprint-delta-webhook-state.json
 *
 * Env:
 *   AUTOMATION_DIGEST_SLACK_WEBHOOK, DISCORD_WEBHOOK_URL, GENERIC_WEBHOOK_URL
 *   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID — optional Telegram sendMessage target
 *   FINGERPRINT_DELTA_WEBHOOK_COOLDOWN_HOURS (default 4) — min time between any sends
 *   FINGERPRINT_DELTA_WEBHOOK_FORCE — 1 bypasses cooldown
 *   FINGERPRINT_DELTA_MTTR_DELTA_MIN — min positive deltaHours to mention MTTR worsening (default 5)
 *   FINGERPRINT_DELTA_WEBHOOK_DRY_RUN
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const INDEX = path.join(REPORTS, 'automation-open-issues-index-latest.json');
const STATE = path.join(REPORTS, 'fingerprint-delta-webhook-state.json');

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

function postTelegram(token, chatId, text) {
  const url = `https://api.telegram.org/bot${encodeURIComponent(token)}/sendMessage`;
  return postJson(url, { chat_id: chatId, text: String(text).slice(0, 4096), disable_web_page_preview: true });
}

function writeJsonIfChanged(filePath, nextObj) {
  const next = `${JSON.stringify(nextObj, null, 2)}\n`;
  let prev = '';
  try {
    prev = fs.readFileSync(filePath, 'utf8');
  } catch {
    prev = '';
  }
  if (prev === next) return false;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, next, 'utf8');
  return true;
}

function main() {
  const dry = ['1', 'true', 'yes'].includes(String(process.env.FINGERPRINT_DELTA_WEBHOOK_DRY_RUN || '').toLowerCase());
  const coolH = Number(process.env.FINGERPRINT_DELTA_WEBHOOK_COOLDOWN_HOURS ?? 4);
  const force = process.env.FINGERPRINT_DELTA_WEBHOOK_FORCE === '1';
  const mttrMin = Number(process.env.FINGERPRINT_DELTA_MTTR_DELTA_MIN ?? 5);

  const idx = readJson(INDEX, null);
  if (!idx || !Array.isArray(idx.issues)) {
    console.log('[fingerprint-delta-webhook] no index; skip.');
    process.exit(0);
  }

  const prev = readJson(STATE, {});
  const prevNums = new Set(Array.isArray(prev.issueNumbers) ? prev.issueNumbers : []);

  const current = idx.issues.map((i) => Number(i.number)).filter((n) => Number.isFinite(n));
  /** First baseline run: record open set without notifying (avoids spamming full backlog). */
  if (prevNums.size === 0 && !prev.baselineRecorded) {
    writeJsonIfChanged(STATE, {
      ...prev,
      updatedAt: new Date().toISOString(),
      baselineRecorded: true,
      issueNumbers: current,
      lastNewIssueNumbers: [],
    });
    console.log('[fingerprint-delta-webhook] baseline recorded; no notify.');
    process.exit(0);
  }

  const newOnes = idx.issues.filter((i) => !prevNums.has(Number(i.number)));

  const mttr = idx.mttr && idx.mttr.trend ? idx.mttr.trend : null;
  const deltaHours =
    mttr && typeof mttr.deltaHours === 'number' && mttr.direction === 'worse' ? mttr.deltaHours : null;
  const mttrLine =
    deltaHours != null && deltaHours >= mttrMin
      ? `MTTR avg worsened ~+${deltaHours}h vs previous snapshot (direction: worse).`
      : null;

  if (newOnes.length === 0 && !mttrLine) {
    console.log('[fingerprint-delta-webhook] no new fp issues and no MTTR worsening; updating state only.');
    const prevCurrent = Array.isArray(prev.issueNumbers) ? prev.issueNumbers : [];
    const changed =
      prevCurrent.length !== current.length || prevCurrent.some((n, i) => Number(n) !== Number(current[i]));
    if (changed) {
      writeJsonIfChanged(STATE, {
        ...prev,
        updatedAt: new Date().toISOString(),
        issueNumbers: current,
        lastNewIssueNumbers: prev.lastNewIssueNumbers || [],
      });
    }
    process.exit(0);
  }

  const stCooldown = readJson(STATE, {});
  const lastSend = stCooldown.lastNotifyAt ? new Date(stCooldown.lastNotifyAt).getTime() : 0;
  const ageH = (Date.now() - lastSend) / 3600000;
  if (!force && lastSend && ageH < coolH) {
    console.log('[fingerprint-delta-webhook] cooldown', ageH.toFixed(2), 'h — skip notify (state unchanged)');
    process.exit(0);
  }

  const lines = ['[Zion automation] Fingerprint digest delta'];
  if (newOnes.length) {
    lines.push(`New automation-fp issues (${newOnes.length}):`);
    for (const i of newOnes.slice(0, 25)) {
      lines.push(`- #${i.number} ${i.title || ''}`.trim());
      if (i.url) lines.push(`  ${i.url}`);
    }
    if (newOnes.length > 25) lines.push(`…and ${newOnes.length - 25} more.`);
  }
  if (mttrLine) lines.push(mttrLine);

  const text = lines.join('\n').slice(0, 12000);

  const slack = process.env.AUTOMATION_DIGEST_SLACK_WEBHOOK || process.env.SLACK_WEBHOOK_URL;
  const discord = process.env.DISCORD_WEBHOOK_URL;
  const generic = process.env.GENERIC_WEBHOOK_URL;
  const telegramToken = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
  const telegramChatId = (process.env.TELEGRAM_CHAT_ID || '').trim();

  if (dry) {
    console.log('[fingerprint-delta-webhook] DRY_RUN:\n', text);
    process.exit(0);
  }

  const tasks = [];
  if (slack) tasks.push(postJson(slack, { text }));
  if (discord) tasks.push(postJson(discord, { content: text.slice(0, 2000) }));
  if (generic) tasks.push(postJson(generic, { text }));
  if (telegramToken && telegramChatId) tasks.push(postTelegram(telegramToken, telegramChatId, text));

  if (tasks.length === 0) {
    console.log('[fingerprint-delta-webhook] no webhooks; would send:\n', text);
    process.exit(0);
  }

  Promise.all(tasks)
    .then(() => {
      writeJsonIfChanged(STATE, {
        ...prev,
        updatedAt: new Date().toISOString(),
        baselineRecorded: true,
        lastNotifyAt: new Date().toISOString(),
        issueNumbers: current,
        lastNewIssueNumbers: newOnes.map((i) => i.number),
        indexGeneratedAt: idx.generatedAt || null,
      });
      console.log('[fingerprint-delta-webhook] sent');
      process.exit(0);
    })
    .catch((e) => {
      console.warn('[fingerprint-delta-webhook]', e.message);
      process.exit(1);
    });
}

main();
