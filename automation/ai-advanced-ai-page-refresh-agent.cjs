#!/usr/bin/env node

/**
 * AI Advanced-AI Page Refresh Agent
 *
 * Uses `automation/config/advanced-ai-topics.json` to find key advanced-AI
 * service/solution pages (TSX) and refreshes their content using the shared
 * LLM client, while trying to preserve imports and overall layout.
 *
 * Behavior:
 * - Selects a small number of high-priority pages per run.
 * - Reads the existing TSX file.
 * - Calls LLM with instructions to improve ONLY textual content (hero copy,
 *   supporting sections, bullets) and to keep imports/exports/structure intact.
 * - Overwrites the file with the returned code when successful.
 * - Logs to `automation/reports/advanced-ai-refresh-log.json`.
 *
 * This agent does NOT commit or push. It is intended to be orchestrated by
 * pipelines or CI workflows that handle git operations and quality checks.
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const fs = require('fs');
const path = require('path');
const { createLLMClient } = require('./lib/llm-client.cjs');

const ROOT = process.cwd();
const CONFIG_PATH = path.join(__dirname, 'config', 'advanced-ai-topics.json');
const REPORTS_DIR = path.join(__dirname, 'reports');
const LOG_PATH = path.join(REPORTS_DIR, 'advanced-ai-refresh-log.json');

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[AdvancedAIRefresh] ${ts} | ${msg}`);
}

function ensureDirs() {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(`Config not found at ${CONFIG_PATH}`);
  }
  const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
  const parsed = JSON.parse(raw);
  const topics = Array.isArray(parsed.topics) ? parsed.topics : [];
  return {
    defaults: parsed.defaults || {},
    topics,
  };
}

function buildCandidatePages(config) {
  const candidates = [];
  for (const topic of config.topics) {
    if (!topic.targetRoutes) continue;
    const primary = topic.targetRoutes.primaryService;
    const relatedSolutions = Array.isArray(topic.targetRoutes.solutionRoutes)
      ? topic.targetRoutes.solutionRoutes
      : [];

    if (primary) {
      candidates.push({
        topicId: topic.id,
        topicTitle: topic.title,
        priority: topic.priority || 'medium',
        route: primary,
        file: path.join(ROOT, 'app', primary.replace(/^\//, ''), 'page.tsx'),
      });
    }

    for (const sol of relatedSolutions) {
      candidates.push({
        topicId: topic.id,
        topicTitle: topic.title,
        priority: topic.priority || 'medium',
        route: sol,
        file: path.join(ROOT, 'app', sol.replace(/^\//, ''), 'page.tsx'),
      });
    }
  }

  // Only keep pages that actually exist
  return candidates.filter((c) => fs.existsSync(c.file));
}

function selectPagesForRefresh(config, candidates) {
  const defaults = config.defaults || {};
  const maxPerRun =
    (defaults.maxPerRun && defaults.maxPerRun.refreshPages) != null
      ? defaults.maxPerRun.refreshPages
      : 2;

  const byPriority = {
    critical: [],
    high: [],
    medium: [],
    low: [],
  };

  for (const c of candidates) {
    const p = c.priority || 'medium';
    if (!byPriority[p]) byPriority[p] = [];
    byPriority[p].push(c);
  }

  const ordered = ['critical', 'high', 'medium', 'low'];
  const selected = [];
  for (const bucket of ordered) {
    for (const c of byPriority[bucket] || []) {
      if (selected.length >= maxPerRun) break;
      selected.push(c);
    }
    if (selected.length >= maxPerRun) break;
  }
  return selected;
}

function loadRefreshLog() {
  if (!fs.existsSync(LOG_PATH)) {
    return { runs: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(LOG_PATH, 'utf8'));
  } catch {
    return { runs: [] };
  }
}

function saveRefreshLog(logState) {
  fs.writeFileSync(LOG_PATH, JSON.stringify(logState, null, 2));
}

async function refreshSinglePage(llm, candidate) {
  const original = fs.readFileSync(candidate.file, 'utf8');

  const systemPrompt =
    'You are an expert front-end engineer and AI solutions copywriter for Zion Tech Group. You are editing a Next.js 16 App Router page.';

  const userPrompt = [
    `You are updating the content for the advanced AI route: ${candidate.route}`,
    '',
    `Topic: ${candidate.topicTitle}`,
    '',
    'Goals:',
    '- Improve clarity, depth, and concreteness of the copy about advanced AI capabilities.',
    '- Emphasize production-readiness, governance, security, and measurable outcomes.',
    '- Keep the overall layout, components, imports, and exports intact.',
    '',
    'Instructions:',
    '- ONLY change textual content (headings, paragraphs, bullet lists, microcopy).',
    '- Do NOT change import statements.',
    '- Do NOT change the default exported component name or its signature.',
    '- Do NOT change route links, href values, or TypeScript types.',
    '- Keep Tailwind and JSX structure consistent; you may add new sections if helpful, but within the existing layout patterns.',
    '- Maintain the same design language as the original file.',
    '',
    'Input file (TypeScript / TSX):',
    '```tsx',
    original,
    '```',
    '',
    'Return ONLY the full updated file contents as valid TypeScript/TSX. Do not add explanations or markdown fencing.',
  ].join('\n');

  const updated = await llm.chat(userPrompt, {
    systemPrompt,
    maxTokens: 4096,
    temperature: 0.6,
  });

  if (typeof updated !== 'string' || !updated.trim()) {
    throw new Error('LLM returned empty content');
  }

  fs.writeFileSync(candidate.file, updated);
}

async function main() {
  ensureDirs();

  const llm = createLLMClient({
    appName: 'Zion Advanced AI Page Refresh',
  });
  if (!llm.isConfigured()) {
    log('No LLM provider configured in llm-client; aborting refresh.');
    process.exit(0);
  }

  const config = loadConfig();
  const candidates = buildCandidatePages(config);
  if (!candidates.length) {
    log('No advanced-AI service or solution pages found to refresh.');
    return;
  }

  const selected = selectPagesForRefresh(config, candidates);
  log(`Refreshing ${selected.length} advanced-AI page(s) this run.`);

  const logState = loadRefreshLog();
  const runEntry = {
    timestamp: new Date().toISOString(),
    pages: [],
  };

  for (const candidate of selected) {
    const entry = {
      topicId: candidate.topicId,
      route: candidate.route,
      file: path.relative(ROOT, candidate.file),
      status: 'pending',
    };
    try {
      log(`Refreshing ${candidate.route} (${path.relative(ROOT, candidate.file)})...`);
      await refreshSinglePage(llm, candidate);
      entry.status = 'updated';
      log(`Updated ${candidate.route}`);
    } catch (err) {
      entry.status = 'error';
      entry.error = err.message;
      log(`Error refreshing ${candidate.route}: ${err.message}`);
    }
    runEntry.pages.push(entry);
  }

  logState.runs.push(runEntry);
  saveRefreshLog(logState);

  log('Advanced-AI page refresh run complete.');
}

main().catch((err) => {
  log(`Fatal error: ${err.message}`);
  process.exit(1);
});

