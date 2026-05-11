#!/usr/bin/env node

/**
 * AI App Improvement Orchestrator
 *
 * Orchestrates full app improvement pipeline: audit live site → generate ideas →
 * implement safe improvements → commit & push. Designed to automate app evolution
 * and deploy new ideas continuously.
 *
 * Pipeline:
 * 1. App audit (live ziontechgroup.com via OpenRouter LLM)
 * 2. App evolution (ideas from audit → backlog)
 * 3. Site link audit (validate all internal links; CREATE_PAGES=1 to create missing)
 * 4. Layout audit (optional, when LAYOUT_AUDIT=1)
 * 5. Content audit ideas (optional, when CONTENT_IDEAS=1)
 * 6. App audit implementation (apply safe meta/SEO changes)
 * 7. Layout implementation (apply safe layout fixes)
 * 8. Commit & push (when AUTO_COMMIT=1)
 *
 * Environment:
 *   AUTO_COMMIT=1 - Commit and push changes to main
 *   LAYOUT_AUDIT=1 - Include layout design audit in pipeline
 *   CONTENT_IDEAS=1 - Include content ideation in pipeline
 *   EVOLUTION_IDEAS=1 - Include evolution ideas generation
 *   TRIGGER_DEPLOY=1 - Trigger Netlify build after push (NETLIFY_BUILD_HOOK)
 *   SKIP_LLM=1 - Skip LLM steps (use existing reports only)
 *   CREATE_PAGES=1 - Create missing pages when site link audit finds broken links
 *
 * Requires: OPENROUTER_API_KEY for LLM-powered audits
 * Runs: Weekly via cron/workflow, or workflow_dispatch
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const AUTOMATION_DIR = path.join(ROOT, 'automation');
const REPORTS_DIR = path.join(AUTOMATION_DIR, 'reports');
const DATA_DIR = path.join(AUTOMATION_DIR, 'data');
const REPORT_FILE = path.join(REPORTS_DIR, 'app-improvement-orchestrator-latest.json');

const AUTO_COMMIT = process.env.AUTO_COMMIT === '1';
const LAYOUT_AUDIT = process.env.LAYOUT_AUDIT === '1';
const CONTENT_IDEAS = process.env.CONTENT_IDEAS === '1';
const EVOLUTION_IDEAS = process.env.EVOLUTION_IDEAS === '1';
const SKIP_LLM = process.env.SKIP_LLM === '1';
const TRIGGER_DEPLOY = process.env.TRIGGER_DEPLOY === '1';
const CREATE_PAGES = process.env.CREATE_PAGES === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[AppImprovement] ${ts} | ${msg}`);
}

function ensureDirs() {
  [REPORTS_DIR, DATA_DIR].forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });
}

function run(cmd, label) {
  log(`Running: ${label}`);
  try {
    execSync(cmd, {
      cwd: ROOT,
      stdio: 'inherit',
      env: { ...process.env },
    });
    return { ok: true };
  } catch (e) {
    log(`  Failed: ${e.message}`);
    return { ok: false, error: e.message };
  }
}

function hasChanges() {
  try {
    execSync('git diff --quiet 2>/dev/null', { cwd: ROOT });
    return false;
  } catch {
    return true;
  }
}

function triggerDeploy() {
  const hook = process.env.NETLIFY_BUILD_HOOK;
  if (!hook) {
    log('NETLIFY_BUILD_HOOK not set. Skipping deploy trigger.');
    return Promise.resolve({ ok: false, reason: 'no_hook' });
  }
  try {
    const https = require('https');
    const u = new URL(hook);
    return new Promise((resolve) => {
      const req = https.request(
        { hostname: u.hostname, path: u.pathname + u.search, method: 'POST' },
        (res) => {
          log(`Deploy trigger: ${res.statusCode}`);
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 400 });
        }
      );
      req.on('error', (e) => {
        log(`Deploy trigger failed: ${e.message}`);
        resolve({ ok: false, error: e.message });
      });
      req.end();
    });
  } catch (e) {
    log(`Deploy trigger error: ${e.message}`);
    return Promise.resolve({ ok: false, error: e.message });
  }
}

async function runPipeline() {
  ensureDirs();
  log('=== App Improvement Orchestrator Started ===');

  const results = [];
  let auditOk = false;
  let evolutionOk = false;

  // 0. Site link audit (CREATE_PAGES=1 to create missing pages when broken links found)
  const siteLinkCmd = CREATE_PAGES
    ? 'node automation/ai-site-link-audit-automation.cjs run --create-pages'
    : 'node automation/ai-site-link-audit-automation.cjs audit';
  const linkR = run(siteLinkCmd, 'Site Link Audit');
  results.push({ step: 'site_link_audit', ok: linkR.ok });

  // 1. App audit
  if (!SKIP_LLM) {
    const r = run('node automation/ai-app-audit-automation-agent.cjs run', 'App Audit');
    results.push({ step: 'app_audit', ok: r.ok });
    auditOk = r.ok;
  } else {
    log('Skipping app audit (SKIP_LLM=1)');
    results.push({ step: 'app_audit', ok: true, skipped: true });
  }

  // 2. App evolution (uses audit suggestions)
  if (!SKIP_LLM) {
    const r = run('node automation/ai-app-evolution-automation-agent.cjs run', 'App Evolution');
    results.push({ step: 'app_evolution', ok: r.ok });
    evolutionOk = r.ok;
  } else {
    results.push({ step: 'app_evolution', ok: true, skipped: true });
  }

  // 4. Layout audit (optional)
  if (LAYOUT_AUDIT && !SKIP_LLM) {
    const r = run('node automation/ai-layout-design-audit-agent.cjs run', 'Layout Audit');
    results.push({ step: 'layout_audit', ok: r.ok });
  }

  // 5. Content ideation (optional)
  if (CONTENT_IDEAS && !SKIP_LLM) {
    const r = run('node automation/ai-content-audit-ideas-agent.cjs', 'Content Audit Ideas');
    results.push({ step: 'content_ideas', ok: r.ok });
  }

  // 4b. Evolution ideas (optional) - generates new deployable ideas from live site
  if (EVOLUTION_IDEAS && !SKIP_LLM) {
    const r = run('node automation/ai-app-evolution-ideas-agent.cjs run', 'Evolution Ideas');
    results.push({ step: 'evolution_ideas', ok: r.ok });
  }

  // 6. App audit implementation (apply safe changes)
  const implR = run('node automation/ai-app-audit-implementation-agent.cjs run', 'App Audit Implementation');
  results.push({ step: 'app_implementation', ok: implR.ok });

  // 7. Layout implementation (if layout audit ran)
  if (LAYOUT_AUDIT) {
    const layoutImplR = run('node automation/ai-layout-design-implementation-agent.cjs run', 'Layout Implementation');
    results.push({ step: 'layout_implementation', ok: layoutImplR.ok });
  }

  const report = {
    timestamp: new Date().toISOString(),
    pipeline: results,
    summary: {
      auditOk,
      evolutionOk,
      totalSteps: results.length,
      successCount: results.filter((r) => r.ok).length,
      failedSteps: results.filter((r) => !r.ok).map((r) => r.step),
    },
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Report: ${REPORT_FILE}`);

  // 7. Commit and push
  if (AUTO_COMMIT && hasChanges()) {
    log('Committing and pushing improvements...');
    try {
      execSync('git config user.name "github-actions[bot]"', { cwd: ROOT });
      execSync('git config user.email "github-actions[bot]@users.noreply.github.com"', { cwd: ROOT });
      execSync('git add -A', { cwd: ROOT });
      execSync('git diff --staged --quiet || git commit -m "chore(automation): app improvement pipeline - audit, evolution, implementation"', {
        cwd: ROOT,
        stdio: 'inherit',
      });
      execSync('git push origin HEAD:main 2>/dev/null || true', { cwd: ROOT, stdio: 'inherit' });
      log('Changes committed and pushed');
      report.committed = true;

      // 8. Trigger deploy (optional)
      if (TRIGGER_DEPLOY) {
        const deployResult = await triggerDeploy();
        report.deployTriggered = deployResult.ok;
        if (!deployResult.ok && deployResult.reason) report.deployReason = deployResult.reason;
      }
    } catch (e) {
      log(`Commit/push failed: ${e.message}`);
      report.commitError = e.message;
    }
  }

  log('=== App Improvement Orchestrator Finished ===');
  return report;
}

const cmd = process.argv[2] || 'run';
if (cmd === 'run') {
  runPipeline().catch((e) => {
    console.error(e);
    process.exit(1);
  });
} else if (cmd === 'summary') {
  try {
    const data = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'));
    console.log(JSON.stringify(data.summary || data, null, 2));
  } catch (e) {
    console.log('No report found. Run with "run" first.');
  }
} else {
  console.log('Usage: node ai-app-improvement-orchestrator.cjs [run|summary]');
  process.exit(1);
}
