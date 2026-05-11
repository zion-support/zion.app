#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const OUT_DIR = path.join(ROOT, 'public', 'api');

function readJson(fileName) {
  const p = path.join(REPORTS, fileName);
  try {
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function writeJson(fileName, data) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, fileName), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function main() {
  const latest = readJson('automation-health-latest.json');
  if (!latest) {
    console.log('publish-automation-health-static: latest report missing; skipping');
    process.exit(0);
  }
  const history = readJson('automation-health-history.json');
  writeJson('automation-health.json', latest);
  if (history) writeJson('automation-health-history.json', history);
  console.log('publish-automation-health-static: wrote public/api automation health snapshots');
}

main();
