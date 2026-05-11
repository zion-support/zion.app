import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import AIToolCard from '../components/AIToolCard';
import { AI_LAB_TOOLS } from './ai-lab-tools';

export const metadata = {
  title: 'Zion AI Lab',
  description:
    'Explore experimental and live AI tools that showcase how Zion’s autonomous agents improve and evolve ziontechgroup.com.',
};

export default function AILabPage() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-6 lg:px-8 lg:pb-16 lg:pt-16">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-sky-400">
              Autonomous Platform · Live Preview
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
              Zion AI Lab
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
              A growing collection of in-browser experiments that expose how Zion’s autonomous
              agents audit, improve, and evolve your applications. Everything here is powered by
              the same pipelines that keep this site improving.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 text-xs text-slate-300 sm:flex-row sm:items-end sm:text-right">
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 shadow-lg shadow-emerald-900/40">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
                Autonomy status
              </p>
              <p className="mt-1 text-xs text-emerald-100">
                Live app evolution, layout, content, and performance agents are continuously
                auditing and improving{' '}
                <span className="font-mono text-emerald-50">ziontechgroup.com</span>.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {AI_LAB_TOOLS.map((tool) => (
            <AIToolCard
              key={tool.id}
              className="group flex flex-col rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-xl shadow-slate-900/60 backdrop-blur transition hover:border-sky-500/60 hover:bg-slate-900"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 text-xs font-medium text-sky-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  {tool.category}
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    tool.status === 'live'
                      ? 'border border-emerald-500/60 bg-emerald-500/10 text-emerald-200'
                      : tool.status === 'experimental'
                      ? 'border border-amber-400/60 bg-amber-400/10 text-amber-100'
                      : 'border border-slate-500/60 bg-slate-500/10 text-slate-100'
                  }`}
                >
                  {tool.badge ?? tool.status}
                </span>
              </div>
              <h2 className="text-base font-semibold text-slate-50 sm:text-lg">
                {tool.title}
              </h2>
              <p className="mt-2 text-sm text-slate-300">{tool.shortDescription}</p>
              <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-400">
                <p>
                  Shows how Zion’s automation behaves using the same reports and pipelines that
                  power production.
                </p>
                <a
                  href={tool.href}
                  className="inline-flex items-center rounded-full border border-sky-500/60 bg-sky-500/10 px-3 py-1 font-medium text-sky-100 hover:bg-sky-500/20"
                >
                  Open tool
                  <span className="ml-1.5 text-sky-200 transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </a>
              </div>
            </AIToolCard>
          ))}
        </div>

        <div className="mt-10 grid gap-6 text-xs text-slate-400 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
              What powers these tools
            </p>
            <p className="mt-2">
              Under the hood, Zion runs live UX audits, layout design pipelines, navigation audits,
              content freshness checks, and performance optimizers against the production site.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
              Safe by design
            </p>
            <p className="mt-2">
              The AI Lab surfaces telemetry and recommendations only. No personal data is stored,
              and all insights are aggregated.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
              Always evolving
            </p>
            <p className="mt-2">
              New tools are added over time as the autonomous agents discover fresh optimization
              opportunities across the stack.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

