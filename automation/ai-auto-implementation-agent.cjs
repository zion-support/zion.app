#!/usr/bin/env node

/**
 * AI Auto-Implementation Agent
 *
 * Autonomous meta-agent that runs ecosystem intelligence, applies safe suggestions,
 * and optionally commits automation updates. Makes the ecosystem self-improving.
 *
 * Pipeline: Ecosystem intel → Suggestion importer → (optional) Commit & push
 *
 * Use: node automation/ai-auto-implementation-agent.cjs [run|dry]
 * Env: AUTO_COMMIT=1 to commit and push changes
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = process.cwd();
const AUTO_COMMIT = process.env.AUTO_COMMIT === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[AutoImpl] ${ts} | ${msg}`);
}

function run(cmd, label) {
  log(`Running: ${label}`);
  try {
    execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
    return true;
  } catch (e) {
    log(`Failed: ${e.message}`);
    return false;
  }
}

function hasChanges() {
  try {
    execSync('git diff --quiet automation/ .github/ 2>/dev/null', { cwd: ROOT });
    return false;
  } catch {
    return true;
  }
}

function main() {
  log('=== Auto-Implementation Agent Started ===');

  run('node automation/ai-ecosystem-intelligence-agent.cjs run', 'Ecosystem Intelligence');
  run('node automation/ai-suggestion-importer-agent.cjs run', 'Suggestion Importer');

  if (AUTO_COMMIT && hasChanges()) {
    log('Committing automation updates...');
    try {
      execSync('git add automation/ automation/cron/ .github/', { cwd: ROOT });
      execSync('git diff --staged --quiet || git commit -m "chore(automation): apply ecosystem suggestions"', {
        cwd: ROOT,
        stdio: 'inherit',
      });
      execSync('git push origin HEAD:main 2>/dev/null || true', { cwd: ROOT, stdio: 'inherit' });
      log('Changes committed and pushed');
    } catch (e) {
      log(`Commit/push failed: ${e.message}`);
    }
  } else if (AUTO_COMMIT && !hasChanges()) {
    log('No automation changes to commit');
  }

  log('=== Auto-Implementation Agent Finished ===');
}

main();
