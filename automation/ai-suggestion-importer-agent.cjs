#!/usr/bin/env node

/**
 * AI Suggestion Importer Agent
 *
 * Reads ecosystem-suggestions.json and autonomously implements safe suggestions:
 * - Adds new cron jobs to automation.cron (if not already present)
 * - Creates GitHub workflow stubs for workflow suggestions
 * - Logs enhancements and new_agent suggestions for manual review
 *
 * Makes the ecosystem self-improving: ecosystem intel suggests, this agent applies.
 *
 * Runs: After ecosystem intelligence (e.g. daily 6:15 AM) or via GitHub Actions
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const AUTOMATION_DIR = path.join(ROOT, 'automation');
const CRON_FILE = path.join(AUTOMATION_DIR, 'cron', 'automation.cron');
const SUGGESTIONS_FILE = path.join(AUTOMATION_DIR, 'data', 'ecosystem-suggestions.json');
const WORKFLOWS_DIR = path.join(ROOT, '.github', 'workflows');
const CI_CD_PATH = path.join(ROOT, '.github', 'workflows', 'ci-cd.yml');
const REPORTS_DIR = path.join(AUTOMATION_DIR, 'reports');
const REPORT_FILE = path.join(REPORTS_DIR, 'suggestion-importer-latest.json');

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[SuggestionImporter] ${ts} | ${msg}`);
}

function readJsonSafe(p, def = null) {
  try {
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    log(`Warning: Could not read ${p}: ${e.message}`);
  }
  return def;
}

function extractCronCommand(implementation) {
  // "Add to cron: 0 3 * * 0 cd $ZION_ROOT && npm audit fix --audit-level=low"
  const m = implementation && implementation.match(/Add to cron:\s*(.+)/);
  return m ? m[1].trim() : null;
}

function cronLineExists(cronContent, searchPattern) {
  const lines = cronContent.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    if (trimmed.includes(searchPattern) || searchPattern.includes(trimmed)) return true;
  }
  return false;
}

function applyCronSuggestion(suggestion, cronContent) {
  const cmd = extractCronCommand(suggestion.implementation);
  if (!cmd) return { applied: false, reason: 'No cron command in implementation' };

  const searchPattern = cmd.includes('npm audit') ? 'npm audit' : cmd.split(' ').slice(4).join(' ').slice(0, 40);
  if (cronContent.includes(searchPattern) || cronLineExists(cronContent, searchPattern)) {
    return { applied: false, reason: 'Cron job already exists' };
  }

  const fullLine = cmd + ' >> automation/logs/suggestion-importer-cron.log 2>&1';

  const insertBefore = '# Telegram daily digest';
  const idx = cronContent.indexOf(insertBefore);
  const newContent = idx >= 0
    ? cronContent.slice(0, idx) + `# ${suggestion.title} (auto-added by suggestion-importer)\n${fullLine}\n\n` + cronContent.slice(idx)
    : cronContent.trimEnd() + '\n\n# ' + suggestion.title + '\n' + fullLine + '\n';

  return { applied: true, newContent, line: fullLine };
}

function run() {
  if (!fs.existsSync(SUGGESTIONS_FILE)) {
    log('No ecosystem-suggestions.json found. Run ecosystem:intel first.');
    return { applied: 0, skipped: 0, errors: [] };
  }

  const data = readJsonSafe(SUGGESTIONS_FILE, { suggestions: [] });
  const suggestions = data.suggestions || [];
  let cronContent = fs.existsSync(CRON_FILE) ? fs.readFileSync(CRON_FILE, 'utf8') : '';
  const results = [];
  let appliedCount = 0;

  for (const s of suggestions) {
    const result = { id: s.id, type: s.type, title: s.title, applied: false, reason: null };
    if (s.type === 'cron_job' && s.implementation) {
      const r = applyCronSuggestion(s, cronContent);
      result.applied = r.applied;
      result.reason = r.reason;
      if (r.applied && r.newContent) {
        fs.writeFileSync(CRON_FILE, r.newContent);
        cronContent = r.newContent;
        appliedCount++;
        log(`Applied cron: ${s.title}`);
      }
    } else if (s.type === 'workflow') {
      if (s.id === 'sitemap-on-deploy' && fs.existsSync(CI_CD_PATH)) {
        const ciContent = fs.readFileSync(CI_CD_PATH, 'utf8');
        result.applied = ciContent.includes('sitemap:validate');
        result.reason = result.applied ? 'Already in ci-cd.yml' : 'Add npm run sitemap:validate to ci-cd.yml';
      } else {
        result.reason = 'Workflow suggestions require manual review or workflow_dispatch';
      }
    } else if (s.type === 'new_agent' || s.type === 'enhancement') {
      result.reason = 'Requires code changes - logged for review';
    }
    results.push(result);
  }

  const report = {
    timestamp: new Date().toISOString(),
    applied: appliedCount,
    total: suggestions.length,
    results,
  };

  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Done. Applied ${appliedCount}/${suggestions.length} suggestions. Report: ${REPORT_FILE}`);
  return report;
}

const cmd = process.argv[2] || 'run';
if (cmd === 'run') {
  run();
} else {
  console.log('Usage: node ai-suggestion-importer-agent.cjs [run]');
  process.exit(1);
}
