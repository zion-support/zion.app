#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const MAX_KEEP_PER_PREFIX = parseInt(process.env.REPORT_PRUNER_KEEP_PER_PREFIX || '20', 10);
const MAX_AGE_DAYS = parseInt(process.env.REPORT_PRUNER_MAX_AGE_DAYS || '30', 10);
const DRY_RUN = process.env.DRY_RUN === 'true';

function log(message) {
  console.log(`[ReportPruner] ${new Date().toISOString()} | ${message}`);
}

function prefixFor(fileName) {
  if (fileName.endsWith('-latest.json') || fileName.endsWith('-latest.md')) {
    return fileName.replace(/-latest\.(json|md)$/, '');
  }
  const idx = fileName.indexOf('-');
  return idx > 0 ? fileName.slice(0, idx) : fileName;
}

function run() {
  if (!fs.existsSync(REPORTS_DIR)) {
    log('Reports directory missing; nothing to prune.');
    return;
  }

  const now = Date.now();
  const cutoff = now - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  const files = fs
    .readdirSync(REPORTS_DIR)
    .map((name) => ({ name, full: path.join(REPORTS_DIR, name), stat: fs.statSync(path.join(REPORTS_DIR, name)) }))
    .filter((entry) => entry.stat.isFile());

  const groups = new Map();
  for (const entry of files) {
    const prefix = prefixFor(entry.name);
    if (!groups.has(prefix)) groups.set(prefix, []);
    groups.get(prefix).push(entry);
  }

  let deleted = 0;
  let reclaimedBytes = 0;

  for (const [prefix, entries] of groups.entries()) {
    entries.sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs);
    const protectedLatest = new Set(entries.filter((e) => e.name.includes('-latest.')).map((e) => e.name));
    let kept = 0;

    for (const entry of entries) {
      const isProtected = protectedLatest.has(entry.name);
      const tooOld = entry.stat.mtimeMs < cutoff;
      const overLimit = kept >= MAX_KEEP_PER_PREFIX;
      const shouldDelete = !isProtected && (tooOld || overLimit);

      if (shouldDelete) {
        if (!DRY_RUN) fs.unlinkSync(entry.full);
        deleted += 1;
        reclaimedBytes += entry.stat.size;
      } else {
        kept += 1;
      }
    }

    log(`Prefix ${prefix}: total=${entries.length}, kept=${kept}, deleted=${entries.length - kept}`);
  }

  const report = {
    timestamp: new Date().toISOString(),
    dryRun: DRY_RUN,
    maxKeepPerPrefix: MAX_KEEP_PER_PREFIX,
    maxAgeDays: MAX_AGE_DAYS,
    deleted,
    reclaimedMB: Number((reclaimedBytes / (1024 * 1024)).toFixed(2)),
  };

  fs.writeFileSync(path.join(REPORTS_DIR, 'report-pruner-intelligence-latest.json'), JSON.stringify(report, null, 2));
  log(`Prune complete: deleted=${deleted}, reclaimed=${report.reclaimedMB}MB, dryRun=${DRY_RUN}`);
}

run();
