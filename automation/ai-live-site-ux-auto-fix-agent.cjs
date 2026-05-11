#!/usr/bin/env node

/**
 * AI Live Site UX Auto-Fix Agent
 *
 * Reads live-site-ux-audit-latest.json and applies fixable UX/SEO improvements
 * to the homepage (app/page.tsx). No LLM required.
 *
 * Fixes applied:
 * - meta_description: trim/shorten to 50-160 chars
 * - title: shorten to 30-60 chars
 *
 * Run after ai-live-site-ux-audit-agent. Part of app evolution pipeline.
 *
 * Options:
 *   DRY_RUN=1 - Log what would be applied, don't modify files
 *
 * Output: automation/reports/live-site-ux-auto-fix-latest.json
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const AUDIT_FILE = path.join(REPORTS_DIR, 'live-site-ux-audit-latest.json');
const REPORT_FILE = path.join(REPORTS_DIR, 'live-site-ux-auto-fix-latest.json');
const HOMEPAGE_PATH = path.join(ROOT, 'app', 'page.tsx');
const LAYOUT_PATH = path.join(ROOT, 'app', 'layout.tsx');

const DRY_RUN = process.env.DRY_RUN === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[LiveSiteUXFix] ${ts} | ${msg}`);
}

function loadAudit() {
  if (!fs.existsSync(AUDIT_FILE)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf8'));
  } catch (e) {
    log(`Failed to load audit: ${e.message}`);
    return null;
  }
}

function truncate(str, maxLen, suffix = '') {
  if (!str || str.length <= maxLen) return str;
  const cut = str.slice(0, maxLen - suffix.length).trim();
  const lastSpace = cut.lastIndexOf(' ');
  if (lastSpace > maxLen * 0.6) {
    return cut.slice(0, lastSpace) + suffix;
  }
  return cut + suffix;
}

function applyFixes(audit) {
  const applied = [];
  const skipped = [];

  const failedChecks = (audit.checks || []).filter((c) => !c.ok);
  if (failedChecks.length === 0) {
    log('No failed checks; nothing to fix.');
    return { applied, skipped, ok: true };
  }

  // Try layout.tsx first (homepage metadata often comes from root layout)
  let content = '';
  let targetPath = LAYOUT_PATH;
  if (fs.existsSync(LAYOUT_PATH)) {
    content = fs.readFileSync(LAYOUT_PATH, 'utf8');
  }
  if (!content && fs.existsSync(HOMEPAGE_PATH)) {
    content = fs.readFileSync(HOMEPAGE_PATH, 'utf8');
    targetPath = HOMEPAGE_PATH;
  }
  if (!content) {
    log('Neither layout nor homepage found; skipping.');
    return { applied, skipped, ok: false };
  }

  for (const check of failedChecks) {
    if (check.id === 'meta_description') {
      const descMatch = content.match(
        /description:\s*\n\s*['"`]([^'"`]+)['"`]\s*,\s*(?:metadataBase|applicationName)/
      ) || content.match(
        /description:\s*['"`]([^'"`]+)['"`]\s*,\s*(?:metadataBase|applicationName)/
      );
      if (descMatch) {
        const current = descMatch[1];
        const target = truncate(current, 158, '');
        if (current.length > 160 || (current.length > 158 && target.length < current.length)) {
          const escaped = target.replace(/'/g, "\\'");
          const nextKey = content.includes('metadataBase') ? 'metadataBase' : 'applicationName';
          const replacement = `description:\n    '${escaped}',\n  ${nextKey}`;
          content = content.replace(descMatch[0], replacement);
          applied.push({ check: 'meta_description', action: `Trimmed to ${target.length} chars`, file: targetPath });
        } else {
          skipped.push({ check: 'meta_description', reason: 'Already within range' });
        }
      } else {
        skipped.push({ check: 'meta_description', reason: 'Pattern not found' });
      }
    } else if (check.id === 'title') {
      const titleObjMatch = content.match(/title:\s*\{\s*default:\s*['"`]([^'"`]+)['"`]/);
      const titleStrMatch = content.match(/title:\s*['"`]([^'"`]+)['"`]\s*,\s*description/);
      const match = titleObjMatch || titleStrMatch;
      if (match) {
        const current = match[1];
        const target = truncate(current, 58, '');
        if (current.length > 60 || (target.length < current.length && target.length >= 30)) {
          const escaped = target.replace(/'/g, "\\'");
          if (titleObjMatch) {
            content = content.replace(titleObjMatch[0], `title: {\n    default: '${escaped}',`);
          } else {
            content = content.replace(titleStrMatch[0], `title: '${escaped}',\n  description`);
          }
          applied.push({ check: 'title', action: `Shortened to ${target.length} chars`, file: targetPath });
        } else {
          skipped.push({ check: 'title', reason: 'Already within range' });
        }
      } else {
        skipped.push({ check: 'title', reason: 'Pattern not found' });
      }
    } else {
      skipped.push({ check: check.id, reason: 'No auto-fix implemented' });
    }
  }

  if (applied.length > 0 && !DRY_RUN) {
    fs.writeFileSync(targetPath, content);
  }

  return { applied, skipped, ok: true };
}

async function main() {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  const audit = loadAudit();
  if (!audit) {
    log('Run ai-live-site-ux-audit-agent first.');
    fs.writeFileSync(
      REPORT_FILE,
      JSON.stringify(
        { error: 'No audit report', timestamp: new Date().toISOString() },
        null,
        2
      )
    );
    process.exit(1);
  }

  log(`Audit score: ${audit.score}/100`);
  const result = applyFixes(audit);

  if (DRY_RUN && result.applied.length > 0) {
    log(`DRY_RUN: Would apply ${result.applied.length} fixes`);
  } else if (result.applied.length > 0) {
    log(`Applied ${result.applied.length} fixes`);
  }

  const report = {
    timestamp: new Date().toISOString(),
    dryRun: DRY_RUN,
    applied: result.applied,
    skipped: result.skipped,
    ok: result.ok,
  };
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Report: ${REPORT_FILE}`);

  process.exit(0);
}

main().catch((err) => {
  log(`Fatal: ${err.message}`);
  process.exit(1);
});
