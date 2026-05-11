#!/usr/bin/env node

/**
 * AI Automation Brain Agent
 *
 * Orchestrates existing audit and improvement outputs into concrete decisions:
 * - Reads latest app audit report and suggestions
 * - Scores suggestions by category and priority
 * - Decides whether to auto-apply (delegated to existing implementation agents)
 *   or queue items into the evolution backlog for later work
 * - Emits AutomationEvents into automation-timeline.json for observability
 *
 * This agent does NOT apply code changes directly; it coordinates other agents.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { recordAutomationEvent } = require('./lib/automation-brain-types.cjs');

const ROOT = process.cwd();
const AUTOMATION_DIR = path.join(ROOT, 'automation');
const REPORTS_DIR = path.join(AUTOMATION_DIR, 'reports');
const DATA_DIR = path.join(AUTOMATION_DIR, 'data');

const APP_AUDIT_REPORT = path.join(REPORTS_DIR, 'app-audit-automation-latest.json');
const APP_AUDIT_SUGGESTIONS = path.join(DATA_DIR, 'app-audit-suggestions.json');
const EVOLUTION_BACKLOG = path.join(DATA_DIR, 'app-evolution-backlog.json');

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[AutomationBrain] ${ts} | ${msg}`);
}

function loadJson(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    log(`Failed to load ${filePath}: ${e.message}`);
    return fallback;
  }
}

function saveJson(filePath, payload) {
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
}

function priorityWeight(priority) {
  const p = (priority || 'medium').toLowerCase();
  if (p === 'high') return 3;
  if (p === 'medium') return 2;
  if (p === 'low') return 1;
  return 1;
}

/**
 * Very small heuristic scoring for suggestions.
 * Conversion > SEO > UX > content > performance > feature.
 */
function categoryWeight(category) {
  const c = (category || '').toLowerCase();
  if (c === 'conversion') return 6;
  if (c === 'seo') return 5;
  if (c === 'ux') return 4;
  if (c === 'content') return 3;
  if (c === 'performance') return 2;
  if (c === 'feature') return 1;
  return 1;
}

function scoreSuggestion(s) {
  return priorityWeight(s.priority) * 10 + categoryWeight(s.category);
}

function classifySuggestion(s) {
  const p = (s.priority || 'medium').toLowerCase();
  const c = (s.category || 'content').toLowerCase();
  const score = scoreSuggestion(s);

  const isLowRiskCategory = c === 'seo' || c === 'content' || c === 'conversion';
  const isHighPriority = p === 'high';

  if (isLowRiskCategory && isHighPriority) {
    return { bucket: 'auto_apply_candidate', score };
  }

  if (score >= 40) {
    return { bucket: 'backlog_high', score };
  }

  return { bucket: 'backlog', score };
}

function runCommand(cmd, label) {
  log(`Running: ${label}`);
  const startedAt = new Date().toISOString();
  try {
    execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
    const finishedAt = new Date().toISOString();
    recordAutomationEvent({
      id: `automation-brain-cmd-${label}-${startedAt}`,
      timestamp: finishedAt,
      agent: 'ai-automation-brain-agent',
      category: 'implementation',
      decision: 'auto_applied',
      summary: `Ran delegated command: ${label}`,
      meta: { cmd, startedAt, finishedAt },
    });
    return { ok: true };
  } catch (e) {
    const finishedAt = new Date().toISOString();
    log(`Command failed: ${label} – ${e.message}`);
    recordAutomationEvent({
      id: `automation-brain-cmd-${label}-${startedAt}`,
      timestamp: finishedAt,
      agent: 'ai-automation-brain-agent',
      category: 'implementation',
      decision: 'needs_review',
      summary: `Delegated command failed: ${label}`,
      meta: { cmd, error: e.message, startedAt, finishedAt },
    });
    return { ok: false, error: e.message };
  }
}

function loadBacklog() {
  const fallback = {
    ideas: [],
    quickWins: [],
    newIdeas: [],
    implementationTasks: [],
    quickWinsPrioritized: [],
    evolutionRoadmap: [],
  };
  return loadJson(EVOLUTION_BACKLOG, fallback);
}

function saveBacklog(backlog) {
  saveJson(EVOLUTION_BACKLOG, backlog);
}

