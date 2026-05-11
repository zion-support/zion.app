#!/usr/bin/env node

/**
 * OpenRouter-powered Content Generator
 * Generates high-quality blog posts using LLM via OpenRouter API,
 * creates Next.js page components matching the site's dark theme,
 * and updates the blog index page.
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const fs = require('fs');
const path = require('path');
const { createLLMClient } = require('./lib/openrouter-client.cjs');

const MAX_POSTS = parseInt(process.env.MAX_POSTS || '0', 10) || 999;
const APP_DIR = path.join(process.cwd(), 'app');
const BLOG_DIR = path.join(APP_DIR, 'blog');
const DATA_DIR = path.join(__dirname, 'data');
const LOG_DIR = path.join(__dirname, 'logs');
const BLOG_DATA_PATH = path.join(APP_DIR, 'lib', 'blog-data.ts');
const RUNTIME_DIR = path.join(__dirname, 'reports', '.runtime');
const STATE_PATH =
  process.env.CONTENT_GENERATOR_STATE_PATH ||
  path.join(RUNTIME_DIR, 'openrouter-content-generator-state.json');

const LLM_RETRY_MAX = Math.max(0, parseInt(process.env.LLM_RETRY_MAX || '3', 10) || 3);
const LLM_RETRY_BASE_BACKOFF_MS = Math.max(
  0,
  parseInt(process.env.LLM_RETRY_BASE_BACKOFF_MS || '1200', 10) || 1200
);
const FAIL_COOLDOWN_BASE_MINUTES = Math.max(
  1,
  parseInt(process.env.CONTENT_FAIL_COOLDOWN_BASE_MINUTES || '45', 10) || 45
);
const FAIL_COOLDOWN_MAX_MINUTES = Math.max(
  FAIL_COOLDOWN_BASE_MINUTES,
  parseInt(process.env.CONTENT_FAIL_COOLDOWN_MAX_MINUTES || '720', 10) || 720
);

function ensureDirs() {
  [BLOG_DIR, DATA_DIR, LOG_DIR, RUNTIME_DIR].forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });
}

function log(msg) {
  const ts = new Date().toISOString();
  const line = `[${ts}] ${msg}`;
  console.log(line);
  fs.appendFileSync(path.join(LOG_DIR, 'openrouter-generator.log'), line + '\n');
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function readState() {
  try {
    if (!fs.existsSync(STATE_PATH)) {
      return { version: 1, updatedAt: new Date().toISOString(), items: {} };
    }
    const raw = fs.readFileSync(STATE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') throw new Error('Invalid state JSON');
    if (!parsed.items || typeof parsed.items !== 'object') parsed.items = {};
    return { version: 1, updatedAt: parsed.updatedAt || new Date().toISOString(), items: parsed.items };
  } catch (e) {
    log(`WARN: could not read state at ${STATE_PATH}: ${e.message}`);
    return { version: 1, updatedAt: new Date().toISOString(), items: {} };
  }
}

function writeState(state) {
  try {
    const next = {
      version: 1,
      updatedAt: new Date().toISOString(),
      items: state.items || {},
    };
    fs.writeFileSync(STATE_PATH, JSON.stringify(next, null, 2));
  } catch (e) {
    log(`WARN: could not write state at ${STATE_PATH}: ${e.message}`);
  }
}

function cooldownMinutesForFailureCount(failureCount) {
  // Exponential-ish backoff with a hard cap.
  const minutes = Math.min(
    FAIL_COOLDOWN_MAX_MINUTES,
    Math.round(FAIL_COOLDOWN_BASE_MINUTES * Math.pow(1.8, Math.max(0, failureCount - 1)))
  );
  return minutes;
}

function isInCooldown(state, slug) {
  const item = state.items?.[slug];
  if (!item || !item.cooldownUntil) return false;
  const until = Date.parse(item.cooldownUntil);
  if (!Number.isFinite(until)) return false;
  return until > Date.now();
}

/** Load dynamic topics from ideation/audit JSON (blogTopics array) */
function loadDynamicTopics() {
  const paths = [
    process.env.TOPICS_JSON,
    process.env.IDEATION_REPORT_PATH,
    path.join(__dirname, 'reports', 'content-audit-ideas-latest.json'),
    path.join(__dirname, 'reports', 'content-ideation-latest.json'),
  ].filter(Boolean);

  for (const p of paths) {
    const fullPath = path.isAbsolute(p) ? p : path.join(process.cwd(), p);
    if (fs.existsSync(fullPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        const topics = data.blogTopics || data.blog_topics;
        if (Array.isArray(topics) && topics.length > 0) {
          return topics.map((t) => ({
            title: t.title,
            category: t.category || 'AI Trends',
            icon: t.icon || '📄',
            prompt:
              t.prompt ||
              `Write a comprehensive 1200-word blog article about ${t.title}. ${t.rationale || 'Cover key aspects, practical examples, and actionable insights for enterprise readers.'} Include specific metrics and ROI examples where relevant.`,
          }));
        }
      } catch (e) {
        log(`Could not load topics from ${fullPath}: ${e.message}`);
      }
    }
  }
  return null;
}

