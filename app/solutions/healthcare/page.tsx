import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import { ArrowRight } from 'lucide-react';
import SolutionPageFAQ from '../../components/SolutionPageFAQ';

export const metadata = {
  title: 'Healthcare AI Solutions | Zion Tech Group',
  description:
    'Streamline medical records, patient communication, and appointment scheduling with HIPAA-compliant AI workflows. Digitize intake and improve care delivery.',
  alternates: { canonical: '/solutions/healthcare' },
};

const healthcareApps = [
  { name: 'Medical Records Manager', href: '/medical-records-manager' },
  { name: 'AI Document Processor', href: '/zion-ai-document-processor' },
  { name: 'AI Chatbot Builder', href: '/zion-ai-chatbot-builder' },
  { name: 'Security Shield', href: '/zion-security-shield' },
  { name: 'AI Meeting Assistant', href: '/zion-ai-meeting-assistant' },
  { name: 'Compliance Manager', href: '/zion-compliance-manager' },
];

export default function HealthcareSolutionsPage() {
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
            Healthcare{' '}
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
              AI Solutions
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Digitize medical records, automate appointment scheduling, and build AI-assisted patient intake flows
            with full HIPAA compliance. Streamline records and improve patient communication.
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
          <h2 className="text-xl font-bold text-white">Featured AI Apps for Healthcare</h2>
          <p className="mt-2 text-slate-300">
            Production-ready tools for medical records, patient intake, document processing, and secure communications.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {healthcareApps.map((app) => (
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
          <h2 className="mt-2 text-2xl font-bold text-white">Common Healthcare Workflows</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Patient Intake & Scheduling</h3>
              <p className="mt-2 text-sm text-slate-300">
                Automate appointment booking, pre-visit forms, and intake questionnaires. Reduce no-shows with smart reminders.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Medical Records Digitization</h3>
              <p className="mt-2 text-sm text-slate-300">
                Extract and structure data from paper records, faxes, and scanned documents. HIPAA-compliant processing and storage.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Patient Communication</h3>
              <p className="mt-2 text-sm text-slate-300">
                AI chatbots for FAQs, appointment confirmations, and follow-up. Route complex inquiries to staff with full context.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Compliance & Audit</h3>
              <p className="mt-2 text-sm text-slate-300">
                Maintain audit trails, access controls, and documentation for HIPAA, SOC 2, and regulatory requirements.
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
          <h2 className="mt-2 text-xl font-bold text-white">Healthcare Provider Modernizes Records Workflow</h2>
          <p className="mt-2 text-slate-300">
            A multi-location healthcare provider used AI Document Processor and Medical Records Manager to digitize intake workflows and reduce manual data entry by 75%.
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
        industryName="Healthcare"
        items={[
          {
            question: 'Is the solution HIPAA compliant?',
            answer:
              'Yes. Our healthcare solutions are designed for HIPAA compliance with access controls, audit trails, encryption, and BAA support where required.',
          },
          {
            question: 'How quickly can we deploy a pilot?',
            answer:
              'Most healthcare pilots launch in 2–4 weeks with scoped workflows (e.g., intake digitization or appointment scheduling) and clear KPI tracking.',
          },
          {
            question: 'Can we integrate with our EHR or practice management system?',
            answer:
              'Yes. We integrate with common EHR and practice management platforms. Discovery includes mapping your existing systems and defining integration scope.',
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
