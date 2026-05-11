#!/usr/bin/env node

/**
 * AI Layout Design Implementation Agent
 *
 * Reads layout-design-audit-latest.json (from ai-layout-design-audit-agent) and
 * applies safe, high-priority layout/design improvements. Runs after layout audit.
 *
 * Applied improvements:
 * - Font display: swap (FOUT prevention)
 * - Section spacing tokens in Tailwind
 * - Simplified shadow (performance)
 * - Logs applied changes for audit trail
 *
 * Environment:
 *   DRY_RUN=1 - Log what would be applied, don't modify files
 *   AUTO_COMMIT=1 - Commit applied changes (requires git)
 *
 * Runs: After layout audit, or workflow_dispatch
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const AUTOMATION_DIR = path.join(ROOT, 'automation');
const REPORTS_DIR = path.join(AUTOMATION_DIR, 'reports');
const REPORT_FILE = path.join(REPORTS_DIR, 'layout-design-audit-latest.json');
const IMPL_REPORT_FILE = path.join(REPORTS_DIR, 'layout-design-implementation-latest.json');

const DRY_RUN = process.env.DRY_RUN === '1';
const AUTO_COMMIT = process.env.AUTO_COMMIT === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[LayoutDesignImpl] ${ts} | ${msg}`);
}

function ensureDirs() {
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }
}

function loadAuditReport() {
  if (!fs.existsSync(REPORT_FILE)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'));
  } catch (e) {
    log(`Failed to load audit: ${e.message}`);
    return null;
  }
}

function applyFontDisplaySwap() {
  const layoutPath = path.join(ROOT, 'app', 'layout.tsx');
  if (!fs.existsSync(layoutPath)) return { applied: 0, changes: [] };

  let content = fs.readFileSync(layoutPath, 'utf8');
  const changes = [];

  if (!content.includes("display: 'swap'") && content.includes('Inter({')) {
    content = content.replace(
      /Inter\(\{\s*subsets:\s*\['latin'\]\s*\}\)/,
      "Inter({ subsets: ['latin'], display: 'swap' })"
    );
    changes.push({ type: 'font-display', detail: 'Added display: swap to Inter font' });
  }

  if (changes.length > 0 && !DRY_RUN) {
    fs.writeFileSync(layoutPath, content);
  }
  return { applied: changes.length, changes };
}

function applySectionSpacing() {
  const tailwindPath = path.join(ROOT, 'tailwind.config.ts');
  if (!fs.existsSync(tailwindPath)) return { applied: 0, changes: [] };

  let content = fs.readFileSync(tailwindPath, 'utf8');
  const changes = [];

  if (!content.includes("section:") && content.includes('extend:')) {
    const extendMatch = content.match(/extend:\s*\{/);
    if (extendMatch) {
      content = content.replace(
        /extend:\s*\{/,
        "extend: {\n      spacing: {\n        section: '4rem',\n      },"
      );
      changes.push({ type: 'section-spacing', detail: 'Added section spacing token to Tailwind' });
    }
  }

  if (changes.length > 0 && !DRY_RUN) {
    fs.writeFileSync(tailwindPath, content);
  }
  return { applied: changes.length, changes };
}

function applySimplifiedShadow() {
  const navPath = path.join(ROOT, 'app', 'components', 'Navigation.tsx');
  if (!fs.existsSync(navPath)) return { applied: 0, changes: [] };

  let content = fs.readFileSync(navPath, 'utf8');
  const changes = [];

  if (content.includes('shadow-[0_0_0_1px_rgba(168,85,247,0.35)]')) {
    content = content.replace(
      /shadow-\[0_0_0_1px_rgba\(168,85,247,0\.35\)\]/g,
      'shadow-lg'
    );
    changes.push({ type: 'shadow-simplify', detail: 'Simplified active link shadow for performance' });
  }

  if (changes.length > 0 && !DRY_RUN) {
    fs.writeFileSync(navPath, content);
  }
  return { applied: changes.length, changes };
}

function applyTypographyScale() {
  const globalsPath = path.join(ROOT, 'app', 'globals.css');
  if (!fs.existsSync(globalsPath)) return { applied: 0, changes: [] };

  let content = fs.readFileSync(globalsPath, 'utf8');
  const changes = [];

  if (!content.includes('--font-size-base') && !content.includes('--line-height-tight')) {
    const typographyBlock = `
  /* Typography scale (design tokens) */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
