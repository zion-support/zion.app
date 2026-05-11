#!/usr/bin/env node

/**
 * AI Front Page Content Expansion Agent
 *
 * Uses OpenRouter LLM to generate new services and content for the main front page:
 * - 2 industry solutions
 * - 2 case study teasers
 * - 1 innovation bundle
 * - 2 platform page spotlights
 * - 2 FAQ items
 * - Momentum signals
 *
 * Uses local LLM (Ollama primary, OpenRouter fallback).
 * Run: npm run content:front-page-expand
 *      (Ollama: ollama serve, ollama pull llama3.2:3b — or set OPENROUTER_API_KEY)
 */

const fs = require('fs');
const path = require('path');
const { createLLMClient } = require('./lib/openrouter-client.cjs');

const PAGE_PATH = path.join(process.cwd(), 'app', 'page.tsx');
const CASE_STUDIES_PATH = path.join(process.cwd(), 'app', 'case-studies', 'page.tsx');
const DATA_DIR = path.join(__dirname, 'data');
const REPORT_PATH = path.join(__dirname, 'reports', 'front-page-expansion-latest.json');

const EXISTING_INDUSTRIES = [
  'Financial Services', 'Healthcare', 'E-Commerce & Retail', 'Real Estate & Property',
  'Legal & Professional Services', 'Education & Training', 'Manufacturing & Industrial',
  'Logistics & Supply Chain', 'Technology & SaaS', 'Media & Entertainment',
  'Energy & Utilities', 'Government & Public Sector', 'Hospitality & Travel',
  'Non-Profit & Social Impact', 'Insurance', 'Agriculture & Agritech',
  'Construction & Engineering', 'Mining & Natural Resources', 'Pharmaceuticals & Life Sciences',
  'Telecommunications', 'Automotive & Mobility', 'Aerospace & Defense', 'Maritime & Shipping',
  'Food & Beverage', 'Oil & Gas', 'Banking & Capital Markets', 'Environmental & Waste Management',
  'Gaming & Esports', 'Renewable Energy & Cleantech', 'Sports & Fitness', 'Consumer Goods & CPG',
  'Transportation & Fleet', 'Marketing & Advertising', 'Chemicals & Materials',
  'Electronics & Semiconductors', 'Space & Satellite', 'Textiles & Apparel',
  'Veterinary & Animal Health', 'Home Services & Contractors', 'Accounting & Tax Services',
  'Wholesale & Distribution', 'Asset Management & Investment', 'Restaurants & Food Service',
  'Asset Management', 'Beauty & Wellness', 'Packaging & Materials',   'Warehousing & 3PL',
  'Staffing & Recruiting',
  'Facilities & Property Management',
];

const EXISTING_BUNDLES = [
  'Customer Success Engine', 'Revenue Command Center', 'Autonomous Operations Desk',
  'Compliance-Ready Delivery Pod', 'Talent & Operations Hub', 'Content & Marketing Engine',
  'Supply Chain Intelligence', 'Content & Creative Engine', 'Engineering Velocity Hub',
  'Data & Analytics Engine', 'AI Operations Hub', 'Finance & Risk Intelligence',
  'Research & Development Hub', 'Smart Fleet & Operations Hub', 'Sustainability & ESG Intelligence',
  'AI Customer Intelligence Hub', 'AI Governance & Compliance Hub', 'AI Security & Threat Intelligence',
  'AI Wellness & Engagement Hub', 'AI Fleet & Marketing Intelligence', 'AI Quality & Supply Intelligence',
  'AI Orbital & Supply Intelligence', 'AI Care & Field Operations Hub', 'AI Accounting & Tax Hub',
];

