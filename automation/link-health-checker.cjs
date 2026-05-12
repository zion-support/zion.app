#!/usr/bin/env node
/**
 * Broken Link & Sitemap Health Checker
 * Crawls sitemap → validates internal links → reports broken/redirect chains
 * Runs autonomously daily; alerts via Telegram; creates GitHub issues
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const ROOT = process.cwd();
const STATE_DIR = path.join(ROOT, '.hermes', 'memory', 'link-checker');
const REPORT_DIR = path.join(ROOT, 'automation', 'reports', 'link-checker');
const LOG_FILE = path.join(STATE_DIR, 'link-checker.log');
const HISTORY_FILE = path.join(STATE_DIR, 'history.json');
const BROKEN_ISSUES_FILE = path.join(STATE_DIR, 'broken-issues.json');

const SITEMAP_URL = process.env.SITEMAP_URL || 'https://ziontechgroup.com/sitemap.xml';
const BASE_URL = process.env.APP_URL || 'https://ziontechgroup.com';
const MAX_CONCURRENCY = 5;
const TIMEOUT_MS = 15000;

function ts() { return new Date().toISOString(); }

function log(msg) {
  const line = `[${ts()}] ${msg}`;
  console.log(line);
  fs.mkdirSync(STATE_DIR, { recursive: true });
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function ensureDirs() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.mkdirSync(STATE_DIR, { recursive: true });
}

function loadHistory() {
  if (!fs.existsSync(HISTORY_FILE)) return { broken: {}, orphaned: [], redirects: [] };
  return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
}

function saveHistory(history) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

function loadBrokenIssues() {
  if (!fs.existsSync(BROKEN_ISSUES_FILE)) return {};
  return JSON.parse(fs.readFileSync(BROKEN_ISSUES_FILE, 'utf8'));
}

function saveBrokenIssues(issues) {
  fs.writeFileSync(BROKEN_ISSUES_FILE, JSON.stringify(issues, null, 2));
}

function fetchURL(url) {
  return new Promise((resolve) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, { timeout: TIMEOUT_MS, headers: { 'User-Agent': 'OpenClaw-LinkChecker/1.0' } }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', () => resolve({ status: 0, error: true }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, timeout: true }); });
  });
}

function parseSitemap(xml) {
  const urls = [];
  const regex = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    urls.push(match[1].trim());
  }
  return urls;
}

function extractInternalLinks(html, base) {
  const links = new Set();
  // Simple regex-based extraction (cheerio would be heavier)
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    try {
      const abs = new URL(match[1], base).href;
      if (abs.startsWith(BASE_URL)) links.add(abs.split('#')[0]); // strip hash
    } catch (e) { /* ignore malformed */ }
  }
  return Array.from(links);
}

async function crawlPage(url, visited, internalLinks, semaphore) {
  await semaphore.acquire();
  try {
    const { status, body, error, timeout } = await fetchURL(url);
    if (status !== 200 || !body) return;

    const links = extractInternalLinks(body, url);
    links.forEach(link => {
      if (!visited.has(link) && link.startsWith(BASE_URL)) {
        visited.add(link);
        internalLinks.push(link);
      }
    });
  } catch (e) {
    // ignore
  } finally {
    semaphore.release();
  }
}

async function crawlSite(startUrls) {
  const visited = new Set(startUrls);
  const internalLinks = [...startUrls];
  const semaphore = { count: 0, queue: [], acquire() { return new Promise(resolve => { if (this.count < MAX_CONCURRENCY) { this.count++; resolve(); } else { this.queue.push(resolve); } }); }, release() { this.count--; if (this.queue.length) { this.count++; this.queue.shift()(); } } };

  // Breadth-first crawl limited to 50 pages for speed
  for (let i = 0; i < Math.min(startUrls.length, 50); i++) {
    await crawlPage(startUrls[i], visited, internalLinks, semaphore);
  }
  return internalLinks;
}

function normalizeUrl(url) {
  try {
    const u = new URL(url);
    // Remove trailing slash for consistency (except root)
    if (u.pathname !== '/' && u.pathname.endsWith('/')) {
      u.pathname = u.pathname.slice(0, -1);
    }
    return u.toString();
  } catch { return url; }
}

