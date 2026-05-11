#!/usr/bin/env node

/**
 * AI Advanced-AI Ideas Agent
 *
 * Continuously proposes new content and improvement ideas for advanced AI solutions,
 * so the autonomous content engine has a growing backlog of high-signal topics.
 *
 * Responsibilities:
 * - Read the current advanced-AI topics config and recent generated blog history.
 * - Ask the LLM for a small batch of NEW topic ideas (titles, audience, angle).
 * - Append them to `automation/reports/advanced-ai-ideas-log.json`.
 *
 * This agent does NOT change the config directly and does NOT commit or push.
 * Orchestrators decide what to implement from the ideas log.
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const fs = require('fs');
const path = require('path');
const { createLLMClient } = require('./lib/llm-client.cjs');

const ROOT = process.cwd();
const CONFIG_PATH = path.join(__dirname, 'config', 'advanced-ai-topics.json');
const DATA_DIR = path.join(__dirname, 'data');
const REPORTS_DIR = path.join(__dirname, 'reports');
const HISTORY_PATH = path.join(__dirname, 'data', 'openrouter-generated-content.json');
const IDEAS_LOG_PATH = path.join(REPORTS_DIR, 'advanced-ai-ideas-log.json');

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[AdvancedAIIdeas] ${ts} | ${msg}`);
}

function ensureDirs() {
  [DATA_DIR, REPORTS_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
}

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(`Config not found at ${CONFIG_PATH}`);
  }
  const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed.topics) ? parsed.topics : [];
}

function loadHistory() {
  if (!fs.existsSync(HISTORY_PATH)) {
    return { runs: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf8'));
  } catch {
    return { runs: [] };
  }
}

function loadIdeasLog() {
  if (!fs.existsSync(IDEAS_LOG_PATH)) {
    return { runs: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(IDEAS_LOG_PATH, 'utf8'));
  } catch {
    return { runs: [] };
  }
}

function saveIdeasLog(state) {
  fs.writeFileSync(IDEAS_LOG_PATH, JSON.stringify(state, null, 2));
}

function buildPrompt(topics, history) {
  const existingTitles = new Set(
    topics.map((t) => t.title).filter(Boolean)
  );

  const generatedTitles = new Set();
  for (const run of history.runs || []) {
    for (const r of run.results || []) {
      if (r.title) generatedTitles.add(r.title);
    }
  }

  const summaryLines = [];
  summaryLines.push('Existing advanced-AI topic pillars:');
  topics.slice(0, 20).forEach((t) => {
    summaryLines.push(
      `- ${t.title} (priority: ${t.priority || 'medium'}, primary: ${
        t.targetRoutes?.primaryService || 'n/a'
      })`,
    );
  });

  summaryLines.push('');
  summaryLines.push('Recently generated blog titles:');
  Array.from(generatedTitles)
    .slice(0, 40)
    .forEach((title) => summaryLines.push(`- ${title}`));

  const summary = summaryLines.join('\n');

  return [
    summary,
    '',
    'Based on the pillars and existing content, propose 5–8 NEW high-value topics that:',
    '- Are clearly about advanced AI solutions (agents, RAG, multimodal, orchestration, governance, security, observability, regulated industries, foundation models, edge AI, enterprise platforms).',
    '- Do NOT duplicate existing titles, but can be adjacent or deeper cuts.',
    '- Are suitable for enterprise buyers and engineering/ops leadership.',
    '',
    'Return a strict JSON object with this shape:',
    '',
    '{',
    '  "ideas": [',
    '    {',
    '      "id": "string-short-identifier",',
    '      "title": "Full blog/page title",',
    '      "priority": "critical|high|medium|low",',
    '      "audience": "Who this is for",',
    '      "angle": "What is unique about this angle vs existing topics",',
    '      "suggestedCategory": "AI Trends|Technical Guide|Business Strategy|Security|Industry Guide",',
    '      "notes": "Short notes on how this should map to Zion routes (ai-services and/or solutions) and what architecture/implementation depth is expected."',
    '    }',
    '  ]',
    '}',
    '',
    'Do NOT include markdown or commentary. Only return JSON.',
  ].join('\n');
}

async function main() {
  ensureDirs();

  const topics = loadConfig();
  const history = loadHistory();

  const llm = createLLMClient({
    appName: 'Zion Advanced AI Ideas Agent',
  });
  if (!llm.isConfigured()) {
    log('No LLM configured; skipping ideas generation.');
    process.exit(0);
  }

  const info = llm.getProviderInfo();
  log(`LLM provider: ${info.provider || 'unknown'} (${info.model || 'n/a'})`);

  const prompt = buildPrompt(topics, history);
  const raw = await llm.chat(prompt, {
    systemPrompt:
      'You are an autonomous product strategist and AI solutions architect for Zion Tech Group. You propose concrete, high-value advanced AI topics for enterprise audiences.',
    maxTokens: 2048,
    temperature: 0.7,
  });

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    log(`Failed to parse LLM JSON: ${err.message}`);
    return;
  }

  if (!parsed || !Array.isArray(parsed.ideas) || !parsed.ideas.length) {
    log('No ideas returned from LLM.');
    return;
  }

  const ideasLog = loadIdeasLog();
  const run = {
    timestamp: new Date().toISOString(),
    provider: info.provider || null,
    model: info.model || null,
    ideas: parsed.ideas,
  };
  ideasLog.runs.push(run);
  saveIdeasLog(ideasLog);

  log(`Recorded ${parsed.ideas.length} new advanced-AI ideas.`);
}

main().catch((err) => {
  log(`Fatal error: ${err.message}`);
  process.exit(1);
});

