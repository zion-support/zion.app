'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { AIProduct } from '../../config/aiCatalog';

type CompanySize = 'small' | 'mid' | 'enterprise';
type Industry =
  | 'saas'
  | 'ecommerce'
  | 'financial'
  | 'healthcare'
  | 'public'
  | 'industrial'
  | 'other';
type Goal = 'revenue' | 'operations' | 'experience' | 'engineering' | 'compliance';

type ProductBundle = {
  id: string;
  title: string;
  tagline: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  products: { name: string; href: string }[];
  bestFor: string;
};

type NarrativeSummary = {
  title: string;
  body: string;
};

const bundles: ProductBundle[] = [
  {
    id: 'revenue-lab',
    title: 'Revenue Acceleration Lab',
    tagline: 'Align chat, email, and lifecycle journeys around one revenue command center.',
    primaryCtaLabel: 'Launch revenue lab',
    primaryCtaHref: '/zion-smart-crm-automation',
    products: [
      { name: 'Autonomous Growth Intelligence', href: '/ai-services/autonomous-growth-intelligence' },
      { name: 'Zion AI Chatbot Builder', href: '/zion-ai-chatbot-builder' },
      { name: 'Zion AI Email Assistant', href: '/zion-ai-email-assistant' },
      { name: 'Zion AI Marketing Automation', href: '/zion-ai-marketing-automation' },
      { name: 'Zion AI Lead Scoring', href: '/zion-ai-lead-scoring' },
    ],
    bestFor: 'Growth and sales teams who want measurable pipeline impact.',
  },
  {
    id: 'support-hub',
    title: 'Autonomous Support Hub',
    tagline: 'Deliver always-on support with clear escalation paths for your team.',
    primaryCtaLabel: 'Modernize support',
    primaryCtaHref: '/zion-ai-customer-support-pro',
    products: [
      { name: 'Autonomous Retention Playbook', href: '/ai-lab/autonomous-retention-playbook' },
      { name: 'Zion AI Customer Support Pro', href: '/zion-ai-customer-support-pro' },
      { name: 'Zion AI Knowledge Base', href: '/zion-ai-knowledge-base' },
      { name: 'Zion AI Help Desk', href: '/zion-ai-help-desk' },
      { name: 'Zion AI Sentiment Analyzer', href: '/zion-ai-customer-sentiment-tracker' },
    ],
    bestFor: 'Customer experience teams shipping tier-1 automation.',
  },
  {
    id: 'ops-desk',
    title: 'Autonomous Operations Desk',
    tagline: 'Reduce manual work across documents, meetings, and notifications.',
    primaryCtaLabel: 'Streamline operations',
    primaryCtaHref: '/zion-workflow-automation',
    products: [
      { name: 'Zion Workflow Automation', href: '/zion-workflow-automation' },
      { name: 'Zion AI Document Processor', href: '/zion-ai-document-processor' },
      { name: 'Zion AI Meeting Assistant', href: '/zion-ai-meeting-assistant' },
      { name: 'Zion AI Notification Hub', href: '/zion-ai-notification-hub' },
    ],
    bestFor: 'Ops teams coordinating cross-functional work and back-office processes.',
  },
  {
    id: 'engineering-pod',
    title: 'Engineering Velocity Pod',
    tagline: 'Use AI to improve code quality, test coverage, and release confidence.',
    primaryCtaLabel: 'Boost engineering delivery',
    primaryCtaHref: '/zion-devops-automation',
    products: [
      { name: 'Zion AI Code Assistant', href: '/zion-ai-code-assistant' },
      { name: 'Zion AI Code Reviewer', href: '/zion-ai-code-reviewer' },
      { name: 'Zion AI API Tester', href: '/zion-ai-api-tester' },
      { name: 'Zion AI Quality Assurance', href: '/zion-ai-quality-assurance' },
    ],
    bestFor: 'Engineering and platform teams modernizing their delivery pipeline.',
  },
  {
    id: 'regulated-ai',
    title: 'Regulated AI Launch Kit',
    tagline: 'Ship AI use cases that satisfy internal risk, legal, and compliance teams.',
    primaryCtaLabel: 'Plan compliant rollout',
    primaryCtaHref: '/ai-services/ai-regulated-industries',
    products: [
      { name: 'AI Governance & Trust', href: '/ai-services/ai-governance-trust' },
      { name: 'AI Security & Responsible AI', href: '/ai-services/ai-security-responsible-ai' },
      { name: 'AI Strategy & Roadmap', href: '/ai-services/ai-strategy-roadmap' },
      { name: 'Zion Compliance Manager', href: '/zion-compliance-manager' },
    ],
    bestFor: 'Leaders in healthcare, finance, legal, and public sector.',
  },
];

