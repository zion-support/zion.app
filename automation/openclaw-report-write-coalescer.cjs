#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const INDEX = path.join(REPORTS, 'report-write-coalescer-index.json');
const OUTPUT = path.join(REPORTS, 'report-write-coalescer-latest.json');
const MIN_AGE_SECONDS = Number.parseInt(process.env.REPORT_COALESCE_MIN_AGE_SECONDS || '120', 10);

function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function main() {
  if (!fs.existsSync(REPORTS)) fs.mkdirSync(REPORTS, { recursive: true });
  const nowMs = Date.now();
  const files = fs
    .readdirSync(REPORTS)
    .filter((name) => name.endsWith('.json'))
    .map((name) => {
      const full = path.join(REPORTS, name);
      const stat = fs.statSync(full);
      return { name, full, mtimeMs: stat.mtimeMs };
    });

  const prev = readJson(INDEX, { files: {} });
  const coalesced = [];
  for (const file of files) {
    const prevEntry = prev.files[file.name];
    const ageSec = Math.floor((nowMs - file.mtimeMs) / 1000);
    const changedRecently = prevEntry && Math.abs(file.mtimeMs - prevEntry.mtimeMs) < MIN_AGE_SECONDS * 1000;
    if (changedRecently && ageSec < MIN_AGE_SECONDS) {
      coalesced.push(file.name);
    }
    prev.files[file.name] = { mtimeMs: file.mtimeMs };
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    totalReports: files.length,
    minAgeSeconds: MIN_AGE_SECONDS,
    coalescedCount: coalesced.length,
    coalescedReports: coalesced.slice(0, 200),
  };

  fs.writeFileSync(INDEX, JSON.stringify(prev, null, 2));
  fs.writeFileSync(OUTPUT, JSON.stringify(payload, null, 2));
  console.log(`Report write coalescer snapshot written: ${OUTPUT}`);
}

main();
