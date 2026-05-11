#!/usr/bin/env node

/**
 * AI Telegram Notification Agent
 *
 * Sends automation alerts to Telegram (health, Lighthouse, security, stale content).
 * Respects USER.md: no notifications 23:00–08:00 (America/Sao_Paulo), urgent prefix [URGENTE].
 *
 * Environment:
 *   TELEGRAM_BOT_TOKEN  - Bot token from @BotFather
 *   TELEGRAM_CHAT_ID    - Chat ID to receive messages
 *
 * Usage:
 *   node automation/ai-telegram-notification-agent.cjs send "Message"
 *   node automation/ai-telegram-notification-agent.cjs health
 *   node automation/ai-telegram-notification-agent.cjs digest
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// USER.md: Kleber sleeps at 23h, America/Sao_Paulo
const QUIET_START_HOUR = 23;
const QUIET_END_HOUR = 8;
const TZ = process.env.TZ || 'America/Sao_Paulo';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[TelegramNotify] ${ts} | ${msg}`);
}

function getLocalHour() {
  try {
    return parseInt(new Date().toLocaleString('en-US', { timeZone: TZ, hour: 'numeric', hour12: false }), 10);
  } catch {
    return new Date().getHours();
  }
}

function isQuietHours() {
  const h = getLocalHour();
  if (QUIET_START_HOUR > QUIET_END_HOUR) {
    return h >= QUIET_START_HOUR || h < QUIET_END_HOUR;
  }
  return h >= QUIET_START_HOUR && h < QUIET_END_HOUR;
}

function sendTelegram(text, options = {}) {
  if (!BOT_TOKEN || !CHAT_ID) {
    log('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set. Skipping send.');
    return Promise.resolve({ ok: false, skipped: true });
  }

  if (options.respectQuietHours !== false && isQuietHours()) {
    if (!text.startsWith('[URGENTE]')) {
      log('Quiet hours (23h–08h). Skipping non-urgent message.');
      return Promise.resolve({ ok: false, quietHours: true });
    }
  }

  const body = JSON.stringify({
    chat_id: CHAT_ID,
    text: text.slice(0, 4096),
    parse_mode: options.parseMode || 'HTML',
    disable_web_page_preview: true,
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.telegram.org',
        path: `/bot${BOT_TOKEN}/sendMessage`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const j = JSON.parse(data);
            resolve(j);
          } catch {
            resolve({ ok: false, raw: data });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function escapeHtml(s) {
  if (typeof s !== 'string') return String(s);
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function readJsonSafe(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (e) {
    log(`Could not read ${filePath}: ${e.message}`);
  }
  return null;
}

function cmdSend(args) {
  const text = args.join(' ').trim();
  if (!text) {
    log('Usage: send "your message"');
    process.exit(1);
  }
  return sendTelegram(text, { respectQuietHours: false }).then((r) => {
    if (r.ok) log('Sent.');
    else log(`Send failed: ${JSON.stringify(r)}`);
  });
}

function cmdHealth() {
  const report = readJsonSafe(path.join(REPORTS_DIR, 'health-monitor-latest.json'));
  if (!report) {
    return sendTelegram('⚠️ Health report not found. Run automation:health first.');
  }
  const score = report.score ?? 0;
  const issues = report.issues ?? [];
  const emoji = score >= 90 ? '✅' : score >= 70 ? '⚠️' : '🔴';
  let msg = `${emoji} <b>Zion Automation Health</b>\nScore: ${score}/100`;
  if (issues.length > 0) {
    msg += '\n\nIssues:\n' + issues.slice(0, 5).map((i) => '• ' + escapeHtml(i)).join('\n');
    if (issues.length > 5) msg += `\n... +${issues.length - 5} more`;
  }
  return sendTelegram(msg);
}

function cmdDigest() {
  const parts = [];
  const health = readJsonSafe(path.join(REPORTS_DIR, 'health-monitor-latest.json'));
  const lighthouse = readJsonSafe(path.join(REPORTS_DIR, 'lighthouse-production-latest.json'));
  const freshness = readJsonSafe(path.join(REPORTS_DIR, 'content-freshness-latest.json'));
  const siteHealth = readJsonSafe(path.join(REPORTS_DIR, 'site-health-report.json'));

  if (health) {
    const s = health.score ?? 0;
    parts.push(`Health: ${s}/100 ${s >= 80 ? '✅' : '⚠️'}`);
  }
  if (lighthouse && lighthouse.categories) {
    const p = lighthouse.categories.performance?.score ?? 0;
    const a = lighthouse.categories.accessibility?.score ?? 0;
    const seo = lighthouse.categories.seo?.score ?? 0;
    parts.push(`Lighthouse: P${Math.round(p * 100)} A${Math.round(a * 100)} SEO${Math.round(seo * 100)}`);
  }
  if (freshness && freshness.stale?.length > 0) {
    parts.push(`Stale content: ${freshness.stale.length} items`);
  }
  if (siteHealth && siteHealth.pages) {
    const p = siteHealth.pages;
    const down = Array.isArray(p.results) ? p.results.filter((r) => !r.ok).length : (p.failed ?? 0);
    if (down > 0) parts.push(`Site down: ${down} pages`);
  }
  const outdated = readJsonSafe(path.join(REPORTS_DIR, 'dependency-outdated-latest.json'));
  if (outdated && outdated.byType && outdated.total > 0) {
    const { major, minor, patch } = outdated.byType;
    parts.push(`Outdated deps: ${major} major, ${minor} minor, ${patch} patch`);
  }
  const bundleSize = readJsonSafe(path.join(REPORTS_DIR, 'bundle-size-monitor-latest.json'));
  if (bundleSize && bundleSize.regression) {
    parts.push(`Bundle regression: +${bundleSize.regression.percent}%`);
  }

  const msg = '<b>Zion Daily Digest</b>\n\n' + (parts.length ? parts.join('\n') : 'All systems nominal.');
  return sendTelegram(msg);
}

function cmdLighthouse() {
  const report = readJsonSafe(path.join(REPORTS_DIR, 'lighthouse-production-latest.json'));
  if (!report || !report.categories) {
    return sendTelegram('⚠️ Lighthouse report not found.');
  }
  const c = report.categories;
  const p = Math.round((c.performance?.score ?? 0) * 100);
  const a = Math.round((c.accessibility?.score ?? 0) * 100);
  const bp = Math.round((c['best-practices']?.score ?? 0) * 100);
  const seo = Math.round((c.seo?.score ?? 0) * 100);
  const emoji = p >= 80 && a >= 90 ? '✅' : '⚠️';
  const msg = `${emoji} <b>Lighthouse</b> ziontechgroup.com\nPerf: ${p} | A11y: ${a} | BP: ${bp} | SEO: ${seo}`;
  return sendTelegram(msg);
}

function cmdFreshness() {
  const report = readJsonSafe(path.join(REPORTS_DIR, 'content-freshness-latest.json'));
  if (!report) return sendTelegram('⚠️ Content freshness report not found.');
  const stale = report.stale ?? [];
  const warn = report.warning ?? [];
  if (stale.length === 0 && warn.length === 0) {
    return sendTelegram('✅ Content freshness: all content within thresholds.');
  }
  let msg = '📄 <b>Content Freshness</b>\n';
  if (stale.length > 0) msg += `Stale (${stale.length}): ${stale.slice(0, 3).map((s) => s.slug || s.path).join(', ')}${stale.length > 3 ? '...' : ''}\n`;
  if (warn.length > 0) msg += `Warning (${warn.length}): ${warn.slice(0, 3).map((w) => w.slug || w.path).join(', ')}${warn.length > 3 ? '...' : ''}`;
  return sendTelegram(msg);
}

function main() {
  const cmd = process.argv[2];
  const args = process.argv.slice(3);

  const handlers = {
    send: () => cmdSend(args),
    health: cmdHealth,
    digest: cmdDigest,
    lighthouse: cmdLighthouse,
    freshness: cmdFreshness,
  };

  const fn = handlers[cmd];
  if (!fn) {
    log('Usage: send|health|digest|lighthouse|freshness [args...]');
    process.exit(1);
  }

  fn()
    .then((r) => {
      if (r && r.ok === false && !r.skipped && !r.quietHours) {
        log(JSON.stringify(r));
      }
    })
    .catch((err) => {
      log(`Error: ${err.message}`);
      process.exit(1);
    });
}

main();
