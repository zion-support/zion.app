// app/service-comparison/page.tsx — Interactive service comparison matrix
'use client';

import { useState, useMemo } from 'react';

import Link from 'next/link';
import { allServices, type Service } from '@/data/servicesData';

const MAX_COMPARE = 4;

const catMeta: Record<string, { label: string; color: string }> = {
  ai:        { label: 'AI',        color: 'bg-purple-500/15 text-purple-300 border-purple-500/25' },
  it:        { label: 'IT',        color: 'bg-blue-500/15   text-blue-300   border-blue-500/25'   },
  cloud:     { label: 'Cloud',     color: 'bg-sky-500/15    text-sky-300    border-sky-500/25'    },
  security:  { label: 'Security',  color: 'bg-orange-500/15 text-orange-300 border-orange-500/25'  },
  data:      { label: 'Data',      color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25'},
  automation:{ label: 'Automation',color: 'bg-rose-500/15   text-rose-300   border-rose-500/25'   },
};

export default function ServiceComparisonPage() {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const categories = useMemo(() => {
    const cats = new Set(allServices.map(s => s.category).filter(Boolean));
    return ['all', ...Array.from(cats)] as string[];
  }, []);

  const filtered = useMemo(() => {
    let list = allServices;
    if (catFilter && catFilter !== 'all') list = list.filter(s => s.category === catFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }
    // Sort: popular first, then title
    return [...list].sort((a, b) => {
      const ap = a.popular ? 1 : 0, bp = b.popular ? 1 : 0;
      return bp - ap || a.title.localeCompare(b.title);
    });
  }, [search, catFilter]);

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < MAX_COMPARE ? [...prev, id] : prev
    );
  };

  const compared = useMemo(
    () => allServices.filter(s => selected.includes(s.id)),
    [selected]
  );

  return (
    <div className="container-page py-16">
      {/* ── Header ── */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">Service Comparison</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Select up to <strong className="text-white">{MAX_COMPARE}</strong> services to compare
          features, category, and industry fit side-by-side.
        </p>
      </div>

      {/* ── Search + Category Filter ── */}
      <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
        <input
          type="text"
          placeholder="Search services…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] max-w-md bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat === 'all' ? null : cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                (cat === 'all' && !catFilter) || catFilter === cat
                  ? 'bg-purple-600 border-purple-400 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              {cat === 'all' ? 'All' : catMeta[cat]?.label || cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Compare count ── */}
      <p className="text-sm text-slate-500 mb-3">
        {selected.length}/{MAX_COMPARE} selected
        {selected.length > 0 && (
          <button
            onClick={() => setSelected([])}
            className="ml-3 text-xs text-red-400 hover:text-red-300 underline"
          >
            Clear
          </button>
        )}
      </p>

      {/* ── Service Table ── */}
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/60">
              <th className="text-left p-3 text-slate-400 font-semibold w-10">#</th>
              <th className="text-left p-3 text-slate-400 font-semibold">Service</th>
              <th className="text-left p-3 text-slate-400 font-semibold">Category</th>
              <th className="text-left p-3 text-slate-400 font-semibold">Industry</th>
              {compared.length > 0 && compared.map(s => (
                <th key={s.id} className="text-left p-3 text-slate-400 font-semibold min-w-[180px]">
                  <Link href={s.href} className="text-white hover:text-purple-300">
                    {s.title}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-800">
              <td className="p-3 text-slate-600">—</td>
              <td className="p-3 text-slate-600">—</td>
              <td className="p-3 text-slate-600">—</td>
              <td className="p-3 text-slate-600">—</td>
              {compared.map(s => (
                <td key={s.id} className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${catMeta[s.category]?.color || ''}`}>
                    {catMeta[s.category]?.label || s.category}
                  </span>
                  {s.popular && <span className="ml-1 text-yellow-400 text-xs" title="Popular">★</span>}
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-800 bg-slate-900/30">
              <td className="p-3 text-slate-600">—</td>
              <td className="p-3 text-slate-600 font-semibold">Description</td>
              <td className="p-3 text-slate-600">—</td>
              <td className="p-3 text-slate-600">—</td>
              {compared.map(s => (
                <td key={s.id} className="p-3 text-slate-300 text-xs leading-relaxed">
                  {s.description}
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-800">
              <td className="p-3 text-slate-600">—</td>
              <td className="p-3 text-slate-600 font-semibold">Industry</td>
              <td className="p-3 text-slate-600">—</td>
              <td className="p-3 text-slate-600">—</td>
              {compared.map(s => (
                <td key={s.id} className="p-3 text-slate-300 text-xs">
                  {s.industry || 'General'}
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-800">
              <td className="p-3 text-slate-600">—</td>
              <td className="p-3 text-slate-600 font-semibold">Featured</td>
              <td className="p-3 text-slate-600">—</td>
              <td className="p-3 text-slate-600">—</td>
              {compared.map(s => (
                <td key={s.id} className="p-3 text-xs">
                  {s.popular ? (
                    <span className="text-yellow-400">★ Popular</span>
                  ) : (
                    <span className="text-slate-600">—</span>
                  )}
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-800">
              <td className="p-3 text-slate-600">—</td>
              <td className="p-3 text-slate-600 font-semibold">Action</td>
              <td className="p-3 text-slate-600">—</td>
              <td className="p-3 text-slate-600">—</td>
              {compared.map(s => (
                <td key={s.id} className="p-3">
                  <Link
                    href={s.href}
                    className="text-xs text-purple-400 hover:text-purple-300 underline"
                  >
                    View Details →
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Selector ── */}
      <h2 className="text-xl font-bold text-white mt-12 mb-4">Choose Services to Compare</h2>
      <p className="text-slate-500 text-sm mb-6">
        Click to add — up to {MAX_COMPARE}. Selected services appear as columns above.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(svc => {
          const isSelected = selected.includes(svc.id);
          const disabled = !isSelected && selected.length >= MAX_COMPARE;
          return (
            <button
              key={svc.id}
              onClick={() => toggle(svc.id)}
              disabled={disabled}
              className={`flex items-start gap-3 rounded-lg border p-4 text-left transition ${
                isSelected
                  ? 'border-purple-500 bg-purple-900/20'
                  : disabled
                  ? 'border-slate-800 bg-slate-900/20 opacity-40 cursor-not-allowed'
                  : 'border-slate-700 bg-slate-800/30 hover:border-purple-500/40'
              }`}
            >
              <span className="text-xl shrink-0 mt-0.5">
                {isSelected ? '✅' : disabled ? '🔒' : '⬜'}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm truncate">{svc.title}</span>
                  {svc.popular && <span className="text-yellow-400 text-xs" title="Popular">★</span>}
                </div>
                <p className="text-slate-500 text-xs mt-0.5 line-clamp-2">{svc.description}</p>
                <span className={`inline-block mt-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${catMeta[svc.category]?.color || ''}`}>
                  {catMeta[svc.category]?.label || svc.category}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-slate-500 text-sm mt-6">No services match your filter.</p>
      )}

      {/* ── Footer CTA ── */}
      <div className="mt-16 text-center">
        <p className="text-slate-500 text-sm mb-3">
          Need a custom recommendation? Our AI matches you with the best-fit services.
        </p>
        <Link href="/proposals/" className="text-purple-400 hover:text-purple-300 font-semibold text-sm">
          Get Your Custom Proposal →
        </Link>
      </div>
    </div>
  );
}
