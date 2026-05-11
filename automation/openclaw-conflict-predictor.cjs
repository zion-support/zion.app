#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const OUTPUT = path.join(REPORTS, 'openclaw-conflict-predictor-latest.json');

const HOT_FILES = [
  'package.json',
  'ecosystem.config.cjs',
  'commands/deploy.cjs',
  'OPENCLAW.md',
  'memory/2026-03-20.md',
];

function countTouches(file) {
  try {
    const out = execSync(`git log --since='7 days ago' --pretty=format: --name-only -- "${file}" | wc -l`, {
      cwd: ROOT,
      encoding: 'utf8',
    }).trim();
    return Number.parseInt(out, 10) || 0;
  } catch {
    return 0;
  }
}

function riskBand(touches) {
  if (touches >= 18) return 'high';
  if (touches >= 8) return 'medium';
  return 'low';
}

function main() {
  if (!fs.existsSync(REPORTS)) fs.mkdirSync(REPORTS, { recursive: true });
  const files = HOT_FILES.map((file) => {
    const touches7d = countTouches(file);
    return {
      file,
      touches7d,
      risk: riskBand(touches7d),
      recommendation:
        touches7d >= 8
          ? 'Prefer append-only edits or section-scoped patching to reduce merge conflicts.'
          : 'Normal edit flow is safe.',
    };
  });
  const payload = {
    generatedAt: new Date().toISOString(),
    files,
    highRiskFiles: files.filter((f) => f.risk === 'high').map((f) => f.file),
  };
  fs.writeFileSync(OUTPUT, JSON.stringify(payload, null, 2));
  console.log(`Conflict predictor report written: ${OUTPUT}`);
}

main();