const EXISTING_APPS = [
  'AI Document Processor', 'AI Meeting Assistant', 'AI Chatbot Builder', 'AI Customer Support Pro',
  'AI Lead Scoring', 'Smart CRM Automation', 'Workflow Automation', 'Security Shield',
  'AI Contract Analyzer', 'Cloud Vault', 'AI Recruitment Pro', 'AI Onboarding Pro',
  'AI Talent Analytics', 'AI SEO Optimizer', 'Content Studio', 'AI Marketing Automation',
  'AI Supply Chain Optimizer', 'AI Predictive Maintenance', 'Smart Inventory Manager',
  'AI Image Generator', 'AI Translation Service', 'AI Code Assistant', 'AI Code Reviewer',
  'DevOps Automation', 'AI Data Visualizer', 'AI Data Pipeline', 'AI Predictive Analytics',
  'AI Financial Forecaster', 'AI Fraud Detector', 'AI Risk Assessor', 'AI Document Analyzer',
  'AI Knowledge Base', 'AI Report Generator', 'Compliance Manager', 'AI Scheduling Assistant',
  'AI Content Moderator', 'AI Accounting Assistant', 'Invoice Genius',
];

function ensureDirs() {
  [DATA_DIR, path.dirname(REPORT_PATH)].forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });
}

function extractExistingContent() {
  const pageContent = fs.readFileSync(PAGE_PATH, 'utf8');
  const caseContent = fs.readFileSync(CASE_STUDIES_PATH, 'utf8');

  const industrySolutions = [...pageContent.matchAll(/industry: '([^']+)'/g)].map((m) => m[1]);
  const caseStudyTitles = [...caseContent.matchAll(/title: '([^']+)'/g)].map((m) => m[1]);
  const caseStudyIndustries = [...caseContent.matchAll(/industry: '([^']+)'/g)].map((m) => m[1]);

  return {
    industries: [...new Set(industrySolutions)],
    caseStudyTitles,
    caseStudyIndustries,
  };
}

function buildPrompt(existing) {
  const industriesToExclude = [...EXISTING_INDUSTRIES, ...existing.industries].join(', ');
  const bundlesToExclude = EXISTING_BUNDLES.join(', ');
  const appsToUse = EXISTING_APPS.slice(0, 25).join(', ');

  return `You are a content strategist for Zion Tech Group (ziontechgroup.com), an AI solutions and engineering services company. Generate NEW content for the front page. DO NOT repeat any existing industries or bundles.

EXISTING industries (DO NOT use): ${industriesToExclude}
EXISTING innovation bundles (DO NOT use): ${bundlesToExclude}
Available Zion AI apps to reference: ${appsToUse}

Return ONLY valid JSON (no markdown, no extra text) with this exact structure:

{
  "industrySolutions": [
    {
      "industry": "Industry Name",
      "icon": "emoji",
      "headline": "One-line value proposition",
      "description": "2-3 sentence description of AI workflows for this industry.",
      "apps": ["App1", "App2", "App3", "App4"],
      "href": "/solutions" or "/supply-chain-optimizer" or "/zion-ai-*"
    }
  ],
  "caseStudyTeasers": [
    {
      "title": "Company/Industry Achieves X% Improvement",
      "industry": "Industry Name",
      "result": "X% metric",
      "description": "One sentence on how Zion apps helped.",
      "icon": "emoji"
    }
  ],
  "caseStudies": [
    {
      "title": "Full case study title",
      "industry": "Industry Name",
      "result": "X% metric",
      "description": "2-3 sentence description.",
      "apps": ["App1", "App2"],
      "icon": "emoji"
    }
  ],
  "innovationBundle": {
    "title": "Bundle Name Hub",
    "description": "2-3 sentence description.",
    "impact": "Short impact phrase",
    "href": "/zion-ai-*",
    "cta": "Launch X bundle",
    "icon": "emoji",
    "modules": [
      {"name": "App Name", "href": "/zion-ai-*"},
      {"name": "App Name", "href": "/zion-ai-*"},
      {"name": "App Name", "href": "/zion-ai-*"}
    ]
  },
  "platformPageSpotlights": [
    {
      "title": "Page Title",
      "href": "/path",
      "description": "One sentence.",
      "tag": "AI Services" or "Industry" or "Collection"
    }
  ],
  "faqItems": [
    {
      "question": "Question about the new industries?",
      "answer": "Answer mentioning the new industries and bundle."
    }
  ],
  "momentumSignals": [
    "New [Bundle Name] innovation bundle",
    "[Industry1] and [Industry2] solutions",
    "43 industry verticals with tailored workflows"
  ]
}

Rules:
- Pick 2 NEW industries NOT in the existing list (e.g. Asset Management, Restaurants, Beauty & Wellness, Logistics Tech, Packaging, etc.)
- Use only app names from the available list
- href values MUST be existing routes only: /solutions, /services, /ai-services, /industries, /zion-ai-*, /supply-chain-optimizer. Do NOT use /asset-management, /restaurants, or other non-existent paths.
- Update vertical count to 45 in momentumSignals
- Be specific and professional`;
}

