#!/usr/bin/env node

/**
 * Merge GitHub Actions audit app ideas into app-evolution-backlog.json.
 * Reads automation/data/github-actions-audit-suggestions.json (appAutomationIdeas)
 * and adds them as implementationTasks with source 'github_actions_audit'.
 *
 * Run after ai-github-actions-audit-agent. Used in ai-github-actions-audit.yml.
 * Env: MERGE_TO_BACKLOG=1 (default), DRY_RUN=1 to preview only.
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'automation', 'data');
const SUGGESTIONS_FILE = path.join(DATA_DIR, 'github-actions-audit-suggestions.json');
const BACKLOG_FILE = path.join(DATA_DIR, 'app-evolution-backlog.json');

const MERGE_TO_BACKLOG = process.env.MERGE_TO_BACKLOG !== '0';
const DRY_RUN = process.env.DRY_RUN === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[MergeAppIdeas] ${ts} | ${msg}`);
}

function readJsonSafe(p, def = null) {
  try {
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    log(`Could not read ${p}: ${e.message}`);
  }
  return def;
}

function run() {
  if (!fs.existsSync(SUGGESTIONS_FILE)) {
    log('No suggestions file; run actions:audit first.');
    return { merged: 0 };
  }

  const suggestions = readJsonSafe(SUGGESTIONS_FILE, {});
  const ideas = suggestions.appAutomationIdeas || [];
  if (ideas.length === 0) {
    log('No appAutomationIdeas to merge.');
    return { merged: 0 };
  }

  const backlog = readJsonSafe(BACKLOG_FILE, { ideas: [], quickWins: [], newIdeas: [], implementationTasks: [] });
  const tasks = backlog.implementationTasks || [];
  const existingIds = new Set(tasks.map((t) => t.id));

  let merged = 0;
  for (const idea of ideas) {
    const id = (idea.id || `gh-${(idea.title || '').replace(/\s+/g, '-').toLowerCase().slice(0, 40)}`).replace(/[^a-z0-9-_]/gi, '-');
    if (existingIds.has(id)) continue;
    existingIds.add(id);
    tasks.push({
      id,
      category: idea.category || 'automation',
      priority: (idea.priority || 'medium').toLowerCase(),
      title: idea.title || 'App automation idea',
      description: idea.description || idea.implementation || '',
      page: 'site-wide',
      impact: idea.impact || 'App improvement and evolution',
      safeToAutoApply: false,
      source: 'github_actions_audit',
    });
    merged++;
  }

  if (merged === 0) {
    log('No new ideas to add (all already in backlog).');
    return { merged: 0 };
  }

  if (MERGE_TO_BACKLOG && !DRY_RUN) {
    const updated = {
      ...backlog,
      implementationTasks: tasks,
      updatedAt: new Date().toISOString(),
      evolutionIdeasFromGitHubActionsAudit: new Date().toISOString(),
    };
    fs.writeFileSync(BACKLOG_FILE, JSON.stringify(updated, null, 2));
    log(`Merged ${merged} app idea(s) into ${BACKLOG_FILE}`);
  } else if (DRY_RUN) {
    log(`DRY_RUN: would merge ${merged} idea(s).`);
  }

  return { merged };
}

run();