`;
    content = content.replace(
      /:root\s*\{/,
      `:root {${typographyBlock}`
    );
    changes.push({ type: 'typography-scale', detail: 'Added typography scale design tokens' });
  }

  if (changes.length > 0 && !DRY_RUN) {
    fs.writeFileSync(globalsPath, content);
  }
  return { applied: changes.length, changes };
}

function applyImageAspectRatio() {
  const globalsPath = path.join(ROOT, 'app', 'globals.css');
  if (!fs.existsSync(globalsPath)) return { applied: 0, changes: [] };

  let content = fs.readFileSync(globalsPath, 'utf8');
  const changes = [];

  if (content.includes('img {') && !content.includes('aspect-ratio')) {
    if (content.includes('content-visibility: auto')) {
      content = content.replace(
        /img\s*\{\s*content-visibility:\s*auto;/,
        'img {\n  content-visibility: auto;\n  aspect-ratio: auto;'
      );
    } else {
      content = content.replace(/img\s*\{/, 'img {\n  aspect-ratio: auto;');
    }
    changes.push({ type: 'image-aspect', detail: 'Added aspect-ratio for image CLS prevention' });
  }

  if (changes.length > 0 && !DRY_RUN) {
    fs.writeFileSync(globalsPath, content);
  }
  return { applied: changes.length, changes };
}

function run() {
  ensureDirs();
  log('Starting layout design implementation...');

  const audit = loadAuditReport();
  if (!audit) {
    log('No layout audit report. Run layout:audit first.');
    const report = {
      timestamp: new Date().toISOString(),
      status: 'skipped',
      reason: 'no_audit_report',
      applied: 0,
    };
    fs.writeFileSync(IMPL_REPORT_FILE, JSON.stringify(report, null, 2));
    return report;
  }

  let totalApplied = 0;
  const appliedChanges = [];

  const fontResult = applyFontDisplaySwap();
  totalApplied += fontResult.applied;
  appliedChanges.push(...fontResult.changes);

  const spacingResult = applySectionSpacing();
  totalApplied += spacingResult.applied;
  appliedChanges.push(...spacingResult.changes);

  const shadowResult = applySimplifiedShadow();
  totalApplied += shadowResult.applied;
  appliedChanges.push(...shadowResult.changes);

  const typographyResult = applyTypographyScale();
  totalApplied += typographyResult.applied;
  appliedChanges.push(...typographyResult.changes);

  const aspectResult = applyImageAspectRatio();
  totalApplied += aspectResult.applied;
  appliedChanges.push(...aspectResult.changes);

  const report = {
    timestamp: new Date().toISOString(),
    status: totalApplied > 0 ? 'applied' : 'no_changes',
    auditHealthScore: audit.healthScore,
    suggestionsCount: (audit.suggestions || []).length,
    applied: totalApplied,
    changes: appliedChanges,
    dryRun: DRY_RUN,
  };

  fs.writeFileSync(IMPL_REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Report: ${IMPL_REPORT_FILE}`);
  log(`Applied: ${totalApplied} changes`);

  if (AUTO_COMMIT && totalApplied > 0 && !DRY_RUN) {
    try {
      execSync(
        'git add -A && git diff --cached --quiet || git commit -m "chore(layout): apply layout design audit improvements"',
        { cwd: ROOT, stdio: 'inherit' }
      );
      log('Committed changes');
    } catch (e) {
      log(`Commit failed: ${e.message}`);
    }
  }

  return report;
}

const cmd = process.argv[2] || 'run';
if (cmd === 'run') {
  run();
} else if (cmd === 'summary') {
  try {
    const data = JSON.parse(fs.readFileSync(IMPL_REPORT_FILE, 'utf8'));
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.log('No report found. Run with "run" first.');
  }
} else {
  console.log(`
AI Layout Design Implementation Agent

Usage:
  node ai-layout-design-implementation-agent.cjs run     - Apply safe fixes
  node ai-layout-design-implementation-agent.cjs summary - Show summary

Environment:
  DRY_RUN=1     - Log only, don't modify files
  AUTO_COMMIT=1  - Commit applied changes
`);
  process.exit(1);
}
