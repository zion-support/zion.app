#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Maps conflict-predictor hot-file risk to recommended patch modes for agents/CI.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const INPUT = path.join(REPORTS, 'openclaw-conflict-predictor-latest.json');
const OUTPUT = path.join(REPORTS, 'openclaw-hot-file-patch-router-latest.json');

function patchModeForRisk(risk) {
  if (risk === 'high') return 'section_scoped';
  if (risk === 'medium') return 'append_only_preferred';
  return 'full_edit_ok';
}

function main() {
  if (!fs.existsSync(REPORTS)) fs.mkdirSync(REPORTS, { recursive: true });
  let predictor = { files: [] };
  try {
    if (fs.existsSync(INPUT)) predictor = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
  } catch {
    /* empty */
  }

  const files = Array.isArray(predictor.files) ? predictor.files : [];
  const routes = files.map((f) => ({
    file: f.file,
    risk: f.risk,
    touches7d: f.touches7d,
    patchMode: patchModeForRisk(f.risk),
    guidance:
      f.risk === 'high'
        ? 'Use section-scoped or minimal hunks; avoid wholesale rewrites.'
        : f.risk === 'medium'
          ? 'Prefer append-only or tail-section edits when possible.'
          : 'Standard patch flow OK.',
  }));

  const payload = {
    generatedAt: new Date().toISOString(),
    source: INPUT,
    routes,
    summary: {
      highRiskCount: routes.filter((r) => r.risk === 'high').length,
      mediumRiskCount: routes.filter((r) => r.risk === 'medium').length,
    },
  };
  fs.writeFileSync(OUTPUT, JSON.stringify(payload, null, 2));
  console.log(`Hot-file patch router written: ${OUTPUT}`);
}

main();
