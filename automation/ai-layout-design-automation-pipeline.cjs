#!/usr/bin/env node

/**
 * AI Layout Design Automation Pipeline
 *
 * Orchestrates layout audit → implementation → optional commit.
 * Runs layout design audit (LLM or local heuristic), applies safe fixes,
 * and optionally commits changes.
 *
 * Usage:
 *   node ai-layout-design-automation-pipeline.cjs           - Audit + apply
 *   node ai-layout-design-automation-pipeline.cjs --commit   - Audit + apply + commit
 *   AUTO_COMMIT=1 node ai-layout-design-automation-pipeline.cjs
 *
 * Environment:
 *   AUTO_COMMIT=1  - Commit applied changes
 *   DRY_RUN=1      - Don't modify files (implementation agent)
 *
 * Runs: After layout audit workflow, or on-demand
 */

const { execSync } = require('child_process');
const path = require('path');

const ROOT = process.cwd();
const AUTO_COMMIT = process.env.AUTO_COMMIT === '1' || process.argv.includes('--commit');
const DRY_RUN = process.env.DRY_RUN === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[LayoutPipeline] ${ts} | ${msg}`);
}

function run(cmd, opts = {}) {
  try {
    execSync(cmd, {
      cwd: ROOT,
      stdio: opts.silent ? 'pipe' : 'inherit',
      ...opts,
    });
    return true;
  } catch (e) {
    if (!opts.ignoreError) {
      log(`Command failed: ${cmd} - ${e.message}`);
    }
    return false;
  }
}

async function main() {
  log('Starting layout design automation pipeline...');

  // Step 1: Run layout audit
  log('Step 1: Running layout design audit...');
  const auditOk = run('npm run layout:audit', { ignoreError: true });
  if (!auditOk) {
    log('Audit completed with warnings (e.g. LLM unavailable, using local heuristic)');
  }

  // Step 2: Apply layout improvements
  log('Step 2: Applying layout design improvements...');
  const env = { ...process.env };
  if (DRY_RUN) env.DRY_RUN = '1';
  if (AUTO_COMMIT) env.AUTO_COMMIT = '1';

  run(`node automation/ai-layout-design-implementation-agent.cjs run`, {
    env: { ...process.env, ...env },
  });

  log('Pipeline complete.');
  if (AUTO_COMMIT) {
    log('AUTO_COMMIT=1: Changes committed by implementation agent if any were applied.');
  }
}

main().catch((err) => {
  log(`Fatal: ${err.message}`);
  process.exit(1);
});
