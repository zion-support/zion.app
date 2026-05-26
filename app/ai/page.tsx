import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Cog, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Lab',
  description:
    'Explore Zion\'s AI Lab — interactive tools and configurators for autonomous AI solutions and architecture planning.',
  alternates: { canonical: '/ai' },};

const tools = [
  {
    name: 'Solutions Configurator',
    href: '/ai/solutions-configurator',
    description:
      'Tell us where you are, what you want to improve, and which systems you rely on. Get a deterministic, in-browser blueprint of how Zion\'s autonomous platform would be assembled for you.',
    icon: Cog,
  },
  {
    name: 'URL Audit Assistant',
    href: '/ai/url-audit-assistant',
    description:
      'Analyze URLs for SEO, content, and technical factors. Get actionable insights on how AI could optimize your web presence.',
    icon: Search,
  },
];

export default function AILabPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 left-1/4 h-[28rem] w-[28rem] rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute bottom-[-12rem] right-[-8rem] h-[24rem] w-[24rem] rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <section className="relative mx-auto w-full max-w-5xl px-4 pb-16 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
            AI Lab
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Tools for Autonomous AI
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Interactive tools that show how Zion\'s autonomous agents can configure solutions,
            audit technical assets, and plan AI implementations — all computed in your browser.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact/"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-cyan-700/20 transition hover:-translate-y-0.5"
            >
              Contact Us
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/services/"
              className="inline-flex items-center justify-center rounded-xl border border-slate-500/80 bg-slate-900/60 px-6 py-3 text-base font-semibold text-slate-100 transition hover:border-cyan-300/70 hover:text-white"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex flex-col rounded-2xl border border-slate-700/70 bg-slate-900/65 p-6 transition hover:border-cyan-400/70 hover:bg-slate-900"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/15">
                <tool.icon className="h-6 w-6 text-cyan-400" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-white group-hover:text-cyan-200">
                {tool.name}
              </h2>
              <p className="mt-2 flex-1 text-sm text-slate-300">{tool.description}</p>
              <div className="mt-4 inline-flex items-center text-xs font-medium text-cyan-300">
                Try it now
                <ArrowRight className="ml-1 h-3 w-3 transition group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-900/40 via-blue-900/30 to-indigo-900/40 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready for autonomous AI?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-200">
            Start with a discovery call to align your goals with the right apps, architecture, and delivery plan.
          </p>
          <Link
            href="/contact/"
            className="mt-6 inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Start a Conversation
          </Link>
        </div>
      </section>
    </div>
  );
}