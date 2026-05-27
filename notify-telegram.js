// notify-telegram.js - minimal stub for workflow notifications
const https = require('https');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

function notify(message) {
  console.log(`notify: ${message}`);
  // Stub - would send to Telegram if credentials provided
}

module.exports = { notify };
