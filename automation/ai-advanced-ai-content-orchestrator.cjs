#!/usr/bin/env node

/**
 * AI Advanced-AI Content Orchestrator
 *
 * Uses `automation/config/advanced-ai-topics.json` to:
 * - Select a small batch of high-priority advanced-AI topics for NEW blog posts.
 * - Generate a dynamic topics JSON in `automation/reports/advanced-ai-blog-topics-latest.json`.
 * - Invoke `openrouter-content-generator.cjs` scoped to those topics.
 * - Trigger the advanced-AI page refresh agent for key service/solution routes.
 *
 * This script does NOT commit or push – it is designed to be called from
 * higher-level pipelines (e.g. ai-content-maximum-pipeline.cjs) and CI workflows.
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { createLLMClient } = require('./lib/llm-client.cjs');

const ROOT = process.cwd();
const CONFIG_PATH = path.join(__dirname, 'config', 'advanced-ai-topics.json');
const REPORTS_DIR = path.join(__dirname, 'reports');
const BLOG_DIR = path.join(ROOT, 'app', 'blog');
const IDEAS_LOG_PATH = path.join(REPORTS_DIR, 'advanced-ai-ideas-log.json');

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[AdvancedAIOrchestrator] ${ts} | ${msg}`);
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
  if (!topics.length) {
    throw new Error('No topics defined in advanced-ai-topics.json');
  }
  return {
    defaults: parsed.defaults || {},
    topics,
  };
}

function loadIdeasAsTopics() {
  if (!fs.existsSync(IDEAS_LOG_PATH)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(IDEAS_LOG_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    const runs = Array.isArray(parsed.runs) ? parsed.runs : [];
    const ideas = [];
    for (const run of runs) {
      for (const idea of run.ideas || []) {
        if (!idea || !idea.title) continue;
        ideas.push({
          id: idea.id || `idea-${Math.random().toString(36).slice(2, 8)}`,
          title: idea.title,
          priority: idea.priority || 'medium',
          audience: idea.audience || '',
          summary: idea.angle || idea.notes || '',
          blog: {
            preferredCategories: idea.suggestedCategory ? [idea.suggestedCategory] : ['Technical Guide'],
          },
          targetRoutes: {
            primaryService: '',
            relatedServices: [],
            solutionRoutes: [],
          },
          _source: 'ideas-log',
        });
      }
    }
    return ideas;
  } catch {
    return [];
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function topicHasBlogPage(topic) {
  const slugCandidates = [];
  if (topic.blog && Array.isArray(topic.blog.suggestedSlugs)) {
    slugCandidates.push(...topic.blog.suggestedSlugs);
  }
  slugCandidates.push(slugify(topic.title));

  return slugCandidates.some((slug) =>
    fs.existsSync(path.join(BLOG_DIR, slug, 'page.tsx'))
  );
}

function selectNewBlogTopics(config) {
  const defaults = config.defaults || {};
  const maxPerRun =
    (defaults.maxPerRun && defaults.maxPerRun.newBlog) != null
      ? defaults.maxPerRun.newBlog
      : 2;

  const byPriority = {
    critical: [],
    high: [],
    medium: [],
    low: [],
  };

  for (const t of config.topics) {
    if (topicHasBlogPage(t)) continue;
    const p = t.priority || 'medium';
    if (!byPriority[p]) byPriority[p] = [];
    byPriority[p].push(t);
  }

  const orderedBuckets = ['critical', 'high', 'medium', 'low'];
  const selected = [];
  for (const bucket of orderedBuckets) {
    for (const t of byPriority[bucket] || []) {
      if (selected.length >= maxPerRun) break;
      selected.push(t);
    }
    if (selected.length >= maxPerRun) break;
  }

  return selected;
}

function buildBlogTopicsPayload(topics) {
  return {
    blogTopics: topics.map((topic) => {
      const baseTitle = topic.title || 'Advanced AI Topic';
      const category =
        (topic.blog && topic.blog.preferredCategories && topic.blog.preferredCategories[0]) ||
        'Technical Guide';

      const icon = '🧠';

      const crossLinks = [];
      if (topic.targetRoutes && topic.targetRoutes.primaryService) {
        crossLinks.push(topic.targetRoutes.primaryService);
      }
      if (topic.targetRoutes && Array.isArray(topic.targetRoutes.relatedServices)) {
        crossLinks.push(...topic.targetRoutes.relatedServices);
      }

      const prompt = [
        `You are writing a deep, production-focused article for Zion Tech Group about "${baseTitle}".`,
        '',
        'Audience: senior engineering, data, security, and operations leaders evaluating advanced AI solutions.',
        '',
        'Write a ~1800 word article with the following structure:',
        '',
        '1. Problem Context – explain the real-world enterprise problems and constraints for this area.',
        '2. Architecture Overview – describe typical reference architectures, including components, data flows, and integration points.',
        '3. Implementation Patterns – outline 3–5 concrete implementation patterns with trade-offs.',
        '4. Risk & Compliance Considerations – cover security, governance, and regulatory aspects relevant to this topic.',
        '5. KPIs & Metrics – list measurable KPIs that teams should track when rolling this out.',
        '6. Example Workflows – provide 2–3 example workflows mapped to real departments (e.g., support, operations, finance).',
        '',
        'Constraints:',
        '- Assume the reader is familiar with basic AI concepts; focus on implementation detail and decision-making.',
        '- Use specific, concrete examples (not fluff) and avoid vendor-specific hard sells.',
        '- Where appropriate, reference internal routes such as:',
        crossLinks.length ? `  ${crossLinks.join(', ')}` : '  (use generic Zion AI services routes).',
        '- Maintain a neutral, advisory tone suitable for an enterprise blog.',
      ].join('\n');

      return {
        title: baseTitle,
        category,
        icon,
        prompt,
      };
    }),
  };
}

function writeTopicsReport(payload) {
  const outPath = path.join(REPORTS_DIR, 'advanced-ai-blog-topics-latest.json');
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
  return outPath;
}

function runNodeScript(scriptPath, label, extraEnv = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [scriptPath], {
      cwd: ROOT,
      env: { ...process.env, ...extraEnv },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => {
      stdout += d.toString();
      process.stdout.write(d);
    });
    child.stderr.on('data', (d) => {
      stderr += d.toString();
      process.stderr.write(d);
    });

    child.on('close', (code) => {
      const ok = code === 0;
      if (!ok) {
        log(`${label} exited with code ${code}`);
      }
      resolve({ ok, code, stdout, stderr });
    });
    child.on('error', (err) => {
      log(`${label} failed: ${err.message}`);
      reject(err);
    });
  });
}

async function runBlogGeneration(selectedTopics) {
  if (!selectedTopics.length) {
    log('No advanced-AI topics selected for new blog posts this run.');
    return { ok: true, skipped: true };
  }

  const payload = buildBlogTopicsPayload(selectedTopics);
  const topicsPath = writeTopicsReport(payload);
  log(
    `Prepared ${payload.blogTopics.length} advanced-AI blog topics at ${path.relative(
      ROOT,
      topicsPath
    )}`
  );

  const maxPosts = String(payload.blogTopics.length);
  const maxConcurrency = process.env.ADVANCED_AI_MAX_CONCURRENCY || '3';

  log('Invoking openrouter-content-generator.cjs for advanced-AI topics...');
  return runNodeScript('automation/openrouter-content-generator.cjs', 'AdvancedAI Blog', {
    TOPICS_JSON: topicsPath,
    MAX_POSTS: maxPosts,
    MAX_CONCURRENCY: maxConcurrency,
  });
}

async function runPageRefresh() {
  const llm = createLLMClient();
  if (!llm.isConfigured()) {
    log('Skipping page refresh (no LLM configured for llm-client).');
    return { ok: true, skipped: true };
  }

  log('Running advanced-AI page refresh agent...');
  return runNodeScript(
    'automation/ai-advanced-ai-page-refresh-agent.cjs',
    'AdvancedAI Page Refresh',
    {}
  );
}

async function main() {
  ensureDirs();

  const llm = createLLMClient();
  if (!llm.isConfigured()) {
    log('WARNING: No LLM configured; new advanced-AI content generation may fail.');
  } else {
    const info = llm.getProviderInfo();
    log(`LLM provider: ${info.provider || 'unknown'} (${info.model || 'n/a'})`);
  }

  const config = loadConfig();
  const ideaTopics = loadIdeasAsTopics();
  if (ideaTopics.length) {
    config.topics.push(...ideaTopics);
    log(`Loaded ${ideaTopics.length} additional topic(s) from ideas log.`);
  }

  const selectedNew = selectNewBlogTopics(config);

  log(
    `Selected ${selectedNew.length} advanced-AI topics for NEW blog posts (out of ${config.topics.length} total).`
  );

  const blogResult = await runBlogGeneration(selectedNew);
  const refreshResult = await runPageRefresh();

  const anyOk = (blogResult.ok || blogResult.skipped) && (refreshResult.ok || refreshResult.skipped);
  if (!anyOk) {
    log('Advanced-AI orchestrator completed with errors.');
    process.exit(1);
  }

  log('Advanced-AI orchestrator completed.');
}

main().catch((err) => {
  log(`Fatal error: ${err.message}`);
  process.exit(1);
});

