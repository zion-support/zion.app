#!/usr/bin/env node

/**
 * AI Contact Form Handler
 * Processes contact form submissions stored in a JSON queue,
 * validates data, enriches with metadata, and dispatches notifications.
 * Designed to work with a static site that writes submissions to a JSON file
 * or receives them via a lightweight webhook endpoint.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

class AIContactFormHandler {
  constructor() {
    this.logFile = path.join(__dirname, 'logs', 'contact-form-handler.log');
    this.dataDir = path.join(__dirname, 'data');
    this.submissionsFile = path.join(this.dataDir, 'contact-submissions.json');
    this.processedFile = path.join(this.dataDir, 'processed-submissions.json');
    this.port = parseInt(process.env.CONTACT_FORM_PORT) || 3001;
    this.ensureDirectories();
    this.submissions = this.loadSubmissions();
    this.processed = this.loadProcessed();
  }

  ensureDirectories() {
    for (const dir of [path.dirname(this.logFile), this.dataDir]) {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    }
  }

  log(message, level = 'INFO') {
    const ts = new Date().toISOString();
    const entry = `[${ts}] [${level}] ${message}\n`;
    console.log(message);
    fs.appendFileSync(this.logFile, entry);
  }

  loadSubmissions() {
    if (fs.existsSync(this.submissionsFile)) {
      try { return JSON.parse(fs.readFileSync(this.submissionsFile, 'utf8')); }
      catch { return []; }
    }
    return [];
  }

  loadProcessed() {
    if (fs.existsSync(this.processedFile)) {
      try { return JSON.parse(fs.readFileSync(this.processedFile, 'utf8')); }
      catch { return []; }
    }
    return [];
  }

  saveSubmissions() {
    fs.writeFileSync(this.submissionsFile, JSON.stringify(this.submissions, null, 2));
  }

  saveProcessed() {
    const maxEntries = 500;
    this.processed = this.processed.slice(-maxEntries);
    fs.writeFileSync(this.processedFile, JSON.stringify(this.processed, null, 2));
  }

  validateSubmission(data) {
    const errors = [];
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Invalid or missing email');
    }
    if (!data.firstName || data.firstName.trim().length < 1) {
      errors.push('Missing first name');
    }
    if (!data.message || data.message.trim().length < 5) {
      errors.push('Message too short or missing');
    }
    const spamPatterns = [/\b(viagra|casino|lottery|free money|click here)\b/i];
    const combined = `${data.firstName || ''} ${data.lastName || ''} ${data.message || ''} ${data.company || ''}`;
    for (const pattern of spamPatterns) {
      if (pattern.test(combined)) {
        errors.push('Potential spam detected');
        break;
      }
    }
    return { valid: errors.length === 0, errors };
  }

  categorizeInquiry(message) {
    const lower = (message || '').toLowerCase();
    if (/\b(price|pricing|cost|quote|budget)\b/.test(lower)) return 'pricing';
    if (/\b(demo|trial|test|poc|pilot)\b/.test(lower)) return 'demo-request';
    if (/\b(partner|integration|resell)\b/.test(lower)) return 'partnership';
    if (/\b(support|help|issue|bug|problem)\b/.test(lower)) return 'support';
    if (/\b(job|career|hiring|position|apply)\b/.test(lower)) return 'careers';
    return 'general';
  }

  async addSubmission(data) {
    const validation = this.validateSubmission(data);
    const submission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      ...data,
      category: this.categorizeInquiry(data.message),
      validation,
      receivedAt: new Date().toISOString(),
      processed: false,
    };

    this.submissions.push(submission);
    this.saveSubmissions();
    this.log(`New submission from ${data.email} [${submission.category}] (valid: ${validation.valid})`);
    return submission;
  }

  async processSubmissions() {
    const pending = this.submissions.filter((s) => !s.processed && s.validation.valid);
    if (pending.length === 0) return;

    this.log(`Processing ${pending.length} pending submissions`);

    for (const sub of pending) {
      try {
        sub.processed = true;
        sub.processedAt = new Date().toISOString();

        this.processed.push({
          id: sub.id,
          email: sub.email,
          category: sub.category,
          processedAt: sub.processedAt,
        });

        this.log(`Processed: ${sub.id} (${sub.email}) [${sub.category}]`);
      } catch (err) {
        this.log(`Error processing ${sub.id}: ${err.message}`, 'ERROR');
      }
    }

    this.saveSubmissions();
    this.saveProcessed();
  }

  startWebhookServer() {
    const server = http.createServer(async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }

      if (req.method === 'POST' && req.url === '/api/contact') {
        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', async () => {
          try {
            const data = JSON.parse(body);
            const submission = await this.addSubmission(data);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, id: submission.id, category: submission.category }));
          } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
        return;
      }

      if (req.method === 'GET' && req.url === '/api/contact/stats') {
        const stats = {
          total: this.submissions.length,
          pending: this.submissions.filter((s) => !s.processed).length,
          processed: this.processed.length,
          byCategory: {},
        };
        for (const sub of this.submissions) {
          stats.byCategory[sub.category] = (stats.byCategory[sub.category] || 0) + 1;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(stats, null, 2));
        return;
      }

      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    });

    server.listen(this.port, () => {
      this.log(`Webhook server listening on port ${this.port}`);
    });

    return server;
  }

  async start() {
    this.log('Starting Contact Form Handler');
    this.startWebhookServer();

    setInterval(async () => {
      try { await this.processSubmissions(); }
      catch (err) { this.log(`Processing error: ${err.message}`, 'ERROR'); }
    }, 30000);
  }
}

if (require.main === module) {
  const handler = new AIContactFormHandler();
  const cmd = process.argv[2] || 'start';

  switch (cmd) {
    case 'start':
      handler.start();
      break;
    case 'process':
      handler.processSubmissions().then(() => process.exit(0));
      break;
    case 'stats': {
      const stats = {
        total: handler.submissions.length,
        pending: handler.submissions.filter((s) => !s.processed).length,
        processed: handler.processed.length,
      };
      console.log(JSON.stringify(stats, null, 2));
      break;
    }
    default:
      console.log('Commands: start | process | stats');
  }
}

module.exports = AIContactFormHandler;