/** Sync BLOG_SLUGS in app/lib/blog-data.ts when new posts are created */
function syncBlogDataSlugs(newSlugs) {
  if (!fs.existsSync(BLOG_DATA_PATH) || newSlugs.length === 0) return;
  const content = fs.readFileSync(BLOG_DATA_PATH, 'utf8');
  const match = content.match(/export const BLOG_SLUGS = \[([\s\S]*?)\]/);
  if (!match) return;
  const existing = match[1]
    .split(',')
    .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);
  const combined = [...new Set([...existing, ...newSlugs])].sort();
  const newArray = `export const BLOG_SLUGS = [\n  ${combined.map((s) => `'${s}'`).join(',\n  ')},\n] as const;`;
  const updated = content.replace(/export const BLOG_SLUGS = \[[\s\S]*?\] as const;/, newArray);
  fs.writeFileSync(BLOG_DATA_PATH, updated);
  log(`Updated BLOG_SLUGS in blog-data.ts (+${newSlugs.length} new)`);
}

async function callLLM(prompt, maxTokens = 4000) {
  const llm = createLLMClient({
    appName: 'Zion Tech Group Content Generator',
    openrouterModel: process.env.OPENROUTER_MODEL || 'openrouter/free',
  });
  return llm.chat(prompt, {
    systemPrompt:
      'You are an expert technology content writer for Zion Tech Group, an AI delivery studio. Write professional, SEO-optimized content about AI, automation, and enterprise technology. Be specific, data-driven, and actionable. Avoid fluff. Use concrete examples.',
    maxTokens,
    temperature: 0.7,
  });
}

async function callLLMWithRetry(prompt, maxTokens) {
  let lastErr = null;
  for (let attempt = 0; attempt <= LLM_RETRY_MAX; attempt++) {
    try {
      if (attempt > 0) {
        const backoff = LLM_RETRY_BASE_BACKOFF_MS * Math.pow(2, attempt - 1);
        await sleep(backoff);
      }
      return await callLLM(prompt, maxTokens);
    } catch (e) {
      lastErr = e;
      log(`LLM attempt ${attempt + 1}/${LLM_RETRY_MAX + 1} failed: ${e.message}`);
    }
  }
  throw lastErr || new Error('LLM call failed');
}

