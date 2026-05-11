#!/usr/bin/env node
/**
 * ai-automation-engine/run.cjs – Orchestrator for AI Automation Engine.
 *
 * This script coordinates the following autonomous tasks:
 *   1. Run self-healing CI task (creates issues for failed workflows)
 *   2. Perform daily security audit and auto-PR if necessary
 *   3. Run cost‑benefit analysis and output a report
 *   4. Generate a daily summary report and commit it if changed
 *   5. Push any generated changes to the repository
 *   6. Optionally create a PR with the aggregated report for review
 *
 * All subprocesses are run sequentially and failures short‑circuit the rest to prevent cascading errors.
 * The script is idempotent: it only commits if there are changes in the report or any generated file.
 *
 * Environment variables needed:
 *   GITHUB_TOKEN – For API operations
 *   REPO_OWNER   – Owner of the repository
 *   REPO_NAME    – Repository name
 *   GITHUB_COMMITTER_NAME – Optional, defaults to "GitHub Actions"
 *   GITHUB_COMMITTER_EMAIL – Optional, defaults to "actions@github.com"
 */

require('dotenv').config();
const { execSync, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { Octokit } = require('@octokit/rest');
const util = require('util');

const {
  GITHUB_TOKEN,
  REPO_OWNER,
  REPO_NAME,
  GITHUB_COMMITTER_NAME = 'GitHub Actions',
  GITHUB_COMMITTER_EMAIL = 'actions@github.com'
} = process.env;

if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
  console.error('❌ Missing required env vars: GITHUB_TOKEN, REPO_OWNER, REPO_NAME');
  process.exit(1);
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });
const execAsync = util.promisify(execSync);

async function runCommand(cmd, opts = {}) {
  console.log(`🚀 Running: ${cmd}`);
  try {
    const out = execSync(cmd, { stdio: 'inherit', ...opts });
    return out;
  } catch (err) {
    console.error(`❌ Command failed: ${cmd}`);
    throw err;
  }
}

async function runSelfHeal() {
  await runCommand('node ais/ai-automation-engine/self-heal.cjs', { cwd: process.cwd() });
}

async function runAudit() {
  // Run audit script; if it fails, the script will exit with non-zero.
  await runCommand('node scripts/audit-app.cjs', { cwd: process.cwd() });
}

async function runCostBenefit() {