function selectBundle(size: CompanySize, industry: Industry, goal: Goal): ProductBundle {
  if (goal === 'revenue') {
    return bundles[0];
  }

  if (goal === 'experience') {
    return bundles[1];
  }

  if (goal === 'operations') {
    return bundles[2];
  }

  if (goal === 'engineering') {
    return bundles[3];
  }

  if (industry === 'financial' || industry === 'healthcare' || industry === 'public') {
    return bundles[4];
  }

  return bundles[0];
}

function buildNarrativeSummary(
  size: CompanySize,
  industry: Industry,
  goal: Goal,
  hasChallenge: boolean,
): NarrativeSummary {
  const sizeLabel =
    size === 'small' ? 'early team' : size === 'mid' ? 'scaling company' : 'large enterprise with multiple teams';

  const industryLabel =
    industry === 'saas'
      ? 'software and SaaS'
      : industry === 'ecommerce'
        ? 'e-commerce and digital retail'
        : industry === 'financial'
          ? 'financial services and fintech'
          : industry === 'healthcare'
            ? 'healthcare and life sciences'
            : industry === 'public'
              ? 'public sector and government'
              : industry === 'industrial'
                ? 'industrial and logistics'
                : 'diverse and cross-industry';

  const goalLabel =
    goal === 'revenue'
      ? 'unlock new revenue and pipeline'
      : goal === 'experience'
        ? 'raise the quality of customer experiences'
        : goal === 'operations'
          ? 'reduce manual operational load'
          : goal === 'engineering'
            ? 'accelerate engineering delivery and quality'
            : 'strengthen risk, governance, and compliance';

  const title = 'Why this configuration fits your AI rollout';

  const challengeSentence = hasChallenge
    ? 'Because you shared additional context, this configuration is tuned as a practical starting point—not a generic bundle.'
    : 'If you add a short description of your main challenge, we can further tailor how this configuration would be rolled out.';

  const body = [
    `You described a ${sizeLabel} operating in ${industryLabel}, looking first to ${goalLabel}.`,
    'This bundle concentrates Zion apps that typically land quickly while leaving space to expand into adjacent teams once the first wins are proven.',
    challengeSentence,
  ].join(' ');

  return { title, body };
}

