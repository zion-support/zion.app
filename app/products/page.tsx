import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import { ArrowRight } from 'lucide-react';
import { AUTOMATION_LINKS } from '../constants/navigation';
import Breadcrumb from '../components/Breadcrumb';

export const metadata = {
  title: 'Products | Zion Tech Group',
  description:
    'Explore Zion Tech Group production-ready products — analytics, CRM, content, project management, and more. Built for teams that need measurable results.',
  alternates: { canonical: '/products' },
};

const productCategories = [
  {
    title: 'Analytics & Intelligence',
    description: 'Turn raw data into actionable insights with real-time dashboards, forecasting, and KPI tracking.',
    icon: '📊',
    products: [
      { name: 'Zion Analytics Pro', href: '/zion-analytics-pro' },
      { name: 'Zion Smart Analytics Dashboard', href: '/zion-smart-analytics-dashboard' },
      { name: 'Zion Performance Monitor', href: '/zion-performance-monitor' },
      { name: 'AI Predictive Analytics', href: '/zion-ai-predictive-analytics' },
    ],
  },
  {
    title: 'Sales & Marketing',
    description: 'Accelerate pipeline velocity with AI-powered lead scoring, email marketing, and SEO tools.',
    icon: '🚀',
    products: [
      { name: 'Zion Lead Magnet', href: '/zion-lead-magnet' },
      { name: 'AI Lead Scoring', href: '/zion-ai-lead-scoring' },
      { name: 'AI Email Marketing Pro', href: '/zion-ai-email-marketing-pro' },
      { name: 'AI SEO Optimizer', href: '/zion-ai-seo-optimizer' },
      { name: 'AI Social Media Manager', href: '/zion-ai-social-media-manager' },
    ],
  },
  {
    title: 'CRM & Customer Operations',
    description: 'Manage customer relationships, support tickets, and retention strategies in one place.',
    icon: '🤝',
    products: [
      { name: 'Zion CRM Intelligence', href: '/zion-crm-intelligence' },
      { name: 'AI Customer Support Pro', href: '/zion-ai-customer-support-pro' },
      { name: 'AI Chatbot Builder', href: '/zion-ai-chatbot-builder' },
      { name: 'Smart CRM Automation', href: '/zion-smart-crm-automation' },
    ],
  },
  {
    title: 'Content & Collaboration',
    description: 'Create, manage, and distribute content across channels with AI-powered workflows.',
    icon: '✍️',
    products: [
      { name: 'Zion Content Studio', href: '/zion-content-studio' },
      { name: 'AI Meeting Assistant', href: '/zion-ai-meeting-assistant' },
      { name: 'Zion Project Master', href: '/zion-project-master' },
      { name: 'AI Voice Assistant', href: '/zion-ai-voice-assistant' },
    ],
  },
  {
    title: 'Finance & Operations',
    description: 'Streamline invoicing, expense tracking, and fraud detection with intelligent automation.',
    icon: '💰',
    products: [
      { name: 'Zion Invoice Genius', href: '/zion-invoice-genius' },
      { name: 'AI Fraud Detection', href: '/zion-ai-fraud-detection' },
      { name: 'Zion Data Sync', href: '/zion-data-sync' },
    ],
  },
  {
    title: 'Automation & Workflows',
    description: 'Eliminate manual bottlenecks with intelligent process orchestration and cross-system integration.',
    icon: '⚡',
    products: AUTOMATION_LINKS.slice(0, 6).map((link) => ({
      name: link.name,
      href: link.href,
    })),
  },
];

export default function ProductsPage() {
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
            { label: 'Products' },
          ]}
          className="mb-6"
        />
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">Products</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Tools built for{' '}
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
              real teams
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Production-ready products organized by business function. Each product includes verified
            links, practical delivery paths, and measurable KPI tracking.
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
              href="/pricing"
              className="inline-flex items-center justify-center rounded-xl border border-slate-600 bg-slate-900/60 px-7 py-3 text-base font-semibold text-slate-100 transition hover:border-purple-400 hover:text-white"
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {productCategories.map((category) => (
            <div
              key={category.title}
              className="group rounded-2xl border border-slate-700/60 bg-slate-900/60 p-6 transition hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-xl">
                  {category.icon}
                </span>
                <h2 className="text-lg font-semibold text-white">{category.title}</h2>
              </div>
              <p className="mb-5 text-sm leading-relaxed text-slate-400">{category.description}</p>
              <ul className="space-y-2">
                {category.products.map((product) => (
                  <li key={product.href}>
                    <a
                      href={product.href}
                      className="group/link flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/40 px-3 py-2 text-sm text-slate-200 transition hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-white"
                    >
                      {product.name}
                      <ArrowRight className="h-3.5 w-3.5 text-slate-500 transition group-hover/link:text-purple-400" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-slate-700/70 bg-gradient-to-br from-slate-900/80 to-slate-950/70 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            How we deliver
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            From pilot to production
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Every product deployment includes implementation support, integration, and measurable KPI tracking.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Pilot Sprint</h3>
              <p className="mt-2 text-sm text-slate-300">
                Launch a scoped pilot in 2-4 weeks with clear KPI tracking. Validate impact before scaling.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Full Rollout</h3>
              <p className="mt-2 text-sm text-slate-300">
                End-to-end implementation with integration, security, and optimization. Ready for production.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Ongoing Support</h3>
              <p className="mt-2 text-sm text-slate-300">
                Runbooks, training, and observability so your team can operate and extend with confidence.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="mb-4 text-sm text-slate-400">
            Looking for AI services?
          </p>
          <a
            href="/ai-services"
            className="inline-flex items-center justify-center rounded-xl border border-purple-500/40 bg-purple-500/10 px-6 py-3 text-sm font-semibold text-purple-200 transition hover:border-purple-400 hover:bg-purple-500/20 hover:text-white"
          >
            Browse AI Services
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
