#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Exit 0 if the latest *successful* run of the fingerprint digest workflow is within the max age.
 * Exit 1 if stale or no successful run is found (for CI + optional escalation).
 *
 * Env:
 *   DIGEST_FRESHNESS_MAX_HOURS — default 192 (8 days)
 *   DIGEST_FRESHNESS_WORKFLOW_FILE — default ai-automation-fingerprint-digest-weekly.yml
 *   GH_TOKEN / GITHUB_TOKEN — required for gh
 */
const { spawnSync } = require('child_process');

function gh(args) {
  return spawnSync('gh', args, { encoding: 'utf8', env: process.env });
}

function main() {
  if (!process.env.GH_TOKEN && !process.env.GITHUB_TOKEN) {
    console.error('check-fingerprint-digest-freshness: missing GH_TOKEN/GITHUB_TOKEN');
    process.exit(1);
  }
  const maxH = parseFloat(String(process.env.DIGEST_FRESHNESS_MAX_HOURS || '192'));
  const maxAgeMs = (Number.isFinite(maxH) && maxH > 0 ? maxH : 192) * 3600000;
  const wf = String(process.env.DIGEST_FRESHNESS_WORKFLOW_FILE || 'ai-automation-fingerprint-digest-weekly.yml');

  const r = gh([
    'run',
    'list',
    '--workflow',
    wf,
    '--limit',
    '40',
    '--json',
    'conclusion,updatedAt,status,displayTitle,url',
  ]);
  if (r.status !== 0) {
    console.error(r.stderr || r.stdout || 'gh run list failed');
    process.exit(1);
  }
  let runs;
  try {
    runs = JSON.parse(r.stdout || '[]');
  } catch {
    console.error('Invalid JSON from gh run list');
    process.exit(1);
  }
  const ok = (runs || []).find((x) => x && x.conclusion === 'success' && x.status === 'completed');
  if (!ok) {
    console.error('No successful completed run found for workflow', wf);
    process.exit(1);
  }
  const age = Date.now() - Date.parse(ok.updatedAt);
  const ageH = age / 3600000;
  if (age > maxAgeMs) {
    console.error(
      `Fingerprint digest last success too old: ${ageH.toFixed(1)}h (max ${(maxAgeMs / 3600000).toFixed(1)}h) — ${ok.url || ''}`
    );
    process.exit(1);
  }
  console.log(`Fingerprint digest freshness OK (last success ${ageH.toFixed(1)}h ago)`);
  process.exit(0);
}

main();
