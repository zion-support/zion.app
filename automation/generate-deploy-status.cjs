#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const REPORT_FILE = path.join(REPORTS_DIR, 'deploy-status-latest.json');

function ensureReportsDir() {
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }
}

function main() {
  ensureReportsDir();

  const payload = {
    generatedAt: new Date().toISOString(),
    source: process.env.DEPLOY_STATUS_SOURCE || 'local',
    status: process.env.DEPLOY_STATUS || 'unknown',
    sha: process.env.GITHUB_SHA || process.env.DEPLOY_SHA || 'unknown',
    ref: process.env.GITHUB_REF || process.env.DEPLOY_REF || 'unknown',
    runId: process.env.GITHUB_RUN_ID || null,
    workflow: process.env.GITHUB_WORKFLOW || null,
    netlifyDeployId:
      process.env.NETLIFY_DEPLOY_ID ||
      process.env.NETLIFY_DEPLOYMENT_ID ||
      process.env.NETLIFY_BUILD_ID ||
      null,
    netlifyDeployUrl:
      process.env.NETLIFY_DEPLOY_URL ||
      process.env.NETLIFY_URL ||
      process.env.DEPLOY_URL ||
      null,
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(payload, null, 2));
  console.log(`Wrote deploy status report: ${REPORT_FILE}`);
}

if (require.main === module) {
  main();
}

module.exports = { main };

