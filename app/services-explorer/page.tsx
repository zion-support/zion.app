// app/services-explorer/page.tsx — Interactive Service Explorer
'use client';

import { useState, useEffect, useMemo } from 'react';

import { allServices } from '@/data/servicesData';
import type { Service } from '@/data/servicesData';

const CAT_COLORS: Record<string, string> = {
  ai:        'bg-purple-900/50 text-purple-200 border-purple-500/30',
  it:        'bg-blue-900/50 text-blue-200 border-blue-500/30',
  cloud:     'bg-purple-900/50 text-purple-200 border-purple-500/30',
  security:  'bg-orange-900/50 text-orange-200 border-orange-500/30',
  data:      'bg-emerald-900/50 text-emerald-200 border-emerald-500/30',
  automation:'bg-rose-900/50 text-rose-200 border-rose-500/30',
};

export default function ServicesExplorerPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('all');
  const [sort, setSort] = useState<'id' | 'title' | 'price'>('id');
  const [q, setQ] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch('/service-index.json')
      .then(r => r.json())
      .then(idx => {
        if (!cancelled) {
          setServices(idx.services || []);
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
    return () => { cancelled = true; };
  }, []);

  const catCounts = useMemo(() => {
    const m: Record<string, number> = {};
    services.forEach(s => m[s.category] = (m[s.category] || 0) + 1);
    return m;
  }, [services]);

  const filtered = useMemo(() => {
    let list = services;
    if (cat !== 'all') list = list.filter(s => s.category === cat);
    if (q.trim()) {
      const lq = q.toLowerCase();
      list = list.filter(s =>
        s.title.toLowerCase().includes(lq) ||
        s.description?.toLowerCase().includes(lq)
      );
    }
    return [...list].sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title);
      if (sort === 'price') return (parseInt((a as any).basic) || 0) - (parseInt((b as any).basic) || 0);
      return a.id.localeCompare(b.id);
    });
  }, [services, cat, sort, q]);

  return (
    <main className="min-h-screen bg-slate-950 py-20">
      {/* JSON-LD: CollectionPage + BreadcrumbList */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Service Explorer | Zion Tech Group",
            description:
              "Browse and filter 550+ enterprise AI and IT services by category, industry, stage, and keyword.",
            url: "https://ziontechgroup.com/services-explorer",
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: services.length,
              itemListElement: services
                .slice(0, 20)
                .map((svc: Service, i: number) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  url: `https://ziontechgroup.com/services/${svc.id}`,
                  name: svc.title,
                })),
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://ziontechgroup.com" },
                { "@type": "ListItem", position: 2, name: "Service Explorer", item: "https://ziontechgroup.com/services-explorer" },
              ],
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Service Explorer",
            description: "Interactive explorer for all 550+ enterprise AI and IT services — filter by category, industry, and keywords.",
            url: "https://ziontechgroup.com/services-explorer",
          }),
        }}
      />
      <div className="container-page">
        <a href="/" className="text-purple-400 text-sm hover:text-purple-300 transition">← Home</a>

        <div className="mt-8 mb-2">
          <h1 className="text-4xl font-bold gradient-text" style={{background:'linear-gradient(135deg,#a78bfa,#ec4899)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
            Services Explorer
          </h1>
          <p className="text-slate-400 mt-2">
            Search, filter &amp; sort all <span className="text-purple-400 font-semibold">{services.length}</span> services from our live catalogue
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-8 mt-4">
          <select
            value={cat}
            onChange={e => setCat(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 text-slate-200 px-4 py-2.5 text-sm"
          >
            <option value="all">All Categories ({services.length})</option>
            {Object.entries(catCounts).sort((a,b) => b[1]-a[1]).map(([k,n]) => (
              <option key={k} value={k}>
                {k.charAt(0).toUpperCase()+k.slice(1)} ({n})
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={e => setSort(e.target.value as typeof sort)}
            className="rounded-lg border border-slate-700 bg-slate-900 text-slate-200 px-4 py-2.5 text-sm"
          >
            <option value="id">Sort: ID</option>
            <option value="title">Sort: Title</option>
            <option value="price">Sort: Price (Low → High)</option>
          </select>

          <input
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="🔍  Search all services…"
            className="flex-1 min-w-[220px] rounded-lg border border-slate-700 bg-slate-900 text-slate-200 px-4 py-2.5 text-sm placeholder:text-slate-500"
          />
        </div>

        {/* Result count */}
        <p className="text-sm text-slate-400 mb-4">
          Showing <span className="text-purple-400 font-semibold">{filtered.length}</span> of {services.length} services
        </p>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">
            <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-3" />
            <p>Loading service index…</p>
          </div>
        ) : (
          <div className="feature-grid">
            {filtered.map((svc: Service) => {
              const price = ((svc as any).basic || '—').startsWith('$') ? (svc as any).basic : '$' + (svc as any).basic;
              const cc = CAT_COLORS[svc.category] || CAT_COLORS.ai;
              const feat2 = (svc.features || []).slice(0, 2);
              return (
                <div key={svc.id} className={`glass-card flex flex-col h-full ${cc} gap-0 overflow-hidden`}>
                  <div style={{height:'3px',background:'currentColor',opacity:.15}} />
                  <div className="flex items-start gap-3 mb-3 p-5 pb-0">
                    <span className="text-2xl shrink-0">{svc.icon || '★'}</span>
                    <div>
                      <h3 className="text-base font-semibold text-white leading-snug group-hover:text-purple-300 transition-colors">
                        {svc.title}
                      </h3>
                      <span className="text-xs text-slate-500 uppercase tracking-wider mt-0.5 block">
                        {svc.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mb-3 flex-1 px-5 line-clamp-2">
                    {svc.description || 'No description available.'}
                  </p>
                  <ul className="space-y-1 mb-3 px-5">
                    {feat2.map((f: string, i: number) => (
                      <li key={i} className="text-slate-300 text-xs flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5 shrink-0">✓</span>
                        <span className="line-clamp-1">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-3 border-t border-slate-700/50 flex justify-between items-center px-5 pb-5">
                    <span className="text-purple-300 text-sm font-semibold">{price}/mo</span>
                    <a href={`/services/${svc.id}`} className="text-sm text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                      Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !filtered.length && (
          <div className="text-center py-16 text-slate-400">
            <p className="text-xl mb-1">No services match &quot;{q}&quot;</p>
            <p className="text-sm">Clear your search or change the filter.</p>
          </div>
        )}
      </div>
    </main>
  );
}
