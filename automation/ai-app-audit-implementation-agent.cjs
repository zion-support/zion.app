#!/usr/bin/env node

/**
 * AI App Audit Implementation Agent
 *
 * Reads app-audit-suggestions.json (from ai-app-audit-automation-agent) and
 * applies safe, high-priority improvements to the app. Runs after app audit.
 *
 * Applied improvements:
 * - Meta tag enhancements (keywords, descriptions)
 * - CTA prominence (already handled by manual hero update)
 * - Logs applied changes for audit trail
 *
 * Environment:
 *   DRY_RUN=1 - Log what would be applied, don't modify files
 *   AUTO_COMMIT=1 - Commit applied changes (requires GH_TOKEN)
 *
 * Runs: After app audit, or workflow_dispatch
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { recordAutomationEvent } = require('./lib/automation-brain-types.cjs');

const ROOT = process.cwd();
const AUTOMATION_DIR = path.join(ROOT, 'automation');
const DATA_DIR = path.join(AUTOMATION_DIR, 'data');
const REPORTS_DIR = path.join(AUTOMATION_DIR, 'reports');
const SUGGESTIONS_FILE = path.join(DATA_DIR, 'app-audit-suggestions.json');
const REPORT_FILE = path.join(REPORTS_DIR, 'app-audit-implementation-latest.json');
const CONFIG_FILE = path.join(AUTOMATION_DIR, 'app-audit.config.json');

const DRY_RUN = process.env.DRY_RUN === '1';
const AUTO_COMMIT = process.env.AUTO_COMMIT === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[AppAuditImpl] ${ts} | ${msg}`);
}

function ensureDirs() {
  [REPORTS_DIR, DATA_DIR].forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });
}

function loadConfig() {
  const defaultConfig = {
    enabledCategories: ['content', 'ux', 'seo', 'performance', 'conversion', 'feature'],
    minPriority: 'medium',
    maxSuggestions: 40,
    quickWinsPerPage: 5,
    requireHighPrioritySeoForApply: true,
  };

  if (!fs.existsSync(CONFIG_FILE)) {
    return defaultConfig;
  }

  try {
    const raw = fs.readFileSync(CONFIG_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      ...defaultConfig,
      ...parsed,
      enabledCategories: parsed.enabledCategories || defaultConfig.enabledCategories,
    };
  } catch (e) {
    log(`Failed to load config, using defaults: ${e.message}`);
    return defaultConfig;
  }
}

function loadSuggestions() {
  if (!fs.existsSync(SUGGESTIONS_FILE)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(SUGGESTIONS_FILE, 'utf8'));
  } catch (e) {
    log(`Failed to load suggestions: ${e.message}`);
    return null;
  }
}

function applyMetaEnhancements() {
  const metadataPath = path.join(ROOT, 'app', 'constants', 'metadata.ts');
  if (!fs.existsSync(metadataPath)) return { applied: 0, changes: [] };

  let content = fs.readFileSync(metadataPath, 'utf8');
  const changes = [];

  // Ensure keywords include conversion-related terms
  if (!content.includes('consulting') && content.includes('keywords:')) {
    const kwMatch = content.match(/keywords:\s*'([^']+)'/);
    if (kwMatch) {
      const existing = kwMatch[1];
      const enhanced = existing + ', consulting, implementation';
      content = content.replace(
        /keywords:\s*'[^']+'/,
        `keywords: '${enhanced}'`
      );
      changes.push({ type: 'meta-keywords', detail: 'Added consulting, implementation' });
    }
  }

  if (changes.length > 0 && !DRY_RUN) {
    fs.writeFileSync(metadataPath, content);
  }
  return { applied: changes.length, changes };
}

function run() {
  ensureDirs();
  log('Starting app audit implementation...');

  const config = loadConfig();

  const suggestions = loadSuggestions();
  if (!suggestions) {
    log('No suggestions file. Run app:audit first.');
    const report = {
      timestamp: new Date().toISOString(),
      status: 'skipped',
      reason: 'no_suggestions',
      applied: 0,
    };
    fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));

    recordAutomationEvent({
      id: `app-audit-impl-${report.timestamp}`,
      timestamp: report.timestamp,
      agent: 'ai-app-audit-implementation-agent',
      category: 'implementation',
      decision: 'skipped',
      summary: 'Skipped app audit implementation because no suggestions file was found.',
      meta: {
        reason: report.reason,
      },
    });

    return report;
  }

  const enabledCategories = config.enabledCategories || ['content', 'ux', 'seo', 'performance', 'conversion', 'feature'];
  const priorityWeight = (priority) => {
    if (priority === 'high') return 3;
    if (priority === 'medium') return 2;
    if (priority === 'low') return 1;
    return 1;
  };
  const minPriorityWeight = priorityWeight(config.minPriority || 'medium');

  const eligibleSuggestions = (suggestions.suggestions || []).filter((s) => {
    const category = (s.category || 'content').toLowerCase();
    const prio = priorityWeight((s.priority || 'medium').toLowerCase());
    return enabledCategories.includes(category) && prio >= minPriorityWeight;
  });

  const highPrioritySeo = eligibleSuggestions.filter(
    (s) => (s.priority || '').toLowerCase() === 'high' && (s.category || '').toLowerCase() === 'seo',
  );

  const shouldApplyMeta =
    !config.requireHighPrioritySeoForApply || highPrioritySeo.length > 0;

  let totalApplied = 0;
  const appliedChanges = [];

  if (shouldApplyMeta) {
    const metaResult = applyMetaEnhancements();
    totalApplied += metaResult.applied;
    appliedChanges.push(...metaResult.changes);
  } else {
    log('Config requires high-priority SEO suggestions and none were found. No changes applied.');
  }

  const report = {
    timestamp: new Date().toISOString(),
    status: totalApplied > 0 ? 'applied' : 'no_changes',
    suggestionsCount: (suggestions.suggestions || []).length,
    highPriorityCount: highPrioritySeo.length,
    applied: totalApplied,
    changes: appliedChanges,
    dryRun: DRY_RUN,
    configSnapshot: {
      enabledCategories,
      minPriority: config.minPriority,
      maxSuggestions: config.maxSuggestions,
      quickWinsPerPage: config.quickWinsPerPage,
      requireHighPrioritySeoForApply: config.requireHighPrioritySeoForApply,
    },
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Report: ${REPORT_FILE}`);
  log(`Applied: ${totalApplied} changes`);

  // Emit an AutomationEvent describing what was applied (or not)
  recordAutomationEvent({
    id: `app-audit-impl-${report.timestamp}`,
    timestamp: report.timestamp,
    agent: 'ai-app-audit-implementation-agent',
    category: 'implementation',
    decision: report.status === 'applied' ? 'auto_applied' : 'no_changes',
    summary:
      report.status === 'applied'
        ? `Applied ${report.applied} automated meta enhancements from app audit suggestions.`
        : 'No meta enhancements were applied from app audit suggestions.',
    meta: {
      suggestionsCount: report.suggestionsCount,
      highPriorityCount: report.highPriorityCount,
      applied: report.applied,
      dryRun: report.dryRun,
    },
  });

  if (AUTO_COMMIT && totalApplied > 0 && !DRY_RUN) {
    try {
      execSync('git add -A && git diff --cached --quiet || git commit -m "chore(automation): apply app audit meta enhancements"', {
        cwd: ROOT,
        stdio: 'inherit',
      });
      log('Committed changes');
    } catch (e) {
      log(`Commit failed: ${e.message}`);
    }
  }

  return report;
}

const cmd = process.argv[2] || 'run';
if (cmd === 'run') {
  run();
} else if (cmd === 'summary') {
  try {
    const data = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'));
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.log('No report found. Run with "run" first.');
  }
} else {
  console.log('Usage: node ai-app-audit-implementation-agent.cjs [run|summary]');
  process.exit(1);
}
