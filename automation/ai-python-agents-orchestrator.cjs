#!/usr/bin/env node

/**
 * AI Python Agents Orchestrator
 *
 * Runs Python-based agents (lead discovery, email interaction, feature promotion)
 * in sequence. Continues on individual failures so one missing credential
 * doesn't block others.
 *
 * Use: npm run agents:python-all
 * Cron: Individual agents have their own cron entries for scheduling.
 */

const { execSync } = require('child_process');
const path = require('path');

const ROOT = process.cwd();
const COMMANDS_DIR = path.join(ROOT, 'commands');

const AGENTS = [
  { name: 'Lead Discovery', script: 'zion_lead_discovery_agent.py', env: ['CRUNCHBASE_API_KEY', 'APOLLO_API_KEY'] },
  { name: 'Email Interaction', script: 'zion_email_interaction_agent.py', env: ['GOG_TOKEN', 'CURSOR_API_KEY'] },
  { name: 'Feature Promotion', script: 'zion_feature_promotion_agent.py', env: [] },
];

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[PythonOrchestrator] ${ts} | ${msg}`);
}

function runAgent(agent) {
  const scriptPath = path.join(COMMANDS_DIR, agent.script);
  try {
    log(`Running ${agent.name}...`);
    execSync(`python3 "${scriptPath}"`, { cwd: ROOT, stdio: 'inherit' });
    log(`${agent.name} completed`);
    return { ok: true };
  } catch (e) {
    log(`${agent.name} failed: ${e.message}`);
    return { ok: false, error: e.message };
  }
}

function main() {
  log('=== Python Agents Orchestrator Started ===');
  const results = [];
  for (const agent of AGENTS) {
    results.push({ name: agent.name, ...runAgent(agent) });
  }
  const failed = results.filter((r) => !r.ok).length;
  log(`=== Done. ${results.length - failed}/${results.length} succeeded ===`);
  process.exit(0);
}

main();
