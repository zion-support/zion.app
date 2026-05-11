#!/usr/bin/env node
/**
 * OpenClaw Agent: Master Orchestrator
 * Runs all specialized agents and aggregates results
 * This is the central brain of the improvement system
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const WORKSPACE = '/root/.openclaw/workspace/zion.app';
const AGENTS_DIR = path.join(WORKSPACE, 'openclaw-agents');
const MASTER_REPORT = path.join(AGENTS_DIR, 'master-orchestrator-report.json');

console.log('🎛️  MASTER ORCHESTRATOR Starting...\n');
console.log(`   Time: ${new Date().toISOString()}\n`);

const agents = [
  { name: 'Code Auditor', file: '01-code-auditor.cjs', enabled: true },
  { name: 'Bug Hunter', file: '02-bug-hunter.cjs', enabled: true },
  { name: 'Performance', file: '03-performance-optimizer.cjs', enabled: true },
  { name: 'Content', file: '04-content-enhancer.cjs', enabled: true },
  { name: 'Code Review', file: '13-code-review.cjs', enabled: true },
  { name: 'Documentation', file: '14-docs-generator.cjs', enabled: true },
  { name: 'Testing', file: '15-testing-agent.cjs', enabled: true },
  { name: 'Deployment', file: '16-deployment-agent.cjs', enabled: true },
];

const report = {
  timestamp: new Date().toISOString(),
  agents: [],
  scores: {},
  overallScore: 0,
  summary: ''
};

let totalScore = 0;
let scoredAgents = 0;

for (const agent of agents) {
  if (!agent.enabled) continue;
  
  console.log(`▶️  Running ${agent.name}...`);
  const start = Date.now();
  
  try {
    const output = execSync(`node ${agent.file}`, {
      cwd: AGENTS_DIR,
      encoding: 'utf8',
      timeout: 180000,
      maxBuffer: 20 * 1024 * 1024
    });
    
    const duration = Date.now() - start;
    
    // Try to extract score from report
    let score = 50; // Default
    const reportFile = agent.file.replace('.cjs', '-report.json');
    try {
      const fullPath = path.join(AGENTS_DIR, 'reports', reportFile);
      if (fs.existsSync(fullPath)) {
        const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        score = data.score || data.scores?.quality || data.scores?.bugFree || 50;
      }
    } catch (e) {}
    
    report.agents.push({
      name: agent.name,
      status: 'success',
      duration,
      score
    });
    
    totalScore += score;
    scoredAgents++;
    
    console.log(`   ✅ ${agent.name} completed (${duration}ms) - Score: ${score}`);
    
  } catch (e) {
    report.agents.push({
      name: agent.name,
      status: 'failed',
      error: e.message.slice(0, 200)
    });
    console.log(`   ❌ ${agent.name} failed: ${e.message.slice(0, 80)}`);
  }
  
  console.log('');
}

// Calculate overall score
report.overallScore = scoredAgents > 0 ? Math.round(totalScore / scoredAgents) : 0;

// Load task queue status
try {
  const taskQueue = JSON.parse(fs.readFileSync(path.join(AGENTS_DIR, 'task-queue.json'), 'utf8'));
  report.taskQueue = {
    pending: taskQueue.generated?.length || 0,
    inProgress: taskQueue.inProgress?.length || 0,
    completed: taskQueue.completed?.length || 0
  };
} catch (e) {
  report.taskQueue = { pending: 0, inProgress: 0, completed: 0 };
}

// Summary
report.summary = `
Master Orchestrator Complete:
- Agents Run: ${report.agents.filter(a => a.status === 'success').length}/${agents.length}
- Overall Score: ${report.overallScore}/100
- Tasks: ${report.taskQueue.pending} pending, ${report.taskQueue.completed} completed
`.trim();

console.log('='.repeat(50));
console.log('🎛️  MASTER ORCHESTRATOR COMPLETE');
console.log('='.repeat(50));
console.log(`\n📊 Overall Score: ${report.overallScore}/100`);
console.log(`📋 Tasks: ${report.taskQueue.pending} pending, ${report.taskQueue.completed} completed`);

// Save master report
fs.writeFileSync(MASTER_REPORT, JSON.stringify(report, null, 2));
console.log('\n✅ Master report saved');

// Exit with score
process.exit(report.overallScore >= 70 ? 0 : 1);