async function main() {
  ensureDirs();
  log('🔗 Starting Broken Link Checker...');

  // 1. Fetch sitemap
  log(`📋 Fetching sitemap: ${SITEMAP_URL}`);
  const { status: sitemapStatus, body: sitemapXml } = await fetchURL(SITEMAP_URL);
  if (sitemapStatus !== 200 || !sitemapXml) {
    log(`❌ Sitemap fetch failed (status ${sitemapStatus})`);
    process.exit(1);
  }
  const sitemapUrls = parseSitemap(sitemapXml).map(normalizeUrl);
  log(`✅ Sitemap parsed: ${sitemapUrls.length} URLs`);

  // 2. Crawl site (collect internal links)
  log(`🕷️ Crawling site...`);
  const internalLinks = await crawlSite(sitemapUrls);
  log(`✅ Discovered ${internalLinks.length} internal links`);

  // 3. Validate each link
  log(`🔍 Validating links...`);
  const broken = [];
  const redirects = [];
  const semaphore = { count: 0, queue: [], acquire() { return new Promise(resolve => { if (this.count < MAX_CONCURRENCY) { this.count++; resolve(); } else { this.queue.push(resolve); } }); }, release() { this.count--; if (this.queue.length) { this.count++; this.queue.shift()(); } } };

  const checkLink = async (url) => {
    await semaphore.acquire();
    try {
      const { status, timeout, error } = await fetchURL(url);
      if (status === 404 || status === 500 || status === 0 || timeout) {
        broken.push({ url, status: status === 0 ? (timeout ? 'timeout' : 'error') : status, firstSeen: ts() });
      } else if (status >= 300 && status < 400) {
        redirects.push({ url, status });
      }
    } catch (e) {
      broken.push({ url, status: 'exception', error: e.message });
    } finally {
      semaphore.release();
    }
  };

  await Promise.all(internalLinks.map(checkLink));

  // 4. Find orphaned pages (in sitemap but not linked from anywhere)
  const orphaned = sitemapUrls.filter(u => !internalLinks.includes(u));

  log(`📊 Results: ${broken.length} broken, ${redirects.length} redirects, ${orphaned.length} orphaned`);

  // 5. Load history and previously created issues
  const history = loadHistory();
  const issues = loadBrokenIssues();

  const newBroken = [];
  for (const b of broken) {
    const key = b.url;
    if (!history.broken[key]) {
      history.broken[key] = { firstSeen: b.firstSeen, status: b.status, lastSeen: ts() };
      newBroken.push(b);
    } else {
      history.broken[key].lastSeen = ts();
      if (history.broken[key].status !== b.status) {
        history.broken[key].status = b.status;
      }
    }
  }

  // Track orphaned and redirects
  history.orphaned = orphaned.map(u => ({ url: u, lastSeen: ts() }));
  history.redirects = redirects;

  saveHistory(history);

  // 6. Generate report JSON
  const report = {
    generatedAt: ts(),
    totalLinks: internalLinks.length,
    broken: broken,
    redirects: redirects,
    orphaned: orphaned,
    newBrokenCount: newBroken.length,
  };
  const reportFile = path.join(REPORT_DIR, `link-check-${Date.now()}.json`);
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

  // 7. Create GitHub issues for new broken links (batch)
  if (newBroken.length > 0) {
    await createGitHubIssue(report, newBroken, issues);
  }

  // 8. Send Telegram summary
  await sendTelegram(report);

  log('✅ Link checker complete');
  return report;
}

async function createGitHubIssue(report, newBroken, issues) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    log('⚠️ GITHUB_TOKEN missing; skipping issue');
    return;
  }

  // Only create issue if >3 new broken links or critical ones
  if (newBroken.length < 3) {
    log(`ℹ️ Only ${newBroken.length} new broken links; threshold not met for issue (need ≥3)`);
    return;
  }

  const title = `🚨 Broken Links Detected — ${newBroken.length} new issues`;
  const body = [
    '## Broken Link Report',
    '',
    `**Generated:** ${report.generatedAt}`,
    `**New broken links:** ${newBroken.length}`,
    '',
    '### Newly Broken URLs',
    ...newBroken.map(b => `- [${b.url}](${b.url}) — Status: ${b.status}`),
    '',
    '### Action Required',
    'Fix or redirect these URLs. If false positive, mark as known in `.hermes/memory/link-checker/broken-issues.json`.',
    '',
    '---',
    '*Generated by automation/link-health-checker.cjs*',
  ].join('\n');

  // Use gh CLI
  try {
    const escapedBody = body.replace(/"/g, '\\"').replace(/\$/g, '\\$');
    execSync(`gh issue create --title "${title}" --body "${escapedBody}" --label "automation,seo,broken-links"`, {
      cwd: ROOT,
      stdio: 'pipe',
    });
    log('✅ GitHub issue created for broken links');
    // Store issue number for future dedupe (simplified)
  } catch (e) {
    log('⚠️ gh CLI failed; issue not created: ' + e.message);
  }
}

async function sendTelegram(report) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return;

  const chatId = process.env.TELEGRAM_CHAT_ID || '8435383377';
  const lines = [
    '🔗 *Link Health Check* — ' + new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    `Total links scanned: ${report.totalLinks}`,
    '',
    `✅ Broken: ${report.broken.length}`,
    `🔀 Redirects: ${report.redirects.length}`,
    `🚫 Orphaned (in sitemap): ${report.orphaned.length}`,
  ];

  if (report.newBrokenCount > 0) {
    lines.push(`\n⚠️ ${report.newBrokenCount} new broken links — check automation/reports/link-checker/`);
  }

  const https = require('https');
  const payload = new URLSearchParams({ chat_id: chatId, text: lines.join('\n'), parse_mode: 'Markdown' });

  await new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${botToken}/sendMessage`,
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': payload.byteLength },
    }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => (res.statusCode === 200 ? resolve() : reject(new Error(`Telegram ${res.statusCode}: ${body}`))));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
  log('✅ Telegram summary sent');
}

main().catch(err => {
  console.error('❌ Link checker failed:', err);
  process.exit(1);
});
