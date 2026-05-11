#!/usr/bin/env node
/**
 * send-telegram-alert.cjs
 * Reads public/dashboard.json and posts a Telegram alert if any workflow failures are found.
 * Intended to be run by a scheduled GitHub Actions workflow.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const {
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID,
} = process.env;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error('❌ Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID environment variables.');
  process.exit(1);
}

const DASHBOARD_PATH = path.join(__dirname, '..', 'public', 'dashboard.json');

async function main() {
  try {
    const raw = fs.readFileSync(DASHBOARD_PATH, 'utf8');
    const runs = JSON.parse(raw);

    // Filter failures
    const failures = runs.filter(run => run.conclusion === 'failure');

    if (failures.length === 0) {
      console.log('✅ No failures found – no alert needed.');
      return;
    }

    // Build alert message
    const failureTitles = failures.map(run => `*${run.name}*`);
    const count = failures.length;
    const pct = (count / runs.length * 100).toFixed(1);
    const emoji = ':warning:';

    const message = `
${emoji} *CI Pipeline Failures Detected* :warning:

*Failed runs:* ${failureTitles.join(', ')}
*Count:* ${count} / ${runs.length} (${pct}%)

Please investigate ASAP.
`;

    // Post to Telegram
    const encode = text => encodeURIComponent(text);
    const payload = {
      chat_id: TELEGRAM_CHAT_ID,
      parse_mode: 'Markdown',
      text: message,
    };

    const resp = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await resp.json();
    if (!result.ok) {
      console.error('❌ Telegram API error:', result.description);
      process.exit(1);
    }

    console.log('✅ Telegram alert sent.');
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    process.exit(1);
  }
}

main();
