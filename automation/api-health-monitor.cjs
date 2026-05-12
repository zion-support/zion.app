#!/usr/bin/env node
/**
 * API Health & Latency Monitor
 * Checks critical endpoints, measures response times, detects degradation
 * Alerts via Telegram, creates GitHub issues on threshold breaches
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const ROOT = process.cwd();
const STATE_DIR = path.join(ROOT, '.hermes', 'memory', 'api-health');
const LOG_FILE = path.join(STATE_DIR, 'api-health.log');
const HISTORY_FILE = path.join(STATE_DIR, 'history.json');
const REPORT_FILE = path.join(STATE_DIR, 'latest.json');

const BASE_URL = process.env.APP_URL || 'https://ziontechgroup.com';
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT = process.env.TELEGRAM_CHAT_ID || '8435383377';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Default endpoints to monitor (can be overridden by API_ENDPOINTS JSON env var)
const DEFAULT_ENDPOINTS = [
  { path: '/', method: 'GET', expected: [200, 301, 302], name: 'homepage' },
  { path: '/api/health', method: 'GET', expected: [200], name: 'health' },
  { path: '/api/ai/chat', method: 'POST', expected: [200], name: 'ai-chat', body: { message: 'hi' } },
  { path: '/api/search', method: 'GET', expected: [200], name: 'search' },
];

// Parse API_ENDPOINTS from env if provided (JSON string)
let ENDPOINTS = DEFAULT_ENDPOINTS;
if (process.env.API_ENDPOINTS) {
  try {
    ENDPOINTS = JSON.parse(process.env.API_ENDPOINTS);
  } catch (e) {
    console.warn('Invalid API_ENDPOINTS JSON; using defaults');
  }
}

const CONCURRENCY = 3;
const TIMEOUT_MS = 15000; // 15s
const BASELINE_DAYS = 7;
const ALERT_P95_THRESHOLD_MS = 2000; // 2s
const ISSUE_P95_THRESHOLD_MS = 3000; // 3s
const ERROR_RATE_SPIKE_THRESHOLD = 0.20; // 20% increase
const ISSUE_ERROR_RATE_THRESHOLD = 0.05; // 5% error rate

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.mkdirSync(STATE_DIR, { recursive: true });
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function ensureFiles() {
  if (!fs.existsSync(HISTORY_FILE)) fs.writeFileSync(HISTORY_FILE, JSON.stringify({ endpoints: {} }, null, 2));
}

function loadHistory() {
  try { return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8')); } catch { return { endpoints: {} }; }
}

function saveHistory(hist) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(hist, null, 2));
}

function loadLatest() {
  if (!fs.existsSync(REPORT_FILE)) return null;
  try { return JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8')); } catch { return null; }
}

function saveReport(report) {
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
}

function fetchEndpoint(url, options = {}) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.request(
      url,
      {
        method: options.method || 'GET',
        timeout: TIMEOUT_MS,
        headers: {
          'User-Agent': 'OpenClaw-APIMonitor/1.0',
          'Content-Type': 'application/json',
        },
      },
      (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ status: res.statusCode, body, headers: res.headers }));
      }
    );
    req.on('error', (e) => resolve({ status: 0, error: e.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, error: 'timeout' });
    });
    if (options.body) req.write(JSON.stringify(options.body));
    req.end();
  });
}

async function measureEndpoint(ep) {
  const url = new URL(ep.path, BASE_URL).toString();
  const start = Date.now();
  const result = await fetchEndpoint(url, { method: ep.method, body: ep.body });
  const duration = Date.now() - start;

  return {
    name: ep.name,
    path: ep.path,
    method: ep.method,
    url,
    status: result.status,
    duration,
    ok: result.status > 0 && ep.expected.includes(result.status),
    timestamp: new Date().toISOString(),
  };
}

class Semaphore {
  constructor(max) { this.max = max; this.current = 0; this.queue = []; }
  async acquire() {
    if (this.current < this.max) { this.current++; return; }
    await new Promise(resolve => this.queue.push(resolve));
    this.current++;
  }
  release() {
    this.current--;
    if (this.queue.length) this.queue.shift()();
  }
}

function percentile(sorted, p) {
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

function calculateStats(durations) {
  const sorted = durations.slice().sort((a, b) => a - b);
  const sum = sorted.reduce((a, b) => a + b, 0);
  return {
    count: sorted.length,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    avg: Math.round(sum / sorted.length),
    p50: percentile(sorted, 50),
    p95: percentile(sorted, 95),
    p99: percentile(sorted, 99),
  };
}

async function main() {
  ensureFiles();
  log('🚀 Starting API Health Monitor');

  const semaphore = new Semaphore(CONCURRENCY);
  const results = [];

  // Run all checks in parallel (limited concurrency)
  const checks = ENDPOINTS.map(async (ep) => {
    await semaphore.acquire();
    try {
      const res = await measureEndpoint(ep);
      results.push(res);
    } catch (e) {
      log(`❌ Error checking ${ep.path}: ${e.message}`);
      results.push({
        name: ep.name,
        path: ep.path,
        method: ep.method,
        status: 0,
        duration: 0,
        ok: false,
        timestamp: new Date().toISOString(),
      });
    } finally {
      semaphore.release();
    }
  });

  await Promise.all(checks);

  log(`✅ Checked ${results.length} endpoints`);

  // Build report
  const report = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    endpoints: results,
  };

  // Per-endpoint statistics
  const endpointStats = {};
  for (const r of results) {
    if (!endpointStats[r.name]) endpointStats[r.name] = { durations: [], failures: 0, total: 0 };
    endpointStats[r.name].total++;
    if (!r.ok) endpointStats[r.name].failures++;
    endpointStats[r.name].durations.push(r.duration);
  }

  // Calculate stats
  const statsSummary = {};
  for (const [name, data] of Object.entries(endpointStats)) {
    statsSummary[name] = {
      ...calculateStats(data.durations),
      errorRate: data.total > 0 ? data.failures / data.total : 0,
      failures: data.failures,
      total: data.total,
    };
  }
  report.summary = statsSummary;

  // Load and update history
  const history = loadHistory();
  const now = new Date();
  const dayKey = now.toISOString().slice(0, 10); // YYYY-MM-DD

  for (const [name, stat] of Object.entries(statsSummary)) {
    if (!history.endpoints[name]) history.endpoints[name] = { days: {} };

    // Store today's aggregated stats
    history.endpoints[name].days[dayKey] = {
      p95: stat.p95,
      errorRate: stat.errorRate,
      totalChecks: stat.total,
      failures: stat.failures,
    };

    // Keep only last 30 days
    const days = Object.keys(history.endpoints[name].days).sort();
    if (days.length > 30) {
      const toRemove = days.slice(0, days.length - 30);
      for (const d of toRemove) delete history.endpoints[name].days[d];
    }
  }

  saveHistory(history);
  saveReport(report);

  // Compare to baseline (7-day avg)
  const alerts = [];
  for (const [name, stat] of Object.entries(statsSummary)) {
    const endpointHist = history.endpoints[name];
    if (!endpointHist) continue;

    const dayKeys = Object.keys(endpointHist.days).sort().slice(-BASELINE_DAYS);
    if (dayKeys.length < 3) {
      log(`📊 Insufficient history for ${name} (need ≥3 days, have ${dayKeys.length})`);
      continue;
    }

    const baselineP95 = dayKeys
      .map((dk) => endpointHist.days[dk].p95)
      .filter((v) => v != null)
      .reduce((a, b) => a + b, 0) / dayKeys.length;

    const baselineErrorRate = dayKeys
      .map((dk) => endpointHist.days[dk].errorRate)
      .filter((v) => v != null)
      .reduce((a, b) => a + b, 0) / dayKeys.length;

    const p95Increase = stat.p95 - baselineP95;
    const errorRateIncrease = stat.errorRate - baselineErrorRate;

    // Determine alert severity
    if (stat.p95 > ISSUE_P95_THRESHOLD_MS) {
      alerts.push({ name, severity: 'critical', type: 'latency', value: stat.p95, baseline: Math.round(baselineP95), threshold: ISSUE_P95_THRESHOLD_MS });
    } else if (stat.p95 > ALERT_P95_THRESHOLD_MS) {
      alerts.push({ name, severity: 'warning', type: 'latency', value: stat.p95, baseline: Math.round(baselineP95), threshold: ALERT_P95_THRESHOLD_MS });
    }

    if (stat.errorRate >= ISSUE_ERROR_RATE_THRESHOLD) {
      alerts.push({ name, severity: 'critical', type: 'error_rate', value: stat.errorRate, baseline: baselineErrorRate, threshold: ISSUE_ERROR_RATE_THRESHOLD });
    } else if (errorRateIncrease > ERROR_RATE_SPIKE_THRESHOLD && stat.failures >= 3) {
      alerts.push({ name, severity: 'warning', type: 'error_rate_spike', value: stat.errorRate, baseline: baselineErrorRate, increase: Math.round(errorRateIncrease * 100) + '%' });
    }

    // Any 5xx?
    if (results.some(r => r.name === name && r.status >= 500)) {
      alerts.push({ name, severity: 'critical', type: 'server_errors', value: '5xx detected' });
    }
  }

  // Send Telegram summary
  if (TELEGRAM_TOKEN) {
    await sendTelegram(alerts, statsSummary);
  }

  // Create GitHub issue if critical thresholds breached
  const criticalAlerts = alerts.filter(a => a.severity === 'critical');
  if (criticalAlerts.length > 0 && GITHUB_TOKEN) {
    await createGitHubIssue(report, criticalAlerts);
  }

  log(`✅ API Health check complete — ${alerts.length === 0 ? 'all healthy' : alerts.length + ' alerts triggered'}`);
}

async function sendTelegram(alerts, stats) {
  const https = require('https');
  const now = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  let text = `🌐 *API Health Report* — ${now}\nBase: ${BASE_URL}\n\n`;

  if (alerts.length === 0) {
    text += '✅ All endpoints healthy.\n\n';
  } else {
    text += `⚠️ *${alerts.length} alert(s):*\n\n`;
    alerts.forEach(a => {
      const emoji = a.severity === 'critical' ? '🔴' : '🟡';
      text += `${emoji} ${a.name}: ${a.type} = ${a.value} ${a.baseline ? `(baseline ${a.baseline})` : ''}\n`;
    });
    text += '\n';
  }

  text += '📊 Stats:\n';
  for (const [name, s] of Object.entries(stats)) {
    const status = s.failures === 0 ? '✅' : `❌${s.failures}`;
    text += `${status} ${name}: p95=${Math.round(s.p95)}ms, errors=${Math.round(s.errorRate * 100)}% (${s.total} checks)\n`;
  }

  const payload = new URLSearchParams({ chat_id: TELEGRAM_CHAT, text, parse_mode: 'Markdown' });

  await new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${TELEGRAM_TOKEN}/sendMessage`,
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': payload.byteLength },
    }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => (res.statusCode === 200 ? resolve() : reject(new Error(`HTTP ${res.statusCode}: ${body}`))));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
  log('✅ Telegram alert sent');
}

async function createGitHubIssue(report, criticalAlerts) {
  const title = `🚨 API Health Degradation — ${new Date().toLocaleDateString()} (${criticalAlerts.length} critical)`;
  const body = [
    '## API Health Alert',
    '',
    `**Base URL:** ${report.baseUrl}`,
    `**Timestamp:** ${report.timestamp}`,
    '',
    '### Critical Alerts',
    ...criticalAlerts.map(a => `- **${a.name}** [${a.severity.toUpperCase()}] ${a.type}: ${a.value} ${a.baseline ? `(baseline ${a.baseline})` : ''}`),
    '',
    '### Endpoint Summary',
    ...Object.entries(report.summary || {}).map(([name, s]) => `- ${name}: p95=${Math.round(s.p95)}ms, errorRate=${(s.errorRate * 100).toFixed(1)}%, checks=${s.total}`),
    '',
    '---',
    '*Generated by automation/api-health-monitor.cjs*',
  ].join('\n');

  try {
    const escaped = body.replace(/"/g, '\\"').replace(/\$/g, '\\$');
    const { execSync } = require('child_process');
    execSync(`gh issue create --title "${title}" --body "${escaped}" --label "automation,api,performance"`, { stdio: 'pipe' });
    log('✅ GitHub issue created');
  } catch (e) {
    log('⚠️ gh CLI failed; issue not created: ' + e.message);
  }
}

main().catch(err => {
  console.error('❌ API health monitor failed:', err);
  process.exit(1);
});
