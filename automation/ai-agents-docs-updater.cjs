#!/usr/bin/env node

/**
 * AI Agents Docs Updater
 *
 * Reads automation configuration and recent AutomationEvents and generates
 * a JSON snapshot that can be used to render an Automation & AI Agents
 * overview page (list of agents, categories, and recent activity).
 *
 * This script is read/write inside automation/, but does NOT touch app/
 * directly; page components should consume the generated JSON.
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const AUTOMATION_DIR = path.join(ROOT, 'automation');
const REPORTS_DIR = path.join(AUTOMATION_DIR, 'reports');
const DOCS_FILE = path.join(REPORTS_DIR, 'ai-agents-docs-latest.json');
const TIMELINE_FILE = path.join(REPORTS_DIR, 'automation-timeline.json');

function log(msg) {
  const ts = new Date().toISOString();
   
  console.log(`[AgentsDocs] ${ts} | ${msg}`);
}

function readJsonSafe(p, fallback) {
  try {
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf8'));
    }
  } catch (e) {
    log(`Failed to read ${p}: ${e.message}`);
  }
  return fallback;
}

function collectAgents() {
  // Lightweight static list for now; can be expanded to read from config files.
  return [
    {
      id: 'ai-continuous-improvement-agent',
      name: 'AI Continuous Improvement Agent (ACIA)',
      role: 'Continuously analyzes codebase health, applies safe fixes, and auto-commits/pushes improvements.',
      categories: ['code_quality', 'performance', 'security', 'seo', 'accessibility'],
    },
    {
      id: 'ai-site-improvement-agent',
      name: 'AI Site Improvement Agent',
      role: 'Runs a daily quick improvement pipeline and low-risk app audits for content/SEO tweaks.',
      categories: ['site_health', 'content', 'seo'],
    },
    {
      id: 'ai-app-improvement-orchestrator',
      name: 'AI App Improvement Orchestrator',
      role: 'Runs the full app improvement pipeline from live audit to evolution ideas and implementation.',
      categories: ['audit', 'evolution', 'implementation'],
    },
    {
      id: 'ai-development-agent',
      name: 'AI Development Agent',
      role: 'Performs deeper codebase analysis and development-focused improvements on a schedule.',
      categories: ['code_quality', 'refactoring'],
    },
  ];
}

function main() {
  const agents = collectAgents();
  const timeline = readJsonSafe(TIMELINE_FILE, { events: [] });
  const events = Array.isArray(timeline.events) ? timeline.events : [];

  const byAgent = {};
  for (const ev of events) {
    if (!ev || !ev.agent) continue;
    if (!byAgent[ev.agent]) {
      byAgent[ev.agent] = [];
    }
    byAgent[ev.agent].push(ev);
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    agents: agents.map((agent) => {
      const recentEvents = byAgent[agent.id] || [];
      const lastEvent = recentEvents[recentEvents.length - 1] || null;
      return {
        ...agent,
        recentEvents: recentEvents.slice(-10),
        lastEvent,
      };
    }),
  };

  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }

  fs.writeFileSync(DOCS_FILE, JSON.stringify(payload, null, 2));
  log(`Wrote agents docs snapshot to ${DOCS_FILE}`);
}

if (require.main === module) {
  main();
}