function appendBacklogTasks(backlog, suggestions, bucket) {
  const existingIds = new Set((backlog.implementationTasks || []).map((t) => t.id));
  const tasks = backlog.implementationTasks || [];
  const newTasks = [];

  for (const s of suggestions) {
    const id = s.id || `${s.category || 'other'}-${(s.page || 'site').replace(/\W+/g, '-')}`;
    if (existingIds.has(id)) continue;
    existingIds.add(id);
    const task = {
      id,
      category: s.category || 'content',
      priority: s.priority || 'medium',
      title: s.title || 'Automation suggestion',
      description: s.description || '',
      page: s.page || 'site-wide',
      impact: s.impact || '',
      safeToAutoApply: bucket === 'auto_apply_candidate',
      suggestedChange: null,
    };
    tasks.push(task);
    newTasks.push(task);
  }

  backlog.implementationTasks = tasks;
  return newTasks;
}

function main() {
  const startedAt = new Date().toISOString();
  log('Starting Automation Brain orchestration...');

  const auditReport = loadJson(APP_AUDIT_REPORT, null);
  const suggestionsFile = loadJson(APP_AUDIT_SUGGESTIONS, null);

  if (!auditReport || !suggestionsFile) {
    const reason = !auditReport ? 'no_audit_report' : 'no_suggestions_file';
    log(`Missing inputs for Automation Brain: ${reason}`);
    recordAutomationEvent({
      id: `automation-brain-${startedAt}`,
      timestamp: new Date().toISOString(),
      agent: 'ai-automation-brain-agent',
      category: 'audit',
      decision: 'skipped',
      summary: 'Skipped Automation Brain orchestration due to missing inputs.',
      meta: { reason },
    });
    return;
  }

  const suggestions = suggestionsFile.suggestions || [];
  const scored = suggestions.map((s) => {
    const classification = classifySuggestion(s);
    return { ...s, _score: classification.score, _bucket: classification.bucket };
  });

  const autoApplyCandidates = scored
    .filter((s) => s._bucket === 'auto_apply_candidate')
    .sort((a, b) => b._score - a._score);

  const backlogCandidates = scored
    .filter((s) => s._bucket === 'backlog' || s._bucket === 'backlog_high')
    .sort((a, b) => b._score - a._score);

  log(
    `Classified ${scored.length} suggestions into ${autoApplyCandidates.length} auto-apply candidates and ${backlogCandidates.length} backlog items.`,
  );

  // Delegate auto-apply to existing implementation agent if we have any candidates
  let autoApplyResult = null;
  if (autoApplyCandidates.length > 0) {
    autoApplyResult = runCommand(
      'AUTO_COMMIT=0 node automation/ai-app-audit-implementation-agent.cjs run',
      'app-audit-implementation-agent (delegated by Automation Brain)',
    );
  }

  // Append backlog tasks
  const backlog = loadBacklog();
  const newBacklogTasks = appendBacklogTasks(backlog, backlogCandidates, 'backlog');
  saveBacklog(backlog);

  const finishedAt = new Date().toISOString();

  recordAutomationEvent({
    id: `automation-brain-${startedAt}`,
    timestamp: finishedAt,
    agent: 'ai-automation-brain-agent',
    category: 'audit',
    decision: autoApplyCandidates.length > 0 ? 'auto_applied' : 'backlog_only',
    summary: `Automation Brain processed ${scored.length} suggestions (${autoApplyCandidates.length} auto-apply candidates, ${newBacklogTasks.length} added to backlog).`,
    meta: {
      totalSuggestions: scored.length,
      autoApplyCandidates: autoApplyCandidates.length,
      backlogAdded: newBacklogTasks.length,
      autoApplyOk: autoApplyResult ? autoApplyResult.ok : null,
    },
  });
}

if (require.main === module) {
  try {
    main();
  } catch (e) {
    log(`Fatal error in Automation Brain: ${e.message}`);
    recordAutomationEvent({
      id: `automation-brain-error-${new Date().toISOString()}`,
      timestamp: new Date().toISOString(),
      agent: 'ai-automation-brain-agent',
      category: 'other',
      decision: 'needs_review',
      summary: 'Automation Brain agent crashed.',
      meta: { error: e.message },
    });
    process.exit(1);
  }
}

