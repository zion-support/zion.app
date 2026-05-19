'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { allServices, type Service } from '@/data/servicesData';

/* ── Simple fuzzy-match ── */
function fuzzyScore(query: string, text: string): number {
  if (!query) return text.length; // longer text scores higher when no query
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) return 100 + (text.includes(query) ? 50 : 0); // substring = best
  // character-in-order match
  let qi = 0, score = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) { score += 2; qi++; }
  }
  return qi === q.length ? score : 0;
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-purple-500/40 text-white rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

const CATEGORIES = [
  { key: 'all' as const, label: 'All' },
  { key: 'ai' as const, label: 'AI' },
  { key: 'it' as const, label: 'IT' },
  { key: 'cloud' as const, label: 'Cloud' },
  { key: 'security' as const, label: 'Security' },
  { key: 'data' as const, label: 'Data & AI' },
  { key: 'automation' as const, label: 'Automation' },
];

const LS_KEY = 'ztg_recent_searches';

export default function SmartSearchBar({ initialQuery = '', initialCategory = 'all' }: { initialQuery?: string; initialCategory?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load recent searches
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
      setRecent(stored.slice(0, 6));
    } catch { /* noop */ }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const scored = useMemo(() => {
    let list = [...allServices];
    if (category !== 'all') list = list.filter((s: Service) => s.category === category);
    if (query.trim()) {
      const q = query.trim();
      list = list
        .map((s: Service) => ({
          s,
          score: Math.max(
            fuzzyScore(q, s.title) * 3,
            fuzzyScore(q, s.description) * 2,
            fuzzyScore(q, s.category),
          ),
        }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((x) => x.s);
    }
    return list.slice(0, 12);
  }, [query, category]);

  const hitsByCategory = useMemo(() => {
    if (!query.trim()) return {};
    const q = query.trim();
    const counts: Record<string, number> = {};
    for (const s of allServices) {
      const score = Math.max(fuzzyScore(q, s.title), fuzzyScore(q, s.description));
      if (score > 0) counts[s.category] = (counts[s.category] || 0) + 1;
    }
    return counts;
  }, [query]);

  const submitSearch = useCallback((q?: string, cat?: string) => {
    const qq = (q ?? query).trim();
    const cc = cat ?? category;
    if (qq) {
      const updated = [qq, ...recent.filter((r) => r !== qq)].slice(0, 6);
      setRecent(updated);
      try { localStorage.setItem(LS_KEY, JSON.stringify(updated)); } catch { /* noop */ }
    }
    const params = new URLSearchParams();
    if (qq) params.set('q', qq);
    if (cc !== 'all') params.set('category', cc);
    router.push(`/services?${params.toString()}`);
    setOpen(false);
  }, [query, category, recent, router]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') submitSearch();
    if (e.key === 'Escape') setOpen(false);
  };

  const panelOpen = open && (query.trim().length > 0 || recent.length > 0) && scored.length > 0;

  return (
    <div className="w-full max-w-3xl mx-auto" ref={dropdownRef}>
      {/* Search input */}
      <div className="relative">
        <div className="flex items-center gap-3">
          <svg className="ml-5 h-5 w-5 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onKeyDown={onKeyDown}
            onFocus={() => setOpen(true)}
            placeholder="Search 626+ services by name, keyword, or category..."
            className="flex-1 rounded-full border border-slate-700 bg-slate-900/90 px-5 py-3.5 pl-1 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 pr-28"
            aria-label="Search services"
            aria-autocomplete="list"
            aria-controls="search-results"
            aria-expanded={open}
            role="combobox"
          />
          <button
            onClick={() => submitSearch()}
            type="button"
            className="absolute right-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-1.5 text-sm font-semibold text-white hover:from-purple-500 hover:to-pink-500 transition shadow-lg"
          >
            Search
          </button>
        </div>

        {/* Autocomplete dropdown */}
        {panelOpen && (
          <div
            id="search-results"
            role="listbox"
            className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl overflow-hidden"
          >
            {/* Recent searches */}
            {query.length === 0 && recent.length > 0 && (
              <div className="px-4 pt-4 pb-2 border-b border-slate-800">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-2">Recent Searches</p>
                <div className="flex flex-wrap gap-1.5">
                  {recent.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => { setQuery(r); submitSearch(r); }}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition"
                    >
                      ⌨ {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Category quick-filter pills with hit counts */}
            {query.trim().length > 0 && (
              <div className="px-4 py-3 border-b border-slate-800">
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.filter(c => c.key === 'all' || hitsByCategory[c.key] > 0).map((cat) => {
                    const hits = cat.key === 'all' ? scored.length : hitsByCategory[cat.key] || 0;
                    const active = category === cat.key;
                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => { setCategory(cat.key); setOpen(true); }}
                        className={`rounded-full px-4 py-2 text-xs font-semibold transition inline-flex items-center gap-2
                          ${active
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                            : 'bg-slate-800 text-slate-300 border border-slate-700/50 hover:border-purple-500/50'
                          }`}
                      >
                        {cat.label}
                        <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${active ? 'bg-white/20' : 'bg-slate-700 text-slate-400'}`}>
                          {hits}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Result list */}
            {scored.length > 0 ? (
              <ul className="max-h-[320px] overflow-y-auto p-2" role="groupbox">
                {scored.map((svc: Service) => (
                  <li key={svc.id} role="option">
                    <button
                      type="button"
                      onClick={() => router.push(`/services/${svc.id}`)}
                      className="w-full text-left rounded-xl px-4 py-3 transition hover:bg-slate-800/80 group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl mt-0.5">{svc.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white group-hover:text-purple-300 leading-snug">
                            {highlightMatch(svc.title, query)}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5 uppercase tracking-wider">{svc.category}</p>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                            {highlightMatch(svc.description, query)}
                          </p>
                        </div>
                        <span className="text-purple-400 text-xs font-semibold shrink-0 mt-1">
                          {Object.values(svc.pricing as Record<string, string>)[0]}/mo
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : query.trim().length > 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-slate-400 text-sm">No services match "<strong className="text-slate-200">{query}</strong>"</p>
                <p className="text-slate-500 text-xs mt-1">Try different keywords or browse all services below</p>
                <button
                  type="button"
                  onClick={() => submitSearch()}
                  className="mt-3 text-sm text-purple-400 hover:text-purple-300 font-medium"
                >
                  Browse all services →
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
