#!/usr/bin/env node

/**
 * AI Content Freshness Agent
 *
 * Scans blog posts, case studies, and key pages for stale content.
 * Identifies content older than threshold (default 12 months) and
 * generates actionable reports for content updates.
 *
 * Features:
 * - Scans app/ and src/ for content pages
 * - Extracts date metadata from files
 * - Uses file mtime as fallback
 * - Generates freshness report with recommendations
 *
 * Runs: Weekly via cron (Mondays 4 AM)
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, 'app');
const SRC_DIR = path.join(ROOT, 'src');
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const REPORT_FILE = path.join(REPORTS_DIR, 'content-freshness-latest.json');

const STALE_MONTHS = parseInt(process.env.STALE_MONTHS || '12', 10);
const WARN_MONTHS = parseInt(process.env.WARN_MONTHS || '9', 10);

const DATE_PATTERNS = [
  /date:\s*['"]([^'"]+)['"]/,
  /publishedAt:\s*['"]([^'"]+)['"]/,
  /createdAt:\s*['"]([^'"]+)['"]/,
  /lastUpdated?:\s*['"]([^'"]+)['"]/,
  /(\d{4}-\d{2}-\d{2})/,
  /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}/,
];

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[ContentFreshness] ${ts} | ${msg}`);
}

function ensureDirs() {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

function parseDate(str) {
  if (!str) return null;
  const d = new Date(str.trim());
  return isNaN(d.getTime()) ? null : d;
}

function extractDateFromContent(content) {
  for (const re of DATE_PATTERNS) {
    const m = content.match(re);
    if (m) {
      const parsed = parseDate(m[1] || m[0]);
      if (parsed) return parsed;
    }
  }
  return null;
}

function collectFiles(dir, ext, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') {
      collectFiles(full, ext, acc);
    } else if (e.isFile() && e.name.endsWith(ext)) {
      acc.push(full);
    }
  }
  return acc;
}

function getContentType(filePath) {
  const rel = path.relative(ROOT, filePath);
  if (rel.includes('blog')) return 'blog';
  if (rel.includes('case-studies')) return 'case-study';
  if (rel.includes('services')) return 'service';
  if (rel.includes('solutions')) return 'solution';
  if (rel.includes('platform')) return 'platform';
  return 'page';
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const stat = fs.statSync(filePath);
  const extracted = extractDateFromContent(content);
  const mtime = stat.mtime;
  const date = extracted || mtime;
  const now = new Date();
  const monthsOld = (now - date) / (30 * 24 * 60 * 60 * 1000);
  const slug = path.basename(filePath, path.extname(filePath));

  let status = 'fresh';
  if (monthsOld >= STALE_MONTHS) status = 'stale';
  else if (monthsOld >= WARN_MONTHS) status = 'warning';

  return {
    path: path.relative(ROOT, filePath),
    slug,
    type: getContentType(filePath),
    date: date.toISOString().slice(0, 10),
    dateSource: extracted ? 'metadata' : 'file-mtime',
    monthsOld: Math.round(monthsOld * 10) / 10,
    status,
  };
}

function run() {
  ensureDirs();
  log('Starting content freshness scan...');

  const appFiles = collectFiles(APP_DIR, '.tsx').concat(collectFiles(APP_DIR, '.ts'));
  const srcFiles = collectFiles(SRC_DIR, '.tsx').concat(collectFiles(SRC_DIR, '.ts'));
  const allFiles = [...appFiles, ...srcFiles].filter(
    (f) =>
      (f.includes('blog') || f.includes('case-studies') || f.includes('page.')) &&
      !f.includes('layout.') &&
      !f.includes('loading.')
  );

  const results = allFiles.map(analyzeFile);
  const stale = results.filter((r) => r.status === 'stale');
  const warning = results.filter((r) => r.status === 'warning');
  const fresh = results.filter((r) => r.status === 'fresh');

  const report = {
    timestamp: new Date().toISOString(),
    config: { staleMonths: STALE_MONTHS, warnMonths: WARN_MONTHS },
    summary: {
      total: results.length,
      stale: stale.length,
      warning: warning.length,
      fresh: fresh.length,
    },
    stale,
    warning,
    recommendations: [
      ...stale.map((r) => ({
        path: r.path,
        action: 'Consider updating or archiving',
        priority: 'high',
      })),
      ...warning.map((r) => ({
        path: r.path,
        action: 'Plan for update in next quarter',
        priority: 'medium',
      })),
    ],
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Scan complete. Stale: ${stale.length}, Warning: ${warning.length}, Fresh: ${fresh.length}`);
  log(`Report: ${REPORT_FILE}`);

  return report;
}

function metadataCheck() {
  ensureDirs();
  const appFiles = collectFiles(APP_DIR, '.tsx').concat(collectFiles(APP_DIR, '.ts'));
  const blogFiles = appFiles.filter((f) => f.includes('blog') && !f.includes('layout') && !f.includes('loading'));
  const BLOG_STALE_MONTHS = parseInt(process.env.BLOG_STALE_MONTHS || '18', 10);
  const results = blogFiles.map(analyzeFile);
  const invalidDate = results.filter((r) => r.dateSource === 'file-mtime' && r.type === 'blog');
  const staleBlog = results.filter((r) => r.type === 'blog' && r.monthsOld >= BLOG_STALE_MONTHS);
  const report = {
    timestamp: new Date().toISOString(),
    blogPostsTotal: blogFiles.length,
    missingMetadata: invalidDate.map((r) => ({ path: r.path, monthsOld: r.monthsOld })),
    staleOver18Months: staleBlog.map((r) => ({ path: r.path, date: r.date, monthsOld: r.monthsOld })),
  };
  fs.writeFileSync(path.join(REPORTS_DIR, 'content-metadata-check-latest.json'), JSON.stringify(report, null, 2));
  log(`Blog metadata check: ${invalidDate.length} missing date metadata, ${staleBlog.length} >${BLOG_STALE_MONTHS}mo old`);
  return report;
}

const cmd = process.argv[2] || 'run';
if (cmd === 'run') {
  run();
} else if (cmd === 'summary') {
  if (!fs.existsSync(REPORT_FILE)) {
    console.log('{}');
    process.exit(0);
  }
  const report = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'));
  console.log(JSON.stringify(report.summary, null, 2));
} else if (cmd === 'metadata-check') {
  metadataCheck();
} else {
  console.log('Usage: node ai-content-freshness-agent.cjs [run|summary|metadata-check]');
  process.exit(1);
}
