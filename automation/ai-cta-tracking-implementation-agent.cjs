#!/usr/bin/env node

/**
 * AI CTA Tracking Implementation Agent
 *
 * Reads conversion-funnel-audit-latest.json and adds data-cta-event to
 * high-priority CTAs that lack tracking. Prioritizes homepage, header, footer,
 * and contact links. When untracked > 50, expands to more files.
 * No LLM required.
 *
 * Environment:
 *   DRY_RUN=1 - Log what would be applied, don't modify files
 *   MAX_FILES=10 - Max files to modify per run (default 5)
 *
 * Run: After conversion funnel audit, or as part of app evolution pipeline
 * Output: automation/reports/cta-tracking-implementation-latest.json
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const AUDIT_FILE = path.join(REPORTS_DIR, 'conversion-funnel-audit-latest.json');
const REPORT_FILE = path.join(REPORTS_DIR, 'cta-tracking-implementation-latest.json');
const MAX_FILES = parseInt(process.env.MAX_FILES || '5', 10);
const DRY_RUN = process.env.DRY_RUN === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[CtaTrackingImpl] ${ts} | ${msg}`);
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

function addDataCtaToFile(filePath, eventsByType) {
  const fullPath = path.join(ROOT, filePath);
  if (!fs.existsSync(fullPath)) return { applied: 0, reason: 'file_not_found' };

  let content = fs.readFileSync(fullPath, 'utf8');
  let applied = 0;
  const label = path.basename(filePath, path.extname(filePath));

  // Contact links: href="/contact" or href="/contact#..."
  const contactPattern = /(<(?:Link|a)[^>]*href=["']\/contact[^"']*["'][^>]*)(>)/gi;
  if (eventsByType.cta_contact || eventsByType.cta_discovery) {
    const eventAttr = eventsByType.cta_discovery ? 'cta_discovery' : 'cta_contact';
    content = content.replace(contactPattern, (match, before, after) => {
      if (/data-cta-event/i.test(before)) return match;
      applied++;
      return `${before} data-cta-event="${eventAttr}" data-cta-label="${label}"${after}`;
    });
  }

  if (applied > 0 && !DRY_RUN) {
    fs.writeFileSync(fullPath, content);
  }
  return { applied };
}

function main() {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  const audit = loadAudit();
  if (!audit || !audit.findings || audit.findings.length === 0) {
    log('No conversion funnel audit or no findings. Run conversion:funnel-audit first.');
    fs.writeFileSync(
      REPORT_FILE,
      JSON.stringify({ timestamp: new Date().toISOString(), status: 'no_audit', applied: 0 }, null, 2)
    );
    process.exit(0);
  }

  const priorityFiles = [
    'app/page.tsx',
    'app/components/Navigation.tsx',
    'app/components/Footer.tsx',
    'app/components/StickyMobileCTA.tsx',
    'app/contact/page.tsx',
  ];

  const byFile = new Map();
  for (const f of audit.findings) {
    if (!byFile.has(f.file)) byFile.set(f.file, []);
    byFile.get(f.file).push(f);
  }

  const untrackedCount = audit.untrackedCount ?? 0;
  const expandBeyondPriority = untrackedCount > 50;

  let toProcess = [];
  for (const file of priorityFiles) {
    const findings = byFile.get(file)?.filter((x) => !x.hasTracking) || [];
    if (findings.length > 0) toProcess.push({ file, findings });
  }

  if (expandBeyondPriority && toProcess.length < MAX_FILES) {
    const otherFiles = [...byFile.entries()]
      .filter(([f]) => !priorityFiles.includes(f))
      .map(([file, findings]) => ({ file, findings: findings.filter((x) => !x.hasTracking) }))
      .filter((x) => x.findings.length > 0)
      .sort((a, b) => b.findings.length - a.findings.length);
    const slots = MAX_FILES - toProcess.length;
    toProcess = toProcess.concat(otherFiles.slice(0, slots));
    if (otherFiles.length > 0) log(`Expanded to ${toProcess.length} files (untracked ${untrackedCount} > 50)`);
  }

  const report = { timestamp: new Date().toISOString(), dryRun: DRY_RUN, filesModified: 0, totalApplied: 0 };
  let filesDone = 0;

  for (const { file, findings } of toProcess) {
    if (filesDone >= MAX_FILES) break;
    const eventsByType = {};
    for (const f of findings) {
      eventsByType[f.event] = true;
    }
    const result = addDataCtaToFile(file, eventsByType);
    if (result.applied > 0) {
      report.filesModified = (report.filesModified || 0) + 1;
      report.totalApplied = (report.totalApplied || 0) + result.applied;
      filesDone++;
      log(`${DRY_RUN ? '[DRY] Would modify' : 'Modified'} ${file}: +${result.applied} data-cta-event`);
    }
  }

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Report: ${REPORT_FILE}`);
  process.exit(0);
}

main().catch((e) => {
  log(`Fatal: ${e.message}`);
  process.exit(1);
});
