import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import { ArrowRight, Users, Zap, Shield, Target, BookOpen } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

export const metadata = {
  title: 'Team | Zion Tech Group',
  description:
    'Meet the Zion Tech Group team. Engineers, architects, and product people building production-ready AI solutions with security-first delivery and measurable outcomes.',
  alternates: { canonical: '/team' },
};

const howWeWork = [
  {
    icon: Target,
    title: 'Outcome-focused',
    description:
      'We scope every engagement around measurable business results. Roadmaps are prioritized by impact, not feature lists.',
  },
  {
    icon: Zap,
    title: 'Ship fast, ship right',
    description:
      'Scoped pilots in 2–4 weeks with clear KPIs. We validate early, then scale with security and observability built in.',
  },
  {
    icon: Shield,
    title: 'Security by default',
    description:
      'Compliance, privacy, and infrastructure security are part of delivery planning from day one — not add-ons.',
  },
  {
    icon: BookOpen,
    title: 'Handoff-ready',
    description:
      'Runbooks, training, and documentation so your team can operate and extend solutions with confidence.',
  },
];

const teamFocus = [
  'AI & machine learning — custom models, NLP, computer vision, predictive analytics',
  'Full-stack engineering — Next.js, React, APIs, cloud infrastructure',
  'Solutions architecture — discovery, roadmap design, pilot-to-production delivery',
  'Product & delivery — scoping, prioritization, and client success',
];

export default function TeamPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-16 left-1/4 h-[24rem] w-[24rem] rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-6rem] h-[20rem] w-[20rem] rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Team' }]} className="mb-6" />
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Our team
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Engineers, architects, and product people
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Zion Tech Group is a remote-first team building production-ready AI applications and
            engineering services. We combine product thinking, engineering rigor, and security-first
            delivery so your team can move from pilot to scaled operations with confidence.
          </p>
          <p className="mt-4 text-base leading-7 text-slate-400">
            We believe AI should be grounded in real business workflows. Every app and service we
            deliver is mapped to practical outcomes you can measure — from support automation and
            document processing to predictive analytics and compliance.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-purple-700/20 transition hover:-translate-y-0.5"
            >
              Get in Touch
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a
              href="/about"
              className="inline-flex items-center justify-center rounded-xl border border-slate-500/80 bg-slate-900/60 px-7 py-3 text-base font-semibold text-slate-100 transition hover:border-purple-300/70 hover:text-white"
            >
              About Zion
            </a>
            <a
              href="/careers"
              className="inline-flex items-center justify-center rounded-xl border border-slate-500/80 bg-slate-900/60 px-7 py-3 text-base font-semibold text-slate-100 transition hover:border-purple-300/70 hover:text-white"
            >
              Join the Team
            </a>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 sm:p-10">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">How we work</h2>
          </div>
          <p className="mt-3 max-w-2xl text-slate-300">
            These principles guide how we build, collaborate, and deliver for our customers — from
            discovery through production handoff.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {howWeWork.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-700/70 bg-slate-950/70 p-5 shadow-lg shadow-black/20"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15">
                  <item.icon className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-gradient-to-br from-slate-900/80 to-slate-950/70 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            What we focus on
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Talent across AI, engineering, and delivery
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Our team spans AI and ML, full-stack development, solutions architecture, and product
            management. We hire for outcomes, curiosity, and the ability to ship production-ready
            systems.
          </p>
          <ul className="mt-6 space-y-3">
            {teamFocus.map((focus) => (
              <li key={focus} className="flex items-start gap-3 text-slate-200">
                <span className="mt-1.5 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
                {focus}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-900/40 via-fuchsia-900/30 to-pink-900/40 p-8 text-center shadow-2xl shadow-purple-900/25 sm:p-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to work with us?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-200">
            Start with a discovery call to align your goals with the right apps, architecture, and
            delivery plan. No commitment required.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/contact"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Start a Conversation
            </a>
            <a
              href="/solutions"
              className="rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Explore Solutions
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
