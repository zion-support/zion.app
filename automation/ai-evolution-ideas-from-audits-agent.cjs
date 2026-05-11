#!/usr/bin/env node

/**
 * AI Evolution Ideas from Audits Agent
 *
 * Reads system-intelligence-audit-latest.json and conversion-funnel-audit-latest.json
 * and generates evolution ideas for the app improvement backlog.
 * Merges actionable suggestions into app-evolution-backlog.json.
 *
 * Outputs:
 *   automation/reports/evolution-ideas-from-audits-latest.json
 *   Merges into automation/data/app-evolution-backlog.json
 *
 * Run: npm run app:evolution-ideas-from-audits
 * Env: MERGE_TO_BACKLOG=1 (default) - merge ideas into backlog
 *      DRY_RUN=1 - preview only, do not write backlog
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const DATA_DIR = path.join(ROOT, 'automation', 'data');
const SYSTEM_INTEL_PATH = path.join(REPORTS_DIR, 'system-intelligence-audit-latest.json');
const CONVERSION_FUNNEL_PATH = path.join(REPORTS_DIR, 'conversion-funnel-audit-latest.json');
const BACKLOG_PATH = path.join(DATA_DIR, 'app-evolution-backlog.json');
const REPORT_PATH = path.join(REPORTS_DIR, 'evolution-ideas-from-audits-latest.json');

const MERGE_TO_BACKLOG = process.env.MERGE_TO_BACKLOG !== '0';
const DRY_RUN = process.env.DRY_RUN === '1';

const UNTRACKED_CTA_THRESHOLD = 30;

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[EvolutionFromAudits] ${ts} | ${msg}`);
}

function readJsonSafe(p, def = null) {
  try {
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    log(`Could not read ${p}: ${e.message}`);
  }
  return def;
}

function generateIdeasFromSystemIntel(si) {
  const ideas = [];
  const seen = new Set();

  const intelIdeas = si?.ideas || [];
  const score = si?.summary?.score ?? si?.score ?? si?.systemIntelligenceScore ?? null;

  if (score != null && score < 80) {
    ideas.push({
      id: 'audit-system-intel-low',
      category: 'seo',
      priority: 'high',
      title: 'Improve system intelligence score',
      description: `System intelligence score ${score}/100. Address meta, schema, CTA, and accessibility gaps.`,
      page: 'site-wide',
      impact: 'Better SEO, conversion, and engagement signals',
      safeToAutoApply: false,
      source: 'system_intelligence_audit',
    });
    seen.add('audit-system-intel-low');
  }

  for (const { page, idea } of intelIdeas) {
    const slug = `audit-si-${(page || 'site').replace(/\s+/g, '-').toLowerCase()}-${(idea || '').slice(0, 30).replace(/\s+/g, '-')}`;
    if (seen.has(slug)) continue;
    seen.add(slug);
    ideas.push({
      id: slug,
      category: 'seo',
      priority: 'medium',
      title: idea || 'System intelligence improvement',
      description: `Page: ${page || 'site-wide'}. ${idea}`,
      page: page || 'site-wide',
      impact: 'Improved UX and SEO',
      safeToAutoApply: false,
      source: 'system_intelligence_audit',
    });
  }

  return ideas;
}

function generateIdeasFromConversionFunnel(cf) {
  const ideas = [];
  const untracked = cf?.untrackedCount ?? cf?.untracked ?? 0;

  if (untracked >= UNTRACKED_CTA_THRESHOLD) {
    ideas.push({
      id: 'audit-cta-untracked-high',
      category: 'conversion',
      priority: 'high',
      title: 'Implement CTA tracking for conversion funnel',
      description: `${untracked} untracked CTA(s). Add data-cta-event to key CTAs for GA4 tracking.`,
      page: 'site-wide',
      impact: 'Conversion funnel visibility and optimization',
      safeToAutoApply: true,
      source: 'conversion_funnel_audit',
    });
  } else if (untracked > 0) {
    ideas.push({
      id: 'audit-cta-untracked',
      category: 'conversion',
      priority: 'medium',
      title: 'Improve CTA tracking coverage',
      description: `${untracked} untracked CTA(s). Run conversion:cta-implement for targeted fixes.`,
      page: 'site-wide',
      impact: 'Complete conversion funnel tracking',
      safeToAutoApply: true,
      source: 'conversion_funnel_audit',
    });
  }

  return ideas;
}

function mergeIntoBacklog(backlog, newIdeas, newQuickWins, newNewIdeas) {
  const tasks = backlog.implementationTasks || [];
  const existingIds = new Set(tasks.map((t) => t.id));

  for (const idea of newIdeas) {
    if (!existingIds.has(idea.id)) {
      tasks.push(idea);
      existingIds.add(idea.id);
    }
  }

  const quickWins = [...new Set([...(backlog.quickWins || []), ...(newQuickWins || [])])];
  const newIdeasList = [...new Set([...(backlog.newIdeas || []), ...(newNewIdeas || [])])];

  return {
    ...backlog,
    ideas: backlog.ideas || [],
    quickWins,
    newIdeas: newIdeasList,
    implementationTasks: tasks,
    quickWinsPrioritized: backlog.quickWinsPrioritized || quickWins.slice(0, 5),
    evolutionRoadmap: backlog.evolutionRoadmap || [],
    updatedAt: new Date().toISOString(),
    evolutionIdeasFromAuditsRun: new Date().toISOString(),
  };
}

function run() {
  [REPORTS_DIR, DATA_DIR].forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  log('Reading audit reports...');
  const si = readJsonSafe(SYSTEM_INTEL_PATH);
  const cf = readJsonSafe(CONVERSION_FUNNEL_PATH);

  const ideasFromSi = generateIdeasFromSystemIntel(si);
  const ideasFromCf = generateIdeasFromConversionFunnel(cf);

  const allIdeas = [...ideasFromSi, ...ideasFromCf];
  const newQuickWins = [];
  const newNewIdeas = [];

  if (ideasFromSi.length > 0) {
    newNewIdeas.push('Address system intelligence audit findings (run system:intelligence-audit)');
  }
  if (ideasFromCf.length > 0) {
    newNewIdeas.push('Implement CTA tracking for conversion funnel (run conversion:cta-implement)');
  }

  const report = {
    timestamp: new Date().toISOString(),
    sources: {
      systemIntelligence: !!si,
      conversionFunnel: !!cf,
    },
    ideasGenerated: allIdeas.length,
    ideas: allIdeas,
    newQuickWins,
    newNewIdeas,
    mergedToBacklog: false,
  };

  if (allIdeas.length === 0) {
    log('No evolution ideas generated from audit reports.');
    report.message = 'No actionable ideas; audit reports may be missing or scores acceptable.';
    fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
    return report;
  }

  log(`Generated ${allIdeas.length} evolution idea(s).`);

  if (MERGE_TO_BACKLOG && !DRY_RUN) {
    const backlog = readJsonSafe(BACKLOG_PATH, {});
    const merged = mergeIntoBacklog(backlog, allIdeas, newQuickWins, newNewIdeas);
    fs.writeFileSync(BACKLOG_PATH, JSON.stringify(merged, null, 2));
    report.mergedToBacklog = true;
    log(`Merged into ${BACKLOG_PATH}`);
  } else if (DRY_RUN) {
    log('DRY_RUN: skipping backlog merge.');
  }

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  log(`Report: ${REPORT_PATH}`);
  return report;
}

const cmd = process.argv[2];
if (cmd === 'summary') {
  const r = readJsonSafe(REPORT_PATH);
  if (r) {
    console.log(JSON.stringify(r, null, 2));
  } else {
    console.log('No report. Run with "run" first.');
  }
} else {
  run();
}
