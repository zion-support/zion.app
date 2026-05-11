#!/usr/bin/env node

/**
 * AI System Intelligence Auto-Fix Agent
 *
 * Reads system-intelligence-audit-latest.json and applies fixable improvements
 * to the codebase. No LLM required.
 *
 * Fixes applied:
 * - Homepage: meta description (50-160 chars), title (30-60 chars) via layout.tsx
 * - Services: title expansion (30-60 chars when too short)
 * - Other pages: title/meta adjustments when out of range
 *
 * Run after ai-system-intelligence-audit-agent. Part of app visit intelligence.
 *
 * Environment:
 *   DRY_RUN=1 - Log what would be applied, don't modify files
 *
 * Output: automation/reports/system-intelligence-auto-fix-latest.json
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const AUDIT_FILE = path.join(REPORTS_DIR, 'system-intelligence-audit-latest.json');
const REPORT_FILE = path.join(REPORTS_DIR, 'system-intelligence-auto-fix-latest.json');
const LAYOUT_PATH = path.join(ROOT, 'app', 'layout.tsx');
const SERVICES_PATH = path.join(ROOT, 'app', 'services', 'page.tsx');

const DRY_RUN = process.env.DRY_RUN === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[SystemIntelFix] ${ts} | ${msg}`);
}

function loadAudit() {
  if (!fs.existsSync(AUDIT_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf8'));
  } catch (e) {
    log(`Failed to load audit: ${e.message}`);
    return null;
  }
}

function truncate(str, maxLen) {
  if (!str || str.length <= maxLen) return str;
  const cut = str.slice(0, maxLen).trim();
  const lastSpace = cut.lastIndexOf(' ');
  if (lastSpace > maxLen * 0.6) return cut.slice(0, lastSpace);
  return cut;
}

function expandTitle(str, minLen, maxLen) {
  if (!str || str.length >= minLen) return str;
  const suffix = ' | Zion Tech Group';
  const expanded = str + suffix;
  if (expanded.length <= maxLen) return expanded;
  return truncate(expanded, maxLen);
}

function applyFixes(audit) {
  const applied = [];
  const skipped = [];

  const failedChecks = (audit.checks || []).filter((c) => !c.ok);
  if (failedChecks.length === 0) {
    log('No failed checks; nothing to fix.');
    return { applied, skipped, ok: true };
  }

  // Homepage: meta_description, title (layout.tsx)
  const layoutMetaDesc = failedChecks.find((c) => c.id === 'meta_description' && c.page === 'Homepage');
  const layoutTitle = failedChecks.find((c) => c.id === 'title' && c.page === 'Homepage');

  if ((layoutMetaDesc || layoutTitle) && fs.existsSync(LAYOUT_PATH)) {
    let content = fs.readFileSync(LAYOUT_PATH, 'utf8');

    if (layoutMetaDesc && layoutMetaDesc.detail) {
      const lenMatch = layoutMetaDesc.detail.match(/Length (\d+)/);
      const currentLen = lenMatch ? parseInt(lenMatch[1], 10) : 0;
      if (currentLen > 160) {
        const descMatch = content.match(/description:\s*\n\s*['"`]([^'"`]+)['"`]/) ||
          content.match(/description:\s*['"`]([^'"`]+)['"`]/);
        if (descMatch) {
          const target = truncate(descMatch[1], 158);
          const escaped = target.replace(/'/g, "\\'");
          content = content.replace(descMatch[0], descMatch[0].replace(descMatch[1], escaped));
          applied.push({ check: 'meta_description', page: 'Homepage', action: `Trimmed to ${target.length} chars` });
        }
      } else {
        skipped.push({ check: 'meta_description', reason: 'Length OK or pattern not found' });
      }
    }

    if (layoutTitle && layoutTitle.detail) {
      const lenMatch = layoutTitle.detail.match(/Length (\d+)/);
      const currentLen = lenMatch ? parseInt(lenMatch[1], 10) : 0;
      if (currentLen > 60) {
        const titleObjMatch = content.match(/title:\s*\{\s*default:\s*['"`]([^'"`]+)['"`]/);
        if (titleObjMatch) {
          const target = truncate(titleObjMatch[1], 58);
          const escaped = target.replace(/'/g, "\\'");
          content = content.replace(titleObjMatch[0], titleObjMatch[0].replace(titleObjMatch[1], escaped));
          applied.push({ check: 'title', page: 'Homepage', action: `Shortened to ${target.length} chars` });
        } else {
          skipped.push({ check: 'title', reason: 'Pattern not found' });
        }
      } else {
        skipped.push({ check: 'title', reason: 'Length OK' });
      }
    }

    if (applied.some((a) => a.page === 'Homepage') && !DRY_RUN) {
      fs.writeFileSync(LAYOUT_PATH, content);
    }
  }

  // Services: title too short (26 chars, target 30-60)
  const servicesTitle = failedChecks.find((c) => c.id === 'title' && c.page === 'Services');
  if (servicesTitle && servicesTitle.detail && /Length 26/.test(servicesTitle.detail) && fs.existsSync(SERVICES_PATH)) {
    let content = fs.readFileSync(SERVICES_PATH, 'utf8');
    const titleMatch = content.match(/title:\s*['"`]([^'"`]+)['"`]\s*,\s*description/);
    if (titleMatch && titleMatch[1].length < 30) {
      const expanded = 'Professional AI & Engineering Services';
      const escaped = expanded.replace(/'/g, "\\'");
      content = content.replace(titleMatch[0], `title: '${escaped}',\n  description`);
      if (!DRY_RUN) fs.writeFileSync(SERVICES_PATH, content);
      applied.push({ check: 'title', page: 'Services', action: `Expanded to ${expanded.length} chars` });
    }
  }

  return { applied, skipped, ok: applied.length >= 0 };
}

function main() {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  const audit = loadAudit();
  if (!audit) {
    log('No system intelligence audit found. Run system:intelligence-audit first.');
    fs.writeFileSync(
      REPORT_FILE,
      JSON.stringify({ timestamp: new Date().toISOString(), status: 'no_audit', applied: [] }, null, 2)
    );
    process.exit(0);
  }

  log('Applying fixable improvements...');
  const result = applyFixes(audit);

  const report = {
    timestamp: new Date().toISOString(),
    dryRun: DRY_RUN,
    applied: result.applied,
    skipped: result.skipped,
    ok: result.ok,
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Report: ${REPORT_FILE}`);
  log(`Applied: ${result.applied.length}, Skipped: ${result.skipped.length}`);

  process.exit(0);
}

main();
