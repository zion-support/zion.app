#!/usr/bin/env node

/**
 * AI Documentation Sync Agent
 *
 * Keeps AI-SYSTEMS-OVERVIEW.md in sync with actual automation agents.
 * Scans automation/ for ai-*.cjs agents and .github/workflows for workflows,
 * compares with documented entries, and reports missing or outdated docs.
 *
 * Runs: Weekly Friday via cron | After daily pipeline
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const AUTOMATION_DIR = path.join(ROOT, 'automation');
const OVERVIEW_PATH = path.join(AUTOMATION_DIR, 'AI-SYSTEMS-OVERVIEW.md');
const WORKFLOWS_DIR = path.join(ROOT, '.github', 'workflows');
const REPORTS_DIR = path.join(AUTOMATION_DIR, 'reports');
const REPORT_FILE = path.join(REPORTS_DIR, 'documentation-sync-latest.json');

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[DocSync] ${ts} | ${msg}`);
}

function listAgents() {
  if (!fs.existsSync(AUTOMATION_DIR)) return [];
  return fs.readdirSync(AUTOMATION_DIR)
    .filter((f) => f.startsWith('ai-') && f.endsWith('.cjs'))
    .sort();
}

function listWorkflows() {
  if (!fs.existsSync(WORKFLOWS_DIR)) return [];
  return fs.readdirSync(WORKFLOWS_DIR)
    .filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'))
    .sort();
}

function extractDocRefs(content) {
  const refs = new Set();
  const agentRe = /ai-[a-z0-9-]+\.cjs/g;
  const workflowRe = /ai-[a-z0-9-]+\.yml/g;
  for (const m of content.matchAll(agentRe)) refs.add(m[0]);
  for (const m of content.matchAll(workflowRe)) refs.add(m[0]);
  return refs;
}

function run() {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

  const agents = listAgents();
  const workflows = listWorkflows();
  const overviewContent = fs.existsSync(OVERVIEW_PATH)
    ? fs.readFileSync(OVERVIEW_PATH, 'utf8')
    : '';

  const docRefs = extractDocRefs(overviewContent);
  const documentedAgents = [...docRefs].filter((r) => r.endsWith('.cjs')).map((r) => r.replace('.cjs', ''));
  const documentedWorkflows = [...docRefs].filter((r) => r.endsWith('.yml')).map((r) => r.replace('.yml', ''));

  const agentNames = agents.map((a) => a.replace('.cjs', ''));
  const workflowNames = workflows.map((w) => w.replace(/\.(yml|yaml)$/, ''));

  const missingFromDocs = {
    agents: agentNames.filter((a) => !overviewContent.includes(a)),
    workflows: workflowNames.filter((w) => !overviewContent.includes(w)),
  };

  const status = missingFromDocs.agents.length === 0 && missingFromDocs.workflows.length === 0
    ? 'ok'
    : 'needs_update';

  const report = {
    timestamp: new Date().toISOString(),
    status,
    totalAgents: agents.length,
    totalWorkflows: workflows.length,
    missingFromDocs,
    agents,
    workflows,
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Status: ${status}. Agents: ${agents.length}, Workflows: ${workflows.length}`);
  if (missingFromDocs.agents.length > 0) {
    log(`Agents not in overview: ${missingFromDocs.agents.join(', ')}`);
  }
  if (missingFromDocs.workflows.length > 0) {
    log(`Workflows not in overview: ${missingFromDocs.workflows.join(', ')}`);
  }
  log(`Report: ${REPORT_FILE}`);
  return report;
}

const cmd = process.argv[2] || 'run';
if (cmd === 'run') {
  run();
} else if (cmd === 'summary') {
  if (!fs.existsSync(REPORT_FILE)) {
    console.log(JSON.stringify({ status: 'unknown', missing: { agents: [], workflows: [] } }, null, 2));
  } else {
    const r = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'));
    console.log(JSON.stringify({ status: r.status, missing: r.missingFromDocs }, null, 2));
  }
} else {
  console.log('Usage: node ai-documentation-sync-agent.cjs [run|summary]');
  process.exit(1);
}
