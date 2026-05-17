#!/usr/bin/env node
/**
 * Smart Email Responder v2 — Autonomous, Intelligent Email Processing
 * Free tools only: IMAP + LLM classification + custom draft generation
 * Zero cost, self-hosted, dry-run by default
 */

const { simpleParser } = require('mailparser');
const { Imap } = require('imap');

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CONFIG = {
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 993,
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
  mailbox: process.env.EMAIL_MAILBOX || 'INBOX',
  dryRun: process.env.EMAIL_DRY_RUN !== 'false',
  confidenceThreshold: parseFloat(process.env.EMAIL_CONFIDENCE_THRESHOLD) || 0.75,
  llmEndpoint: process.env.EMAIL_LLM_ENDPOINT || 'http://localhost:3000/api/llm/chat',
  pollInterval: parseInt(process.env.EMAIL_POLL_INTERVAL) || 300000,
  baseUrl: process.env.BASE_URL || 'https://ziontechgroup.com',
  autoSendDelay: parseInt(process.env.EMAIL_AUTO_SEND_DELAY) || 0, // safety delay (ms)
};

const QUEUE_DIR = path.join(process.cwd(), 'automation', 'email-queue');
fs.mkdirSync(QUEUE_DIR, { recursive: true });

const PENDING = path.join(QUEUE_DIR, 'pending.json');
const PROCESSED = path.join(QUEUE_DIR, 'processed.json');
const FOLLOWUP = path.join(QUEUE_DIR, 'followups.json');
const FAILED = path.join(QUEUE_DIR, 'failed.json');

let pendingQueue = []; let processedLog = []; let failedLog = []; let followups = [];
if (fs.existsSync(PENDING)) pendingQueue = JSON.parse(fs.readFileSync(PENDING, 'utf8'));
if (fs.existsSync(PROCESSED)) processedLog = JSON.parse(fs.readFileSync(PROCESSED, 'utf8'));
if (fs.existsSync(FAILED)) failedLog = JSON.parse(fs.readFileSync(FAILED, 'utf8'));
if (fs.existsSync(FOLLOWUP)) followups = JSON.parse(fs.readFileSync(FOLLOWUP, 'utf8'));

let imap = null;

function connectImap() {
  return new Promise((resolve, reject) => {
    imap = new Imap({ host: CONFIG.host, port: CONFIG.port, tls: true, auth: { user: CONFIG.user, pass: CONFIG.pass } });
    imap.once('ready', () => resolve());
    imap.once('error', (err) => reject(err));
    imap.connect();
  });
}

function searchUnseen(cb) {
  imap.openBox(CONFIG.mailbox, false, (err) => {
    if (err) return cb(err);
    // Also search for older high-urgency emails not yet processed
    imap.search(['UNSEEN'], cb);
  });
}

function fetchMessages(ids, cb) {
  const f = imap.seq.fetch(ids, { bodies: '' });
  const messages = [];
  f.on('message', (msg) => {
    let raw = '';
    msg.on('body', (stream) => { stream.on('data', (chunk) => raw += chunk.toString('utf8')); });
    msg.once('end', async () => {
      try {
        const parsed = await simpleParser(raw);
        messages.push(parsed);
      } catch (e) { console.error('Parse error:', e.message); }
    });
  });
  f.once('error', cb);
  f.once('end', () => cb(null, messages));
}

// Advanced classifier — intent + sub-intent + urgency + sentiment
async function classifyEmail(email) {
  const bodyPreview = (email.text || '').slice(0, 1500);
  const hasAttachments = (email.attachments || []).length > 0;

  const prompt = `Analyze this email thoroughly and return JSON only.

Email:
From: ${email.from?.text || 'unknown'}
Subject: ${email.subject || '(no subject)'}
Has Attachments: ${hasAttachments}
Body: ${bodyPreview}

Classify:
1. intent (one): sales, support, partnership, feedback, spam, internal, inquiry
2. sub_intent (optional): for sales → [budget-inquiry, demo-request, pricing-question, general-interest]
   for support → [bug-report, feature-request, how-to, billing-issue]
   for partnership → [affiliate, reseller, integration, co-marketing]
3. urgency (one): low, normal, high, critical
4. sentiment (one): positive, neutral, negative, angry
5. requires_human (boolean): true if sensitive/legal/complex/angry/payment
6. confidence (0.0–1.0): your certainty

Return EXACTLY this JSON schema:
{
  "intent": "...",
  "sub_intent": "...",
  "urgency": "...",
  "sentiment": "...",
  "requires_human": boolean,
  "confidence": 0.0-1.0,
  "reason": "one-sentence explanation",
  "suggested_action": "auto_reply|create_ticket|escalate|pending_review|ignore"
}`;

  try {
    const resp = await fetch(CONFIG.llmEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, temperature: 0.15, max_tokens: 300 })
    });
    const data = await resp.json();
    const text = (data.text || data.response || '').trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return { intent: 'unclassified', sub_intent: null, urgency: 'normal', sentiment: 'neutral', requires_human: false, confidence: 0, reason: 'unparseable', suggested_action: 'pending_review' };
  } catch (e) {
    return { intent: 'unclassified', sub_intent: null, urgency: 'normal', sentiment: 'neutral', requires_human: false, confidence: 0, reason: e.message, suggested_action: 'pending_review' };
  }
}

