import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import { ArrowRight } from 'lucide-react';
import SolutionPageFAQ from '../../components/SolutionPageFAQ';
import { SOLUTION_FAQS } from '../../constants/solutionFAQs';

export const metadata = {
  title: 'Automotive & Mobility AI Solutions | Zion Tech Group',
  description:
    'Streamline supply chain, quality assurance, and fleet operations with AI-powered workflows for automotive and mobility businesses.',
  alternates: { canonical: '/solutions/automotive-mobility' },
};

const automotiveApps = [
  { name: 'AI Supply Chain Optimizer', href: '/zion-ai-supply-chain-optimizer' },
  { name: 'AI Predictive Maintenance', href: '/zion-ai-predictive-maintenance' },
  { name: 'AI Quality Assurance', href: '/zion-ai-quality-assurance' },
  { name: 'Smart Inventory Manager', href: '/zion-smart-inventory-manager' },
  { name: 'AI Document Processor', href: '/zion-ai-document-processor' },
  { name: 'Workflow Automation', href: '/zion-workflow-automation' },
];

export default function AutomotiveMobilitySolutionsPage() {
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
            Automotive & Mobility{' '}
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
              AI Solutions
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Optimize parts inventory, predict equipment failures, automate quality assurance, and improve
            logistics with AI-powered workflows for automotive and mobility operations.
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
          <h2 className="text-xl font-bold text-white">Featured AI Apps for Automotive & Mobility</h2>
          <p className="mt-2 text-slate-300">
            Production-ready tools for supply chain, predictive maintenance, quality assurance, and fleet
            operations.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {automotiveApps.map((app) => (
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
          <h2 className="mt-2 text-2xl font-bold text-white">Common Automotive & Mobility Workflows</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Supply Chain & Procurement</h3>
              <p className="mt-2 text-sm text-slate-300">
                Optimize parts sourcing, inventory, and supplier management. Reduce supply chain disruptions and costs.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Predictive Maintenance</h3>
              <p className="mt-2 text-sm text-slate-300">
                Monitor fleet and equipment health. Predict failures before they occur and reduce downtime.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Quality & Compliance</h3>
              <p className="mt-2 text-sm text-slate-300">
                Automate quality inspection and compliance documentation. Maintain traceability and audit trails.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Fleet & Operations</h3>
              <p className="mt-2 text-sm text-slate-300">
                Optimize routing, scheduling, and resource allocation. Improve utilization and reduce costs.
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
          <h2 className="mt-2 text-xl font-bold text-white">Auto Manufacturer Streamlines Supply Chain 45%</h2>
          <p className="mt-2 text-slate-300">
            An automotive manufacturer deployed Zion AI Supply Chain Optimizer and Predictive Maintenance to improve parts visibility and equipment reliability. Supply chain costs dropped 45%.
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
        industryName="Automotive & Mobility"
        items={SOLUTION_FAQS['automotive-mobility'] ?? []}
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
