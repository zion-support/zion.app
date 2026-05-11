#!/usr/bin/env node
/**
 * OpenClaw Agent: Orchestrator
 * Role: Run all agents in an infinite improvement loop
 * Schedule: Run via cron or manually
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const WORKSPACE = '/root/.openclaw/workspace/zion.app';
const AGENTS_DIR = path.join(WORKSPACE, 'openclaw-agents');
const FINDINGS_FILE = path.join(AGENTS_DIR, 'shared', 'findings.json');
const LOG_FILE = path.join(AGENTS_DIR, 'orchestrator-log.json');

const agents = [
  { name: 'Code Auditor', file: '01-code-auditor.cjs', enabled: true },
  { name: 'Bug Hunter', file: '02-bug-hunter.cjs', enabled: true },
  { name: 'Performance Optimizer', file: '03-performance-optimizer.cjs', enabled: true },
  { name: 'Content Enhancer', file: '04-content-enhancer.cjs', enabled: true },
];

const log = {
  startTime: new Date().toISOString(),
  iterations: [],
  totalIssuesFound: 0,
  totalFixesApplied: 0
};

console.log('🚀 OpenClaw Agent Orchestra Starting...\n');
console.log(`   Workspace: ${WORKSPACE}`);
console.log(`   Agents: ${agents.length}`);
console.log('');

// Run each agent
for (const agent of agents) {
  if (!agent.enabled) continue;
  
  console.log(`▶️  Running ${agent.name}...`);
  const start = Date.now();
  
  try {
    const output = execSync(`node ${path.join(AGENTS_DIR, agent.file)}`, {
      cwd: WORKSPACE,
      encoding: 'utf8',
      timeout: 180000,
      maxBuffer: 50 * 1024 * 1024
    });
    
    log.iterations.push({
      agent: agent.name,
      status: 'success',
      duration: Date.now() - start,
      output: output.slice(0, 500)
    });
    
    console.log(`   ✅ ${agent.name} completed in ${Date.now() - start}ms`);
    
  } catch (e) {
    log.iterations.push({
      agent: agent.name,
      status: 'error',
      duration: Date.now() - start,
      error: (e.message || '').slice(0, 500)
    });
    
    console.log(`   ❌ ${agent.name} failed: ${(e.message || '').slice(0, 100)}`);
  }
  
  console.log('');
}

// Aggregate findings
console.log('📊 Aggregating findings...\n');

let findings = {};
try {
  findings = JSON.parse(fs.readFileSync(FINDINGS_FILE, 'utf8'));
} catch (e) {
  console.log('   No previous findings');
}

// Count total issues
let totalIssues = 0;
for (const key of Object.keys(findings)) {
  const data = findings[key];
  if (data.issues) totalIssues += data.issues.length;
  if (data.bugs) totalIssues += data.bugs.length;
  if (data.typeErrors) totalIssues += data.typeErrors.length;
}

log.totalIssuesFound = totalIssues;

// Calculate overall scores
const scores = {
  codeQuality: findings.codeAuditor?.scores?.quality || 0,
  bugFree: Math.max(0, 100 - (findings.bugHunter?.typeErrors?.length || 0) * 2),
  performance: findings.performance?.score || 0,
  content: findings.content?.score || 0
};

const overallScore = Math.round(
  (scores.codeQuality + scores.bugFree + scores.performance + scores.content) / 4
);

log.overallScore = overallScore;
log.scores = scores;
log.endTime = new Date().toISOString();

console.log('📈 Overall Scores:');
console.log(`   Code Quality:   ${scores.codeQuality}/100`);
console.log(`   Bug Free:       ${scores.bugFree}/100`);
console.log(`   Performance:    ${scores.performance}/100`);
console.log(`   Content:        ${scores.content}/100`);
console.log(`   ─────────────────────`);
console.log(`   OVERALL:        ${overallScore}/100`);
console.log(`\n   Total Issues:   ${totalIssues}`);

// Save log
fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));

// Create improvement summary
const summary = {
  timestamp: new Date().toISOString(),
  overallScore,
  scores,
  totalIssues,
  topIssues: [
    ...(findings.codeAuditor?.issues || []).slice(0, 5),
    ...(findings.bugHunter?.typeErrors || []).slice(0, 5),
    ...(findings.performance?.issues || []).slice(0, 5),
  ],
  recommendations: [
    ...(findings.codeAuditor?.recommendations || []),
    ...(findings.content?.contentOpportunities || []).slice(0, 5),
  ]
};

fs.writeFileSync(path.join(AGENTS_DIR, 'improvement-summary.json'), JSON.stringify(summary, null, 2));

console.log('\n✅ Orchestration complete!');
console.log(`   Log: orchestrator-log.json`);
console.log(`   Summary: improvement-summary.json`);

// Exit with score for automation tracking
process.exit(overallScore >= 80 ? 0 : 1);