// Generate personalized reply using LLM (not templates)
async function generateReply(email, classification) {
  const context = {
    intent: classification.intent,
    sub_intent: classification.sub_intent || '',
    urgency: classification.urgency,
    user_email: email.from?.text || 'user@example.com',
    company: 'Zion Tech Group',
    services_url: `${CONFIG.baseUrl}/services`,
    contact_phone: '+1 302 464 0950',
    contact_email: 'kleber@ziontechgroup.com',
    address: '364 E Main St STE 1008 Middletown DE 19709'
  };

  let style = 'friendly, professional, concise';
  if (classification.sentiment === 'negative' || classification.urgency === 'critical') style = 'empathetic, urgent, solution-oriented';
  if (classification.intent === 'partnership') style = 'formal, respectful, business-like';

  const prompt = `Write a personalized email reply. Do NOT include subject line.

Context:
${JSON.stringify(context, null, 2)}

Original email (for reference only — do not quote it):
Subject: ${email.subject || '(no subject)'}
Body preview: ${(email.text || '').slice(0, 800)}

Instructions:
- Match tone: ${style}
- If intent=sales: include top services recommendation (call to action to browse /services or reply with needs)
- If intent=support: acknowledge issue, give ticket ID (auto-${Date.now()}), promise response within SLA
- If intent=partnership: thank them, state we'll review within 2 business days
- If intent=feedback: thank them, note their input
- If intent=inquiry: answer based on available info, or promise follow-up
- If spam/ignored: do not write reply
- If requires_human: write acknowledgment + promise human follow-up

Write 3–5 sentences maximum.`;

  try {
    const resp = await fetch(CONFIG.llmEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, temperature: 0.4, max_tokens: 300 })
    });
    const data = await resp.json();
    return (data.text || data.response || '').trim();
  } catch (e) {
    return null;
  }
}

// Action dispatch
async function takeAction(email, classification, customReply = null) {
  if (classification.suggested_action === 'ignore' || classification.intent === 'spam') {
    return { action: 'ignored', reason: 'spam/low-value' };
  }

  const replyBody = customReply || classification.intent ? await generateReply(email, classification) : null;

  if (CONFIG.dryRun) {
    console.log(`[DRY-RUN] Would handle: ${email.from?.text} → ${classification.intent}/${classification.sub_intent || 'general'} (${(classification.confidence*100).toFixed(0)}%)`);
    if (replyBody) console.log(`  [DRAFT] ${replyBody.slice(0, 120)}...`);
    return { action: 'dry_run', reply: replyBody ? replyBody.slice(0, 200) : null };
  }

  // TODO: SMTP send (awaiting integration)
  console.log(`[ACTION] ${classification.intent} from ${email.from?.text} — SMTP pending`);
  return { action: 'queued', reply: replyBody ? replyBody.slice(0, 200) : null, sent: false };
}

// Priority check — urgency-based
function getPriority(classification) {
  if (classification.urgency === 'critical' || classification.requires_human) return 10;
  if (classification.urgency === 'high') return 7;
  if (classification.intent === 'support' && classification.sentiment === 'negative') return 6;
  if (classification.intent === 'partnership') return 5;
  if (classification.intent === 'sales') return 3;
  return 1;
}

