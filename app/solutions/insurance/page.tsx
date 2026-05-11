import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import { ArrowRight } from 'lucide-react';
import SolutionPageFAQ from '../../components/SolutionPageFAQ';

export const metadata = {
  title: 'Insurance AI Solutions | Zion Tech Group',
  description:
    'Streamline claims processing, fraud detection, and policy analysis for insurers. AI-powered workflows that reduce manual review and improve accuracy.',
  alternates: { canonical: '/solutions/insurance' },
};

const insuranceApps = [
  { name: 'AI Document Processor', href: '/zion-ai-document-processor' },
  { name: 'AI Fraud Detector', href: '/zion-ai-fraud-detector' },
  { name: 'AI Contract Analyzer', href: '/zion-ai-contract-analyzer' },
  { name: 'AI Risk Assessor', href: '/zion-ai-risk-assessor' },
  { name: 'Compliance Manager', href: '/zion-compliance-manager' },
  { name: 'AI Report Generator', href: '/zion-ai-report-generator' },
];

export default function InsuranceSolutionsPage() {
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
            Insurance{' '}
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
              AI Solutions
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Automate claims intake, fraud detection, and policy analysis with AI-powered workflows
            that reduce manual review and improve accuracy for carriers and MGAs.
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
          <h2 className="text-xl font-bold text-white">Featured AI Apps for Insurance</h2>
          <p className="mt-2 text-slate-300">
            Production-ready tools for claims processing, fraud detection, policy analysis, and
            compliance reporting.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {insuranceApps.map((app) => (
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
          <h2 className="mt-2 text-2xl font-bold text-white">Common Insurance Workflows</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Claims Processing</h3>
              <p className="mt-2 text-sm text-slate-300">
                Automate intake, document extraction, and triage. Reduce cycle time and improve accuracy for claims handling.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Fraud Detection</h3>
              <p className="mt-2 text-sm text-slate-300">
                Identify suspicious patterns and anomalies. Flag high-risk claims for review and reduce fraud loss.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Policy Analysis & Underwriting</h3>
              <p className="mt-2 text-sm text-slate-300">
                Extract terms, compare policies, and assess risk. Speed up underwriting and improve consistency.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Compliance & Reporting</h3>
              <p className="mt-2 text-sm text-slate-300">
                Maintain audit trails and regulatory compliance. Automate reporting for internal and external stakeholders.
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
          <h2 className="mt-2 text-xl font-bold text-white">Insurance Firm Automates Claims 45%</h2>
          <p className="mt-2 text-slate-300">
            An insurance carrier deployed Zion AI Document Processor and Fraud Detector to automate claims intake and fraud screening. Claims processing time dropped 45% while fraud detection improved.
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
        industryName="Insurance"
        items={[
          {
            question: 'How do you handle claims data security and compliance?',
            answer:
              'Our Insurance solutions include access controls, audit trails, and encryption. Discovery maps your compliance requirements (SOC 2, HIPAA where applicable) and we design implementation scope accordingly.',
          },
          {
            question: 'How quickly can we deploy a claims automation pilot?',
            answer:
              'Most claims intake pilots launch in 2–4 weeks with scoped document extraction and integration to your claims system. Full rollout typically takes 6–12 weeks.',
          },
          {
            question: 'Can you integrate with our policy administration or claims system?',
            answer:
              'Yes. We integrate with common policy admin and claims platforms. Discovery includes mapping your existing systems and defining integration scope.',
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
