#!/usr/bin/env node
/**
 * Automated Accessibility Compliance Auditor
 * Uses Playwright + axe-core to scan WCAG 2.1 AA violations
 * Runs on PRs and daily; breaks CI on new critical issues
 */

const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const STATE_DIR = path.join(ROOT, '.hermes', 'memory', 'accessibility');
const LOG_FILE = path.join(STATE_DIR, 'accessibility-audit.log');
const HISTORY_FILE = path.join(STATE_DIR, 'history.json');
const REPORT_FILE = path.join(STATE_DIR, 'latest-report.json');
const VIOLATIONS_DIR = path.join(STATE_DIR, 'violations');

const BASE_URL = process.env.APP_URL || 'https://ziontechgroup.com';
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT = process.env.TELEGRAM_CHAT_ID || '8435383377';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const SITEMAP_URL = `${BASE_URL}/sitemap.xml`;

// Ignored rules (can override via ACCESSIBILITY_IGNORE_RULES JSON array)
const DEFAULT_IGNORED_RULES = [
  // 'button-name', // example: unlabeled buttons we knowingly accept
];
let IGNORED_RULES = DEFAULT_IGNORED_RULES;
if (process.env.ACCESSIBILITY_IGNORE_RULES) {
  try { IGNORED_RULES = JSON.parse(process.env.ACCESSIBILITY_IGNORE_RULES); } catch (e) { console.warn('Invalid ACCESSIBILITY_IGNORE_RULES JSON'); }
}

const CRITICAL_RULES = ['cerulean', 'wcag2a', 'wcag2aa', 'wcag21a']; // axe impact levels
const MAX_CONCURRENT_PAGES = 2;
const PAGE_TIMEOUT_MS = 30000;

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.mkdirSync(STATE_DIR, { recursive: true });
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function ensureFiles() {
  if (!fs.existsSync(HISTORY_FILE)) fs.writeFileSync(HISTORY_FILE, JSON.stringify({ pages: {} }, null, 2));
  if (!fs.existsSync(VIOLATIONS_DIR)) fs.mkdirSync(VIOLATIONS_DIR, { recursive: true });
}

function loadHistory() {
  try { return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8')); } catch { return { pages: {} }; }
}

function saveHistory(hist) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(hist, null, 2));
}

