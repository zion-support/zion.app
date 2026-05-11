#!/usr/bin/env node

/**
 * Automation Ideas From Live Audit
 *
 * Reads latest live-audit reports (UX, site links, nav, content audit ideas)
 * and generates automation improvement tasks for the app-evolution backlog.
 * No LLM required. Output tasks have source 'live_audit_automation_ideas'.
 *
 * Reports used (if present):
 *   - automation/reports/live-site-ux-audit-latest.json
 *   - automation/reports/site-link-audit-latest.json
 *   - automation/reports/live-navigation-audit-latest.json
 *   - automation/reports/content-audit-ideas-latest.json
 *   - automation/reports/layout-design-audit-latest.json
 *
 * Env: MERGE_TO_BACKLOG=1 (default), DRY_RUN=1 to preview only.
 * Run: npm run app:automation-ideas-from-live-audit
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const DATA_DIR = path.join(ROOT, 'automation', 'data');
const BACKLOG_FILE = path.join(DATA_DIR, 'app-evolution-backlog.json');

const MERGE_TO_BACKLOG = process.env.MERGE_TO_BACKLOG !== '0';
const DRY_RUN = process.env.DRY_RUN === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[AutomationIdeasLive] ${ts} | ${msg}`);
}

function readJsonSafe(p, def = null) {
  try {
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    log(`Could not read ${p}: ${e.message}`);
  }
  return def;
}

function slug(title) {
  return (title || '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '')
    .slice(0, 45);
}

function collectIdeas() {
  const ideas = [];

  const uxPath = path.join(REPORTS_DIR, 'live-site-ux-audit-latest.json');
  if (fs.existsSync(uxPath)) {
    const ux = readJsonSafe(uxPath, {});
    const failed = (ux.checks || []).filter((c) => !c.ok);
    if (failed.length > 0) {
      ideas.push({
        title: 'Run live UX audit more frequently',
        description: `Live UX audit had ${failed.length} failed check(s). Consider running ai-live-site-ux-audit daily or before each evolution run.`,
        category: 'automation',
      });
    }
    if ((ux.ideas || []).length > 0) {
      ideas.push({
        title: 'Apply live UX ideas via weekly auto-fix',
        description: 'Ensure merge-live-app-ideas-to-backlog runs in weekly live app audit auto-fix and evolution pipeline.',
        category: 'automation',
      });
    }
  }

  const linkPath = path.join(REPORTS_DIR, 'site-link-audit-latest.json');
  if (fs.existsSync(linkPath)) {
    const link = readJsonSafe(linkPath, {});
    const broken = link.broken ?? link.brokenLinks?.length ?? 0;
    if (broken > 0) {
      ideas.push({
        title: 'Fix broken links from site link audit',
        description: `Site link audit reported ${broken} broken link(s). Ensure ai-weekly-live-link-audit and create-missing-pages run when broken > 0.`,
        category: 'automation',
      });
    }
    ideas.push({
      title: 'Keep site link audit in weekly auto-fix',
      description: 'Site link audit (audit + optional create-pages) should run in ai-weekly-live-app-audit-auto-fix and evolution pipeline.',
      category: 'automation',
    });
  }

  const navPath = path.join(REPORTS_DIR, 'live-navigation-audit-latest.json');
  if (fs.existsSync(navPath)) {
    const nav = readJsonSafe(navPath, {});
    const missing = nav.missingFromApp || nav.liveNotInNavSample || [];
    const missingCount = nav.liveNotInNavCount ?? missing.length;
    if (missingCount > 0) {
      ideas.push({
        title: 'Sync nav constants with live site',
        description: `Live navigation audit found ${missingCount} link(s) on live site not in app nav constants. Consider syncing or adding to navigation.`,
        category: 'automation',
      });
    }
    if ((nav.navBrokenCount ?? nav.navBroken?.length ?? 0) > 0) {
      ideas.push({
        title: 'Fix nav constants pointing to missing pages',
        description: `Live navigation audit found ${nav.navBrokenCount ?? nav.navBroken?.length} nav href(s) with no local page. Create pages or remove from navigation.`,
        category: 'automation',
      });
    }
    ideas.push({
      title: 'Run live navigation audit weekly',
      description: 'ai-weekly-live-navigation-audit (Fri 10 UTC) uploads report; use it to detect nav drift and update app/constants/navigation.',
      category: 'automation',
    });
  }

  const contentPath = path.join(REPORTS_DIR, 'content-audit-ideas-latest.json');
  if (fs.existsSync(contentPath)) {
    const content = readJsonSafe(contentPath, {});
    const contentIdeas = content.ideas || content.topics || [];
    if (contentIdeas.length > 0) {
      ideas.push({
        title: 'Feed content audit ideas into content pipelines',
        description: `Content audit produced ${contentIdeas.length} idea(s). Ensure content-ideas-deploy and content-max-velocity use content-audit-ideas report.`,
        category: 'automation',
      });
    }
  }

  const layoutPath = path.join(REPORTS_DIR, 'layout-design-audit-latest.json');
  if (fs.existsSync(layoutPath)) {
    const layout = readJsonSafe(layoutPath, {});
    const suggestions = layout.suggestions || [];
    const highPriority = suggestions.filter(
      (s) => s.priority === 'critical' || s.priority === 'high'
    );
    if (highPriority.length > 0) {
      ideas.push({
        title: 'Apply layout design audit high-priority fixes',
        description: `Layout design audit found ${highPriority.length} high/critical suggestion(s). Run layout:audit-apply or add to evolution backlog for implementation.`,
        category: 'layout',
      });
    }
    if (suggestions.length > 0) {
      ideas.push({
        title: 'Keep layout design audit in weekly auto-fix',
        description: 'Layout design audit and apply run in ai-weekly-live-app-audit-auto-fix; ensure layout-design-audit-latest.json feeds into evolution when suggestions exist.',
        category: 'automation',
      });
    }
  }

  return ideas;
}

function run() {
  const ideas = collectIdeas();
  if (ideas.length === 0) {
    log('No automation ideas derived from live audit reports.');
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
    const id = `live-audit-auto-${slug(idea.title)}`;
    if (existingIds.has(id)) continue;
    existingIds.add(id);
    tasks.push({
      id,
      category: idea.category || 'automation',
      priority: 'medium',
      title: idea.title,
      description: idea.description || '',
      page: 'site-wide',
      impact: 'App improvement and evolution via automation',
      safeToAutoApply: false,
      source: 'live_audit_automation_ideas',
    });
    merged++;
  }

  if (merged === 0) {
    log('No new automation ideas to add (all already in backlog).');
    return { merged: 0 };
  }

  if (MERGE_TO_BACKLOG && !DRY_RUN) {
    const updated = {
      ...backlog,
      implementationTasks: tasks,
      updatedAt: new Date().toISOString(),
      evolutionAutomationIdeasFromLiveAudit: new Date().toISOString(),
    };
    fs.mkdirSync(path.dirname(BACKLOG_FILE), { recursive: true });
    fs.writeFileSync(BACKLOG_FILE, JSON.stringify(updated, null, 2));
    log(`Merged ${merged} automation idea(s) into ${BACKLOG_FILE}`);
  } else if (DRY_RUN) {
    log(`DRY_RUN: would merge ${merged} automation idea(s).`);
  }

  return { merged };
}

run();
