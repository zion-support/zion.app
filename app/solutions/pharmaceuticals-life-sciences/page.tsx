import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import { ArrowRight } from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import SolutionPageFAQ from '../../components/SolutionPageFAQ';
import { SOLUTION_FAQS } from '../../constants/solutionFAQs';

export const metadata = {
  title: 'Pharmaceuticals & Life Sciences AI Solutions | Zion Tech Group',
  description:
    'Accelerate trial data, regulatory submissions, and quality control with AI-powered compliance and document workflows for pharma and life sciences.',
  alternates: { canonical: '/solutions/pharmaceuticals-life-sciences' },
};

const pharmaApps = [
  { name: 'AI Document Processor', href: '/zion-ai-document-processor' },
  { name: 'AI Quality Assurance', href: '/zion-ai-quality-assurance' },
  { name: 'Compliance Manager', href: '/zion-compliance-manager' },
  { name: 'AI Contract Analyzer', href: '/zion-ai-contract-analyzer' },
  { name: 'AI Data Pipeline', href: '/zion-ai-data-pipeline' },
  { name: 'AI Report Generator', href: '/zion-ai-report-generator' },
];

export default function PharmaceuticalsLifeSciencesSolutionsPage() {
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
            { label: 'Pharmaceuticals & Life Sciences' },
          ]}
          className="mb-6"
        />
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Industry Solutions
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Pharmaceuticals & Life Sciences{' '}
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
              AI Solutions
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Streamline document workflows for regulatory filings, automate quality assurance checks,
            and improve data integrity with AI-powered compliance.
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
            Featured AI Apps for Pharmaceuticals & Life Sciences
          </h2>
          <p className="mt-2 text-slate-300">
            Production-ready tools for regulatory compliance, quality assurance, and document workflows.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {pharmaApps.map((app) => (
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
          <h2 className="mt-2 text-2xl font-bold text-white">Common Pharmaceuticals & Life Sciences Workflows</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Clinical Trial & Regulatory</h3>
              <p className="mt-2 text-sm text-slate-300">
                Automate trial data processing, regulatory submissions, and compliance documentation. Accelerate time to market.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">R&D & Knowledge Management</h3>
              <p className="mt-2 text-sm text-slate-300">
                Centralize research, patents, and literature. Speed up discovery and reduce duplicate work.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Quality & GxP Compliance</h3>
              <p className="mt-2 text-sm text-slate-300">
                Automate batch records, deviations, and CAPA. Maintain audit trails for regulatory inspections.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Supply Chain & Serialization</h3>
              <p className="mt-2 text-sm text-slate-300">
                Track materials, cold chain, and serialization. Ensure traceability and reduce counterfeiting risk.
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
          <h2 className="mt-2 text-xl font-bold text-white">Pharma Accelerates Trial Data Processing 60%</h2>
          <p className="mt-2 text-slate-300">
            A pharmaceutical company deployed Zion AI Document Processor and Report Generator to automate clinical trial data extraction and regulatory reporting. Processing time dropped 60%.
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
        industryName="Pharmaceuticals & Life Sciences"
        items={SOLUTION_FAQS['pharmaceuticals-life-sciences'] ?? []}
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