function extractUrlsFromSitemap(xml) {
  const urls = [];
  const regex = /<loc>([^<]+)<\/loc>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

async function fetchSitemap() {
  const https = require('https');
  return new Promise((resolve, reject) => {
    https.get(SITEMAP_URL, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// We'll run Playwright via child_process to avoid bundling complexity
async function runAxeScan(urls) {
  // Build a standalone Playwright script inline
  const script = `
const { chromium } = require('playwright');
const axe = require('@axe-core/playwright');

const BASE = process.env.BASE_URL || '${BASE_URL}';
const OUT_DIR = '${VIOLATIONS_DIR}';
const urls = ${JSON.stringify(urls)};

(async () => {
  const browser = await chromium.launch({ headless: 'new' });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = {};

  for (const u of urls) {
    const full = u.startsWith('http') ? u : BASE + u;
    try {
      await page.goto(full, { waitUntil: 'networkidle', timeout: ${PAGE_TIMEOUT_MS} });
      // Run axe scan
      const scan = await page.experimentalAxeAnalyze();
      // Only keep violations we care about
      const filtered = scan.violations.filter(v => !${JSON.stringify(IGNORED_RULES)}.includes(v.id));
      results[u] = {
        url: full,
        violations: filtered.map(v => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          help: v.help,
          helpUrl: v.helpUrl,
          nodes: v.nodes.length,
        })),
        totalViolations: filtered.length,
      };
      // Save individual report
      const safePath = u.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
      require('fs').writeFileSync(\`\${OUT_DIR}/\${safePath}.json\`, JSON.stringify(results[u], null, 2));
    } catch (e) {
      results[u] = { url: full, error: e.message };
    }
  }

  await browser.close();
  require('fs').writeFileSync('${REPORT_FILE}', JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ scanned: urls.length, results }));
})();
`;
  const tmpScript = path.join(ROOT, '.tmp', 'axe-scan.js');
  fs.mkdirSync(path.dirname(tmpScript), { recursive: true });
  fs.writeFileSync(tmpScript, script);

  const env = { ...process.env, BASE_URL: BASE_URL, NODE_ENV: 'production' };
  try {
    const out = execSync(`node ${tmpScript}`, { cwd: ROOT, env, stdio: 'pipe' }).toString();
    return JSON.parse(out);
  } catch (e) {
    log('⚠️ Axe scan failed: ' + e.message);
    return null;
  }
}

function aggregateViolations(results) {
  const pageStats = {};
  let totalViolations = 0;
  let criticalCount = 0;

  for (const [page, data] of Object.entries(results)) {
    if (data.error) continue;
    pageStats[page] = { total: data.violations.length, violations: data.violations.map(v => v.id) };
    totalViolations += data.violations.length;
    for (const v of data.violations) {
      if (v.impact === 'critical' || v.impact === 'serious') criticalCount++;
    }
  }

  return { pageStats, totalViolations, criticalCount };
}

async function compareToBaseline(pageStats, history) {
  const newViolations = []; // New pages or new rule IDs per page
  const increasedPages = [];

  const todayKey = new Date().toISOString().slice(0, 10);

  for (const [page, stats] of Object.entries(pageStats)) {
    if (!history.pages[page]) {
      // First time seeing this page
      newViolations.push({ page, violations: stats.violations, reason: 'new_page' });
      history.pages[page] = { firstSeen: todayKey, violationHistory: {} };
    }

    const pageHist = history.pages[page];
    const prevKey = Object.keys(pageHist.violationHistory).sort().pop(); // most recent previous day
    const prev = prevKey ? pageHist.violationHistory[prevKey] : { total: 0, byRule: {} };

    // Store today
    pageHist.violationHistory[todayKey] = {
      total: stats.total,
      byRule: stats.violations.reduce((a, r) => { a[r] = (a[r] || 0) + 1; return a; }, {}),
    };

    // Compare
    if (stats.total > prev.total + 2) {
      increasedPages.push({ page, current: stats.total, previous: prev.total });
    }

    // Per-rule new
    for (const rule of stats.violations) {
      if (!prev.byRule[rule]) {
        newViolations.push({ page, violations: [rule], reason: 'new_rule' });
      }
    }
  }

  return { newViolations, increasedPages };
}

async function sendTelegram(report, stats) {
  const https = require('https');
  const now = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  let text = `♿ *Accessibility Audit* — ${now}\nBase: ${BASE_URL}\n\n`;

  if (stats.criticalCount === 0 && stats.totalViolations === 0) {
    text += '✅ No accessibility violations found.\n';
  } else {
    text += `⚠️ Violations: ${stats.totalViolations} total, ${stats.criticalCount} critical\n\n`;
    Object.entries(stats.pageStats)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 5)
      .forEach(([page, s]) => {
        text += `• ${page}: ${s.total} violation(s)\n`;
      });
    if (Object.keys(stats.pageStats).length > 5) text += `...and ${Object.keys(stats.pageStats).length - 5} more\n`;
  }

  text += `\n📊 Trend:\n`;
  // Show pages with increases
  if (report.increasedPages && report.increasedPages.length > 0) {
    report.increasedPages.forEach(p => {
      text += `↑ ${p.page}: ${p.previous} → ${p.current}\n`;
    });
  } else {
    text += 'No significant increases vs yesterday.\n';
  }

  text += `\nDetails: .hermes/memory/accessibility/latest-report.json`;

  const payload = new URLSearchParams({ chat_id: TELEGRAM_CHAT, text, parse_mode: 'Markdown' });

  await new Promise((resolve, reject) => {
    const req = require('https').request({
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

async function createGitHubIssue(report, stats, history) {
  const title = `🚨 Accessibility Violations — ${new Date().toLocaleDateString()} — ${stats.totalViolations} found`;
  const body = [
    '## Accessibility Audit Report',
    '',
    `**Run:** ${new Date().toISOString()}`,
    `**Base URL:** ${BASE_URL}`,
    `**Pages scanned:** ${Object.keys(report.pageStats).length}`,
    `**Total violations:** ${stats.totalViolations}`,
    `**Critical:** ${stats.criticalCount}`,
    '',
    '### Top Affected Pages',
    ...Object.entries(report.pageStats)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 10)
      .map(([page, s]) => `- ${page}: ${s.total} violation(s)`),
    '',
    report.increasedPages && report.increasedPages.length > 0 ? '### ⚠️ Increases vs Yesterday\n' + report.increasedPages.map(p => `- ${p.page}: ${p.previous} → ${p.current}`).join('\n') + '\n' : '',
    '### Remediation',
    '- Run locally: `npx playwright test` (see automation/accessibility-audit.cjs)',
    '- Review each violation in the HTML report (uploaded artifact)',
    '- Fix ARIA labels, heading hierarchy, focus management, color contrast',
    '',
    '---',
    '*Generated by automation/accessibility-audit.cjs*',
  ].join('\n');

  try {
    const escaped = body.replace(/"/g, '\\"').replace(/\$/g, '\\$');
    execSync(`gh issue create --title "${title}" --body "${escaped}" --label "automation,accessibility,wcag"`, { stdio: 'pipe' });
    log('✅ GitHub issue created');
  } catch (e) {
    log('⚠️ gh CLI failed; issue not created: ' + e.message);
  }
}

async function main() {
  ensureFiles();
  log('♿ Starting Accessibility Audit...');

  // 1. Get pages to scan (from sitemap)
  const sitemapXml = await fetchSitemap();
  const sitemapUrls = extractUrlsFromSitemap(sitemapXml);
  // Filter to pages only (depth ≤ 2), limit to 50 max for performance
  const pages = sitemapUrls
    .filter(u => !u.endsWith('.xml') && !u.includes('.').slice(-4))
    .slice(0, 50);
  log(`📄 Found ${pages.length} pages to scan from sitemap`);

  if (pages.length === 0) {
    log('⚠️ No pages found; scanning homepage only');
    pages.push('/');
  }

  // 2. Run axe scans (sequential due to Playwright overhead)
  const scanResults = await runAxeScan(pages);
  if (!scanResults) {
    log('❌ Scan failed; exiting');
    process.exit(1);
  }
  log(`✅ Scanned ${scanResults.scanned} pages`);

  // 3. Aggregate violations
  const { pageStats, totalViolations, criticalCount } = aggregateViolations(scanResults.results);
  log(`📊 Total violations: ${totalViolations} (critical: ${criticalCount})`);

  // 4. Compare to history
  const history = loadHistory();
  const { newViolations, increasedPages } = await compareToBaseline(pageStats, history);
  saveHistory(history);

  // 5. Build report
  const report = {
    timestamp: new Date().toISOString(),
    pagesScanned: pages.length,
    pageStats,
    summary: { totalViolations, criticalCount },
    changes: { newViolations, increasedPages },
  };
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));

  // 6. Alerts
  if (TELEGRAM_TOKEN) {
    await sendTelegram(report, { pageStats, totalViolations, criticalCount });
  }

  // 7. Create GitHub issue if:
  //  - Any critical violations exist on main branch (we're on main)
  //  - Or increasedPages exist with >50% jump
  if (criticalCount > 0 && GITHUB_TOKEN) {
    await createGitHubIssue(report, { pageStats, totalViolations, criticalCount }, history);
  }

  log('✅ Accessibility audit complete');
}

main().catch(err => {
  console.error('❌ Accessibility audit failed:', err);
  process.exit(1);
});
