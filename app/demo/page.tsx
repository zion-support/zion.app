import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import { ArrowRight, Play, Calendar, MessageSquare, FileCode } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

export const metadata = {
  title: 'Demo | Zion Tech Group',
  description:
    'See Zion AI solutions in action. Book a live demo, explore use cases, or try our ROI estimator and launch advisor. No commitment required.',
  alternates: { canonical: '/demo' },
};

const demoOptions = [
  {
    icon: Play,
    title: 'Live product demo',
    description:
      'Schedule a 30-minute walkthrough of the Zion apps that fit your use case — chatbots, document processing, predictive analytics, or compliance workflows. We tailor the demo to your goals.',
    cta: 'Book a demo',
    href: '/contact',
  },
  {
    icon: Calendar,
    title: 'Discovery call',
    description:
      'Not sure which app to start with? A discovery call helps map your workflows to the right Zion modules, integration approach, and pilot scope. No pressure, just clarity.',
    cta: 'Schedule a call',
    href: '/contact',
  },
  {
    icon: MessageSquare,
    title: 'ROI estimator & launch advisor',
    description:
      'Use our interactive tools on the homepage to model potential savings from your first automation rollout and get a recommended launch path based on your objective and timeline.',
    cta: 'Go to homepage',
    href: '/#interactive-planning',
  },
  {
    icon: FileCode,
    title: 'Implementation playbooks',
    description:
      'Step-by-step guides for common use cases: AI chatbot deployment, document processing, predictive analytics, security and compliance. Each links to industry solutions and FAQs.',
    cta: 'View playbooks',
    href: '/community',
  },
];

export default function DemoPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-16 left-1/4 h-[24rem] w-[24rem] rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-6rem] h-[20rem] w-[20rem] rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Demo' }]} className="mb-6" />
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            See Zion in action
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Demos and hands-on resources
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Explore Zion AI solutions before you commit. Book a live demo, run through our ROI
            estimator and launch advisor, or browse implementation playbooks and use-case guides.
          </p>
          <p className="mt-4 text-base leading-7 text-slate-400">
            No commitment required. We help you choose the right starting point and delivery path
            based on your goals and timeline.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-purple-700/20 transition hover:-translate-y-0.5"
            >
              Book a Demo
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
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            How to explore
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Choose your path
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            From live demos to self-service tools and playbooks — pick what fits your stage and
            timeline.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {demoOptions.map((option) => (
              <a
                key={option.title}
                href={option.href}
                className="group rounded-2xl border border-slate-700/70 bg-slate-950/70 p-6 shadow-lg shadow-black/20 transition hover:border-purple-400/50 hover:bg-slate-900/80"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/15">
                  <option.icon className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white group-hover:text-purple-200">
                  {option.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{option.description}</p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-purple-300 group-hover:text-purple-200">
                  {option.cta}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-900/40 via-fuchsia-900/30 to-pink-900/40 p-8 text-center shadow-2xl shadow-purple-900/25 sm:p-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Prefer a tailored walkthrough?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-200">
            Tell us your use case and we will set up a demo focused on the apps and workflows that
            matter most to you.
          </p>
          <a
            href="/contact"
            className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Request a Demo
          </a>
        </div>
      </section>
    </div>
  );
}
