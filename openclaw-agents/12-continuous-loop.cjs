#!/usr/bin/env node
/**
 * OpenClaw Agent: Continuous Improvement Loop
 * Orchestrates: audit → generate tasks → execute → commit → push
 * This is the heart of the infinite improvement loop
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const WORKSPACE = '/root/.openclaw/workspace/zion.app';
const IMPROVEMENT_LOG = path.join(WORKSPACE, 'openclaw-agents', 'continuous-improvement-log.json');

console.log('♾️  CONTINUOUS IMPROVEMENT LOOP STARTING...\n');
console.log(`   Time: ${new Date().toISOString()}`);
console.log(`   Workspace: ${WORKSPACE}\n`);

const loopLog = {
  startTime: new Date().toISOString(),
  iterations: [],
  commits: [],
  overallScore: 0,
  totalTasksCompleted: 0
};

const START = Date.now();

// Step 1: Run Orchestra (audit)
console.log('📊 STEP 1: Running Agent Orchestra (Audit)...\n');
try {
  const auditOutput = execSync('node openclaw-agents/orchestrator.cjs', {
    cwd: WORKSPACE,
    encoding: 'utf8',
    timeout: 300000,
    maxBuffer: 50 * 1024 * 1024
  });
  
  loopLog.iterations.push({ step: 'audit', status: 'success', duration: Date.now() - START });
  console.log('   ✅ Audit complete\n');
  
  // Extract score from output
  const scoreMatch = auditOutput.match(/OVERALL:\s+(\d+)/);
  if (scoreMatch) {
    loopLog.overallScore = parseInt(scoreMatch[1]);
    console.log(`   Score: ${loopLog.overallScore}/100\n`);
  }
  
} catch (e) {
  loopLog.iterations.push({ step: 'audit', status: 'error', error: e.message });
  console.log(`   ❌ Audit failed: ${e.message}\n`);
}

// Step 2: Generate Tasks
console.log('📋 STEP 2: Generating Tasks...');
const TASK_GEN_START = Date.now();
try {
  execSync('node openclaw-agents/10-task-generator.cjs', {
    cwd: WORKSPACE,
    encoding: 'utf8',
    timeout: 60000
  });
  
  loopLog.iterations.push({ step: 'task-gen', status: 'success', duration: Date.now() - TASK_GEN_START });
  console.log('   ✅ Tasks generated\n');
  
} catch (e) {
  loopLog.iterations.push({ step: 'task-gen', status: 'error', error: e.message });
  console.log(`   ⚠️ Task gen failed: ${e.message}\n`);
}

// Step 3: Execute Tasks
console.log('⚡ STEP 3: Executing Tasks...');
const EXEC_START = Date.now();
try {
  execSync('node openclaw-agents/11-task-executor.cjs', {
    cwd: WORKSPACE,
    encoding: 'utf8',
    timeout: 120000
  });
  
  loopLog.iterations.push({ step: 'execute', status: 'success', duration: Date.now() - EXEC_START });
  console.log('   ✅ Tasks executed\n');
  
} catch (e) {
  loopLog.iterations.push({ step: 'execute', status: 'error', error: e.message });
  console.log(`   ⚠️ Execution failed: ${e.message}\n`);
}

// Step 4: Check for changes and commit
console.log('📦 STEP 4: Checking for changes...');
const CHECK_START = Date.now();

try {
  const status = execSync('git status --porcelain', { cwd: WORKSPACE, encoding: 'utf8' });
  
  if (status.trim()) {
    console.log('   Changes found, committing...');
    
    // Configure git if needed
    try {
      execSync('git config user.email "agent@ziontechgroup.com"', { cwd: WORKSPACE });
      execSync('git config user.name "Zion AI Agent"', { cwd: WORKSPACE });
    } catch (e) {}
    
    // Add and commit
    execSync('git add -A', { cwd: WORKSPACE });
    execSync('git commit -m "♾️ Continuous improvement: audit + tasks + fixes"', { cwd: WORKSPACE });
    
    const commitHash = execSync('git rev-parse --short HEAD', { cwd: WORKSPACE, encoding: 'utf8' }).trim();
    loopLog.commits.push({ hash: commitHash, time: new Date().toISOString() });
    
    console.log(`   ✅ Committed: ${commitHash}\n`);
    
    // Push
    console.log('   Pushing to GitHub...');
    try {
      execSync('git pull origin main --rebase', { cwd: WORKSPACE, encoding: 'utf8' });
      execSync('git push origin main', { cwd: WORKSPACE, encoding: 'utf8' });
      console.log('   ✅ Pushed to main\n');
    } catch (pushError) {
      console.log(`   ⚠️ Push failed: ${pushError.message}\n`);
    }
    
  } else {
    console.log('   No changes to commit\n');
  }
  
  loopLog.iterations.push({ step: 'commit', status: 'success', duration: Date.now() - CHECK_START });
  
} catch (e) {
  loopLog.iterations.push({ step: 'commit', status: 'error', error: e.message });
  console.log(`   ⚠️ Commit check failed: ${e.message}\n`);
}

// Summary
const TOTAL_TIME = Date.now() - START;

console.log('='.repeat(50));
console.log('♾️  IMPROVEMENT LOOP COMPLETE');
console.log('='.repeat(50));
console.log(`\n📊 Summary:`);
console.log(`   Total Time: ${(TOTAL_TIME / 1000).toFixed(1)}s`);
console.log(`   Overall Score: ${loopLog.overallScore}/100`);
console.log(`   Steps Completed: ${loopLog.iterations.filter(i => i.status === 'success').length}/${loopLog.iterations.length}`);
console.log(`   Commits Made: ${loopLog.commits.length}`);

// Load task stats
try {
  const taskQueue = JSON.parse(fs.readFileSync(path.join(WORKSPACE, 'openclaw-agents', 'task-queue.json'), 'utf8'));
  console.log(`\n📋 Task Queue:`);
  console.log(`   Pending: ${taskQueue.generated?.length || 0}`);
  console.log(`   In Progress: ${taskQueue.inProgress?.length || 0}`);
  console.log(`   Completed: ${taskQueue.completed?.length || 0}`);
  loopLog.totalTasksCompleted = taskQueue.completed?.length || 0;
} catch (e) {}

loopLog.endTime = new Date().toISOString();
loopLog.totalDuration = TOTAL_TIME;

// Save log
fs.writeFileSync(IMPROVEMENT_LOG, JSON.stringify(loopLog, null, 2));

console.log('\n✅ Log saved to continuous-improvement-log.json');
console.log('\n🚀 Ready for next iteration!\n');

// Exit with score
process.exit(loopLog.overallScore >= 80 ? 0 : 1);
