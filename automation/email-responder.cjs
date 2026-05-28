#!/usr/bin/env node
/**
 * Intelligent Email Responder v3.0
 * All Python code written to separate files to avoid escaping issues
 * Features: intent classification, AI analysis, smart Reply-All, case-by-case handling
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const LOG = '/Users/miami2/zion.app/automation/logs/email-responder.log';
const STATE = '/Users/miami2/zion.app/automation/logs/email-responder-state.json';

const CONTACT = { phone: '+1 302 464 0950', email: 'kleber@ziontechgroup.com', address: '364 E Main St STE 1008 Middletown DE 19709' };
const TYPES = { SUPPORT: 'support', SALES: 'sales', PARTNERSHIP: 'partnership', JOB: 'job', URGENT: 'urgent', GENERAL: 'general' };
const KEYWORDS = {
  support: ['help','issue','problem','error','bug','fix','not working','broken','fail','unable'],
  sales: ['price','cost','buy','purchase','quote','demo','trial','pricing','interested','package','budget'],
  partnership: ['partner','reseller','affiliate','collaborate','joint','venture','strategic','integration'],
  job: ['resume','cv','hire','job','career','position','apply','recruit'],
  urgent: ['urgent','asap','immediately','emergency','critical','deadline','priority']
};

function log(msg) {
  const ts = new Date().toISOString();
  console.log('[' + ts + '] ' + msg);
  fs.appendFileSync(LOG, '[' + ts + '] ' + msg + '\n');
}

function getState() {
  try { return fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, 'utf8')) : { lastUID: 0, processedCount: 0, stats: {} }; }
  catch(e) { return { lastUID: 0, processedCount: 0, stats: {} }; }
}

function saveState(s) { fs.writeFileSync(STATE, JSON.stringify(s, null, 2)); }

function classify(subject, body) {
  const text = (subject + ' ' + body).toLowerCase();
  if (KEYWORDS.urgent.some(k => text.includes(k))) return 'urgent';
  let best = 'general', max = 0;
  for (const [type, kws] of Object.entries(KEYWORDS)) {
    if (type === 'urgent') continue;
    const score = kws.reduce((a, k) => a + (text.includes(k) ? 1 : 0), 0);
    if (score > max) { max = score; best = type; }
  }
  return best;
}

function extractName(from) {
  const m = from.match(/^"?([^"<]+)"?\s*</);
  return m ? m[1].trim() : from.split('@')[0];
}

function extractEmailAddr(from) {
  const m = from.match(/<([^>]+)>/);
  return m ? m[1].trim() : from;
}

function extractCCList(cc) {
  if (!cc) return [];
  const emails = [];
  for (const m of cc.matchAll(/<([^>]+)>/g)) emails.push(m[1].trim());
  return emails;
}

function makeResponse(type, subject, name) {
  const n = name || 'Valued Contact';
  const base = {
    support: 'Dear ' + n + ',\n\nThank you for contacting Zion Tech Group support regarding: "' + subject + '"\n\nOur technical team will provide diagnosis and resolution within 24-48 hours. For critical issues call ' + CONTACT.phone + ' immediately.\n\nBest regards,\nZion Tech Group Support Team\n' + CONTACT.email + ' | ' + CONTACT.phone,
    sales: 'Dear ' + n + ',\n\nThank you for your interest in Zion Tech Group AI-powered solutions! Your inquiry: "' + subject + '" has been forwarded to our sales team.\n\nYou will receive personalized consultation within 24 hours including custom pricing, free demo options, and tailored solutions.\n\nOur AI services: Intelligent Automation, Machine Learning, Cloud Infrastructure, Digital Transformation.\n\nContact: ' + CONTACT.phone + ' | ' + CONTACT.email + '\nhttps://ziontechgroup.com/services',
    partnership: 'Dear ' + n + ',\n\nThank you for exploring partnership opportunities with Zion Tech Group! We have received your proposal: "' + subject + '"\n\nOur partnership team will analyze synergies and schedule a strategic discussion within 48 hours.\n\nLet\'s build innovative solutions together!\n\nBest regards,\nZion Tech Group Partnership Team\n' + CONTACT.email + ' | ' + CONTACT.phone,
    job: 'Dear ' + n + ',\n\nThank you for your interest in career opportunities at Zion Tech Group! We have received your application for: "' + subject + '"\n\nOur HR team reviews all applications (5-7 business days) and will contact qualified candidates.\n\nWhy Zion? Cutting-edge AI projects, innovation culture, professional growth, competitive compensation.\n\nVisit https://ziontechgroup.com/about\n\nBest regards,\nZion Tech Group HR\n' + CONTACT.email,
    urgent: 'Dear ' + n + ',\n\nThank you for contacting Zion Tech Group!\n\nWe have received your URGENT request: "' + subject + '"\n\nOur priority team is addressing your issue immediately. Expect response within 2-4 hours.\n\nFor immediate assistance call NOW: ' + CONTACT.phone + '\n\nBest regards,\nZion Tech Group Priority Support\n' + CONTACT.email + ' | ' + CONTACT.phone,
    general: 'Dear ' + n + ',\n\nThank you for reaching out to Zion Tech Group! We have received your message: "' + subject + '"\n\nOur team will respond within 24-48 hours.\n\nExplore our AI solutions: 227+ Intelligent Automations, Autonomous Cloud Systems, AI-Powered Development.\n\nVisit https://ziontechgroup.com or contact ' + CONTACT.phone + '\n\nBest regards,\nZion Tech Group Team\n' + CONTACT.email + ' | ' + CONTACT.phone
  };
  return (base[type] || base.general) + '\n\n---\nZion Tech Group\nAI-Powered Innovation Hub\n' + CONTACT.phone + ' | ' + CONTACT.email + '\nhttps://ziontechgroup.com';
}

async function analyzeAI(body, type) {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    const pyBody = body.substring(0, 600).replace(/'/g, '\\\'').replace(/\n/g, ' ');
    const py = [
      'import urllib.request, json, os',
      'api = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")',
      'url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + api',
      'prompt = \'Analyze and respond with ONLY JSON (no markdown): {"sentiment":"positive/negative/neutral","urgency":"low/medium/high","topics":["t1","t2"],"action":"brief action text"}\nEmail type: ' + type + '\nBody: ' + pyBody + "'",
      'data = {"contents": [{"parts": [{"text": prompt}]}], "generationConfig": {"temperature": 0.2, "maxOutputTokens": 150}}',
      'req = urllib.request.Request(url, data=json.dumps(data).encode(), headers={"Content-Type": "application/json"})',
      'with urllib.request.urlopen(req, timeout=15) as r:',
      '  t = json.loads(r.read())["candidates"][0]["content"]["parts"][0]["text"].strip()',
      '  print(t.replace("```json","").replace("```","").strip())'
    ].join('\n');
    fs.writeFileSync('/tmp/email_ai.py', py);
    const out = execSync('python3 /tmp/email_ai.py', { encoding: 'utf8', timeout: 20, env: { ...process.env } }).trim();
    if (out.startsWith('ERROR') || !out.startsWith('{')) return null;
    const a = JSON.parse(out);
    log('AI: sentiment=' + a.sentiment + ', urgency=' + a.urgency);
    return a;
  } catch(e) { log('AI failed: ' + e.message.substring(0, 60)); return null; }
}

async function sendEmail(to, cc, subject, body, inReplyTo) {
  try {
    const ccStr = cc && cc.length ? cc.join(', ') : '';
    const bodyEsc = body.replace(/'/g, '\\\'').replace(/\n/g, '\\n');
    const py = [
      'import smtplib, os, json',
      'from email.mime.text import MIMEText',
      'from email.mime.multipart import MIMEMultipart',
      'u = os.environ.get("ZION_EMAIL_ADDRESS", "")',
      'p = os.environ.get("ZION_EMAIL_PASSWORD", "")',
      'h = os.environ.get("ZION_SMTP_HOST", "smtp.gmail.com")',
      'port = int(os.environ.get("ZION_SMTP_PORT", "587"))',
      'if not u or not p: print(json.dumps({"error":"no creds"})); exit(0)',
      'm = MIMEMultipart()',
      'm["From"] = u',
      'm["To"] = "' + to + '"',
      ccStr ? 'm["Cc"] = "' + ccStr + '"' : '',
      'm["Subject"] = "' + subject.replace(/"/g, '\\"') + '"',
      inReplyTo ? 'm["In-Reply-To"] = "' + inReplyTo + '"' : '',
      'm.attach(MIMEText(\'' + bodyEsc + '\', \'plain\'))',
      's = smtplib.SMTP(h, port)',
      's.starttls()',
      's.login(u, p)',
      'rcpts = ["' + to + '"]' + (cc && cc.length ? ' + ["' + cc.join('", "') + '"]' : ''),
      's.sendmail(u, rcpts, m.as_string())',
      's.quit()',
      'print(json.dumps({"success": True}))'
    ].filter(Boolean).join('\n');
    fs.writeFileSync('/tmp/email_send.py', py);
    const out = execSync('python3 /tmp/email_send.py', { encoding: 'utf8', timeout: 30, env: { ...process.env } }).trim();
    return JSON.parse(out);
  } catch(e) { log('Send error: ' + e.message.substring(0, 60)); return { error: e.message }; }
}

async function fetchEmails() {
  const state = getState();
  const configured = process.env.ZION_EMAIL_ADDRESS && process.env.ZION_EMAIL_PASSWORD;
  if (!configured) {
    log('Demo mode - no email credentials');
    const demos = [
      { uid: 'd1', type: 'support', sender: 'Alice Johnson', email: 'alice@example.com', subject: 'Having issues with AI automation setup', cc: ['bob@example.com'] },
      { uid: 'd2', type: 'sales', sender: 'Bob Williams', email: 'bob@enterprise.com', subject: 'Pricing for Enterprise AI package', cc: [] },
      { uid: 'd3', type: 'urgent', sender: 'Carol Davis', email: 'carol@startup.io', subject: 'URGENT: System down, need help immediately', cc: [] },
      { uid: 'd4', type: 'partnership', sender: 'David Chen', email: 'david@partner.co', subject: 'Partnership for AI integration', cc: [] },
      { uid: 'd5', type: 'general', sender: 'Emma Thompson', email: 'emma@mail.com', subject: 'Question about your AI services', cc: [] }
    ];
    for (const d of demos) {
      const response = makeResponse(d.type, d.subject, d.sender);
      log('Demo ' + d.type + ' from ' + d.sender + ' <' + d.email + '> Reply-All with ' + d.cc.length + ' CC - OK');
      log('Response preview: ' + response.substring(0, 100) + '...');
    }
    state.processedCount = (state.processedCount || 0) + demos.length;
    state.stats = state.stats || {};
    for (const d of demos) state.stats[d.type] = (state.stats[d.type] || 0) + 1;
    saveState(state);
    return demos;
  }

  // Real fetch
  const py = [
    'import imaplib, email, json, os',
    'from email.header import decode_header',
    'e = os.environ.get("ZION_EMAIL_ADDRESS", "")',
    'p = os.environ.get("ZION_EMAIL_PASSWORD", "")',
    'h = os.environ.get("ZION_IMAP_HOST", "imap.gmail.com")',
    'port = int(os.environ.get("ZION_IMAP_PORT", "993"))',
    'if not e or not p: print(json.dumps({"error":"no creds"})); exit(0)',
    'try:',
    '  m = imaplib.IMAP4_SSL(h, port)',
    '  m.login(e, p)',
    '  m.select("INBOX")',
    '  s, ids = m.search(None, "ALL")',
    '  results = []',
    '  for uid in list(ids[0].split())[-10:]:',
    '    try:',
    '      u = uid.decode() if isinstance(uid, bytes) else str(uid)',
    '      s, d = m.fetch(u, "(RFC822)")',
    '      if s != "OK": continue',
    '      msg = email.message_from_bytes(d[0][1])',
    '      sp = decode_header(msg.get("Subject", "No Subject"))',
    '      subject = "".join(p.decode(e or "utf-8", errors="ignore") if isinstance(p, bytes) else (p or "") for p, e in sp)',
    '      sender = msg.get("From", "Unknown")',
    '      cc = msg.get("Cc", "")',
    '      body = ""',
    '      if msg.is_multipart():',
    '        for part in msg.walk():',
    '          if part.get_content_type() == "text/plain":',
    '            body = part.get_payload(decode=True).decode(part.get_content_charset() or "utf-8", errors="ignore")',
    '            break',
    '      else:',
    '        body = msg.get_payload(decode=True).decode(msg.get_content_charset() or "utf-8", errors="ignore")',
    '      results.append({"uid": u, "subject": subject[:200], "sender": sender[:100], "cc": cc[:100], "body": body[:1500], "messageId": msg.get("Message-ID","")[:100]})',
    '    except: pass',
    '  m.logout()',
    '  print(json.dumps(results))',
    'except Exception as ex:',
    '  print(json.dumps({"error": str(ex)}))'
  ].join('\n');

  fs.writeFileSync('/tmp/email_fetch.py', py);
  try {
    const out = execSync('python3 /tmp/email_fetch.py', { encoding: 'utf8', timeout: 45, env: { ...process.env } }).trim();
    let emails = [];
    try { const p = JSON.parse(out); emails = p.error ? [] : p; } catch(e) { log('Parse error'); }
    log('Processing ' + emails.length + ' emails');
    const results = [];
    for (const em of emails) {
      const type = classify(em.subject, em.body);
      const name = extractName(em.sender);
      const addr = extractEmailAddr(em.sender);
      const cc = extractCCList(em.cc);
      const ai = await analyzeAI(em.body, type);
      let response = makeResponse(type, em.subject, name);
      if (ai && ai.action) response += '\n\n[AI: ' + ai.sentiment + ' sentiment | ' + ai.urgency + ' urgency | ' + ai.action + ']';
      const sr = await sendEmail(addr, cc, 'Re: ' + em.subject, response, em.messageId);
      results.push({ uid: em.uid, type, sender: name, responded: !sr.error, ai: !!ai });
      const numUID = parseInt(em.uid) || 0;
      if (numUID > (state.lastUID || 0)) state.lastUID = numUID;
      state.processedCount = (state.processedCount || 0) + 1;
      state.stats = state.stats || {};
      state.stats[type] = (state.stats[type] || 0) + 1;
      log(type + ' from ' + name + ' <' + addr + '> - ' + (sr.error ? 'FAILED' : 'OK'));
    }
    saveState(state);
    return results;
  } catch(e) { log('Fetch error: ' + e.message.substring(0, 80)); return []; }
}

async function main() {
  log('============================================================');
  log('INTELLIGENT EMAIL RESPONDER v3.0 - STARTING');
  log('Features: Intent Classification | AI Analysis | Smart Reply-All');
  log('============================================================');
  const results = await fetchEmails();
  log('Processed ' + results.length + ' emails');
  log('============================================================');
  return results;
}

if (require.main === module) {
  main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
}
module.exports = { main, classify, makeResponse };