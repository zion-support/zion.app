import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import { ArrowRight } from 'lucide-react';
import SolutionPageFAQ from '../../components/SolutionPageFAQ';

export const metadata = {
  title: 'Financial Services AI Solutions | Zion Tech Group',
  description:
    'Automate compliance, accelerate lending decisions, and deploy fraud detection for financial institutions. AI-powered workflows for banks, credit unions, and fintech.',
  alternates: { canonical: '/solutions/financial-services' },
};

const financialServicesApps = [
  { name: 'AI Fraud Detector', href: '/zion-ai-fraud-detection' },
  { name: 'AI Financial Forecaster', href: '/zion-ai-financial-forecaster' },
  { name: 'Compliance Manager', href: '/zion-compliance-manager' },
  { name: 'AI Contract Analyzer', href: '/zion-ai-contract-analyzer' },
  { name: 'AI Risk Assessor', href: '/zion-ai-risk-assessor' },
  { name: 'AI Document Processor', href: '/zion-ai-document-processor' },
];

export default function FinancialServicesSolutionsPage() {
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
            Financial Services{' '}
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
              AI Solutions
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Deploy fraud detection, risk scoring, and regulatory compliance workflows that reduce
            manual review time and increase approval accuracy for banks, credit unions, and fintech.
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
          <h2 className="text-xl font-bold text-white">Featured AI Apps for Financial Services</h2>
          <p className="mt-2 text-slate-300">
            Production-ready tools for fraud detection, compliance, risk assessment, and document
            processing.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {financialServicesApps.map((app) => (
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
          <h2 className="mt-2 text-2xl font-bold text-white">Common Financial Services Workflows</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Fraud Detection & AML</h3>
              <p className="mt-2 text-sm text-slate-300">
                Automate transaction monitoring, anomaly detection, and suspicious activity reporting. Reduce false positives and improve compliance.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Lending & Credit Decisions</h3>
              <p className="mt-2 text-sm text-slate-300">
                Accelerate document review, risk scoring, and approval workflows. Reduce manual review time while maintaining accuracy.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Regulatory Compliance</h3>
              <p className="mt-2 text-sm text-slate-300">
                Automate KYC, regulatory reporting, and audit trail management. Stay compliant with SOC 2, GDPR, and industry-specific requirements.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Contract & Document Analysis</h3>
              <p className="mt-2 text-sm text-slate-300">
                Extract and analyze terms from contracts, policies, and reports. Surface risk clauses and automate compliance checks.
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
          <h2 className="mt-2 text-xl font-bold text-white">Fintech Startup Passes SOC 2 Audit in 8 Weeks</h2>
          <p className="mt-2 text-slate-300">
            A Series A fintech company used Zion Compliance Manager and Security Shield to establish controls and pass their first SOC 2 audit ahead of schedule.
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
        industryName="Financial Services"
        items={[
          {
            question: 'How do you handle regulatory compliance (SOC 2, GDPR, etc.)?',
            answer:
              'Our Financial Services solutions include compliance controls, audit trails, and access policies. Discovery maps your regulatory requirements and we design implementation scope accordingly.',
          },
          {
            question: 'How quickly can we deploy a fraud detection pilot?',
            answer:
              'Most fraud detection pilots launch in 2–4 weeks with scoped transaction monitoring and integration to your core systems. Full rollout typically takes 6–12 weeks.',
          },
          {
            question: 'Can you integrate with our core banking or lending platform?',
            answer:
              'Yes. We integrate with common core banking, lending, and payment platforms. Discovery includes mapping your existing systems and defining integration scope.',
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