const BLOG_TOPICS = [
  {
    title: 'AI in Healthcare: How Intelligent Automation Is Transforming Patient Care in 2026',
    category: 'Industry Guide',
    icon: '🏥',
    prompt: `Write a comprehensive 1200-word blog article about how AI is transforming healthcare in 2026. Cover: (1) AI-powered diagnostics and imaging analysis, (2) automated patient intake and records management, (3) predictive analytics for patient outcomes, (4) AI chatbots for patient engagement, (5) compliance and HIPAA considerations. Include specific statistics and ROI examples. End with practical next steps for healthcare organizations.`,
  },
  {
    title: 'AI for Financial Services: Automating Risk, Compliance, and Customer Growth',
    category: 'Industry Guide',
    icon: '🏦',
    prompt: `Write a comprehensive 1200-word blog article about AI applications in financial services. Cover: (1) fraud detection and real-time transaction monitoring, (2) automated compliance and regulatory reporting, (3) AI-powered credit risk assessment, (4) personalized financial product recommendations, (5) operational automation for back-office processes. Include specific metrics like cost reduction percentages and accuracy improvements.`,
  },
  {
    title: 'Smart Manufacturing: How AI Is Powering the Next Industrial Revolution',
    category: 'Industry Guide',
    icon: '🏭',
    prompt: `Write a comprehensive 1200-word article about AI in manufacturing. Cover: (1) predictive maintenance reducing unplanned downtime, (2) computer vision for quality inspection, (3) supply chain optimization with demand forecasting, (4) digital twins and simulation, (5) robotics and autonomous systems. Include real metrics like yield improvements and cost savings.`,
  },
  {
    title: 'Retail AI Playbook: Personalization, Inventory, and Customer Experience at Scale',
    category: 'Industry Guide',
    icon: '🛍️',
    prompt: `Write a comprehensive 1200-word article about AI in retail. Cover: (1) hyper-personalized product recommendations, (2) intelligent inventory management and demand forecasting, (3) AI-powered customer service chatbots, (4) dynamic pricing optimization, (5) visual search and augmented reality shopping. Include conversion rate and revenue impact statistics.`,
  },
  {
    title: 'Building Your First AI Chatbot: A Step-by-Step Technical Guide',
    category: 'Technical Guide',
    icon: '🤖',
    prompt: `Write a comprehensive 1200-word technical guide on building an enterprise AI chatbot. Cover: (1) choosing between rule-based vs NLU-powered chatbots, (2) designing conversation flows and intents, (3) training with domain-specific data, (4) integrating with existing systems (CRM, helpdesk, knowledge base), (5) measuring chatbot performance (containment rate, CSAT, deflection rate). Include practical implementation steps and common pitfalls.`,
  },
  {
    title: 'The Complete Guide to AI-Powered Predictive Analytics for Business',
    category: 'Technical Guide',
    icon: '📊',
    prompt: `Write a comprehensive 1200-word guide on implementing predictive analytics. Cover: (1) data preparation and feature engineering, (2) selecting the right algorithms for business problems, (3) model training, validation, and deployment, (4) integrating predictions into business workflows, (5) measuring accuracy and business impact. Include use cases across sales forecasting, churn prediction, and demand planning.`,
  },
  {
    title: 'AI Security Best Practices: Protecting Your AI Systems From Emerging Threats',
    category: 'Security',
    icon: '🔐',
    prompt: `Write a comprehensive 1200-word article about AI security. Cover: (1) adversarial attacks and model poisoning, (2) data privacy in AI training pipelines, (3) securing AI APIs and model endpoints, (4) compliance frameworks (SOC 2, ISO 27001, GDPR) for AI systems, (5) AI-powered security monitoring and threat detection. Include actionable security checklists and best practices.`,
  },
  {
    title: 'How to Calculate AI ROI: A Framework for Enterprise Decision-Makers',
    category: 'Business Strategy',
    icon: '💰',
    prompt: `Write a comprehensive 1200-word article on calculating AI ROI. Cover: (1) identifying measurable business outcomes before implementation, (2) total cost of ownership for AI projects (infrastructure, data, talent, maintenance), (3) ROI calculation frameworks and formulas, (4) common pitfalls in AI ROI measurement, (5) case study examples with specific numbers. Include a practical step-by-step framework decision-makers can follow.`,
  },
  {
    title: 'Top 10 AI Trends Reshaping Enterprise Technology in 2026',
    category: 'AI Trends',
    icon: '🔮',
    prompt: `Write a comprehensive 1200-word article about the top AI trends in 2026. Cover: (1) autonomous AI agents and agentic workflows, (2) multimodal AI models, (3) AI governance and regulation, (4) edge AI and on-device intelligence, (5) AI-powered code generation, (6) industry-specific foundation models, (7) AI observability and monitoring, (8) federated learning, (9) AI in cybersecurity, (10) sustainable AI and green computing. Be specific about how each trend impacts businesses.`,
  },
  {
    title: 'AI-Powered DevOps: Automating the Entire Software Delivery Lifecycle',
    category: 'Engineering',
    icon: '⚙️',
    prompt: `Write a comprehensive 1200-word article about AI in DevOps. Cover: (1) AI-powered code review and bug detection, (2) intelligent test generation and prioritization, (3) automated incident response and root cause analysis, (4) predictive capacity planning, (5) AI-driven deployment optimization and canary analysis. Include metrics on deployment frequency, MTTR, and change failure rate improvements.`,
  },
  {
    title: 'Small Business AI Adoption Guide: Start Fast, Scale Smart',
    category: 'Business Strategy',
    icon: '🚀',
    prompt: `Write a comprehensive 1200-word guide for small businesses adopting AI. Cover: (1) identifying the right first AI use case, (2) pre-built AI tools vs custom development, (3) budgeting for AI (realistic cost ranges), (4) quick wins: AI chatbots, email automation, analytics, (5) scaling from pilot to production. Include practical examples and estimated timelines for SMBs with limited budgets.`,
  },
  {
    title: 'AI-Driven Customer Experience: From Chatbots to Hyper-Personalization',
    category: 'AI Strategy',
    icon: '🎯',
    prompt: `Write a comprehensive 1200-word article about AI-powered customer experience. Cover: (1) intelligent chatbots with escalation design, (2) predictive customer service (anticipating issues before they happen), (3) real-time personalization across channels, (4) sentiment analysis and voice-of-customer insights, (5) AI-powered loyalty and retention programs. Include statistics on NPS improvements, ticket reduction, and customer lifetime value.`,
  },
  {
    title: 'Data Strategy for AI: Building the Foundation for Machine Learning Success',
    category: 'Technical Guide',
    icon: '🗄️',
    prompt: `Write a comprehensive 1200-word article about data strategy for AI. Cover: (1) data quality assessment and cleaning pipelines, (2) data governance and cataloging, (3) feature stores and ML data management, (4) synthetic data generation, (5) data labeling at scale. Include practical steps for organizations to build AI-ready data infrastructure.`,
  },
  {
    title: 'Autonomous AI Agents: The Next Frontier in Enterprise Automation',
    category: 'AI Trends',
    icon: '🤖',
    prompt: `Write a comprehensive 1200-word article about autonomous AI agents in enterprise. Cover: (1) what makes an AI agent different from traditional automation, (2) multi-step reasoning and planning capabilities, (3) tool use and API integration, (4) real-world enterprise use cases (IT operations, customer support, data analysis), (5) governance and safety considerations. Include specific productivity gains and deployment patterns.`,
  },
  {
    title: 'Cloud Migration and AI: Modernizing Infrastructure for Intelligent Workloads',
    category: 'Engineering',
    icon: '☁️',
    prompt: `Write a comprehensive 1200-word article about cloud infrastructure for AI. Cover: (1) choosing the right cloud provider for AI workloads, (2) GPU and compute optimization strategies, (3) MLOps pipelines in the cloud, (4) cost management for AI training and inference, (5) hybrid and multi-cloud AI architectures. Include cost comparison examples and performance benchmarks.`,
  },
  {
    title: 'AI Governance and Responsible AI: A Practical Enterprise Framework',
    category: 'Business Strategy',
    icon: '⚖️',
    prompt: `Write a comprehensive 1200-word article about AI governance. Cover: (1) establishing an AI ethics board and review process, (2) bias detection and mitigation strategies, (3) model explainability and transparency, (4) regulatory compliance (EU AI Act, NIST AI RMF), (5) building trust with customers and stakeholders. Include a practical governance checklist organizations can implement immediately.`,
  },
  {
    title: 'AI in Logistics and Supply Chain: Cutting Costs and Improving Visibility',
    category: 'Industry Guide',
    icon: '🚛',
    prompt: `Write a comprehensive 1200-word article about AI in logistics. Cover: (1) route optimization and fleet management, (2) demand forecasting and inventory optimization, (3) warehouse automation and robotics, (4) real-time shipment tracking and ETAs, (5) supplier risk assessment and procurement. Include specific cost reduction and efficiency metrics.`,
  },
  {
    title: 'Implementing AI-Powered Document Processing: From Paper to Insights',
    category: 'Technical Guide',
    icon: '📄',
    prompt: `Write a comprehensive 1200-word guide on AI document processing. Cover: (1) OCR and intelligent character recognition, (2) document classification and routing, (3) key information extraction (invoices, contracts, forms), (4) integration with business workflows, (5) accuracy improvement and human-in-the-loop validation. Include processing speed improvements and error reduction statistics.`,
  },
  {
    title: 'The Future of Work: How AI Is Redefining Every Role in the Enterprise',
    category: 'AI Trends',
    icon: '💼',
    prompt: `Write a comprehensive 1200-word article about AI's impact on work. Cover: (1) AI copilots for knowledge workers, (2) augmented decision-making for managers, (3) AI-assisted creative workflows, (4) automated administrative and operational tasks, (5) upskilling and reskilling strategies. Include productivity statistics and workforce transformation examples across industries.`,
  },
  {
    title: 'Building a Winning AI Team: Roles, Skills, and Organizational Structure',
    category: 'Business Strategy',
    icon: '👥',
    prompt: `Write a comprehensive 1200-word guide on building an AI team. Cover: (1) essential roles (ML engineers, data scientists, AI product managers, MLOps), (2) build vs buy vs partner decisions, (3) organizational models (centralized, embedded, hub-and-spoke), (4) hiring and retaining AI talent in a competitive market, (5) measuring team effectiveness. Include salary ranges and team sizing guidelines.`,
  },
  {
    title: '5 Proven AI Automation Strategies for Enterprise Workflow Optimization',
    category: 'AI Trends',
    icon: '🤖',
    prompt: `Write a comprehensive 1200-word article about 5 proven AI automation strategies for enterprise workflow optimization. Cover: (1) intelligent process mining and discovery, (2) RPA + AI hybrid automation, (3) document workflow automation, (4) customer journey automation, (5) cross-department orchestration. Include ROI metrics and implementation timelines.`,
  },
  {
    title: 'Securing AI Models: A Practical Guide to Threat Mitigation in Production',
    category: 'Technical Guide',
    icon: '🔒',
    prompt: `Write a comprehensive 1200-word guide on securing AI models in production. Cover: (1) adversarial attacks and model evasion, (2) data poisoning and backdoor attacks, (3) model extraction and inversion, (4) secure deployment patterns (API hardening, rate limiting), (5) monitoring and incident response for AI systems. Include NIST and OWASP references.`,
  },
  {
    title: 'Building a Tailored Implementation Roadmap: From Proof of Concept to Full Deployment',
    category: 'Business Strategy',
    icon: '🗺️',
    prompt: `Write a comprehensive 1200-word article on building an AI implementation roadmap. Cover: (1) defining success criteria and KPIs, (2) proof of concept best practices, (3) pilot scaling and validation, (4) full deployment planning, (5) change management and adoption. Include milestone templates and common pitfalls.`,
  },
  {
    title: 'CRM Automation Trends 2026: AI-Driven Customer Journey Personalization',
    category: 'Industry Guide',
    icon: '📈',
    prompt: `Write a comprehensive 1200-word article about CRM automation trends in 2026. Cover: (1) AI-powered lead scoring and routing, (2) predictive customer analytics, (3) automated outreach and follow-up, (4) personalization at scale, (5) CRM integration with marketing and support. Include conversion and retention metrics.`,
  },
  {
    title: 'DevOps Automation with AI: Reducing Deployment Failures by 60%',
    category: 'Technical Guide',
    icon: '🚀',
    prompt: `Write a comprehensive 1200-word article about AI in DevOps. Cover: (1) AI-powered code review and static analysis, (2) intelligent test generation and prioritization, (3) automated incident detection and root cause analysis, (4) predictive deployment risk scoring, (5) self-healing infrastructure. Include MTTR and change failure rate improvements.`,
  },
];

