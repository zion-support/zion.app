#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Structural validation for openclaw-autonomy-handoff-latest.json (no external deps).
 * Exits 1 on failure. Env: OPENCLAW_HANDOFF_PATH=path/to.json
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const DEFAULT = path.join(ROOT, 'automation', 'reports', 'openclaw-autonomy-handoff-latest.json');

const ALLOWED_SCHEMA = new Set([1, 2]);

function fail(msg) {
  console.error('openclaw handoff validate:', msg);
  process.exit(1);
}

function main() {
  const p = process.env.OPENCLAW_HANDOFF_PATH || DEFAULT;
  if (!fs.existsSync(p)) fail(`missing file: ${p}`);

  let j;
  try {
    j = JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    fail(`invalid JSON: ${e.message}`);
  }

  if (typeof j.generatedAt !== 'string' || j.generatedAt.length < 10) fail('generatedAt missing or invalid');
  if (!ALLOWED_SCHEMA.has(Number(j.schemaVersion))) fail(`schemaVersion must be 1 or 2, got ${j.schemaVersion}`);
  if (!j.sources || typeof j.sources !== 'object') fail('sources must be an object');
  if (!j.summary || typeof j.summary !== 'object') fail('summary must be an object');

  const numOrNull = (v) => v === null || typeof v === 'number';
  const s = j.summary;
  for (const k of [
    'queueLength',
    'queueItemsWithPatchHints',
    'hotHighRisk',
    'hotMediumRisk',
    'policyApproved',
    'policyDenied',
    'regressionIncidents',
  ]) {
    if (s[k] !== undefined && !numOrNull(s[k])) fail(`summary.${k} must be number or null`);
  }
  for (const k of ['deployDecision', 'deployBand']) {
    if (s[k] !== undefined && s[k] !== null && typeof s[k] !== 'string') fail(`summary.${k} must be string or null`);
  }

  console.log(`openclaw handoff validate: OK (${p}, schema ${j.schemaVersion})`);
}

main();
