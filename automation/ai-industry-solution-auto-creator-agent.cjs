#!/usr/bin/env node

/**
 * AI Industry Solution Auto-Creator Agent
 *
 * Creates dedicated solution pages from industry discovery report using templates.
 * No LLM required. Runs after industry discovery to auto-create missing pages.
 * Updates industries page hrefs and sitemap.
 *
 * Options:
 *   MAX_PAGES=2  - Max new pages per run (default 2)
 *
 * Output: automation/reports/industry-solution-auto-creator-latest.json
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SOLUTIONS_DIR = path.join(ROOT, 'app', 'solutions');
const INDUSTRIES_PAGE = path.join(ROOT, 'app', 'industries', 'page.tsx');
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const DISCOVERY_PATH = path.join(REPORTS_DIR, 'industry-solution-discovery-latest.json');
const SITEMAP_PATH = path.join(ROOT, 'app', 'sitemap.ts');
const MAX_PAGES = parseInt(process.env.MAX_PAGES || '2', 10);

// App name -> href mapping (real routes)
const APP_HREFS = {
  'AI Document Processor': '/zion-ai-document-processor',
  'AI Chatbot Builder': '/zion-ai-chatbot-builder',
  'AI Contract Analyzer': '/zion-ai-contract-analyzer',
  'Compliance Manager': '/zion-compliance-manager',
  'Security Shield': '/zion-security-shield',
  'Workflow Automation': '/zion-ai-workflow-automator',
  'AI Code Assistant': '/zion-ai-code-assistant',
  'AI Onboarding Pro': '/zion-ai-onboarding-pro',
  'AI SEO Optimizer': '/zion-ai-seo-optimizer',
  'AI Website Analyzer': '/zion-ai-website-analyzer',
  'AI Fraud Detector': '/zion-ai-fraud-detection',
  'AI Risk Assessor': '/zion-ai-risk-assessor',
  'AI Predictive Maintenance': '/zion-ai-predictive-maintenance',
  'AI Customer Support Pro': '/zion-ai-customer-support-pro',
  'AI Data Pipeline': '/zion-ai-data-pipeline',
};

const DEFAULT_APPS = ['AI Document Processor', 'AI Chatbot Builder', 'Compliance Manager', 'Security Shield', 'Workflow Automation'];

const INDUSTRY_APPS = {
  'technology-and-saas': ['AI Code Assistant', 'AI Onboarding Pro', 'AI SEO Optimizer', 'AI Website Analyzer'],
  'government-and-public-sector': ['AI Document Processor', 'AI Contract Analyzer', 'Compliance Manager', 'Security Shield'],
  'banking-and-capital-markets': ['AI Fraud Detector', 'AI Risk Assessor', 'Compliance Manager', 'AI Contract Analyzer'],
  telecommunications: ['AI Predictive Maintenance', 'AI Chatbot Builder', 'AI Customer Support Pro', 'AI Data Pipeline'],
};

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[IndustryAutoCreator] ${ts} | ${msg}`);
}

function ensureDirs() {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

function getPageTemplate(industry, slug, description) {
  const title = industry.replace(/&/g, 'and');
  const apps = INDUSTRY_APPS[slug] || DEFAULT_APPS;
  const appsList = apps
    .map((a) => {
      const href = APP_HREFS[a] || `/zion-${a.toLowerCase().replace(/\s+/g, '-').replace(/^ai /, 'ai-')}`;
      return `  { name: '${a}', href: '${href}' }`;
    })
    .join(',\n');

  return `import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: '${title} AI Solutions | Zion Tech Group',
  description:
    '${description}',
  alternates: { canonical: '/solutions/${slug}' },
};

const industryApps = [
${appsList}
];

export default function ${slug.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('')}SolutionsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-16 left-[-9rem] h-[26rem] w-[26rem] rounded-full bg-purple-500/25 blur-3xl" />
        <div className="absolute right-[-8rem] top-40 h-[22rem] w-[22rem] rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Industry Solutions
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            ${title}{' '}
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
              AI Solutions
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            ${description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-purple-700/20 transition hover:-translate-y-0.5 hover:from-purple-500 hover:to-pink-500"
            >
              Book a Discovery Call
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/solutions"
              className="inline-flex items-center justify-center rounded-xl border border-slate-500/80 bg-slate-900/60 px-7 py-3 text-base font-semibold text-slate-100 transition hover:border-purple-300/70 hover:text-white"
            >
              View All Solutions
            </Link>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 shadow-lg shadow-black/20 sm:p-8">
          <h2 className="text-xl font-bold text-white">Featured AI Apps for ${title}</h2>
          <p className="mt-2 text-slate-300">
            Production-ready tools for document processing, automation, compliance, and secure workflows.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {industryApps.map((app) => (
              <Link
                key={app.href}
                href={app.href}
                className="flex items-center justify-between rounded-xl border border-slate-700/70 bg-slate-950/60 px-4 py-3 text-slate-100 transition hover:border-purple-400/50 hover:text-white"
              >
                <span>{app.name}</span>
                <ArrowRight className="h-4 w-4 text-purple-400" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <Link
          href="/industries"
          className="inline-flex items-center text-sm font-medium text-purple-300 hover:text-purple-200"
        >
          ← Back to Industry Solutions
        </Link>
      </section>
    </div>
  );
}
`;
}

function getDescriptionForIndustry(industry) {
  const descs = {
    'Technology & SaaS': 'Scale engineering velocity, automate customer onboarding, and optimize conversion with AI-powered product workflows.',
    'Government & Public Sector': 'Streamline citizen services, automate document processing, and ensure compliance with secure, audit-ready AI workflows.',
    'Banking & Capital Markets': 'Deploy AI-powered fraud detection, risk scoring, and compliance workflows for KYC, AML, and regulatory reporting.',
    Telecommunications: 'Optimize network operations with predictive maintenance, automate customer support, and improve demand forecasting with AI-driven analytics.',
  };
  return descs[industry] || `Deploy AI-powered workflows for ${industry}. Automate document processing, compliance, and operational efficiency.`;
}

function updateIndustriesPageHref(industry, newHref) {
  if (!fs.existsSync(INDUSTRIES_PAGE)) return;
  let content = fs.readFileSync(INDUSTRIES_PAGE, 'utf8');
  const escaped = industry.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(
    `(industry:\\s*['"]${escaped}['"][\\s\\S]*?href:\\s*)['"]/solutions['"]`,
    'g'
  );
  content = content.replace(re, `$1'${newHref}'`);
  fs.writeFileSync(INDUSTRIES_PAGE, content);
}

function addToSitemap(slug) {
  if (!fs.existsSync(SITEMAP_PATH)) return;
  let content = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const pathToAdd = `/solutions/${slug}`;
  if (content.includes(pathToAdd)) return;
  const insertPoint = content.indexOf("{ path: '/solutions/warehousing-3pl'");
  if (insertPoint === -1) return;
  const line = `    { path: '${pathToAdd}', changeFrequency: 'monthly', priority: 0.75 },\n    `;
  content = content.slice(0, insertPoint) + line + content.slice(insertPoint);
  fs.writeFileSync(SITEMAP_PATH, content);
}

function run() {
  ensureDirs();
  log('Running industry solution auto-creator...');

  if (!fs.existsSync(DISCOVERY_PATH)) {
    log('Discovery report not found. Run nav:industry-discovery first.');
    const report = { timestamp: new Date().toISOString(), created: 0, skipped: 'no_discovery' };
    fs.writeFileSync(path.join(REPORTS_DIR, 'industry-solution-auto-creator-latest.json'), JSON.stringify(report, null, 2));
    return report;
  }

  const discovery = JSON.parse(fs.readFileSync(DISCOVERY_PATH, 'utf8'));
  const candidates = discovery.candidatesForNewPages || [];
  const existingPaths = new Set(discovery.existingSolutionPaths || []);

  const toCreate = candidates
    .filter((c) => !existingPaths.has(c.suggestedPath))
    .slice(0, MAX_PAGES);

  const created = [];
  for (const c of toCreate) {
    const dir = path.join(SOLUTIONS_DIR, c.suggestedSlug);
    const pagePath = path.join(dir, 'page.tsx');
    if (fs.existsSync(pagePath)) {
      log(`Page exists: ${c.suggestedPath}`);
      continue;
    }
    fs.mkdirSync(dir, { recursive: true });
    const desc = getDescriptionForIndustry(c.industry);
    const template = getPageTemplate(c.industry, c.suggestedSlug, desc);
    fs.writeFileSync(pagePath, template);
    updateIndustriesPageHref(c.industry, c.suggestedPath);
    addToSitemap(c.suggestedSlug);
    created.push({ industry: c.industry, path: c.suggestedPath });
    log(`Created: ${c.suggestedPath}`);
    existingPaths.add(c.suggestedPath);
  }

  const report = {
    timestamp: new Date().toISOString(),
    created: created.length,
    pages: created,
    candidatesTotal: candidates.length,
  };

  fs.writeFileSync(
    path.join(REPORTS_DIR, 'industry-solution-auto-creator-latest.json'),
    JSON.stringify(report, null, 2)
  );
  log(`Done. Created ${created.length} solution page(s).`);
  return report;
}

const cmd = process.argv[2] || 'run';
if (cmd === 'run' || cmd === 'report') {
  run();
} else {
  console.log('Usage: node ai-industry-solution-auto-creator-agent.cjs [run|report]');
  process.exit(1);
}
