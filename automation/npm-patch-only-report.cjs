#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Parses `npm outdated --json` and lists packages where latest is a patch bump vs current
 * (same major.minor). Output: automation/reports/npm-patch-only-latest.json
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'automation', 'reports', 'npm-patch-only-latest.json');

function parseSemver(v) {
  const s = String(v || '').replace(/^[^0-9]*/, '');
  const parts = s.split('.').map((x) => Number.parseInt(x, 10));
  return {
    major: Number.isFinite(parts[0]) ? parts[0] : 0,
    minor: Number.isFinite(parts[1]) ? parts[1] : 0,
    patch: Number.isFinite(parts[2]) ? parts[2] : 0,
  };
}

function isPatchOnlyBump(current, latest) {
  const c = parseSemver(current);
  const l = parseSemver(latest);
  if (c.major !== l.major || c.minor !== l.minor) return false;
  return l.patch > c.patch;
}

function main() {
  let raw = '{}';
  try {
    raw = execSync('npm outdated --json', { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  } catch (e) {
    raw = e.stdout || '{}';
  }
  let data;
  try {
    data = JSON.parse(raw || '{}');
  } catch {
    data = {};
  }
  const patchOnly = [];
  const notPatch = [];
  for (const [name, row] of Object.entries(data)) {
    if (!row || typeof row !== 'object') continue;
    const current = String(row.current || '');
    const latest = String(row.latest || '');
    const wanted = String(row.wanted || '');
    if (isPatchOnlyBump(current, latest)) {
      patchOnly.push({
        name,
        current,
        wanted,
        latest,
        type: row.type || 'dependencies',
      });
    } else {
      notPatch.push({ name, current, wanted, latest });
    }
  }
  const payload = {
    generatedAt: new Date().toISOString(),
    patchOnlyCount: patchOnly.length,
    notPatchCount: notPatch.length,
    patchOnly: patchOnly.slice(0, 200),
    note: 'Review with npm run test:ci before batching patch bumps.',
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log(`npm patch-only report: ${patchOnly.length} pkg -> ${OUT}`);
}

main();