async function callLLM() {
  const client = createLLMClient({
    openrouterModel: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.2-3b-instruct:free',
  });
  if (!client.isConfigured()) {
    throw new Error('No LLM available. Start Ollama (ollama serve, ollama pull llama3.2:3b) or set OPENROUTER_API_KEY.');
  }

  const existing = extractExistingContent();
  const prompt = buildPrompt(existing);

  const response = await client.chat(prompt, {
    systemPrompt:
      'You are a content strategist. Return ONLY valid JSON. No markdown code blocks, no explanation.',
    temperature: 0.7,
    maxTokens: 4096,
  });

  // Strip markdown code blocks if present
  let jsonStr = response.trim();
  const codeBlock = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) jsonStr = codeBlock[1].trim();

  return JSON.parse(jsonStr);
}

function applyIndustrySolution(content, item) {
  const insertBefore = '];\n\nconst trustBadges';
  const block = `  {
    industry: '${item.industry.replace(/'/g, "\\'")}',
    icon: '${item.icon}',
    headline: '${item.headline.replace(/'/g, "\\'")}',
    description:
      '${item.description.replace(/'/g, "\\'")}',
    apps: [${item.apps.map((a) => `'${a}'`).join(', ')}],
    href: '${item.href}',
  },
`;
  if (content.includes(`industry: '${item.industry}'`)) return content;
  return content.replace(insertBefore, block + insertBefore);
}

function applyCaseStudyTeaser(content, item) {
  const insertBefore = '];\n\nconst quickJumpLinks';
  const marker = 'const caseStudyTeasers: CaseStudyTeaser[] = [';
  const start = content.indexOf(marker);
  const end = content.indexOf(insertBefore, start);
  const section = content.slice(start, end);
  if (section.includes(`title: '${item.title.replace(/'/g, "\\'")}'`)) return content;
  const block = `  {
    title: '${item.title.replace(/'/g, "\\'")}',
    industry: '${item.industry.replace(/'/g, "\\'")}',
    result: '${item.result.replace(/'/g, "\\'")}',
    description: '${item.description.replace(/'/g, "\\'")}',
    icon: '${item.icon}',
  },
`;
  return content.replace(insertBefore, block + insertBefore);
}

function applyInnovationBundle(content, item) {
  const insertBefore = '];\n\nconst momentumSignals';
  const modulesStr = item.modules
    .map((m) => `      { name: '${m.name}', href: '${m.href}' }`)
    .join(',\n    ');
  const block = `  {
    title: '${item.title.replace(/'/g, "\\'")}',
    description:
      '${item.description.replace(/'/g, "\\'")}',
    impact: '${item.impact.replace(/'/g, "\\'")}',
    href: '${item.href}',
    cta: '${item.cta.replace(/'/g, "\\'")}',
    icon: '${item.icon}',
    modules: [
    ${modulesStr},
    ],
  },
`;
  if (content.includes(`title: '${item.title.replace(/'/g, "\\'")}'`)) return content;
  return content.replace(insertBefore, block + insertBefore);
}

