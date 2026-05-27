'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { searchServices, type SearchService } from '@/data/searchServices';

const CATEGORIES = [
  { id: 'ai',       label: 'AI & Machine Learning', emoji: '🤖' },
  { id: 'automation',label: 'Automation & Workflow', emoji: '⚡' },
  { id: 'cloud',    label: 'Cloud Infrastructure',  emoji: '☁️' },
  { id: 'data',     label: 'Data & Analytics',       emoji: '📊' },
  { id: 'it',       label: 'IT & DevOps',             emoji: '🖥️' },
  { id: 'security', label: 'Security & Compliance',  emoji: '🔐' },
];

const DEBOUNCE_MS = 250;   // quick reaction, not instant
const MAX_RESULTS = 12;    // dropdown cap

export default function ServiceGridWithSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Debounced results — recompute on every render but guarded by length ≤ MAX_RESULTS
  const results = useMemo<SearchService[]>(() => {
    const q = query.toLowerCase().trim();
    return searchServices
      .filter(s => {
        const matchCat  = catFilter ? s.category === catFilter : true;
        const matchQ    = !q
          || s.title.toLowerCase().includes(q)
          || s.description.toLowerCase().includes(q)
          || s.id.toLowerCase().includes(q);
        return matchCat && matchQ;
      })
      .sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0))
      .slice(0, MAX_RESULTS);
  }, [query, catFilter]);

  const activeCount = searchServices.filter(s =>
    !catFilter || s.category === catFilter
  ).length;

  const navigateToService = useCallback((href: string) => {
    setOpen(false);
    router.push(href);
  }, [router]);

  return (
    <section id="find-services" className="py-12 md:py-16 border-t border-slate-800/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* ── Heading ─────────────────────────────────── */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
            🔍 Find the Right Service
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
            Search {activeCount.toLocaleString()} services across {CATEGORIES.length} categories — click any result to open the full detail page.
          </p>
        </div>

        {/* ── Search + Category bar ──────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-2">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2 sm:flex-nowrap" role="group" aria-label="Category filter">
            <CategoryPill
              active={catFilter === null}
              onClick={() => { setCatFilter(null); setQuery(''); }}
              label="All"
              emoji="🌐"
            />
            {CATEGORIES.map(c => (
              <CategoryPill
                key={c.id}
                active={catFilter === c.id}
                onClick={() => { setCatFilter(c.id); setQuery(''); }}
                label={c.emoji + ' ' + c.label}
              />
            ))}
          </div>
        </div>

        {/* ── Full-width search input ─────────────────── */}
        <div ref={wrapperRef} className="relative">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              placeholder="Search by name, keyword, or service ID…"
              aria-label="Search services"
              aria-expanded={open}
              aria-controls="search-results"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 outline-none
                         transition-all focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full
                         bg-slate-700 text-slate-300 text-xs hover:bg-slate-600 transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* ── Results dropdown ────────────────────────── */}
          {open && query.trim().length > 0 && (
            <div
              id="search-results"
              role="listbox"
              className="absolute z-50 left-0 right-0 mt-2 bg-slate-800/95 border border-slate-700 rounded-xl shadow-2xl
                         max-h-72 overflow-y-auto backdrop-blur-sm"
              style={{ backdropFilter: 'blur(8px)' }}
            >
              {results.length === 0 ? (
                <div className="px-5 py-8 text-center text-slate-400 text-sm">
                  No services match <strong className="text-slate-300">"{query}"</strong>
                  <br />Try a different keyword.
                </div>
              ) : (
                results.map(s => (
                  <button
                    key={s.id}
                    role="option"
                    onClick={() => navigateToService(s.href)}
                    className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-blue-600/10 border-b border-slate-700/50
                             last:border-b-0 transition-colors focus:bg-blue-600/10 focus:outline-none"
                  >
                    <span className="text-xl flex-shrink-0 mt-0.5">
                      {CATEGORIES.find(c => c.id === s.category)?.emoji || '🔧'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-medium text-sm">{s.title}</span>
                        {s.popular && (
                          <span className="bg-yellow-500/20 text-yellow-300 text-[10px] px-1.5 py-0.5 rounded-full border border-yellow-500/30">
                            ⭐ Popular
                          </span>
                        )}
                        <span className="text-slate-500 text-xs lowercase">{s.category}</span>
                      </div>
                      <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{s.description}</p>
                    </div>
                    <svg className="w-4 h-4 text-slate-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))
              )}
              {results.length > 0 && query.trim().length > 0 && (
                <div className="px-4 py-2 border-t border-slate-700/50 bg-slate-900/50">
                  <span className="text-slate-500 text-xs">
                    {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
                    {catFilter && <span> in {CATEGORIES.find(c => c.id === catFilter)?.label}</span>}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Quick stats ──────────────────────────────── */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
          <span>{activeCount.toLocaleString()} services · {CATEGORIES.length} categories</span>
          <span>Free search — no account required</span>
        </div>
      </div>
    </section>
  );
}

/* ── Category pill sub-component ──────────────────────── */
function CategoryPill({
  active, onClick, label, emoji,
}: { active: boolean; onClick: () => void; label: string; emoji?: string }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
        transition-all whitespace-nowrap select-none
        ${active
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
          : 'bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:border-blue-500/40 hover:text-slate-200'
        }
      `}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </button>
  );
}
