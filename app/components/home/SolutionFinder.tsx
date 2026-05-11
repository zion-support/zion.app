'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type FinderApp = {
  name: string;
  href: string;
  category: string;
  description: string;
  icon: string;
};

type SolutionFinderProps = {
  apps: FinderApp[];
};

const MAX_VISIBLE_RESULTS = 9;

export default function SolutionFinder({ apps }: SolutionFinderProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categoriesWithCounts = useMemo(() => {
    const counts = new Map<string, number>();

    // "All" category always reflects total visible apps
    counts.set('All', apps.length);

    for (const app of apps) {
      counts.set(app.category, (counts.get(app.category) ?? 0) + 1);
    }

    return counts;
  }, [apps]);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(apps.map((app) => app.category)))],
    [apps]
  );

  const filteredApps = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return apps.filter((app) => {
      const categoryMatch = activeCategory === 'All' || app.category === activeCategory;
      const textMatch =
        normalizedQuery.length === 0 ||
        app.name.toLowerCase().includes(normalizedQuery) ||
        app.description.toLowerCase().includes(normalizedQuery);

      return categoryMatch && textMatch;
    });
  }, [apps, activeCategory, query]);

  const visibleApps = filteredApps.slice(0, MAX_VISIBLE_RESULTS);

  return (
    <div className="rounded-3xl border border-slate-700/70 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-300">Solution Finder</p>
          <h3 className="mt-1 text-2xl font-semibold text-white">Find the best-fit app in seconds</h3>
          <p className="mt-2 text-sm text-slate-300">
            Search by need, then narrow by category to jump directly to relevant product pages.
          </p>
        </div>

        <label className="w-full max-w-xl lg:w-[28rem]">
          <span className="sr-only">Search Zion solutions</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search solutions (e.g. support, security, analytics)..."
            className="w-full rounded-xl border border-slate-600/80 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = category === activeCategory;
          const count = categoriesWithCounts.get(category);

          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                isActive
                  ? 'border-purple-400/70 bg-purple-500/20 text-purple-100'
                  : 'border-slate-700 bg-slate-900/80 text-slate-300 hover:border-purple-400/50 hover:text-white'
              }`}
            >
              {category}
              {typeof count === 'number' ? (
                <span className="ml-1.5 rounded-full bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-semibold text-slate-200">
                  {count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {visibleApps.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleApps.map((app) => (
            <a
              key={app.href}
              href={app.href}
              className="group rounded-2xl border border-slate-700/70 bg-slate-950/70 p-4 transition hover:-translate-y-0.5 hover:border-purple-400/60"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-lg border border-slate-700 bg-slate-900/80 p-2 text-2xl">
                  {app.icon}
                </span>
                <span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-300">
                  {app.category}
                </span>
              </div>
              <h4 className="mt-3 text-sm font-semibold text-white transition group-hover:text-purple-300">
                {app.name}
              </h4>
              <p className="mt-1.5 text-xs leading-5 text-slate-300">{app.description}</p>
            </a>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-slate-700/70 bg-slate-950/70 p-5">
          <p className="text-sm text-slate-200">
            No direct match found yet. Try a broader keyword or browse all available solutions.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a
              href="/solutions"
              className="rounded-lg border border-slate-600 bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-purple-400 hover:text-white"
            >
              Explore all solutions
            </a>
            <a
              href="/contact"
              className="rounded-lg border border-purple-400/40 bg-purple-500/10 px-4 py-2 text-xs font-semibold text-purple-100 transition hover:bg-purple-500/20"
            >
              Get a tailored recommendation
            </a>
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-slate-400">
        Showing {visibleApps.length} of {filteredApps.length} matched apps
        {filteredApps.length > MAX_VISIBLE_RESULTS ? ` (top ${MAX_VISIBLE_RESULTS})` : ''}.
      </p>
    </div>
  );
}