function escapeForJsx(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/'/g, '&apos;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeForTs(text) {
  return text.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

function parseArticleSections(rawContent) {
  const lines = rawContent.split('\n');
  const sections = [];
  let currentSection = null;

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+)/);
    const h3Match = line.match(/^###\s+(.+)/);

    if (h2Match) {
      if (currentSection) sections.push(currentSection);
      currentSection = { heading: h2Match[1].trim(), paragraphs: [] };
    } else if (h3Match) {
      if (currentSection && currentSection.paragraphs.length > 0) sections.push(currentSection);
      currentSection = { heading: h3Match[1].trim(), paragraphs: [] };
    } else {
      const trimmed = line.trim();
      if (trimmed && currentSection) {
        const cleaned = trimmed
          .replace(/^\*\*(.+?)\*\*$/, '$1')
          .replace(/\*\*/g, '')
          .replace(/\*/g, '')
          .replace(/^[-•]\s*/, '')
          .replace(/^\d+\.\s*/, '');
        if (cleaned.length > 20) {
          currentSection.paragraphs.push(cleaned);
        }
      } else if (trimmed && !currentSection) {
        currentSection = { heading: '', paragraphs: [trimmed] };
      }
    }
  }
  if (currentSection) sections.push(currentSection);

  return sections.filter((s) => s.paragraphs.length > 0).slice(0, 8);
}

