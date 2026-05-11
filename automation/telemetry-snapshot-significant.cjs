#!/usr/bin/env node
/**
 * Returns exit 0 if telemetry JSON changed in a material way (not just volatile timestamps).
 * Used by ai-telemetry-snapshot-scheduler to reduce commit churn.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const VOLATILE_KEYS = new Set([
  'generatedAt',
  'generated_at',
  'updatedAt',
  'snapshotAt',
  'lastUpdated',
  'lastRunAt',
  'runId',
  'run_id',
  'timestamp',
]);

function stripVolatile(value) {
  if (Array.isArray(value)) {
    return value.map(stripVolatile);
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (VOLATILE_KEYS.has(k)) {
        continue;
      }
      out[k] = stripVolatile(v);
    }
    return out;
  }
  return value;
}

function readHeadFile(rel) {
  try {
    return execSync(`git show HEAD:${rel}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch {
    return null;
  }
}

function significantForFile(rel) {
  const abs = path.join(process.cwd(), rel);
  if (!fs.existsSync(abs)) {
    return false;
  }
  const curRaw = fs.readFileSync(abs, 'utf8');
  let cur;
  try {
    cur = JSON.parse(curRaw);
  } catch {
    return true;
  }
  const headRaw = readHeadFile(rel);
  if (!headRaw) {
    return true;
  }
  let head;
  try {
    head = JSON.parse(headRaw);
  } catch {
    return true;
  }
  const a = JSON.stringify(stripVolatile(cur));
  const b = JSON.stringify(stripVolatile(head));
  return a !== b;
}

function main() {
  const files = process.argv.slice(2).filter(Boolean);
  if (!files.length) {
    console.error('Usage: telemetry-snapshot-significant.cjs <file1> [file2 ...]');
    process.exit(2);
  }
  const any = files.some((f) => significantForFile(f.replace(/^\.\//, '')));
  if (any) {
    console.log('Significant telemetry diff detected.');
    process.exit(0);
  }
  console.log('No significant telemetry diff; skip snapshot commit.');
  process.exit(1);
}

main();
