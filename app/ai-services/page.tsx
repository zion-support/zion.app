import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import { ArrowRight } from 'lucide-react';
import { AI_SERVICE_LINKS } from '../constants/navigation';
import Breadcrumb from '../components/Breadcrumb';

export const metadata = {
  title: 'AI Services | Zion Tech Group',
  description:
    'Browse all Zion Tech Group AI services — chatbots, DevOps, code review, predictive analytics, security, and more. Production-ready AI for real business outcomes.',
  alternates: { canonical: '/ai-services' },
};

const serviceCategories = [
  {
    title: 'Advanced AI Services',
    description: 'Enterprise-grade generative AI, autonomous agents, multimodal intelligence, RAG, governance, and AI copilots.',
    icon: '🧠',
    services: [
      {
        name: 'Advanced AI & Enterprise Intelligence Hub',
        href: '/ai-services/advanced-ai-enterprise-intelligence-hub',
      },
      { name: 'Generative AI Enterprise', href: '/ai-services/generative-ai-enterprise' },
      { name: 'AI Agents & Autonomous Workflows', href: '/ai-services/ai-agents-autonomous' },
      { name: 'AI Multimodal Intelligence', href: '/ai-services/ai-multimodal-intelligence' },
      { name: 'AI RAG & Knowledge Systems', href: '/ai-services/ai-rag-knowledge-systems' },
      { name: 'AI Governance & Trust', href: '/ai-services/ai-governance-trust' },
      { name: 'AI Model Orchestration', href: '/ai-services/ai-model-orchestration' },
      { name: 'AI Copilot & Enterprise Assistants', href: '/ai-services/ai-copilot-enterprise' },
      { name: 'AI Observability & MLOps', href: '/ai-services/ai-observability-mlops' },
      { name: 'AI Strategy & Roadmap', href: '/ai-services/ai-strategy-roadmap' },
      { name: 'AI Integration & APIs', href: '/ai-services/ai-integration-apis' },
      { name: 'AI Edge & Real-Time Inference', href: '/ai-services/ai-edge-realtime-inference' },
      { name: 'AI for Regulated Industries', href: '/ai-services/ai-regulated-industries' },
      { name: 'AI Foundation Models & Custom Training', href: '/ai-services/ai-foundation-models-custom-training' },
      { name: 'AI Security & Responsible AI', href: '/ai-services/ai-security-responsible-ai' },
      { name: 'Autonomous Growth Intelligence', href: '/ai-services/autonomous-growth-intelligence' },
    ],
  },
  {
    title: 'Customer & Support',
    description: 'AI-powered customer engagement, support automation, and chat experiences.',
    icon: '💬',
    services: [
      { name: 'Zion AI Chatbot Builder', href: '/zion-ai-chatbot-builder' },
      { name: 'Zion AI Customer Support Pro', href: '/zion-ai-customer-support-pro' },
      { name: 'AI Email Analyzer', href: '/ai-powered-email-analyzer' },
      { name: 'Zion AI Help Desk', href: '/zion-ai-help-desk' },
      { name: 'Zion AI Knowledge Base', href: '/zion-ai-knowledge-base' },
    ],
  },
  {
    title: 'Engineering & DevOps',
    description: 'Accelerate development with AI code generation, review, testing, and deployment.',
    icon: '⚙️',
    services: [
      { name: 'AI-Powered DevOps', href: '/ai-powered-devops' },
      { name: 'Zion AI Code Assistant', href: '/zion-ai-code-assistant' },
      { name: 'Zion AI Code Reviewer', href: '/zion-ai-code-reviewer' },
      { name: 'Zion AI API Tester', href: '/zion-ai-api-tester' },
      { name: 'Zion AI Database Optimizer', href: '/zion-ai-database-optimizer' },
      { name: 'Zion AI Quality Assurance', href: '/zion-ai-quality-assurance' },
    ],
  },
  {
    title: 'Security & Compliance',
    description: 'Protect systems and data with AI-driven threat detection, auditing, and risk assessment.',
    icon: '🛡️',
    services: [
      { name: 'Zion Security Shield', href: '/zion-security-shield' },
      { name: 'Cybersecurity Audit', href: '/it-services/cybersecurity-audit' },
      { name: 'Zion Cloud Vault', href: '/zion-cloud-vault' },
      { name: 'Zion AI Risk Assessor', href: '/zion-ai-risk-assessor' },
    ],
  },
  {
    title: 'Analytics & Reporting',
    description: 'Transform data into insights with predictive analytics, dashboards, and automated reporting.',
    icon: '📊',
    services: [
      { name: 'Zion AI Predictive Analytics', href: '/zion-ai-predictive-analytics' },
      { name: 'Zion AI Report Generator', href: '/zion-ai-report-generator' },
    ],
  },
  {
    title: 'Industry Solutions',
    description: 'Specialized AI tools for property management, supply chain, and education.',
    icon: '🏢',
    services: [
      { name: 'Property Management AI', href: '/property-management-ai' },
      { name: 'Supply Chain Optimizer', href: '/supply-chain-optimizer' },
      { name: 'Online Learning Platform', href: '/online-learning-platform' },
    ],
  },
];