function generateBlogPageTsx(topic, rawContent, dateStr) {
  const slug = slugify(topic.title);
  const sections = parseArticleSections(rawContent);
  const dateFormatted = new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const metaDesc = `${topic.title} — practical insights on AI implementation, automation, and technology strategy from Zion Tech Group.`;

  const sectionBlocks = sections
    .map((sec, idx) => {
      const paras = sec.paragraphs
        .slice(0, 4)
        .map(
          (p) =>
            `            <p className="text-slate-300 leading-relaxed mb-4">${escapeForJsx(p)}</p>`
        )
        .join('\n');

      if (!sec.heading) return `          <section className="mb-10">\n${paras}\n          </section>`;

      return `          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">${escapeForJsx(sec.heading)}</h2>
${paras}
          </section>`;
    })
    .join('\n\n');

  return `import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '${escapeForTs(topic.title)} | Zion Tech Group Blog',
  description:
    '${escapeForTs(metaDesc)}',
  alternates: { canonical: '/blog/${slug}' },
  openGraph: {
    title: '${escapeForTs(topic.title)}',
    description: '${escapeForTs(metaDesc)}',
    type: 'article',
    url: 'https://ziontechgroup.com/blog/${slug}',
  },
};

export default function Page() {
  return (
    <div className="relative min-h-screen bg-slate-950">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-16 left-[-9rem] h-[26rem] w-[26rem] rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute right-[-10rem] top-24 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <article className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <header className="mb-12">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
            <time dateTime="${dateStr}" className="text-slate-400">
              ${dateFormatted}
            </time>
            <span className="rounded-full border border-purple-400/40 bg-purple-500/15 px-3 py-1 text-xs font-medium text-purple-200">
              ${escapeForJsx(topic.category)}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            ${escapeForJsx(topic.title)}
          </h1>
        </header>

        <div className="prose-invert max-w-none">
${sectionBlocks}
        </div>

        <div className="mt-16 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-900/40 via-fuchsia-900/30 to-pink-900/40 p-8 text-center shadow-2xl sm:p-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to Implement AI in Your Organization?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-200">
            Talk to our team about building a practical AI roadmap tailored to
            your industry and goals.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/consultation"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Book a Strategy Session
            </Link>
            <Link
              href="/solutions"
              className="rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Explore Solutions
            </Link>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8">
          <Link
            href="/blog"
            className="text-sm font-medium text-purple-300 transition hover:text-purple-200"
          >
            &larr; Back to all articles
          </Link>
        </div>
      </article>
    </div>
  );
}
`;
}

