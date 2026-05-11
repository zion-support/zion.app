'use client';

import { useCallback, useEffect, useState } from 'react';

type CaseStudy = {
  title: string;
  industry: string;
  result: string;
  description: string;
  apps: string[];
  icon: string;
};

type CaseStudiesClientProps = {
  caseStudies: CaseStudy[];
  industries: string[];
};

export default function CaseStudiesClient({ caseStudies, industries }: CaseStudiesClientProps) {
  const [selected, setSelected] = useState('');

  const syncFromHash = useCallback(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const industry = params.get('industry') ?? '';
    setSelected(industry);
  }, []);

  useEffect(() => {
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, [syncFromHash]);

  const setFilter = (industry: string) => {
    setSelected(industry);
    const hash = industry ? `industry=${encodeURIComponent(industry)}` : '';
    window.history.replaceState(null, '', hash ? `#${hash}` : window.location.pathname);
  };

  const filtered =
    selected === '' ? caseStudies : caseStudies.filter((s) => s.industry === selected);

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by industry">
        <button
          type="button"
          onClick={() => setFilter('')}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
            !selected
              ? 'border border-purple-400/40 bg-purple-500/15 text-purple-100'
              : 'border border-slate-700 bg-slate-900/75 text-slate-200 hover:border-purple-400/40 hover:bg-purple-500/10'
          }`}
          aria-pressed={!selected}
        >
          All
        </button>
        {industries.map((industry) => {
          const isActive = selected === industry;
          return (
            <button
              key={industry}
              type="button"
              onClick={() => setFilter(industry)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                isActive
                  ? 'border border-purple-400/40 bg-purple-500/15 text-purple-100'
                  : 'border border-slate-700 bg-slate-900/75 text-slate-200 hover:border-purple-400/40 hover:bg-purple-500/10'
              }`}
              aria-pressed={isActive}
            >
              {industry}
            </button>
          );
        })}
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((study) => (
          <article
            key={study.title}
            className="group rounded-2xl border border-slate-700/70 bg-slate-900/65 p-6 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-purple-400/40"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-xl border border-slate-700 bg-slate-950/70 p-2 text-3xl">
                {study.icon}
              </span>
              <span className="rounded-full border border-purple-400/40 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-100">
                {study.result}
              </span>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-white transition group-hover:text-purple-300">
              {study.title}
            </h2>
            <p className="mt-1 text-xs font-medium text-slate-400">{study.industry}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{study.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {study.apps.map((app) => (
                <span
                  key={app}
                  className="rounded-lg border border-slate-700/60 bg-slate-950/50 px-2.5 py-1 text-xs text-slate-300"
                >
                  {app}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
