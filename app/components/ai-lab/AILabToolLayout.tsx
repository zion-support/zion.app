import React from 'react';
import Link from 'next/link';

interface AILabToolLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function AILabToolLayout({ title, subtitle, children }: AILabToolLayoutProps) {
  return (
    <section className="relative mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pt-16">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-sky-400">
            Zion AI Lab
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
              {subtitle}
            </p>
          ) : null}
        </div>
        <div className="hidden text-right sm:block">
          <a
            href="/ai-lab"
            className="inline-flex items-center rounded-full border border-sky-500/40 bg-sky-500/5 px-3 py-1 text-xs font-medium text-sky-200 hover:border-sky-400 hover:bg-sky-500/10"
          >
            <span className="mr-1.5">←</span>
            Back to AI Lab
          </a>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-xl shadow-sky-900/40 backdrop-blur sm:p-6 lg:p-8">
        <div className="mb-4 flex items-center justify-between gap-3 text-xs text-slate-400">
          <p>
            These tools surface how autonomous agents evolve the site. Outputs are illustrative and
            do not store personal data.
          </p>
          <span className="hidden rounded-full border border-emerald-500/40 bg-emerald-500/5 px-3 py-1 text-[11px] font-semibold text-emerald-300 sm:inline-flex">
            Autonomy-first · Read-only insights
          </span>
        </div>
        {children}
      </div>

      <div className="mt-6 text-xs text-slate-500">
        <p>
          Powered by Zion’s autonomous agents (app evolution, layout, performance, content, and
          navigation pipelines) running continuously against{' '}
          <span className="font-mono text-slate-300">ziontechgroup.com</span>.
        </p>
      </div>
    </section>
  );
}

