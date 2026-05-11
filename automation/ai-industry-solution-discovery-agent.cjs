#!/usr/bin/env node

/**
 * AI Industry Solution Discovery Agent
 *
 * Scans app/industries/page.tsx for industries linking to generic /solutions,
 * /supply-chain-optimizer, /ai-services/energy-management, or other product paths.
 * Reports candidates for dedicated solution pages to improve navigation and SEO.
 * With --create-pages, creates template solution pages for candidates.
 *
 * Usage:
 *   node automation/ai-industry-solution-discovery-agent.cjs run
 *   node automation/ai-industry-solution-discovery-agent.cjs run --create-pages
 *   node automation/ai-industry-solution-discovery-agent.cjs report
 *
 * Output: automation/reports/industry-solution-discovery-latest.json
 */

const GENERIC_HREFS = [
  '/solutions',
  '/supply-chain-optimizer',
  '/ai-services/energy-management',
];

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const INDUSTRIES_PAGE = path.join(ROOT, 'app', 'industries', 'page.tsx');
const SOLUTIONS_DIR = path.join(ROOT, 'app', 'solutions');
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[IndustryDiscovery] ${ts} | ${msg}`);
}

function ensureDirs() {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

function discoverSolutionPages() {
  const pages = new Set();
  if (!fs.existsSync(SOLUTIONS_DIR)) return pages;
  const entries = fs.readdirSync(SOLUTIONS_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const pagePath = path.join(SOLUTIONS_DIR, entry.name, 'page.tsx');
      if (fs.existsSync(pagePath)) {
        pages.add(`/solutions/${entry.name}`);
      }
    }
  }
  return pages;
}

function extractIndustriesFromPage() {
  const content = fs.readFileSync(INDUSTRIES_PAGE, 'utf8');
  const industries = [];
  const blockRe = /\{\s*industry:\s*['"]([^'"]+)['"],[\s\S]*?href:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = blockRe.exec(content)) !== null) {
    industries.push({ industry: m[1], href: m[2] });
  }
  return industries;
}

function slugFromIndustry(industry) {
  return industry
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function run() {
  ensureDirs();
  log('Scanning industries page...');

  const existingSolutions = discoverSolutionPages();
  const industries = extractIndustriesFromPage();

  const genericLinkers = industries.filter((i) => GENERIC_HREFS.includes(i.href));
  const withDedicatedPage = industries.filter((i) =>
    existingSolutions.has(i.href)
  );
  const candidates = genericLinkers
    .filter((i) => !existingSolutions.has(`/solutions/${slugFromIndustry(i.industry)}`))
    .map((i) => ({
    industry: i.industry,
    suggestedSlug: slugFromIndustry(i.industry),
    suggestedPath: `/solutions/${slugFromIndustry(i.industry)}`,
  }));

  const report = {
    timestamp: new Date().toISOString(),
    industriesWithDedicatedPage: withDedicatedPage.length,
    industriesLinkingToGeneric: genericLinkers.length,
    candidatesForNewPages: candidates,
    existingSolutionPaths: Array.from(existingSolutions),
  };

  const outPath = path.join(REPORTS_DIR, 'industry-solution-discovery-latest.json');
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  log(`Report saved to ${outPath}`);

  if (candidates.length > 0) {
    log(`Found ${candidates.length} industries linking to generic paths (candidates for dedicated pages):`);
    candidates.forEach((c) => log(`   - ${c.industry} → ${c.suggestedPath}`));
  } else {
    log('All industries have dedicated solution pages or specific product links.');
  }

  return report;
}

const INDUSTRY_APP_TEMPLATES = {
  'Government & Public Sector': [
    { name: 'AI Document Processor', href: '/zion-ai-document-processor' },
    { name: 'AI Contract Analyzer', href: '/zion-ai-contract-analyzer' },
    { name: 'Compliance Manager', href: '/zion-compliance-manager' },
    { name: 'Security Shield', href: '/zion-security-shield' },
  ],
  'Banking & Capital Markets': [
    { name: 'AI Fraud Detector', href: '/zion-ai-fraud-detector' },
    { name: 'AI Risk Assessor', href: '/zion-ai-risk-assessor' },
    { name: 'Compliance Manager', href: '/zion-compliance-manager' },
    { name: 'AI Contract Analyzer', href: '/zion-ai-contract-analyzer' },
  ],
  'Telecommunications': [
    { name: 'AI Predictive Maintenance', href: '/zion-ai-predictive-maintenance' },
    { name: 'AI Chatbot Builder', href: '/zion-ai-chatbot-builder' },
    { name: 'AI Customer Support Pro', href: '/zion-ai-customer-support-pro' },
    { name: 'AI Data Pipeline', href: '/zion-ai-data-pipeline' },
  ],
  'Technology & SaaS': [
    { name: 'AI Code Assistant', href: '/zion-ai-code-assistant' },
    { name: 'AI Onboarding Pro', href: '/zion-ai-onboarding-pro' },
    { name: 'AI SEO Optimizer', href: '/zion-ai-seo-optimizer' },
    { name: 'AI Website Analyzer', href: '/zion-ai-website-analyzer' },
  ],
};

function createPageTemplate(industry, slug, suggestedPath) {
  const title = `${industry} AI Solutions | Zion Tech Group`;
  const apps = INDUSTRY_APP_TEMPLATES[industry] || [
    { name: 'AI Document Processor', href: '/zion-ai-document-processor' },
    { name: 'AI Chatbot Builder', href: '/zion-ai-chatbot-builder' },
    { name: 'Compliance Manager', href: '/zion-compliance-manager' },
  ];
  const appsList = apps
    .map((a) => `  { name: '${a.name}', href: '${a.href}' },`)
    .join('\n');
  return `import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: '${title}',
  description:
    'Explore AI-driven solutions for ${industry}. Production-ready tools for document processing, automation, and compliance.',
  alternates: { canonical: '${suggestedPath}' },
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
            ${industry}{' '}
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
              AI Solutions
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Explore AI-driven solutions tailored for ${industry}. Production-ready tools for document processing, automation, and compliance.
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
          <h2 className="text-xl font-bold text-white">Featured AI Apps for ${industry}</h2>
          <p className="mt-2 text-slate-300">
            Production-ready tools for document processing, automation, and compliance.
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

function createPages(candidates) {
  let created = 0;
  for (const c of candidates) {
    const dir = path.join(SOLUTIONS_DIR, c.suggestedSlug);
    const pagePath = path.join(dir, 'page.tsx');
    if (fs.existsSync(pagePath)) {
      log(`Skip ${c.suggestedPath} (already exists)`);
      continue;
    }
    fs.mkdirSync(dir, { recursive: true });
    const content = createPageTemplate(c.industry, c.suggestedSlug, c.suggestedPath);
    fs.writeFileSync(pagePath, content);
    log(`Created ${pagePath}`);
    created++;
  }
  return created;
}

const cmd = process.argv[2] || 'run';
const createPagesFlag = process.argv.includes('--create-pages');
if (cmd === 'run' || cmd === 'report') {
  const report = run();
  if (createPagesFlag && report.candidatesForNewPages?.length > 0) {
    log('Creating industry solution pages...');
    const n = createPages(report.candidatesForNewPages);
    log(`Created ${n} new solution pages.`);
  }
} else {
  console.log('Usage: node ai-industry-solution-discovery-agent.cjs [run|report] [--create-pages]');
  process.exit(1);
}
