import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import { ArrowRight } from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import SolutionPageFAQ from '../../components/SolutionPageFAQ';

export const metadata = {
  title: 'Technology & SaaS AI Solutions | Zion Tech Group',
  description:
    'Accelerate product development, automate customer onboarding, and optimize conversion with AI-powered product workflows for technology and SaaS companies.',
  alternates: { canonical: '/solutions/technology-and-saas' },
};

const technologySaaSApps = [
  { name: 'AI Code Assistant', href: '/zion-ai-code-assistant' },
  { name: 'AI Onboarding Pro', href: '/zion-ai-onboarding-pro' },
  { name: 'AI SEO Optimizer', href: '/zion-ai-seo-optimizer' },
  { name: 'AI Website Analyzer', href: '/zion-ai-website-analyzer' },
  { name: 'AI Code Reviewer', href: '/zion-ai-code-reviewer' },
  { name: 'AI Marketing Automation', href: '/zion-ai-marketing-automation' },
];

export default function TechnologySaaSSolutionsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-16 left-[-9rem] h-[26rem] w-[26rem] rounded-full bg-purple-500/25 blur-3xl" />
        <div className="absolute right-[-8rem] top-40 h-[22rem] w-[22rem] rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Solutions', href: '/solutions' },
            { label: 'Technology & SaaS' },
          ]}
          className="mb-6"
        />
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Industry Solutions
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Technology & SaaS{' '}
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
              AI Solutions
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Scale engineering velocity, automate customer onboarding, and optimize conversion with
            AI-powered product workflows for technology and SaaS companies.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-purple-700/20 transition hover:-translate-y-0.5 hover:from-purple-500 hover:to-pink-500"
             data-cta-event="cta_discovery" data-cta-label="page">
              Book a Discovery Call
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a
              href="/solutions"
              className="inline-flex items-center justify-center rounded-xl border border-slate-500/80 bg-slate-900/60 px-7 py-3 text-base font-semibold text-slate-100 transition hover:border-purple-300/70 hover:text-white"
            >
              View All Solutions
            </a>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 shadow-lg shadow-black/20 sm:p-8">
          <h2 className="text-xl font-bold text-white">Featured AI Apps for Technology & SaaS</h2>
          <p className="mt-2 text-slate-300">
            Production-ready tools for code development, onboarding, SEO, and conversion optimization.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {technologySaaSApps.map((app) => (
              <a
                key={app.href}
                href={app.href}
                className="flex items-center justify-between rounded-xl border border-slate-700/70 bg-slate-950/60 px-4 py-3 text-slate-100 transition hover:border-purple-400/50 hover:text-white"
              >
                <span>{app.name}</span>
                <ArrowRight className="h-4 w-4 text-purple-400" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-gradient-to-br from-slate-900/80 to-slate-950/70 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Use cases
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">Common Technology & SaaS Workflows</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Engineering Velocity</h3>
              <p className="mt-2 text-sm text-slate-300">
                Accelerate code reviews, automated testing, and deployment orchestration. Ship features faster with AI-assisted development.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Customer Onboarding</h3>
              <p className="mt-2 text-sm text-slate-300">
                Automate signup flows, onboarding checklists, and activation tracking. Reduce time-to-value for new customers.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Conversion Optimization</h3>
              <p className="mt-2 text-sm text-slate-300">
                Improve SEO, landing page performance, and conversion funnel analytics. Data-driven insights for growth teams.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Product Analytics</h3>
              <p className="mt-2 text-sm text-slate-300">
                Track usage, engagement, and feature adoption. AI-powered dashboards and automated reporting for product decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-purple-500/20 bg-slate-900/65 p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Case study
          </p>
          <h2 className="mt-2 text-xl font-bold text-white">SaaS Platform Ships 3x Faster with AI Code Assistant</h2>
          <p className="mt-2 text-slate-300">
            A B2B SaaS company used Zion AI Code Assistant and Code Reviewer to accelerate development cycles, reduce code review time by 60%, and ship features 3x faster.
          </p>
          <a
            href="/case-studies#industry=Technology"
            className="mt-4 inline-flex items-center text-sm font-semibold text-purple-300 hover:text-purple-200"
          >
            View case studies
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </section>

      <SolutionPageFAQ
        industryName="Technology & SaaS"
        items={[
          {
            question: 'How do AI code tools integrate with our existing dev stack?',
            answer:
              'We integrate with GitHub, GitLab, Bitbucket, and common CI/CD pipelines. AI Code Assistant and Code Reviewer work alongside your existing workflows without replacing your tools.',
          },
          {
            question: 'Can we use AI for customer onboarding and activation?',
            answer:
              'Yes. AI Onboarding Pro creates personalized flows based on user behavior. Many SaaS teams see 30–40% improvement in activation and time-to-value.',
          },
          {
            question: 'How quickly can we deploy a pilot?',
            answer:
              'Most engineering or onboarding pilots launch in 2–4 weeks. We scope a focused use case (e.g., code review automation or onboarding flows) and expand from there.',
          },
          {
            question: 'What support is included after go-live?',
            answer:
              'Runbooks, team training, and handoff guidance are included. Enterprise plans add dedicated success managers and ongoing optimization support.',
          },
        ]}
      />

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <a
          href="/industries"
          className="inline-flex items-center text-sm font-medium text-purple-300 hover:text-purple-200"
        >
          ← Back to Industry Solutions
        </a>
      </section>
    </div>
  );
}
