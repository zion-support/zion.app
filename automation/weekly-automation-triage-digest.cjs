#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Builds a markdown triage digest from automation-open-issues-index-latest.json
 * (run generate-automation-issue-index.cjs first in CI).
 * Writes automation/reports/weekly-automation-triage-digest-latest.md
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const INDEX = path.join(ROOT, 'automation', 'reports', 'automation-open-issues-index-latest.json');
const OUT = path.join(ROOT, 'automation', 'reports', 'weekly-automation-triage-digest-latest.md');

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function bandLabel(avgHours) {
  if (avgHours == null) return 'unknown';
  if (avgHours >= 48) return 'critical_mttr';
  if (avgHours >= 24) return 'warning_mttr';
  return 'healthy_mttr';
}

function main() {
  const idx = readJson(INDEX);
  if (!idx) {
    console.log('[weekly-triage-digest] missing index; skip.');
    process.exit(0);
  }

  const issues = Array.isArray(idx.issues) ? idx.issues : [];
  const mttr = idx.mttr || {};
  const byFp = Array.isArray(mttr.byFingerprint) ? mttr.byFingerprint : [];

  const byBand = new Map();
  for (const row of byFp) {
    const b = bandLabel(row.avgHours);
    if (!byBand.has(b)) byBand.set(b, []);
    byBand.get(b).push(row);
  }

  let md = `# Weekly automation triage digest\n\n`;
  md += `Generated: ${new Date().toISOString()}  \n`;
  md += `Index snapshot: ${idx.generatedAt || 'n/a'}  \n\n`;
  md += `## Open fingerprint issues: ${issues.length}\n\n`;

  if (issues.length === 0) {
    md += `_No open automation fingerprint issues in index._\n\n`;
  } else {
    for (const iss of issues.slice(0, 40)) {
      md += `- [#${iss.number}](${iss.url}) ${iss.title}\n`;
    }
    if (issues.length > 40) md += `\n_…and ${issues.length - 40} more._\n`;
    md += '\n';
  }

  md += `## MTTR by fingerprint (recent closed samples)\n\n`;
  if (byFp.length === 0) {
    md += `_No MTTR breakdown in index._\n\n`;
  } else {
    for (const [band, rows] of [...byBand.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
      md += `### ${band}\n\n`;
      for (const r of rows.slice(0, 15)) {
        md += `- \`${r.label}\` — samples ${r.samples}, avg ${r.avgHours}h\n`;
      }
      md += '\n';
    }
  }

  md += `## Averages\n\n`;
  md += `- MTTR band: ${mttr.band || 'n/a'} | avg hours: ${mttr.avgHours ?? 'n/a'} | samples: ${mttr.samples ?? 'n/a'}\n`;

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, md);
  console.log('[weekly-triage-digest] wrote', OUT);
}

main();
