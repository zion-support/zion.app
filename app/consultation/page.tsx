import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import { ArrowRight, Target, Lightbulb, Wrench, BarChart3 } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

export const metadata = {
  title: 'AI Strategy Consultation | Zion Tech Group',
  description:
    'AI strategy consultation and discovery workshops to align your goals with the right AI apps, architecture, pricing options, and delivery roadmap.',
  alternates: { canonical: '/consultation' },
};

const offerings = [
  {
    icon: Target,
    title: 'Discovery Call',
    duration: '30 min',
    description:
      'Walk through your goals, current stack, and constraints. We map your needs to the right Zion apps and delivery path. No pressure, just clarity.',
    cta: 'Book a call',
  },
  {
    icon: Lightbulb,
    title: 'Quick Start Workshop',
    duration: '2 hours',
    description:
      'A focused session to identify your highest-value AI use case, draft an implementation plan, and align stakeholders on next steps.',
    cta: 'Request workshop',
  },
  {
    icon: Wrench,
    title: 'Technical Deep Dive',
    duration: 'Half day',
    description:
      'Dive into integration architecture, data pipelines, and security requirements. Get a detailed technical roadmap and effort estimate.',
    cta: 'Schedule deep dive',
  },
  {
    icon: BarChart3,
    title: 'Full Roadmap Engagement',
    duration: '1–2 weeks',
    description:
      'End-to-end discovery, pilot scoping, and delivery planning with a dedicated Zion team. Includes executive summary and phased rollout plan.',
    cta: 'Start roadmap',
  },
];

const outcomes = [
  'Clear prioritization of AI use cases',
  'Practical delivery timeline and milestones',
  'Integration and architecture recommendations',
  'ROI and success metrics',
  'Handoff to implementation team',
];

export default function ConsultationPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-16 left-1/4 h-[24rem] w-[24rem] rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-6rem] h-[20rem] w-[20rem] rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Consultation' }]} className="mb-6" />
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            AI Strategy Consultation
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Align your goals with the right AI path
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Not sure where to start? Our consultation services help you map priorities, choose the right
            apps, and build a practical delivery roadmap. No commitment required — start with a conversation.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-purple-700/20 transition hover:-translate-y-0.5"
             data-cta-event="cta_discovery" data-cta-label="page">
              Book a Discovery Call
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a
              href="/solutions"
              className="inline-flex items-center justify-center rounded-xl border border-slate-500/80 bg-slate-900/60 px-7 py-3 text-base font-semibold text-slate-100 transition hover:border-purple-300/70 hover:text-white"
            >
              Browse Solutions
            </a>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-gradient-to-br from-slate-900/80 to-slate-950/70 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Engagement options
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Choose the right starting point
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            From a quick call to a full roadmap engagement: pick the engagement that fits your timeline and decision stage.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {offerings.map((offering) => (
              <div
                key={offering.title}
                className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15">
                    <offering.icon className="h-5 w-5 text-purple-400" />
                  </div>
                  <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-300">
                    {offering.duration}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{offering.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{offering.description}</p>
                <a
                  href="/contact"
                  className="mt-4 inline-flex items-center text-sm font-semibold text-purple-300 hover:text-purple-200"
                 data-cta-event="cta_discovery" data-cta-label="page">
                  {offering.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 sm:p-10">
          <h2 className="text-xl font-bold text-white">What you get</h2>
          <p className="mt-2 text-slate-300">
            Every consultation delivers actionable outcomes for your team.
          </p>
          <ul className="mt-6 space-y-3">
            {outcomes.map((outcome) => (
              <li key={outcome} className="flex items-start gap-3 text-slate-200">
                <span className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
                {outcome}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-12 rounded-3xl border border-purple-500/20 bg-slate-900/65 p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Case study
          </p>
          <h2 className="mt-2 text-xl font-bold text-white">Fintech Maps AI Roadmap in 2-Week Engagement</h2>
          <p className="mt-2 text-slate-300">
            A Series B fintech used our Full Roadmap Engagement to prioritize fraud detection, compliance automation, and customer onboarding. They received a phased implementation plan and launched their first pilot within 6 weeks.
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

      <section className="relative mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-900/40 via-fuchsia-900/30 to-pink-900/40 p-8 text-center shadow-2xl shadow-purple-900/25 sm:p-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to get clarity?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-200">
            Start with a 30-minute discovery call. No commitment required — just a conversation about your goals.
          </p>
          <a
            href="/contact"
            className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
           data-cta-event="cta_discovery" data-cta-label="page">
            Book a Discovery Call
          </a>
        </div>
      </section>
    </div>
  );
}
