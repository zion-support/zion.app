#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const OUTPUT = path.join(REPORTS, 'merge-ledger-latest.json');
const HISTORY = path.join(REPORTS, 'merge-ledger-history.json');

const TRACKED_PREFIXES = ['automation/', '.github/workflows/', 'commands/', 'scripts/'];

function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function collectTrackedFiles() {
  const files = [];
  for (const prefix of TRACKED_PREFIXES) {
    const absolutePrefix = path.join(ROOT, prefix);
    if (!fs.existsSync(absolutePrefix)) continue;
    const stack = [absolutePrefix];
    while (stack.length) {
      const current = stack.pop();
      const stat = fs.statSync(current);
      if (stat.isDirectory()) {
        for (const child of fs.readdirSync(current)) stack.push(path.join(current, child));
      } else if (stat.isFile()) {
        files.push(path.relative(ROOT, current));
      }
    }
  }
  return files.sort();
}

function main() {
  if (!fs.existsSync(REPORTS)) fs.mkdirSync(REPORTS, { recursive: true });
  const files = collectTrackedFiles();
  const grouped = {};
  for (const file of files) {
    const key = file.split('/')[0];
    grouped[key] = (grouped[key] || 0) + 1;
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    trackedPrefixes: TRACKED_PREFIXES,
    totalFiles: files.length,
    groupedCounts: grouped,
    sample: files.slice(0, 120),
  };
  const history = readJson(HISTORY, { entries: [] });
  history.entries = [...history.entries.slice(-59), { at: payload.generatedAt, totalFiles: payload.totalFiles }];

  fs.writeFileSync(OUTPUT, JSON.stringify(payload, null, 2));
  fs.writeFileSync(HISTORY, JSON.stringify(history, null, 2));
  console.log(`Merge ledger written: ${OUTPUT}`);
}

main();