async function generateSinglePost(topic, index) {
  const dateOffset = index * 3;
  const date = new Date();
  date.setDate(date.getDate() - dateOffset);
  const dateStr = date.toISOString().split('T')[0];
  const dateFormatted = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const slug = slugify(topic.title);
  const pageDir = path.join(BLOG_DIR, slug);

  if (fs.existsSync(path.join(pageDir, 'page.tsx'))) {
    log(`SKIP (exists): ${slug}`);
    return { slug, topic, dateStr, dateFormatted, skipped: true };
  }

  log(`Generating: ${topic.title}`);

  try {
    const rawContent = await callLLMWithRetry(topic.prompt);
    const tsx = generateBlogPageTsx(topic, rawContent, dateStr);

    if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, { recursive: true });
    fs.writeFileSync(path.join(pageDir, 'page.tsx'), tsx);

    log(`DONE: ${slug}`);
    return { slug, topic, dateStr, dateFormatted, skipped: false };
  } catch (err) {
    log(`ERROR generating ${slug}: ${err.message}`);
    return { slug, topic, dateStr, dateFormatted, error: err.message };
  }
}

function updateBlogIndexPage(generatedPosts) {
  const blogIndexPath = path.join(BLOG_DIR, 'page.tsx');
  const existing = fs.readFileSync(blogIndexPath, 'utf8');

  const existingPostsMatch = existing.match(
    /const blogPosts: BlogPost\[\] = \[([\s\S]*?)\];/
  );
  if (!existingPostsMatch) {
    log('Could not find blogPosts array in blog index');
    return false;
  }

  const newEntries = generatedPosts
    .filter((p) => !p.skipped && !p.error)
    .map(
      (p) => `  {
    slug: '${p.slug}',
    title: '${escapeForTs(p.topic.title)}',
    excerpt:
      '${escapeForTs(p.topic.prompt.slice(0, 180).replace(/Write a comprehensive \d+-word [\w\s]+ about /i, 'Explore ').replace(/\. Cover:.*$/, '.'))}',
    category: '${escapeForTs(p.topic.category)}',
    date: '${p.dateFormatted}',
    readTime: '${Math.floor(Math.random() * 4) + 7} min read',
    icon: '${p.topic.icon}',
  }`
    )
    .join(',\n');

  const oldArray = existingPostsMatch[0];
  const updatedArray = oldArray.replace(/\];$/, `,\n${newEntries},\n];`);
  const updatedContent = existing
    .replace(oldArray, updatedArray)
    .replace(
      /href="\/blog" className="mt-3/g,
      'href={`/blog/${post.slug}`} className="mt-3'
    );

  fs.writeFileSync(blogIndexPath, updatedContent);
  log(`Updated blog index with ${generatedPosts.filter((p) => !p.skipped && !p.error).length} new posts`);
  return true;
}

