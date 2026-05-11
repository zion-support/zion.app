'use client';

import { useState } from 'react';
import Link from 'next/link';

type FeaturedApp = {
  name: string;
  href: string;
  category: string;
  description: string;
  icon: string;
};

const INITIAL_COUNT = 9;

export default function FeaturedAppGrid({ apps }: { apps: FeaturedApp[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? apps : apps.slice(0, INITIAL_COUNT);

  return (
    <>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((app) => (
          <a
            key={app.href}
            href={app.href}
            className="group rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-900/80 to-slate-950/60 p-6 transition hover:-translate-y-1 hover:border-purple-400/50 hover:shadow-xl hover:shadow-purple-500/10 ring-1 ring-white/[0.03]"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="rounded-xl border border-slate-700/80 bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-2.5 text-3xl shadow-inner">
                {app.icon}
              </span>
              <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-200">
                {app.category}
              </span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white transition group-hover:text-purple-300">
              {app.name}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-200">{app.description}</p>
            <p className="mt-4 text-sm font-semibold text-purple-300 group-hover:text-purple-200">View app →</p>
          </a>
        ))}
      </div>

      {!showAll && apps.length > INITIAL_COUNT && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="inline-flex items-center justify-center rounded-xl border border-purple-400/40 bg-purple-500/10 px-7 py-3 text-base font-semibold text-purple-100 transition hover:bg-purple-500/20"
          >
            Show all {apps.length} apps
          </button>
        </div>
      )}
    </>
  );
}