function applyPlatformPage(content, item) {
  const insertBefore = '];\n\nconst valueHighlights';
  const block = `  {
    title: '${item.title.replace(/'/g, "\\'")}',
    href: '${item.href}',
    description: '${item.description.replace(/'/g, "\\'")}',
    tag: '${item.tag}',
  },
`;
  if (content.includes(`title: '${item.title.replace(/'/g, "\\'")}'`)) return content;
  return content.replace(insertBefore, block + insertBefore);
}

function applyFaqItem(content, item) {
  const insertBefore = '];\n\ntype IndustrySolution';
  const block = `  {
    question: '${item.question.replace(/'/g, "\\'")}',
    answer:
      '${item.answer.replace(/'/g, "\\'")}',
  },
`;
  if (content.includes(item.question.substring(0, 30))) return content;
  return content.replace(insertBefore, block + insertBefore);
}

function applyMomentumSignals(content, signals) {
  signals.forEach((sig) => {
    if (!content.includes(sig)) {
      const insertBefore = "  'New Data Engineering service";
      if (content.includes(insertBefore)) {
        content = content.replace(insertBefore, `  '${sig.replace(/'/g, "\\'")}',\n${insertBefore}`);
      }
    }
  });
  // Update vertical count 41/43 -> 45
  content = content.replace(/41 industry verticals/g, '45 industry verticals');
  content = content.replace(/43 industry verticals/g, '45 industry verticals');
  return content;
}

function applyCaseStudyFull(caseContent, item) {
  const insertBefore = '];\n\nexport default function';
  const block = `  {
    title: '${item.title.replace(/'/g, "\\'")}',
    industry: '${item.industry.replace(/'/g, "\\'")}',
    result: '${item.result.replace(/'/g, "\\'")}',
    description:
      '${item.description.replace(/'/g, "\\'")}',
    apps: [${item.apps.map((a) => `'${a}'`).join(', ')}],
    icon: '${item.icon}',
  },
`;
  if (caseContent.includes(`title: '${item.title.replace(/'/g, "\\'")}'`)) return caseContent;
  return caseContent.replace(insertBefore, block + insertBefore);
}

function applyAll(generated) {
  let pageContent = fs.readFileSync(PAGE_PATH, 'utf8');
  let caseContent = fs.readFileSync(CASE_STUDIES_PATH, 'utf8');

  (generated.industrySolutions || []).forEach((item) => {
    pageContent = applyIndustrySolution(pageContent, item);
  });

  (generated.caseStudyTeasers || []).forEach((item) => {
    pageContent = applyCaseStudyTeaser(pageContent, item);
  });

  (generated.caseStudies || []).forEach((item) => {
    caseContent = applyCaseStudyFull(caseContent, item);
  });

  if (generated.innovationBundle) {
    pageContent = applyInnovationBundle(pageContent, generated.innovationBundle);
  }

  (generated.platformPageSpotlights || []).forEach((item) => {
    pageContent = applyPlatformPage(pageContent, item);
  });

  (generated.faqItems || []).forEach((item) => {
    pageContent = applyFaqItem(pageContent, item);
  });

  if (generated.momentumSignals && generated.momentumSignals.length) {
    pageContent = applyMomentumSignals(pageContent, generated.momentumSignals);
  }

  // Update FAQ industry count
  pageContent = pageContent.replace(
    /41 verticals including/,
    '45 verticals including'
  );
  pageContent = pageContent.replace(
    /43 verticals including/,
    '45 verticals including'
  );

  fs.writeFileSync(PAGE_PATH, pageContent);
  fs.writeFileSync(CASE_STUDIES_PATH, caseContent);
}

async function run() {
  ensureDirs();
  console.log('🤖 AI Front Page Content Expansion Agent');
  console.log('   Using OpenRouter LLM...');

  const generated = await callLLM();
  fs.writeFileSync(REPORT_PATH, JSON.stringify(generated, null, 2));
  console.log('   Generated content saved to', REPORT_PATH);

  applyAll(generated);
  console.log('   Applied changes to page.tsx and case-studies/page.tsx');
  console.log('✅ Done.');
}

if (require.main === module) {
  run().catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}

module.exports = { run, callLLM, applyAll };
