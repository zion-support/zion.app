#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'automation', 'reports');
const AUDIT_FILE = path.join(REPORT_DIR, 'github-actions-integrity-audit-latest.json');
const PLAN_JSON = path.join(REPORT_DIR, 'autonomous-fix-factory-plan-latest.json');
const PLAN_MD = path.join(REPORT_DIR, 'autonomous-fix-factory-plan-latest.md');
const QUEUE_JSON = path.join(REPORT_DIR, 'autonomous-fix-factory-queue.json');

function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function buildPlan(audit) {
  const now = new Date().toISOString();
  const workflows = Array.isArray(audit?.workflows) ? audit.workflows : [];
  const queue = [];
  for (const wf of workflows) {
    const f = wf.file;
    if (!wf.checks?.hasPermissions) {
      queue.push({
        id: `perm-${f}`,
        type: 'workflow-permissions-hardening',
        targetFile: f,
        priority: 'critical',
        action: 'insert explicit least-privilege permissions block',
      });
    }
    if (Number(wf.checks?.unpinnedActionsCount || 0) > 0) {
      queue.push({
        id: `pin-${f}`,
        type: 'workflow-action-pin-hardening',
        targetFile: f,
        priority: 'critical',
        action: 'pin action references to commit SHA with comment',
      });
    }
    if (Number(wf.checks?.missingJobTimeouts || 0) > 0) {
      queue.push({
        id: `timeout-${f}`,
        type: 'workflow-timeout-hardening',
        targetFile: f,
        priority: 'warning',
        action: 'add timeout-minutes per job',
      });
    }
  }

  const plan = {
    generatedAt: now,
    source: 'github-actions-integrity-auditor',
    queueSize: queue.length,
    criticalCount: queue.filter((q) => q.priority === 'critical').length,
    warningCount: queue.filter((q) => q.priority === 'warning').length,
    queue: queue.slice(0, 150),
  };
  return { plan, queue };
}

function writeOutputs(plan, queue) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(PLAN_JSON, `${JSON.stringify(plan, null, 2)}\n`, 'utf8');
  fs.writeFileSync(QUEUE_JSON, `${JSON.stringify({ generatedAt: plan.generatedAt, queue }, null, 2)}\n`, 'utf8');
  const lines = [
    '# Autonomous fix-factory plan',
    '',
    `- generatedAt: ${plan.generatedAt}`,
    `- queueSize: ${plan.queueSize}`,
    `- criticalCount: ${plan.criticalCount}`,
    `- warningCount: ${plan.warningCount}`,
    '',
    '## Top tasks',
    ...plan.queue.slice(0, 25).map((q) => `- [${q.priority}] ${q.type} -> \`${q.targetFile}\``),
    '',
  ];
  fs.writeFileSync(PLAN_MD, `${lines.join('\n')}\n`, 'utf8');
}

function escalatePlan(plan) {
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  if (!token) return;
  if (plan.criticalCount < 5) return;
  process.env.ISSUE_TITLE = `Autonomous fix-factory backlog elevated (${plan.criticalCount} critical)`;
  process.env.ISSUE_FINGERPRINT = 'autonomous-fix-factory-backlog-elevated';
  process.env.ISSUE_LABELS = 'automation,ci,maintenance';
  process.env.ISSUE_BODY_FILE = PLAN_MD;
  spawnSync('node', ['scripts/automation/gh-issue-dedupe-or-create.cjs'], {
    cwd: ROOT,
    env: process.env,
    encoding: 'utf8',
  });
}

function main() {
  const audit = readJson(AUDIT_FILE, null);
  if (!audit) {
    console.log('[autonomous-fix-factory] audit report missing; skip');
    process.exit(0);
  }
  const { plan, queue } = buildPlan(audit);
  writeOutputs(plan, queue);
  escalatePlan(plan);
  console.log('[autonomous-fix-factory] queue size:', plan.queueSize);
}

main();
