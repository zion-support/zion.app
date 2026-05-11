#!/usr/bin/env node

/**
 * Merge Live App (UX Audit) ideas into app-evolution-backlog.json.
 * Reads automation/reports/live-site-ux-audit-latest.json (ideas from failed checks)
 * and adds them as implementationTasks with source 'live_site_ux_audit'.
 *
 * Run after ai-live-site-ux-audit-agent. Can be used in evolution pipeline or weekly audit.
 * Env: MERGE_TO_BACKLOG=1 (default), DRY_RUN=1 to preview only.
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const DATA_DIR = path.join(ROOT, 'automation', 'data');
const UX_AUDIT_FILE = path.join(REPORTS_DIR, 'live-site-ux-audit-latest.json');
const BACKLOG_FILE = path.join(DATA_DIR, 'app-evolution-backlog.json');

const MERGE_TO_BACKLOG = process.env.MERGE_TO_BACKLOG !== '0';
const DRY_RUN = process.env.DRY_RUN === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[MergeLiveAppIdeas] ${ts} | ${msg}`);
}

function readJsonSafe(p, def = null) {
  try {
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    log(`Could not read ${p}: ${e.message}`);
  }
  return def;
}

function slug(id) {
  return (id || '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '')
    .slice(0, 50);
}

function run() {
  if (!fs.existsSync(UX_AUDIT_FILE)) {
    log('No live-site-ux-audit report; run app:ux-audit first.');
    return { merged: 0 };
  }

  const ux = readJsonSafe(UX_AUDIT_FILE, {});
  const ideas = ux.ideas || [];
  if (ideas.length === 0) {
    log('No ideas in UX audit report.');
    return { merged: 0 };
  }

  const backlog = readJsonSafe(BACKLOG_FILE, {
    ideas: [],
    quickWins: [],
    newIdeas: [],
    implementationTasks: [],
  });
  const tasks = backlog.implementationTasks || [];
  const existingIds = new Set(tasks.map((t) => t.id));

  let merged = 0;
  for (const idea of ideas) {
    const title = typeof idea === 'string' ? idea : (idea.title || idea.description || idea);
    const id = `live-ux-${slug(title)}`;
    if (existingIds.has(id)) continue;
    existingIds.add(id);
    tasks.push({
      id,
      category: 'ux',
      priority: 'medium',
      title: typeof idea === 'string' ? idea : (idea.title || 'Live UX improvement'),
      description: typeof idea === 'string' ? idea : (idea.description || idea.title || ''),
      page: '/',
      impact: 'Improved UX and SEO from live site audit',
      safeToAutoApply: false,
      source: 'live_site_ux_audit',
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
      evolutionIdeasFromLiveUxAudit: new Date().toISOString(),
    };
    fs.mkdirSync(path.dirname(BACKLOG_FILE), { recursive: true });
    fs.writeFileSync(BACKLOG_FILE, JSON.stringify(updated, null, 2));
    log(`Merged ${merged} live UX idea(s) into ${BACKLOG_FILE}`);
  } else if (DRY_RUN) {
    log(`DRY_RUN: would merge ${merged} idea(s).`);
  }

  return { merged };
}

run();