export default function ProductRecommenderSection({
  items,
  sectionId = 'ai-product-recommender',
}: {
  items?: AIProduct[];
  sectionId?: string;
}) {
  const [companySize, setCompanySize] = useState<CompanySize>('mid');
  const [industry, setIndustry] = useState<Industry>('saas');
  const [goal, setGoal] = useState<Goal>('revenue');
  const [challenge, setChallenge] = useState('');

  const bundle = useMemo(
    () => selectBundle(companySize, industry, goal),
    [companySize, industry, goal],
  );

  const narrative = useMemo(
    () => buildNarrativeSummary(companySize, industry, goal, challenge.trim().length > 0),
    [companySize, industry, goal, challenge],
  );

  return (
    <section
      id={sectionId}
      className="relative mx-auto mt-14 w-full max-w-7xl rounded-3xl border border-purple-500/30 bg-gradient-to-br from-slate-950/95 via-slate-950/90 to-slate-950/95 px-4 py-8 shadow-2xl shadow-purple-900/40 sm:mt-20 sm:px-8 sm:py-10"
      aria-labelledby="product-recommender-heading"
    >
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-300">
            Zion AI rollout copilot
          </p>
          <h2
            id="product-recommender-heading"
            className="mt-2 text-2xl font-semibold text-white sm:text-3xl"
          >
            Describe your company and get a recommended AI stack
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-200">
            Answer three quick questions and we&apos;ll suggest a starting bundle of Zion AI
            products and services tailored to your stage, industry, and primary goal.
          </p>

          <div className="mt-6 space-y-4 text-xs sm:text-[13px]">
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                Company size
              </span>
              <select
                value={companySize}
                onChange={(event) => setCompanySize(event.target.value as CompanySize)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 outline-none transition focus:border-purple-400"
              >
                <option value="small">0-50 people</option>
                <option value="mid">51-500 people</option>
                <option value="enterprise">500+ people</option>
              </select>
            </label>

            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                Industry
              </span>
              <select
                value={industry}
                onChange={(event) => setIndustry(event.target.value as Industry)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 outline-none transition focus:border-purple-400"
              >
                <option value="saas">Software / SaaS</option>
                <option value="ecommerce">E-commerce / Retail</option>
                <option value="financial">Financial services / Fintech</option>
                <option value="healthcare">Healthcare / Life sciences</option>
                <option value="public">Public sector / Government</option>
                <option value="industrial">Industrial / Manufacturing / Logistics</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                Primary goal
              </span>
              <select
                value={goal}
                onChange={(event) => setGoal(event.target.value as Goal)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 outline-none transition focus:border-purple-400"
              >
                <option value="revenue">Grow revenue and pipeline</option>
                <option value="experience">Improve customer experience</option>
                <option value="operations">Reduce manual operations work</option>
                <option value="engineering">Accelerate engineering delivery</option>
                <option value="compliance">Reduce risk and strengthen compliance</option>
              </select>
            </label>

            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                What&apos;s the main challenge you&apos;re trying to solve?
              </span>
              <textarea
                value={challenge}
                onChange={(event) => setChallenge(event.target.value)}
                rows={3}
                className="mt-1 w-full resize-none rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 outline-none transition focus:border-purple-400"
                placeholder="Optional: e.g. reduce response time for inbound leads, cut manual reporting, speed up delivery..."
              />
            </label>
          </div>

          <p className="mt-4 text-[11px] text-slate-400">
            This tool runs fully in your browser. When you&apos;re ready, share your answers with
            our team and we&apos;ll refine the rollout plan with you.
          </p>
        </div>

        <div className="rounded-2xl border border-purple-500/40 bg-slate-950/90 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-purple-200">
            Recommended Zion configuration
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">{bundle.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-200">{bundle.tagline}</p>

          <p className="mt-3 text-xs text-slate-300">
            Best for:{' '}
            <span className="font-medium text-slate-100">{bundle.bestFor}</span>
          </p>

          <div className="mt-4 rounded-xl border border-purple-500/40 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-purple-200">
              Core products & modules
            </p>
            <ul className="mt-2 space-y-1.5">
              {bundle.products.map((product) => (
                <li key={product.href}>
                  <a
                    href={product.href}
                    className="text-xs text-slate-100 underline-offset-2 hover:text-purple-200 hover:underline"
                  >
                    {product.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/80 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
              How this stack fits your context
            </p>
            <h4 className="mt-1 text-xs font-semibold text-slate-100">{narrative.title}</h4>
            <p className="mt-1 text-[11px] leading-5 text-slate-200">{narrative.body}</p>
          </div>

          {challenge.trim().length > 0 ? (
            <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/80 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                How we would approach your challenge
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-200">
                Based on your description, we&apos;d use this bundle to design a focused pilot, plug
                into your existing stack, and measure impact on the KPIs that matter most. Share
                this context with our team and we&apos;ll turn it into a concrete rollout plan.
              </p>
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={bundle.primaryCtaHref}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition hover:from-purple-500 hover:to-pink-500"
            >
              {bundle.primaryCtaLabel}
            </a>
            <a
              href="/contact#engagement"
              className="inline-flex items-center justify-center rounded-xl border border-slate-600 bg-slate-900/80 px-4 py-2.5 text-xs font-semibold text-slate-100 transition hover:border-purple-300 hover:text-white"
            >
              Share my answers with Zion
            </a>
            <a
              href="/ai-services"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-xs font-semibold text-slate-100 transition hover:border-purple-300 hover:text-white"
            >
              Browse all AI services
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

