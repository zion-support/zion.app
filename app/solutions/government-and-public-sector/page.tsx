import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import { ArrowRight } from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import SolutionPageFAQ from '../../components/SolutionPageFAQ';

export const metadata = {
  title: 'Government & Public Sector AI Solutions | Zion Tech Group',
  description:
    'Streamline citizen services, document processing, and regulatory compliance with secure, audit-ready AI workflows for government and public sector organizations.',
  alternates: { canonical: '/solutions/government-and-public-sector' },
};

const governmentApps = [
  { name: 'AI Document Processor', href: '/zion-ai-document-processor' },
  { name: 'AI Contract Analyzer', href: '/zion-ai-contract-analyzer' },
  { name: 'Compliance Manager', href: '/zion-compliance-manager' },
  { name: 'Security Shield', href: '/zion-security-shield' },
  { name: 'AI Chatbot Builder', href: '/zion-ai-chatbot-builder' },
  { name: 'AI Report Generator', href: '/zion-ai-report-generator' },
];

export default function GovernmentPublicSectorSolutionsPage() {
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
            { label: 'Government & Public Sector' },
          ]}
          className="mb-6"
        />
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Industry Solutions
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Government & Public Sector{' '}
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
              AI Solutions
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Automate document processing, citizen intake, and regulatory reporting with secure,
            audit-ready AI workflows. Streamline citizen services and compliance for government agencies.
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
          <h2 className="text-xl font-bold text-white">Featured AI Apps for Government & Public Sector</h2>
          <p className="mt-2 text-slate-300">
            Production-ready tools for document processing, citizen intake, compliance, and secure communications.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {governmentApps.map((app) => (
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
          <h2 className="mt-2 text-2xl font-bold text-white">Common Government & Public Sector Workflows</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Citizen Services & Intake</h3>
              <p className="mt-2 text-sm text-slate-300">
                Automate application processing, document collection, and status updates. Improve citizen experience and reduce backlogs.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Document Processing</h3>
              <p className="mt-2 text-sm text-slate-300">
                Extract data from forms, permits, and reports. Reduce manual data entry and accelerate processing.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Compliance & Reporting</h3>
              <p className="mt-2 text-sm text-slate-300">
                Maintain audit trails and regulatory compliance. Automate reporting for internal and external stakeholders.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Secure Communications</h3>
              <p className="mt-2 text-sm text-slate-300">
                Deploy secure chatbots and knowledge bases for citizen inquiries. Scale support without compromising security.
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
          <h2 className="mt-2 text-xl font-bold text-white">Government Agency Streamlines Citizen Intake 40%</h2>
          <p className="mt-2 text-slate-300">
            A government agency deployed Zion AI Document Processor and Chatbot Builder to automate permit applications and citizen inquiries. Processing time dropped 40% while improving transparency.
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
        industryName="Government & Public Sector"
        items={[
          {
            question: 'Are solutions compliant with government security and data residency requirements?',
            answer:
              'Yes. We design for FedRAMP, state, and local requirements. Discovery maps your security and residency needs. Solutions can run on government-approved cloud or on-premises.',
          },
          {
            question: 'How do we handle sensitive citizen data?',
            answer:
              'We use encryption, access controls, and audit trails. Data can be processed in-region. BAA and DPA support are available where required.',
          },
          {
            question: 'How quickly can we deploy a pilot?',
            answer:
              'Government pilots typically launch in 4–8 weeks depending on procurement and security review. We scope a focused use case (e.g., document intake or citizen chatbot) first.',
          },
          {
            question: 'What support is included after go-live?',
            answer:
              'Runbooks, staff training, and handoff guidance are included. Enterprise plans add dedicated success managers and 24/7 infrastructure monitoring.',
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