async function processEmail(email) {
  const classification = await classifyEmail(email);
  const priority = getPriority(classification);

  // Flag attachments
  const attachmentInfo = (email.attachments || []).map(a => ({ filename: a.filename, size: a.size, content_type: a.contentType }));

  const actionResult = await takeAction(email, classification);

  const record = {
    id: email.messageId || crypto.randomUUID(),
    from: email.from?.text || 'unknown',
    subject: email.subject || '(no subject)',
    intent: classification.intent,
    sub_intent: classification.sub_intent || null,
    urgency: classification.urgency,
    sentiment: classification.sentiment,
    requires_human: classification.requires_human,
    confidence: classification.confidence,
    reason: classification.reason,
    action: classification.suggested_action,
    priority,
    attachments: attachmentInfo,
    reply: actionResult,
    receivedAt: email.date ? new Date(email.date).toISOString() : new Date().toISOString(),
    processedAt: new Date().toISOString(),
    dryRun: CONFIG.dryRun
  };

  if (classification.confidence >= CONFIG.confidenceThreshold && !classification.requires_human) {
    processedLog.unshift(record);
    if (processedLog.length > 2000) processedLog.pop();
    fs.writeFileSync(PROCESSED, JSON.stringify(processedLog, null, 2));
    console.log(`✅ ${record.from} → ${record.intent}/${record.sub_intent || 'general'} [P${priority}] (${(classification.confidence*100).toFixed(0)}%)`);
  } else {
    pendingQueue.unshift(record);
    fs.writeFileSync(PENDING, JSON.stringify(pendingQueue, null, 2));
    console.log(`⏳ Pending [P${priority}]: ${record.from} → ${record.intent} (${(classification.confidence*100).toFixed(0)}%)`);
  }
}

async function runCycle() {
  if (!imap) await connectImap();
  searchUnseen((err, ids) => {
    if (err) return console.error('Search error:', err);
    if (!ids || ids.length === 0) return console.log('📭 No unread emails');

    console.log(`📬 Found ${ids.length} unread emails`);
    fetchMessages(ids, (err, messages) => {
      if (err) return console.error('Fetch error:', err);
      (async () => {
        for (const msg of messages) {
          try {
            await processEmail(msg);
          } catch (e) {
            console.error('❌ Processing failed:', e.message);
            failedLog.unshift({ error: e.message, at: new Date().toISOString() });
            fs.writeFileSync(FAILED, JSON.stringify(failedLog, null, 2));
          }
        }
        console.log(`🔄 Cycle complete — sleeping ${CONFIG.pollInterval / 1000}s`);
      })();
    });
  });
}

async function startDaemon() {
  console.log(`🤖 Smart Email Responder v2 starting…`);
  console.log(`📧 ${CONFIG.user}@${CONFIG.host} | Dry-run: ${CONFIG.dryRun} | Threshold: ${CONFIG.confidenceThreshold}`);

  while (true) {
    try {
      await runCycle();
      // Follow-up scan: send gentle follow-ups to unanswered sales threads older than 48h
      await scanFollowups();
    } catch (e) {
      console.error('⚠️ Cycle error, reconnecting:', e.message);
      try { imap?.end(); } catch (_) {}
      imap = null;
    }
    await new Promise(r => setTimeout(r, CONFIG.pollInterval));
  }
}

// Follow-up scanner — checks processed log for threads needing touch
async function scanFollowups() {
  const FOLLOWUP_DELAY = 48 * 60 * 60 * 1000; // 48h
  const now = Date.now();

  // Find processed sales emails without replies (dry-run, or no action taken)
  const needsFollowup = processedLog.filter(p =>
    p.intent === 'sales' &&
    (!p.reply || !p.reply.sent) &&
    (now - new Date(p.processedAt).getTime()) > FOLLOWUP_DELAY
  ).slice(0, 5);

  for (const item of needsFollowup) {
    console.log(`[FOLLOWUP] ${item.from} — thread ${item.id} (${item.subject}) needs follow-up`);
    // TODO: send follow-up template via SMTP
    // For now, log to followups.json
    followups.unshift({ emailId: item.id, from: item.from, scheduledAt: new Date().toISOString(), sent: false });
    fs.writeFileSync(FOLLOWUP, JSON.stringify(followups, null, 2));
  }
}

// Single-run mode
if (process.argv.includes('--once')) {
  runCycle().then(() => {
    try { imap?.end(); } catch (_) {}
    process.exit(0);
  }).catch(e => { console.error(e); process.exit(1); });
} else {
  startDaemon();
}
