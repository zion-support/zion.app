#!/usr/bin/env node

/**
 * Report-only: lists AI Lab tool pages that use the legacy gradient shell but do not
 * import AILabToolLayout (candidates for manual UX upgrades — not auto-rewritten).
 *
 * Output: automation/reports/ai-lab-legacy-scaffold-scan-latest.json
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const ROOT = process.cwd();
const REPORT = path.join(ROOT, 'automation', 'reports', 'ai-lab-legacy-scaffold-scan-latest.json');
const HISTORY = path.join(ROOT, 'automation', 'reports', 'ai-lab-legacy-scaffold-scan-history.json');
const LEGACY_GRADIENT = 'from-slate-950 via-slate-900';

function main() {
  const files = glob
    .sync('app/ai-lab/**/page.tsx', { cwd: ROOT, nodir: true })
    .filter((f) => f !== 'app/ai-lab/page.tsx');

  const candidates = [];
  for (const rel of files) {
    if (rel === 'app/ai-lab/page.tsx') continue;
    const full = path.join(ROOT, rel);
    let text;
    try {
      text = fs.readFileSync(full, 'utf8');
    } catch {
      continue;
    }
    if (text.includes('AILabToolLayout')) continue;
    if (!text.includes(LEGACY_GRADIENT)) continue;
    candidates.push({
      path: `/${rel.replace(/^app\//, '').replace(/\/page\.tsx$/, '')}`.replace(/\/+/g, '/'),
      file: rel,
    });
  }

  candidates.sort((a, b) => a.path.localeCompare(b.path));

  const report = {
    at: new Date().toISOString(),
    count: candidates.length,
    note:
      'Pages without AILabToolLayout that use the legacy gradient shell; review before any bulk migration.',
    candidates,
  };
  fs.mkdirSync(path.dirname(REPORT), { recursive: true });
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2));

  let rows = [];
  try {
    rows = JSON.parse(fs.readFileSync(HISTORY, 'utf8'));
    if (!Array.isArray(rows)) rows = [];
  } catch {
    rows = [];
  }
  rows.push({ at: report.at, count: report.count });
  const maxH = Math.max(30, Number(process.env.AI_LAB_LEGACY_SCAN_HISTORY_MAX || 120));
  if (rows.length > maxH) rows = rows.slice(rows.length - maxH);
  fs.writeFileSync(HISTORY, `${JSON.stringify(rows, null, 2)}\n`, 'utf8');

  console.log(`[ai-lab-legacy-scaffold-scan] ${candidates.length} candidate(s) -> ${path.relative(ROOT, REPORT)}`);
}

main();
