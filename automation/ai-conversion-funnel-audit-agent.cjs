#!/usr/bin/env node

/**
 * AI Conversion Funnel Audit Agent
 *
 * Audits the codebase for CTA links and buttons that should be tracked for
 * conversion funnel analysis. Suggests gtag/GA4 event tracking for key actions.
 * No LLM required.
 *
 * Output: automation/reports/conversion-funnel-audit-latest.json
 *
 * Run: npm run conversion:funnel-audit
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const REPORT_FILE = path.join(REPORTS_DIR, 'conversion-funnel-audit-latest.json');
const APP_DIR = path.join(ROOT, 'app');

const CTA_PATTERNS = [
  { pattern: /href=["']\/contact[^"']*["']/g, label: 'Contact link', event: 'cta_contact' },
  { pattern: /Start a Project|Book a (Strategy Session|Discovery Call|30-min call)/gi, label: 'Primary CTA', event: 'cta_primary' },
  { pattern: /Book a Discovery Call/gi, label: 'Discovery CTA', event: 'cta_discovery' },
  { pattern: /Launch (analytics|engine|platform)/gi, label: 'Product CTA', event: 'cta_product' },
];

const GTAG_EVENT_PATTERN = /gtag\s*\(\s*['"]event['"]\s*,/;
const DATA_ATTR_TRACKING = /data-cta-event|data-event-name|data-analytics/;

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[ConversionFunnel] ${ts} | ${msg}`);
}

function findTsxFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') {
      findTsxFiles(full, files);
    } else if (e.name.endsWith('.tsx') || e.name.endsWith('.ts')) {
      files.push(full);
    }
  }
  return files;
}

function auditFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const rel = path.relative(ROOT, filePath);
  const findings = [];

  for (const { pattern, label, event } of CTA_PATTERNS) {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      const hasTracking = GTAG_EVENT_PATTERN.test(content) || DATA_ATTR_TRACKING.test(content);
      findings.push({
        file: rel,
        label,
        event,
        count: matches.length,
        hasTracking,
        suggestion: hasTracking ? null : `Add gtag('event','${event}',{...}) or data-cta-event="${event}"`,
      });
    }
  }

  return findings;
}

function main() {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  const files = findTsxFiles(APP_DIR);
  const allFindings = [];
  const byEvent = {};
  let totalUntracked = 0;

  for (const f of files) {
    const findings = auditFile(f);
    for (const fn of findings) {
      allFindings.push(fn);
      byEvent[fn.event] = (byEvent[fn.event] || 0) + fn.count;
      if (!fn.hasTracking) totalUntracked += fn.count;
    }
  }

  const uniqueFiles = [...new Set(allFindings.map((f) => f.file))];
  const report = {
    timestamp: new Date().toISOString(),
    totalCtaOccurrences: allFindings.reduce((s, f) => s + f.count, 0),
    untrackedCount: totalUntracked,
    filesWithCtas: uniqueFiles.length,
    byEvent,
    findings: allFindings.filter((f) => !f.hasTracking),
    suggestions: [
      'Add gtag event tracking for CTA clicks (cta_contact, cta_primary, cta_discovery)',
      'Consider data-cta-event attribute for declarative tracking',
      'Track conversion funnel: view_contact → click_cta → form_submit',
    ],
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Report: ${REPORT_FILE}`);
  log(`CTAs found: ${report.totalCtaOccurrences}, untracked: ${report.untrackedCount}`);
  log(`Files with CTAs: ${report.filesWithCtas}`);
}

main();
