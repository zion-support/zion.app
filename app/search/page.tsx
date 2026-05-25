// app/search/page.tsx  — v2: JSON feed powered
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';

import Link from 'next/link';

// ── Types ────────────────────────────────────────────────────────────────────
interface ServiceFeedEntry {
  id: string;
  title: string;
  description: string;
  href: string;
  category: string;
  industry: string;
}

interface FeedResponse {
  generated: string;
  count: number;
  categories: Record<string, number>;
  services: ServiceFeedEntry[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function getQuery(): string {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get('q') || '';
}

const CATEGORY_META: Record<string, { label: string; accent: string }> = {
  ai:        { label: 'AI Services',     accent: 'text-violet-400' },
  it:        { label: 'IT Services',     accent: 'text-blue-400'    },
  cloud:     { label: 'Cloud',           accent: 'text-purple-400'    },
  security:  { label: 'Security',        accent: 'text-red-400'     },
  data:      { label: 'Data & Analytics',accent: 'text-emerald-400'},
  automation:{ label: 'Automation',     accent: 'text-amber-400'   },
};

// ── Page ─────────────────────────────────────────────────────────────────────
export default function SearchPage() {
  const [allServices, setAllServices] = useState<ServiceFeedEntry[]>([]);
  const [feedMeta, setFeedMeta]       = useState<FeedResponse['categories']>({});
  const [loaded, setLoaded]           = useState(false);
  const [err, setErr]                 = useState<string|null>(null);

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('');

  // Client-side state: fetch services.json once on mount
  useEffect(() => {
    let cancelled = false;
    const ac = new AbortController();
    fetch('/data/services.json', { signal: ac.signal })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<FeedResponse>;
      })
      .then(data => {
        if (!cancelled) {
          setAllServices(data.services);
          setFeedMeta(data.categories);
          setLoaded(true);
        }
      })
      .catch(e => {
        if (!cancelled) { setErr(e.message); setLoaded(true); }
      });
    return () => { cancelled = true; ac.abort(); };
  }, []);

  // Sync query from URL onChange
  useEffect(() => {
    setQuery(getQuery());
  }, []);

  // ── Filtered results ──
  const qLower = query.toLowerCase().trim();

  const results = useMemo(() => {
    let list = allServices;
    if (activeCategory) list = list.filter(s => s.category === activeCategory);
    if (qLower)           list = list.filter(s =>
      s.title.toLowerCase().includes(qLower) ||
      s.description.toLowerCase().includes(qLower) ||
      s.category.toLowerCase().includes(qLower) ||
      s.industry.toLowerCase().includes(qLower)
    );
    return list;
  }, [allServices, activeCategory, qLower]);

  const doSearch = useCallback((q: string) => {
    setQuery(q);
    setActiveCategory('');
    const url = q.trim() ? `/search/?q=${encodeURIComponent(q)}` : '/search/';
    window.history.pushState({}, '', url);
  }, []);

  // ── Status bar text ──
  const statusText = useMemo(() => {
    if (!loaded) return 'Loading…';
    if (err)      return `Error: ${err}`;
    if (activeCategory) return `${feedMeta[activeCategory] ?? 0} in ${CATEGORY_META[activeCategory]?.label || activeCategory}`;
    if (qLower)  return `${results.length} results`;
    return `${allServices.length} services available`;
  }, [loaded, err, allServices.length, results.length, activeCategory, feedMeta, qLower]);

  return (
    <div className="container-page py-12">
      {/* JSON-LD: SearchResultsPage + BreadcrumbList */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SearchResultsPage",
            name: "Service Search | Zion Tech Group",
            description:
              "Search 550+ services, solutions, and industry offerings at Zion Tech Group — find the right AI or IT capability instantly.",
            url: "https://ziontechgroup.com/search",
            mainEntity: {
              "@type": "ItemList",
              numberOfItems:
                loaded && !err ? results.length : allServices.length,
              itemListElement:
                loaded && !err && query
                  ? results.slice(0, 20).map((service: ServiceFeedEntry, i: number) => ({
                      "@type": "ListItem",
                      position: i + 1,
                      url: `https://ziontechgroup.com${service.href}`,
                      name: service.title,
                    }))
                  : undefined,
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://ziontechgroup.com" },
                { "@type": "ListItem", position: 2, name: "Search", item: "https://ziontechgroup.com/search" },
              ],
            },
          })),
        }}
      />
      <h1 className="text-3xl font-bold text-white mb-2">Service Search</h1>
      <p className="text-slate-400 mb-8">
        Browse and filter {allServices.length ? allServices.length : ''} AI, IT, Cloud, Security, Data, and Automation services.
      </p>

      {/* ── Search bar ── */}
      <div className="mb-6">
        <input
          type="search"
          placeholder="Search services, categories, industries…"
          value={query}
          onChange={e => doSearch(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); doSearch(query); } }}
          autoFocus
          className="w-full px-5 py-4 rounded-2xl bg-slate-900/60 border border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-lg"
        />
      </div>

      {/* ── Category pills ── */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory('')}
          className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
            !activeCategory
              ? 'bg-purple-500/20 border-purple-500/60 text-purple-300'
              : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
          }`}
        >
          All
        </button>
        {Object.entries(CATEGORY_META).map(([key, meta]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(activeCategory === key ? '' : key)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
              activeCategory === key
                ? `bg-purple-500/20 border-purple-500/60 ${meta.accent}`
                : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
            }`}
          >
            {meta.label} ({feedMeta[key] ?? 0})
          </button>
        ))}
      </div>

      {/* ── Status ── */}
      <p className={`text-sm mb-6 ${loaded && !err ? 'text-slate-500' : 'text-amber-400'}`}>
        {statusText}
      </p>

      {/* ── Results grid ── */}
      {results.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map(service => {
            const meta = CATEGORY_META[service.category];
            return (
              <Link
                key={service.id}
                href={service.href}
                prefetch={false}
                className="glass-card group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0" aria-hidden>♿</span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white text-sm group-hover:text-purple-300 transition-colors truncate">
                      {service.title}
                    </h3>
                    <p className="text-slate-400 text-xs mt-1 line-clamp-2">{service.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs ${meta?.accent || 'text-slate-400'}`}>
                        {CATEGORY_META[service.category]?.label || service.category}
                      </span>
                      <span className="text-slate-600 text-xs">·</span>
                      <span className="text-slate-500 text-xs">{service.industry}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : query ? (
        <div className="text-center py-16">
          <p className="text-slate-400 text-lg mb-4">No services match “{query}”</p>
          <Link href="/search/" className="btn-primary">Browse All Services</Link>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-slate-400 text-lg">Start typing or pick a category above</p>
        </div>
      )}
    </div>
  );
}
