#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Surfaces Openclaw improver history for dashboards: prefers gitignored runtime ring buffer,
 * falls back to tracked snapshot when runtime is empty (e.g. CI fresh checkout).
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const RUNTIME = path.join(REPORTS, '.runtime', 'openclaw-autonomous-app-improver-history.json');
const SNAPSHOT = path.join(REPORTS, 'openclaw-autonomous-app-improver-history.json');
const OUTPUT = path.join(REPORTS, 'openclaw-improver-history-merged-latest.json');

function readArray(p) {
  try {
    if (!fs.existsSync(p)) return [];
    const j = JSON.parse(fs.readFileSync(p, 'utf8'));
    return Array.isArray(j) ? j : [];
  } catch {
    return [];
  }
}

function main() {
  if (!fs.existsSync(REPORTS)) fs.mkdirSync(REPORTS, { recursive: true });
  const runtime = readArray(RUNTIME);
  const snapshot = readArray(SNAPSHOT);
  const merged = runtime.length > 0 ? runtime : snapshot;
  const payload = {
    generatedAt: new Date().toISOString(),
    sources: { runtime: RUNTIME, snapshot: SNAPSHOT },
    preferredSource: runtime.length > 0 ? 'runtime' : 'snapshot',
    counts: {
      runtimeEntries: runtime.length,
      snapshotEntries: snapshot.length,
      mergedEntries: merged.length,
    },
    tail: merged.slice(-48),
    merged,
  };
  fs.writeFileSync(OUTPUT, JSON.stringify(payload, null, 2));
  console.log(
    `Openclaw improver history merge written: ${OUTPUT} (${payload.counts.mergedEntries} entries, ${payload.preferredSource})`,
  );
}

main();
