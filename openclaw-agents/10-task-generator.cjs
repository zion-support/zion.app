#!/usr/bin/env node
/**
 * OpenClaw Agent: Task Generator
 * Analyzes findings and generates actionable tasks
 * Priority: CRITICAL - Keeps the improvement loop moving
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = '/root/.openclaw/workspace/zion.app';
const FINDINGS_FILE = path.join(WORKSPACE, 'openclaw-agents', 'shared', 'findings.json');
const TASKS_FILE = path.join(WORKSPACE, 'openclaw-agents', 'task-queue.json');

console.log('📋 Task Generator analyzing findings...\n');

const tasks = {
  timestamp: new Date().toISOString(),
  generated: [],
  inProgress: [],
  completed: [],
  highPriority: [],
  stats: {}
};

// Load findings
let findings = {};
try {
  findings = JSON.parse(fs.readFileSync(FINDINGS_FILE, 'utf8'));
} catch (e) {
  console.log('No findings file found');
}

// Generate tasks from code auditor
if (findings.codeAuditor?.issues) {
  for (const issue of findings.codeAuditor.issues.slice(0, 10)) {
    tasks.generated.push({
      id: `task-code-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      source: 'code-auditor',
      type: issue.type,
      severity: issue.severity,
      description: `${issue.type} in ${issue.file || 'unknown file'}`,
      status: 'pending',
      estimatedEffort: issue.severity === 'high' ? '2h' : issue.severity === 'medium' ? '1h' : '30m',
      createdAt: new Date().toISOString()
    });
  }
}

// Generate tasks from bug hunter
if (findings.bugHunter?.bugs) {
  for (const bug of findings.bugHunter.bugs.slice(0, 10)) {
    tasks.generated.push({
      id: `task-bug-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      source: 'bug-hunter',
      type: bug.type || 'eslint-error',
      severity: 'high',
      description: `${bug.rule || 'ESLint'}: ${(bug.message || '').slice(0, 100)}`,
      file: bug.file,
      status: 'pending',
      estimatedEffort: '1h',
      createdAt: new Date().toISOString()
    });
  }
}

// Generate tasks from performance
if (findings.performance?.issues) {
  for (const issue of findings.performance.issues.slice(0, 5)) {
    tasks.generated.push({
      id: `task-perf-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      source: 'performance-optimizer',
      type: issue.type,
      severity: issue.type === 'heavy-import' ? 'high' : 'medium',
      description: `${issue.type}: ${issue.file || ''}`,
      file: issue.file,
      status: 'pending',
      estimatedEffort: '2h',
      createdAt: new Date().toISOString()
    });
  }
}

// Generate tasks from content
if (findings.content?.seoIssues) {
  for (const issue of findings.content.seoIssues.slice(0, 5)) {
    tasks.generated.push({
      id: `task-seo-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      source: 'content-enhancer',
      type: issue.issue,
      severity: 'medium',
      description: `SEO: ${issue.issue} in ${issue.file}`,
      file: issue.file,
      status: 'pending',
      estimatedEffort: '30m',
      createdAt: new Date().toISOString()
    });
  }
}

// Load existing tasks to avoid duplicates
let existingTasks = { generated: [], inProgress: [], completed: [] };
try {
  existingTasks = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'));
} catch (e) {}

// Filter out duplicates
const existingIds = new Set([
  ...existingTasks.generated.map(t => t.description),
  ...existingTasks.inProgress.map(t => t.description),
  ...existingTasks.completed.map(t => t.description)
]);

tasks.generated = tasks.generated.filter(t => !existingIds.has(t.description));

// Mark high priority
tasks.highPriority = tasks.generated
  .filter(t => t.severity === 'high')
  .slice(0, 5);

// Stats
tasks.stats = {
  totalGenerated: tasks.generated.length,
  highPriority: tasks.highPriority.length,
  inProgress: existingTasks.inProgress.length,
  completed: existingTasks.completed.length,
  pending: existingTasks.generated.length
};

console.log('📊 Task Generation Summary:');
console.log(`   New tasks generated: ${tasks.generated.length}`);
console.log(`   High priority: ${tasks.highPriority.length}`);
console.log(`   In progress: ${tasks.stats.inProgress}`);
console.log(`   Completed: ${tasks.stats.completed}`);
console.log(`   Pending: ${tasks.stats.pending}`);

// Merge with existing
const allTasks = {
  ...existingTasks,
  generated: [...tasks.generated, ...existingTasks.generated].slice(0, 50),
  highPriority: tasks.highPriority,
  stats: tasks.stats,
  lastUpdated: new Date().toISOString()
};

fs.writeFileSync(TASKS_FILE, JSON.stringify(allTasks, null, 2));
console.log('\n✅ Task queue updated');
