import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import { ArrowRight } from 'lucide-react';
import SolutionPageFAQ from '../../components/SolutionPageFAQ';

export const metadata = {
  title: 'Manufacturing & Industrial AI Solutions | Zion Tech Group',
  description:
    'Reduce downtime with predictive maintenance, optimize supply chains, and automate quality assurance with AI-powered workflows for manufacturing.',
  alternates: { canonical: '/solutions/manufacturing-industrial' },
};

const manufacturingApps = [
  { name: 'AI Predictive Maintenance', href: '/zion-ai-predictive-maintenance' },
  { name: 'Supply Chain Optimizer', href: '/supply-chain-optimizer' },
  { name: 'AI Quality Assurance', href: '/zion-ai-quality-assurance' },
  { name: 'AI Document Processor', href: '/zion-ai-document-processor' },
  { name: 'Smart Inventory Manager', href: '/zion-smart-inventory-manager' },
  { name: 'AI Supply Chain Optimizer', href: '/zion-ai-supply-chain-optimizer' },
];

export default function ManufacturingIndustrialSolutionsPage() {
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
            Manufacturing & Industrial{' '}
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
              AI Solutions
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Reduce downtime with predictive maintenance, optimize supply chains, and automate
            quality assurance with AI-powered workflows for manufacturing and industrial operations.
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
          <h2 className="text-xl font-bold text-white">
            Featured AI Apps for Manufacturing & Industrial
          </h2>
          <p className="mt-2 text-slate-300">
            Production-ready tools for predictive maintenance, supply chain, quality assurance, and
            document processing.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {manufacturingApps.map((app) => (
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
          <h2 className="mt-2 text-2xl font-bold text-white">Common Manufacturing & Industrial Workflows</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Predictive Maintenance</h3>
              <p className="mt-2 text-sm text-slate-300">
                Predict equipment failures before they occur. Reduce unplanned downtime and extend asset life.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Supply Chain Optimization</h3>
              <p className="mt-2 text-sm text-slate-300">
                Optimize sourcing, inventory, and logistics. Improve demand forecasting and reduce bottlenecks.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Quality Assurance</h3>
              <p className="mt-2 text-sm text-slate-300">
                Automate defect detection and batch inspection. Improve traceability and reduce waste.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Document & Compliance</h3>
              <p className="mt-2 text-sm text-slate-300">
                Automate work orders, SOPs, and compliance documentation. Maintain audit trails and traceability.
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
          <h2 className="mt-2 text-xl font-bold text-white">Manufacturer Streamlines Supply Chain 45%</h2>
          <p className="mt-2 text-slate-300">
            An industrial manufacturer deployed Zion AI Supply Chain Optimizer and Predictive Maintenance to improve inventory accuracy and reduce equipment downtime. Supply chain costs dropped 45%.
          </p>
          <a
            href="/case-studies"
            className="mt-4 inline-flex items-center text-sm font-semibold text-purple-300 hover:text-purple-200"
          >
            View case studies
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </section>

      <SolutionPageFAQ
        industryName="Manufacturing & Industrial"
        items={[
          {
            question: 'How do predictive maintenance solutions integrate with our equipment?',
            answer:
              'We integrate with common industrial IoT and MES platforms via APIs. Discovery maps your equipment data sources and we design monitoring and alerting flows around your maintenance workflows.',
          },
          {
            question: 'How quickly can we launch a supply chain optimization pilot?',
            answer:
              'Most supply chain pilots launch in 2–4 weeks with scoped demand forecasting and inventory optimization. Full rollout typically takes 6–12 weeks.',
          },
          {
            question: 'Can we start with one plant or facility and scale?',
            answer:
              'Yes. Many manufacturers start with a single facility or production line, validate results, then expand to additional sites.',
          },
          {
            question: 'What support is included after go-live?',
            answer:
              'Runbooks, team training, and handoff guidance are included. Enterprise plans add dedicated success managers and 24/7 infrastructure monitoring.',
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
