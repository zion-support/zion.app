#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Writes automation/reports/openclaw-policy-history-dashboard-latest.md from policy history JSON.
 * Invoked by ai-report-aggregator-agent or: node automation/openclaw-policy-history-dashboard.cjs
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const HISTORY = path.join(REPORTS, 'openclaw-action-policy-history.json');
const OUT = path.join(REPORTS, 'openclaw-policy-history-dashboard-latest.md');

function readJson(p) {
  try {
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function writeDashboard() {
  const hist = readJson(HISTORY);
  const entries = Array.isArray(hist?.entries) ? hist.entries : [];
  const tail = entries.slice(-15);

  let md = '# OpenClaw action policy — reason history\n\n';
  md += `_Generated: ${new Date().toISOString()}_\n\n`;
  if (tail.length === 0) {
    md += '_No policy history entries yet._ Run `npm run openclaw:actions:policy` to populate.\n';
  } else {
    md += '| At (UTC) | In | Approved | Denied | Top reasons |\n| --- | --- | --- | --- | --- |\n';
    for (const e of tail) {
      const rc = e.reasonCounts || {};
      const top = Object.entries(rc)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([k, v]) => `${k}(${v})`)
        .join(', ');
      md += `| ${e.at || '—'} | ${e.totalInput ?? '—'} | ${e.totalApproved ?? '—'} | ${e.totalDenied ?? '—'} | ${top || '—'} |\n`;
    }
  }
  md += '\n---\n_See `automation/reports/openclaw-action-policy-history.json` for full data._\n';

  if (!fs.existsSync(REPORTS)) fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(OUT, md);
  console.log(`[policy-history-dashboard] wrote ${OUT}`);
}

if (require.main === module) {
  writeDashboard();
}

module.exports = { writeDashboard };