export default function AIServicesPage() {
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
            { label: 'AI Services' },
          ]}
          className="mb-6"
        />
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">AI Services</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            AI services for{' '}
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
              every business function
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Browse {AI_SERVICE_LINKS.length}+ production-ready AI services organized by category. Each
            service includes practical delivery paths, integration guides, and measurable ROI tracking.
          </p>
          <p className="mt-4 text-base leading-7 text-slate-400">
            From advanced AI (generative AI, agents, RAG, governance) to customer support, engineering, security, and industry-specific solutions — find the right fit for your use case and scale with confidence.
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

      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            How we deliver AI services
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            From discovery to production
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Every AI service deployment follows a clear path: scoped discovery, pilot with measurable KPIs, integration and security hardening, and handoff with runbooks and training.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <span className="rounded-full border border-purple-400/40 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-200">Step 1</span>
              <h3 className="mt-3 font-semibold text-white">Discovery</h3>
              <p className="mt-2 text-sm text-slate-300">Align goals, use cases, and success metrics in a focused workshop.</p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <span className="rounded-full border border-purple-400/40 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-200">Step 2</span>
              <h3 className="mt-3 font-semibold text-white">Pilot</h3>
              <p className="mt-2 text-sm text-slate-300">Launch a 2–4 week pilot with clear KPIs and integration checkpoints.</p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <span className="rounded-full border border-purple-400/40 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-200">Step 3</span>
              <h3 className="mt-3 font-semibold text-white">Integration</h3>
              <p className="mt-2 text-sm text-slate-300">Connect to your stack with security, observability, and compliance built in.</p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <span className="rounded-full border border-purple-400/40 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-200">Step 4</span>
              <h3 className="mt-3 font-semibold text-white">Scale & handoff</h3>
              <p className="mt-2 text-sm text-slate-300">Expand use cases and hand off with runbooks, training, and ongoing support.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {serviceCategories.map((category) => (
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
                {category.services.map((service) => (
                  <li key={service.href}>
                    <a
                      href={service.href}
                      className="group/link flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/40 px-3 py-2 text-sm text-slate-200 transition hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-white"
                    >
                      {service.name}
                      <ArrowRight className="h-3.5 w-3.5 text-slate-500 transition group-hover/link:text-purple-400" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Industry Solutions
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            AI services for your vertical
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Explore AI solutions built for specific industries and use cases. Each industry solution includes tailored apps, use cases, and case studies.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/solutions/healthcare"
              className="inline-flex items-center rounded-xl border border-slate-700/70 bg-slate-950/60 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-purple-400/50 hover:text-white"
            >
              Healthcare
              <ArrowRight className="ml-2 h-3.5 w-3.5 text-purple-400" />
            </a>
            <a
              href="/solutions/financial-services"
              className="inline-flex items-center rounded-xl border border-slate-700/70 bg-slate-950/60 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-purple-400/50 hover:text-white"
            >
              Financial Services
              <ArrowRight className="ml-2 h-3.5 w-3.5 text-purple-400" />
            </a>
            <a
              href="/solutions/technology-and-saas"
              className="inline-flex items-center rounded-xl border border-slate-700/70 bg-slate-950/60 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-purple-400/50 hover:text-white"
            >
              Technology & SaaS
              <ArrowRight className="ml-2 h-3.5 w-3.5 text-purple-400" />
            </a>
            <a
              href="/solutions/ecommerce-retail"
              className="inline-flex items-center rounded-xl border border-slate-700/70 bg-slate-950/60 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-purple-400/50 hover:text-white"
            >
              E-Commerce & Retail
              <ArrowRight className="ml-2 h-3.5 w-3.5 text-purple-400" />
            </a>
            <a
              href="/solutions/manufacturing-industrial"
              className="inline-flex items-center rounded-xl border border-slate-700/70 bg-slate-950/60 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-purple-400/50 hover:text-white"
            >
              Manufacturing
              <ArrowRight className="ml-2 h-3.5 w-3.5 text-purple-400" />
            </a>
            <a
              href="/solutions/legal-professional-services"
              className="inline-flex items-center rounded-xl border border-slate-700/70 bg-slate-950/60 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-purple-400/50 hover:text-white"
            >
              Legal
              <ArrowRight className="ml-2 h-3.5 w-3.5 text-purple-400" />
            </a>
            <a
              href="/industries"
              className="inline-flex items-center rounded-xl border border-purple-400/40 bg-purple-500/10 px-4 py-3 text-sm font-medium text-purple-200 transition hover:bg-purple-500/20"
            >
              View All Industries
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-900/25 via-fuchsia-900/20 to-pink-900/25 p-8">
          <h2 className="mb-2 text-2xl font-semibold text-white">All AI Services</h2>
          <p className="mb-6 text-sm text-slate-300">
            Complete directory of every AI service available on the Zion platform.
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {AI_SERVICE_LINKS.map((service) => (
              <a
                key={service.href}
                href={service.href}
                className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-200 transition hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-white"
              >
                {service.name}
                <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-slate-500" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-sm text-slate-400">
            Looking for products and platforms?
          </p>
          <a
            href="/products"
            className="inline-flex items-center justify-center rounded-xl border border-purple-500/40 bg-purple-500/10 px-6 py-3 text-sm font-semibold text-purple-200 transition hover:border-purple-400 hover:bg-purple-500/20 hover:text-white"
          >
            Browse Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
