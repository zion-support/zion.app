#!/usr/bin/env node

/**
 * AI GitHub Actions Implementation Agent
 *
 * Applies safe improvements from github-actions-audit-suggestions.json:
 * - Workflow improvements (permissions, triggers, timeouts)
 * - New workflow creation from suggestions
 * - Fallback improvements when LLM suggestions unavailable
 *
 * Runs: After ai-github-actions-audit-agent (in workflow) or manually
 * Requires: Run actions:audit first to populate suggestions
 *
 * AUTO_COMMIT=1 to commit and push applied changes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const AUTOMATION_DIR = path.join(ROOT, 'automation');
const DATA_DIR = path.join(AUTOMATION_DIR, 'data');
const REPORTS_DIR = path.join(AUTOMATION_DIR, 'reports');
const WORKFLOWS_DIR = path.join(ROOT, '.github', 'workflows');
const SUGGESTIONS_FILE = path.join(DATA_DIR, 'github-actions-audit-suggestions.json');
const REPORT_FILE = path.join(REPORTS_DIR, 'github-actions-implementation-latest.json');

const FALLBACK_WORKFLOW_IMPROVEMENTS = [
  {
    id: 'ci-cd-workflow-dispatch',
    workflow: 'ci-cd.yml',
    title: 'Add workflow_dispatch to CI/CD for manual runs',
    apply: (content) => {
      if (content.includes('workflow_dispatch:')) return null;
      const onMatch = content.match(/^on:\s*\n(\s+)(push:|pull_request:)/m);
      if (!onMatch) return null;
      const indent = onMatch[1];
      return content.replace(
        /^on:\s*\n(\s+)(push:)/m,
        `on:\n${indent}workflow_dispatch:\n${indent}$2`
      );
    },
  },
  {
    id: 'workflows-add-timeout',
    workflow: 'ai-github-actions-audit.yml',
    title: 'Ensure timeout-minutes on long-running jobs',
    apply: (content) => {
      if (content.includes('timeout-minutes:')) return null;
      const jobsMatch = content.match(/(jobs:\s*\n\s+\w+:[\s\S]*?runs-on:[\s\S]*?)(\n\s+steps:)/m);
      if (!jobsMatch) return null;
      return content.replace(
        /(runs-on: ubuntu-latest)\n(\s+)(env:)/m,
        '$1\n$2timeout-minutes: 25\n$2$3'
      );
    },
  },
];

// deploy-preflight.yml is created manually; fallback only for LLM-suggested new workflows
const FALLBACK_NEW_WORKFLOWS = [];

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[GitHubActionsImpl] ${ts} | ${msg}`);
}

function ensureDirs() {
  [REPORTS_DIR, DATA_DIR].forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });
}

function readJsonSafe(p, def = null) {
  try {
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    log(`Warning: Could not read ${p}: ${e.message}`);
  }
  return def;
}

function applyWorkflowImprovement(improvement, workflowPath) {
  if (!fs.existsSync(workflowPath)) return { applied: false, reason: 'File not found' };
  let content = fs.readFileSync(workflowPath, 'utf8');
  const improved = improvement.apply ? improvement.apply(content) : null;
  if (improved === null) return { applied: false, reason: 'Already applied or not applicable' };
  fs.writeFileSync(workflowPath, improved);
  return { applied: true };
}

function createNewWorkflow(suggestion) {
  const filepath = path.join(WORKFLOWS_DIR, suggestion.file);
  if (fs.existsSync(filepath)) return { applied: false, reason: 'Workflow already exists' };
  const yaml = suggestion.yaml || suggestion.yamlSnippet || '';
  if (!yaml) return { applied: false, reason: 'No YAML content' };
  fs.writeFileSync(filepath, (typeof yaml === 'string' ? yaml : '').trim() + '\n');
  return { applied: true };
}

function run() {
  ensureDirs();
  log('Starting GitHub Actions implementation...');

  const suggestions = readJsonSafe(SUGGESTIONS_FILE, {});
  const workflowImprovements = suggestions.workflowImprovements || [];
  const newWorkflowSuggestions = suggestions.newWorkflowSuggestions || [];
  const applied = [];
  const skipped = [];

  // Apply workflow improvements from LLM or fallback
  for (const imp of workflowImprovements.length ? workflowImprovements : FALLBACK_WORKFLOW_IMPROVEMENTS) {
    const workflowPath = path.join(WORKFLOWS_DIR, imp.workflow);
    const result = applyWorkflowImprovement(imp, workflowPath);
    if (result.applied) {
      applied.push({ type: 'workflow_improvement', id: imp.id, workflow: imp.workflow });
      log(`Applied: ${imp.title}`);
    } else {
      skipped.push({ type: 'workflow_improvement', id: imp.id, reason: result.reason });
    }
  }

  // Create new workflows from suggestions or fallback
  const newWorkflows = newWorkflowSuggestions.length ? newWorkflowSuggestions : FALLBACK_NEW_WORKFLOWS;
  for (const nw of newWorkflows) {
    const file = nw.file || (nw.id || 'workflow') + '.yml';
    const result = createNewWorkflow({ ...nw, file });
    if (result.applied) {
      applied.push({ type: 'new_workflow', id: nw.id, file });
      log(`Created: ${file}`);
    } else {
      skipped.push({ type: 'new_workflow', id: nw.id, reason: result.reason });
    }
  }

  const report = {
    timestamp: new Date().toISOString(),
    applied: applied.length,
    skipped: skipped.length,
    appliedItems: applied,
    skippedItems: skipped,
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Done. Applied ${applied.length}, skipped ${skipped.length}. Report: ${REPORT_FILE}`);

  if (process.env.AUTO_COMMIT === '1' && applied.length > 0) {
    try {
      execSync('git add -A && git diff --cached --quiet || (git commit -m "chore(ci): apply GitHub Actions improvements from audit" && git push)', {
        cwd: ROOT,
        stdio: 'inherit',
      });
      log('Committed and pushed changes');
    } catch (e) {
      log(`Auto-commit failed: ${e.message}`);
    }
  }

  return report;
}

const cmd = process.argv[2] || 'run';
if (cmd === 'run') {
  run();
} else if (cmd === 'summary') {
  try {
    const data = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'));
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.log('No report found. Run with "run" first.');
  }
} else {
  console.log('Usage: node ai-github-actions-implementation-agent.cjs [run|summary]');
  process.exit(1);
}
