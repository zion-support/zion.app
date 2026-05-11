#!/usr/bin/env node

/**
 * AI Layout Design Automation Pipeline (Full)
 *
 * Unified pipeline for ziontechgroup.com layout and design improvements.
 * Orchestrates: Live Site UX Audit → Layout Design Audit → Layout Implementation
 * → optional commit & deploy.
 *
 * Pipeline:
 *   Step 0: Live Site UX Audit (heuristic, no LLM)
 *   Step 1: Layout Design Audit (LLM or heuristic fallback)
 *   Step 2: Layout Design Implementation (apply safe fixes)
 *   Step 3: Commit & Deploy (when AUTO_COMMIT=1)
 *
 * Options:
 *   AUTO_COMMIT=1        - Commit and push after improvements
 *   TRIGGER_DEPLOY=1     - Call NETLIFY_BUILD_HOOK after commit (if set)
 *   SKIP_UX_AUDIT=1      - Skip Step 0 live site UX audit
 *   SKIP_LAYOUT_AUDIT=1  - Skip Step 1 layout design audit
 *   SKIP_LAYOUT_APPLY=1  - Skip Step 2 layout implementation
 *   DRY_RUN=1            - Don't modify files (implementation only)
 *
 * Run: npm run layout:automation
 *      AUTO_COMMIT=1 TRIGGER_DEPLOY=1 npm run layout:automation-deploy
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = process.cwd();
const AUTO_COMMIT = process.env.AUTO_COMMIT === '1';
const TRIGGER_DEPLOY = process.env.TRIGGER_DEPLOY === '1';
const SKIP_UX_AUDIT = process.env.SKIP_UX_AUDIT === '1';
const SKIP_LAYOUT_AUDIT = process.env.SKIP_LAYOUT_AUDIT === '1';
const SKIP_LAYOUT_APPLY = process.env.SKIP_LAYOUT_APPLY === '1';
const DRY_RUN = process.env.DRY_RUN === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[LayoutAutomation] ${ts} | ${msg}`);
}

function run(cmd, label) {
  log(`Running: ${label}`);
  try {
    execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
    return { ok: true };
  } catch (e) {
    log(`  Failed: ${e.message}`);
    return { ok: false, error: e.message };
  }
}

function triggerNetlifyDeploy() {
  const hook = process.env.NETLIFY_BUILD_HOOK;
  if (!hook) {
    log('NETLIFY_BUILD_HOOK not set, skipping deploy trigger');
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    https
      .get(hook, (res) => {
        log(`Deploy triggered: ${res.statusCode}`);
        resolve();
      })
      .on('error', (err) => {
        log(`Deploy trigger failed: ${err.message}`);
        resolve();
      });
  });
}

async function main() {
  log('=== AI Layout Design Automation Pipeline ===');
  log('Steps: 0=UX audit 1=layout audit 2=apply 3=commit/deploy');

  const start = Date.now();
  const results = { uxAudit: null, layoutAudit: null, layoutApply: null };

  // Step 0: Live Site UX Audit
  if (!SKIP_UX_AUDIT) {
    const r = run('node automation/ai-live-site-ux-audit-agent.cjs', 'Live Site UX Audit');
    results.uxAudit = r.ok;
    // Step 0b: Apply UX fixes (meta, title) from audit (continue on failure)
    try {
      execSync('node automation/ai-live-site-ux-auto-fix-agent.cjs', { cwd: ROOT, stdio: 'inherit' });
    } catch (_) {
      log('  UX Auto-Fix completed with warnings (no fixes needed or pattern not found)');
    }
  } else {
    log('Skipping UX audit (SKIP_UX_AUDIT=1)');
  }

  // Step 1: Layout Design Audit
  if (!SKIP_LAYOUT_AUDIT) {
    const r = run('npm run layout:audit', 'Layout Design Audit');
    results.layoutAudit = r.ok;
  } else {
    log('Skipping layout audit (SKIP_LAYOUT_AUDIT=1)');
  }

  // Step 2: Layout Design Implementation
  if (!SKIP_LAYOUT_APPLY) {
    const env = { ...process.env };
    if (DRY_RUN) env.DRY_RUN = '1';
    if (AUTO_COMMIT) env.AUTO_COMMIT = '1';
    const r = run('node automation/ai-layout-design-implementation-agent.cjs run', 'Layout Implementation');
    results.layoutApply = r.ok;
  } else {
    log('Skipping layout apply (SKIP_LAYOUT_APPLY=1)');
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  log(`Pipeline completed in ${elapsed}s`);

  // Step 3: Commit & Deploy
  if (AUTO_COMMIT) {
    log('Committing changes...');
    try {
      const status = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' });
      if (status.trim()) {
        execSync('git add -A', { cwd: ROOT, stdio: 'inherit' });
        execSync(
          `git commit -m "chore(layout): layout design automation - UX audit + layout improvements"`,
          { cwd: ROOT, stdio: 'inherit' }
        );
        execSync('git push', { cwd: ROOT, stdio: 'inherit' });
        log('Commit and push complete.');

        if (TRIGGER_DEPLOY) {
          await triggerNetlifyDeploy();
        }
      } else {
        log('No changes to commit.');
      }
    } catch (e) {
      log(`Commit failed: ${e.message}`);
    }
  }

  // Write report
  const reportPath = path.join(ROOT, 'automation', 'reports', 'layout-design-automation-pipeline-latest.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        elapsedSeconds: parseFloat(elapsed),
        results,
        autoCommit: AUTO_COMMIT,
        triggerDeploy: TRIGGER_DEPLOY,
      },
      null,
      2
    )
  );
  log(`Report: ${reportPath}`);

  log('=== Layout Design Automation Complete ===');
}

main().catch((err) => {
  log(`Fatal: ${err.message}`);
  process.exit(1);
});