async function main() {
  ensureDirs();

  const state = readState();

  const llm = createLLMClient({ appName: 'Zion Tech Group Content Generator' });
  if (!llm.isConfigured()) {
    log('ERROR: No LLM available. Start Ollama (ollama serve, ollama pull llama3.2:3b) or set OPENROUTER_API_KEY.');
    process.exit(1);
  }

  const topicSource = loadDynamicTopics() || BLOG_TOPICS;
  const topicsToProcess = topicSource
    .filter((t) => {
      const slug = slugify(t.title);
      return !fs.existsSync(path.join(BLOG_DIR, slug, 'page.tsx'));
    })
    .filter((t) => {
      const slug = slugify(t.title);
      if (isInCooldown(state, slug)) {
        const until = state.items?.[slug]?.cooldownUntil;
        log(`SKIP (cooldown): ${slug} until ${until}`);
        return false;
      }
      return true;
    })
    .slice(0, MAX_POSTS);

  if (topicSource !== BLOG_TOPICS) {
    log('Using dynamic topics from ideation/audit');
  }

  const info = llm.getProviderInfo();
  log(`Starting content generation (${info.provider || 'ollama'} primary, openrouter fallback)`);
  log(`Generating up to ${Math.min(MAX_POSTS, topicsToProcess.length)} new posts (${topicsToProcess.length} pending)...`);

  const results = [];
  const CONCURRENCY = parseInt(process.env.MAX_CONCURRENCY || '2', 10) || 2;

  for (let i = 0; i < topicsToProcess.length; i += CONCURRENCY) {
    const batch = topicsToProcess.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map((topic, batchIdx) => generateSinglePost(topic, i + batchIdx))
    );
    results.push(...batchResults);

    if (i + CONCURRENCY < topicsToProcess.length) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  const success = results.filter((r) => !r.skipped && !r.error);
  const skipped = results.filter((r) => r.skipped);
  const errors = results.filter((r) => r.error);

  log(`\nResults: ${success.length} created, ${skipped.length} skipped, ${errors.length} errors`);

  if (success.length > 0) {
    updateBlogIndexPage(results);
    const newSlugs = success.map((r) => r.slug);
    syncBlogDataSlugs(newSlugs);
  }

  // Persist failure cooldowns so repeated failures don't waste throughput.
  for (const r of results) {
    if (!r || !r.slug) continue;
    const slug = r.slug;
    const item = state.items[slug] || { failureCount: 0 };
    if (r.error) {
      const nextFailureCount = (item.failureCount || 0) + 1;
      const mins = cooldownMinutesForFailureCount(nextFailureCount);
      state.items[slug] = {
        ...item,
        slug,
        title: r.topic?.title || item.title,
        lastFailureAt: new Date().toISOString(),
        lastError: String(r.error).slice(0, 500),
        failureCount: nextFailureCount,
        cooldownMinutes: mins,
        cooldownUntil: new Date(Date.now() + mins * 60_000).toISOString(),
      };
    } else if (!r.skipped) {
      // On success, clear cooldown/failure history for this slug.
      delete state.items[slug];
    }
  }
  writeState(state);

  const historyPath = path.join(DATA_DIR, 'openrouter-generated-content.json');
  const history = fs.existsSync(historyPath) ? JSON.parse(fs.readFileSync(historyPath, 'utf8')) : { runs: [] };
  history.runs.push({
    timestamp: new Date().toISOString(),
    model: process.env.OPENROUTER_MODEL || 'openrouter/free',
    results: results.map((r) => ({
      slug: r.slug,
      title: r.topic.title,
      category: r.topic.category,
      date: r.dateStr,
      status: r.error ? 'error' : r.skipped ? 'skipped' : 'created',
      error: r.error || undefined,
    })),
  });
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));

  if (errors.length > 0) {
    log('\nErrors:');
    errors.forEach((e) => log(`  ${e.slug}: ${e.error}`));
  }

  log('\nContent generation complete.');
}

main().catch((err) => {
  log(`Fatal error: ${err.message}`);
  process.exit(1);
});
