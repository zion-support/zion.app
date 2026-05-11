#!/usr/bin/env node

/**
 * AI Live Site UX Implementation Agent
 *
 * Reads live-site-ux-audit-latest.json and applies fixable UX/SEO improvements
 * to the homepage (app/page.tsx). Handles title (30-60 chars) and meta description (50-160 chars).
 * No LLM required.
 *
 * Fixable checks:
 *   - title: truncate or shorten to 30-60 chars
 *   - meta_description: truncate or shorten to 50-160 chars
 *
 * Output: automation/reports/live-site-ux-implementation-latest.json
 *
 * Run: npm run app:ux-audit-apply (after app:ux-audit)
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const UX_AUDIT_FILE = path.join(REPORTS_DIR, 'live-site-ux-audit-latest.json');
const IMPL_REPORT_FILE = path.join(REPORTS_DIR, 'live-site-ux-implementation-latest.json');
const HOMEPAGE_PATH = path.join(ROOT, 'app', 'page.tsx');

const TITLE_MIN = 30;
const TITLE_MAX = 60;
const DESC_MIN = 50;
const DESC_MAX = 160;

const DRY_RUN = process.env.DRY_RUN === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[LiveSiteUXImpl] ${ts} | ${msg}`);
}

function truncate(str, max, suffix = '') {
  if (str.length <= max) return str;
  const cut = max - suffix.length;
  return str.slice(0, cut).trim() + suffix;
}

function loadAudit() {
  if (!fs.existsSync(UX_AUDIT_FILE)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(UX_AUDIT_FILE, 'utf8'));
  } catch (e) {
    log(`Failed to load audit: ${e.message}`);
    return null;
  }
}

function applyFixes(content, fixes) {
  let modified = content;
  const applied = [];

  if (fixes.title) {
    const titleMatch = modified.match(/title:\s*['"]([^'"]+)['"]/);
    if (titleMatch && titleMatch[1].length > TITLE_MAX) {
      const newTitle = truncate(titleMatch[1], TITLE_MAX);
      modified = modified.replace(
        new RegExp(`title:\\s*['"]${titleMatch[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`),
        `title: '${newTitle}'`
      );
      applied.push({ type: 'title', from: titleMatch[1].length, to: newTitle.length });
    }
  }

  if (fixes.meta_description) {
    const descMatch = modified.match(/description:\s*\n\s*['"]([^'"]+)['"]/);
    if (descMatch && descMatch[1].length > DESC_MAX) {
      const newDesc = truncate(descMatch[1], DESC_MAX);
      modified = modified.replace(
        new RegExp(`description:\\s*\\n\\s*['"]${descMatch[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`),
        `description:\n    '${newDesc}'`
      );
      applied.push({ type: 'meta_description', from: descMatch[1].length, to: newDesc.length });
    }
  }

  return { modified, applied };
}

function main() {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  const audit = loadAudit();
  if (!audit || !audit.checks) {
    log('No UX audit report found. Run: npm run app:ux-audit');
    fs.writeFileSync(
      IMPL_REPORT_FILE,
      JSON.stringify({ error: 'No audit', timestamp: new Date().toISOString() }, null, 2)
    );
    process.exit(1);
  }

  const fixes = {};
  for (const c of audit.checks) {
    if (!c.ok && (c.id === 'title' || c.id === 'meta_description')) {
      fixes[c.id] = true;
    }
  }

  if (Object.keys(fixes).length === 0) {
    log('No fixable UX issues (title/meta_description already OK)');
    fs.writeFileSync(
      IMPL_REPORT_FILE,
      JSON.stringify(
        { applied: 0, fixes: [], timestamp: new Date().toISOString(), status: 'ok' },
        null,
        2
      )
    );
    return;
  }

  if (!fs.existsSync(HOMEPAGE_PATH)) {
    log(`Homepage not found: ${HOMEPAGE_PATH}`);
    process.exit(1);
  }

  let content = fs.readFileSync(HOMEPAGE_PATH, 'utf8');
  const { modified, applied } = applyFixes(content, fixes);

  if (applied.length === 0) {
    log('No changes applied (metadata format may differ)');
    fs.writeFileSync(
      IMPL_REPORT_FILE,
      JSON.stringify(
        { applied: 0, attempted: Object.keys(fixes), timestamp: new Date().toISOString() },
        null,
        2
      )
    );
    return;
  }

  if (!DRY_RUN) {
    fs.writeFileSync(HOMEPAGE_PATH, modified);
  }

  log(`Applied ${applied.length} fix(es): ${applied.map((a) => `${a.type} ${a.from}→${a.to} chars`).join(', ')}`);
  if (DRY_RUN) {
    log('DRY_RUN: no files modified');
  }

  fs.writeFileSync(
    IMPL_REPORT_FILE,
    JSON.stringify(
      {
        applied: applied.length,
        fixes: applied,
        dryRun: DRY_RUN,
        timestamp: new Date().toISOString(),
        status: 'ok',
      },
      null,
      2
    )
  );
}

main();
