import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import { ArrowRight } from 'lucide-react';
import SolutionPageFAQ from '../../components/SolutionPageFAQ';
import Breadcrumb from '../../components/Breadcrumb';

export const metadata = {
  title: 'Legal & Professional Services AI Solutions | Zion Tech Group',
  description:
    'Accelerate contract review, case management, and client intake with AI-powered legal workflows. Reduce document review time and surface risk clauses automatically.',
  alternates: { canonical: '/solutions/legal-professional-services' },
};

const legalApps = [
  { name: 'Legal Document Manager', href: '/legal-document-manager' },
  { name: 'AI Contract Analyzer', href: '/zion-ai-contract-analyzer' },
  { name: 'AI Document Analyzer', href: '/zion-ai-document-ai' },
  { name: 'Compliance Manager', href: '/zion-compliance-manager' },
];

export default function LegalProfessionalServicesSolutionsPage() {
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
            { label: 'Legal & Professional Services' },
          ]}
          className="mb-6"
        />
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Industry Solutions
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Legal & Professional Services{' '}
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
              AI Innovations
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Reduce time spent on document review, automate client intake, and surface risk clauses with
            AI-powered legal analysis. Deploy contract review, compliance workflows, and case
            management tools that cut manual review cycles by up to 50%.
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
            Featured AI Apps for Legal & Professional Services
          </h2>
          <p className="mt-2 text-slate-300">
            Production-ready tools for contract analysis, document management, and compliance in law
            firms and professional services.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {legalApps.map((app) => (
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
          <h2 className="mt-2 text-2xl font-bold text-white">Common Legal & Professional Services Workflows</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Contract Review & Analysis</h3>
              <p className="mt-2 text-sm text-slate-300">
                Surface risk clauses, extract key terms, and compare versions. Cut manual review time by up to 50%.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Client Intake & Onboarding</h3>
              <p className="mt-2 text-sm text-slate-300">
                Automate intake forms, conflict checks, and document collection. Speed up onboarding and reduce errors.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Case & Matter Management</h3>
              <p className="mt-2 text-sm text-slate-300">
                Organize documents, deadlines, and tasks. Improve collaboration and visibility across matters.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Compliance & Audit</h3>
              <p className="mt-2 text-sm text-slate-300">
                Maintain audit trails, regulatory compliance, and ethical walls. Automate reporting and documentation.
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
          <h2 className="mt-2 text-xl font-bold text-white">Law Firm Automates Contract Review 50%</h2>
          <p className="mt-2 text-slate-300">
            A mid-size law firm deployed Zion AI Contract Analyzer and Document Processor to automate contract review and client intake. Document turnaround dropped 50% while improving risk identification.
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
        industryName="Legal & Professional Services"
        items={[
          {
            question: 'How do you handle client confidentiality and data security?',
            answer:
              'Our Legal solutions include access controls, audit trails, and encryption. Discovery maps your confidentiality and compliance requirements (ABA, state bar) and we design implementation scope accordingly.',
          },
          {
            question: 'How quickly can we deploy a contract review pilot?',
            answer:
              'Most contract review pilots launch in 2–4 weeks with scoped extraction and risk identification. Full rollout typically takes 6–12 weeks.',
          },
          {
            question: 'Can you integrate with our practice management or DMS?',
            answer:
              'Yes. We integrate with common practice management and document management systems. Discovery includes mapping your existing systems and defining integration scope.',
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
