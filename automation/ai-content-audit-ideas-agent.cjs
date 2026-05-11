#!/usr/bin/env node

/**
 * AI Content Audit & Ideas Agent
 *
 * Audits ziontechgroup.com, fetches key pages, sends to OpenRouter LLM for
 * content opportunity analysis. Outputs actionable ideas (blog, industries,
 * case studies) and can auto-apply via front-page expansion.
 *
 * Run: npm run content:audit-ideas
 *      (Ollama or OPENROUTER_API_KEY) | AUTO_APPLY=1 to apply via front page agent
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { createLLMClient } = require('./lib/openrouter-client.cjs');

const SITE_URL = 'https://ziontechgroup.com';
const PAGES = [
  '/',
  '/solutions',
  '/services',
  '/blog',
  '/case-studies',
  '/ai-services',
  '/industries',
];
const REPORT_PATH = path.join(__dirname, 'reports', 'content-audit-ideas-latest.json');

function ensureDirs() {
  const dir = path.dirname(REPORT_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let loc = res.headers.location;
        if (loc && (res.statusCode === 301 || res.statusCode === 302)) {
          fetchPage(loc.startsWith('http') ? loc : new URL(loc, url).href)
            .then(resolve)
            .catch(reject);
          return;
        }
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
      })
      .on('error', reject);
  });
}

async function run() {
  ensureDirs();

  const client = createLLMClient({
    openrouterModel: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.2-3b-instruct:free',
  });
  if (!client.isConfigured()) {
    console.error('No LLM available. Start Ollama (ollama serve, ollama pull llama3.2:3b) or set OPENROUTER_API_KEY.');
    process.exit(1);
  }

  console.log('Auditing ziontechgroup.com...');
  const pages = await Promise.all(
    PAGES.map((p) =>
      fetchPage(SITE_URL + p)
        .then((html) => ({ path: p, html: html.slice(0, 4000) }))
        .catch((err) => ({ path: p, html: '', error: err.message }))
    )
  );

  const content = pages
    .map((p) => `--- ${p.path} ---\n${p.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}`)
    .join('\n\n');

  const prompt = `You are a content strategist for Zion Tech Group (ziontechgroup.com), an AI solutions and engineering services company.

AUDIT SITE CONTENT (first ~4000 chars per page):

${content.slice(0, 20000)}

Based on this audit, suggest NEW content ideas to create more content automatically and as fast as possible.
Focus on: gaps (missing industries, topics), trending AI/automation themes, SEO opportunities, case study angles.

Return ONLY valid JSON (no markdown) with this structure:

{
  "blogTopics": [
    {
      "title": "Full article title",
      "category": "Industry Guide | Technical Guide | AI Trends | Business Strategy",
      "icon": "emoji",
      "rationale": "Why this topic now"
    }
  ],
  "industryIdeas": [
    {
      "industry": "Industry Name",
      "rationale": "Why add this vertical"
    }
  ],
  "caseStudyIdeas": [
    {
      "title": "Company/Industry Achieves X% Improvement",
      "industry": "Industry",
      "rationale": "Why this case study"
    }
  ],
  "quickWins": [
    "Short actionable item (e.g. Add FAQ about X)"
  ],
  "priority": "high|medium|low"
}

Suggest 5 blog topics, 3 industries, 2 case study ideas, 3 quick wins. Be specific and actionable.`;

  const response = await client.chat(prompt, {
    systemPrompt: 'You are a content strategist. Return ONLY valid JSON. No markdown code blocks.',
    temperature: 0.8,
    maxTokens: 4096,
  });

  let jsonStr = response.trim();
  const codeBlock = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) jsonStr = codeBlock[1].trim();

  const ideas = JSON.parse(jsonStr);
  ideas.auditedAt = new Date().toISOString();
  ideas.model = 'openrouter/free';

  fs.writeFileSync(REPORT_PATH, JSON.stringify(ideas, null, 2));
  console.log('Ideas saved to', REPORT_PATH);
  console.log('Blog topics:', ideas.blogTopics?.length || 0);
  console.log('Industries:', ideas.industryIdeas?.length || 0);
  console.log('Case studies:', ideas.caseStudyIdeas?.length || 0);
  console.log('Quick wins:', ideas.quickWins?.length || 0);

  return ideas;
}

if (require.main === module) {
  run().catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}

module.exports = { run };
