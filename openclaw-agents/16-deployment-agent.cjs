#!/usr/bin/env node
/**
 * OpenClaw Agent: Deployment Agent
 * Handles deployment and monitors deployment status
 * Priority: HIGH
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const WORKSPACE = '/root/.openclaw/workspace/zion.app';
const REPORT_FILE = path.join(WORKSPACE, 'openclaw-agents', 'reports', 'deployment-report.json');

console.log('🚀 Deployment Agent starting...\n');

const report = {
  timestamp: new Date().toISOString(),
  agent: 'deployment',
  status: 'checking',
  lastDeploy: null,
  netlify: {},
  errors: []
};

async function main() {
  // Check Netlify CLI
  console.log('1️⃣ Checking Netlify configuration...');
  try {
    const netlifyConfig = fs.readFileSync(path.join(WORKSPACE, 'netlify.toml'), 'utf8');
    report.netlify = { configured: true, file: 'netlify.toml exists' };
    console.log('   ✅ Netlify configured');
  } catch (e) {
    report.netlify = { configured: false };
    console.log('   ⚠️ Netlify not configured');
  }

  // Check for deployment status
  console.log('\n2️⃣ Checking deployment status...');
  try {
    const statusOutput = execSync('gh run list --limit 5 --json status,conclusion,workflowId', { 
      cwd: WORKSPACE, 
      encoding: 'utf8' 
    });
    const runs = JSON.parse(statusOutput);
    
    report.recentRuns = runs.slice(0, 3).map(r => ({
      status: r.status,
      conclusion: r.conclusion,
      workflowId: r.workflowId
    }));
    
    const latest = runs[0];
    if (latest?.conclusion === 'success') {
      report.status = 'deployed';
      console.log('   ✅ Latest deployment successful');
    } else if (latest?.conclusion === 'failure') {
      report.status = 'failed';
      report.errors.push('Latest deployment failed');
      console.log('   ❌ Latest deployment failed');
    } else {
      report.status = 'in-progress';
      console.log('   ⏳ Deployment in progress');
    }
    
  } catch (e) {
    console.log('   ⚠️ Could not check deployment status');
  }

  // Check build status locally
  console.log('\n3️⃣ Checking local build readiness...');
  const buildScript = JSON.parse(fs.readFileSync(path.join(WORKSPACE, 'package.json'), 'utf8')).scripts?.build;
  
  if (buildScript) {
    report.buildReady = true;
    report.buildCommand = buildScript;
    console.log('   ✅ Build script available');
  } else {
    report.buildReady = false;
    console.log('   ❌ No build script found');
  }

  // Check for recent commits to deploy
  console.log('\n4️⃣ Checking for undeployed commits...');
  try {
    const localRev = execSync('git rev-parse HEAD', { cwd: WORKSPACE, encoding: 'utf8' }).trim();
    report.localCommit = localRev.slice(0, 7);
    
    // Try to get remote status
    try {
      execSync('git fetch origin main', { cwd: WORKSPACE, encoding: 'utf8' });
      const remoteRev = execSync('git rev-parse origin/main', { cwd: WORKSPACE, encoding: 'utf8' }).trim();
      report.remoteCommit = remoteRev.slice(0, 7);
      
      if (localRev !== remoteRev) {
        report.status = 'ahead';
        const diffCount = execSync(`git rev-list ${remoteRev}..${localRev} --count`, { cwd: WORKSPACE, encoding: 'utf8' }).trim();
        report.undeployedCommits = parseInt(diffCount);
        console.log(`   ⚠️ ${diffCount} commits ahead of remote`);
      } else {
        console.log('   ✅ Local matches remote');
      }
    } catch (e) {
      console.log('   Could not compare with remote');
    }
    
  } catch (e) {
    console.log('   Could not check commit status');
  }

  // Deployment score
  let score = 30;
  if (report.status === 'deployed' || report.status === 'up-to-date') score += 40;
  if (report.status === 'ahead') score += 20;
  if (report.netlify?.configured) score += 15;
  if (report.buildReady) score += 15;
  report.score = Math.min(100, score);

  console.log(`\n📊 Deployment Score: ${score}/100`);

  // Save report
  const reportDir = path.dirname(REPORT_FILE);
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  console.log('\n✅ Deployment report saved');
}

main().catch(console.error);
