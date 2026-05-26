// app/tools/service-comparison/page.tsx — Full Service Comparison
'use client';
import { pingTool } from '@/data/tools_ping_client';

import { useState, useMemo, useEffect } from 'react';
import { allServices, type Service } from '../../data/servicesData';
import Link from 'next/link';
import SmartServiceCard from '@/components/SmartServiceCard';

const CAT_LABELS: Record<string,string> = {
  ai:'AI Services', it:'IT', cloud:'Cloud', security:'Security',
  data:'Data & Analytics', automation:'Automation',
};

const TABS = [
  { key:'overview',    label:'Overview',  icon:'📋' },
  { key:'features',   label:'Features', icon:'✨' },
  { key:'pricing',    label:'Pricing',  icon:'💰' },
  { key:'benefits',   label:'Benefits', icon:'🎯' },
  { key:'timeline',   label:'Timeline', icon:'🗓️' },
] as const;

type TabKey = typeof TABS[number]['key'];

export default function ServiceComparisonPage() {
  useEffect(() => { pingTool('service-comparison'); }, []);

  const featured = useMemo(
    () => allServices.filter((s: Service) => s.popular).slice(0, 8), []
  );

  // ── Deep-compare state ──────────────────────────────────────────
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [catFilter, setCatFilter] = useState<string>('');

  const categories = useMemo(
    () => [...new Set(allServices.map((s: Service) => s.category))].sort(), []
  );

  const pool = useMemo(() => {
    const base = compareIds.length > 0
      ? allServices.filter((s: Service) => compareIds.includes(s.id))
      : featured;
    return catFilter
      ? base.filter((s: Service) => s.category === catFilter)
      : base;
  }, [compareIds, catFilter, featured]);

  const toggleCompare = (id: string) => {
    setCompareIds(prev => prev.includes(id)
      ? prev.filter(x => x !== id)
      : prev.length >= 3 ? prev : [...prev, id]
    );
  };

  // ── Feature checkmark ───────────────────────────────────────────
  const hasFeature = (svc: Service, feat: string) =>
    (svc.features || []).some((f: string) =>
      f.toLowerCase().includes(feat.toLowerCase())
    );

  const CHECK_FEATURES = [
    'API','SDK','realtime','24/7','cloud','on-prem','audit','report',
    'multilingual','integration','automation',
  ];

  // ── Timeline rows ───────────────────────────────────────────────
  const timelinePhases = [
    { phase:'Foundation',    weeks:'Week 1–2', tasks:['Requirements & architecture','Environment & credentials setup','Stakeholder kickoff'] },
    { phase:'Core Config',   weeks:'Week 3–5', tasks:['Service deployment / integration','Core pipeline workflow','Data connections'] },
    { phase:'Test & Validate',weeks:'Week 6–7', tasks:['Acceptance testing','Fine-tuning & calibration','Edge-case review'] },
    { phase:'Go Live',       weeks:'Week 8',    tasks:['Production deploy','Rollout plan','Hyper-care handover'] },
    { phase:'Optimise',      weeks:'Ongoing',   tasks:['Usage analytics review','Feature iterations','Continuous improvement'] },
  ];

  return (
    <div className="container-page py-16">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">Service Comparison</h1>
        <p className="text-slate-400 max-w-2xl">
          Compare features, pricing, benefits, and implementation timelines
          across <strong className="text-white">{allServices.length}+</strong> services.
          Pick up to 3 services for a side-by-side deep compare.
        </p>
      </div>

      {/* ── Quick-Compare Table (featured, 1-click deep) ─────────── */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold text-white mb-4">⚡ Quick Compare — Popular Services</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-900/50">
                <th className="py-3 px-4 text-slate-300 font-semibold w-56">Service</th>
                <th className="py-3 px-4 text-slate-300 font-semibold">Category</th>
                <th className="py-3 px-4 text-slate-300 font-semibold text-center">Basic</th>
                <th className="py-3 px-4 text-slate-300 font-semibold text-center">Pro</th>
                <th className="py-3 px-4 text-slate-300 font-semibold text-center">Enterprise</th>
                <th className="py-3 px-4 text-slate-300 font-semibold text-center w-36">Compare</th>
              </tr>
            </thead>
            <tbody>
              {featured.map((svc: Service) => (
                <tr key={svc.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4">
                    <Link href={`/services/${svc.id}`} className="text-purple-400 font-medium hover:underline">
                      {svc.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{CAT_LABELS[svc.category] || svc.category}</td>
                  <td className="py-3 px-4 text-center text-slate-300 text-xs">{svc.pricing?.basic ?? '—'}</td>
                  <td className="py-3 px-4 text-center text-emerald-400 text-xs font-medium">{svc.pricing?.pro ?? '—'}</td>
                  <td className="py-3 px-4 text-center text-purple-300 text-xs">{svc.pricing?.enterprise ?? '—'}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleCompare(svc.id)}
                      className={`px-3 py-1 rounded-full text-xs transition ${
                        compareIds.includes(svc.id)
                          ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                          : 'bg-slate-800 border border-slate-700 text-slate-400 hover:border-purple-500/30 hover:text-purple-300'
                      }`}
                    >
                      {compareIds.includes(svc.id) ? '✓ Added' : '+ Add'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-slate-500 text-xs mt-2">
          Click <strong>+ Add</strong> to select services for deep comparison (up to 3).
        </p>
      </section>

      {/* ── Deep Compare Panel ─────────────────────────────────── */}
      {compareIds.length > 1 && (
        <section className="mb-14" id="deep-compare">
          <h2 className="text-xl font-semibold text-white mb-5">
            ⚖️ Deep Compare — {compareIds.length} Services Selected
          </h2>

          {/* Tab bar */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-800 pb-4">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  activeTab === tab.key
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                    : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
            <button
              onClick={() => setCompareIds([])}
              className="ml-auto px-3 py-2 rounded-full text-xs bg-red-900/30 text-red-300 border border-red-500/20 hover:border-red-500/40 transition"
            >
              ✕ Clear selection
            </button>
          </div>

          {/* ── Overview tab ────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-3 gap-6">
              {compareIds.map(id => {
                const s = allServices.find((x: Service) => x.id === id);
                if (!s) return null;
                return (
                  <div key={id} className="bg-slate-900/60 rounded-xl border border-slate-700/50 p-6">
                    <Link href={`/services/${id}`} className="text-lg font-bold text-white hover:text-purple-300">
                      {s.title}
                    </Link>
                    <p className="text-slate-400 text-sm mt-2 mb-4">{s.description}</p>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {CHECK_FEATURES.map(f => (
                        <div key={f}
                          className={`text-xs px-2 py-1 rounded text-center ${
                            hasFeature(s, f)
                              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/20'
                              : 'bg-slate-800 text-slate-600 border border-slate-800'
                          }`}
                        >{f}</div>
                      ))}
                    </div>
                    <div className="text-xs text-slate-500 mt-3">
                      {CAT_LABELS[s.category] || s.category} · {s.features?.length || 0} features · {(s.benefits||[]).length} benefits
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Features tab ─────────────────────────────────────── */}
          {activeTab === 'features' && (
            <div className="grid md:grid-cols-3 gap-6">
              {compareIds.map(id => {
                const s = allServices.find((x: Service) => x.id === id);
                if (!s) return null;
                return (
                  <div key={id} className="bg-slate-900/60 rounded-xl border border-slate-700/50 p-6">
                    <h3 className="font-semibold text-white mb-4">{s.title}</h3>
                    <ul className="space-y-2">
                      {(s.features || []).map((f: string, j: number) => (
                        <li key={j} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-purple-400 mt-0.5 shrink-0">✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Pricing tab ──────────────────────────────────────── */}
          {activeTab === 'pricing' && (
            <div className="grid md:grid-cols-3 gap-6">
              {compareIds.map(id => {
                const s = allServices.find((x: Service) => x.id === id);
                if (!s) return null;
                const tiers = [
                  { key:'basic',      label:'Basic',      color:'text-slate-300', bg:'bg-slate-800' },
                  { key:'pro',        label:'Pro',        color:'text-emerald-400', bg:'bg-emerald-900/30' },
                  { key:'enterprise', label:'Enterprise', color:'text-purple-300', bg:'bg-purple-900/30' },
                ];
                return (
                  <div key={id} className="bg-slate-900/60 rounded-xl border border-slate-700/50 p-6">
                    <h3 className="font-semibold text-white mb-4">{s.title}</h3>
                    <div className="space-y-3">
                      {tiers.map(t => (
                        <div key={t.key}
                          className={`${t.bg} rounded-lg p-4 border border-slate-700/50`}
                        >
                          <div className={`text-xs font-semibold mb-1 ${t.color}`}>{t.label}</div>
                          <div className="text-xl font-bold text-white">
                            {s.pricing?.[t.key as keyof typeof s.pricing] ?? 'Custom'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Benefits tab ─────────────────────────────────────── */}
          {activeTab === 'benefits' && (
            <div className="grid md:grid-cols-3 gap-6">
              {compareIds.map(id => {
                const s = allServices.find((x: Service) => x.id === id);
                if (!s) return null;
                return (
                  <div key={id} className="bg-slate-900/60 rounded-xl border border-slate-700/50 p-6">
                    <h3 className="font-semibold text-white mb-4">{s.title}</h3>
                    <ul className="space-y-2">
                      {(s.benefits || []).map((b: string, j: number) => (
                        <li key={j} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5 shrink-0">●</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Timeline tab ────────────────────────────────────── */}
          {activeTab === 'timeline' && (
            <div className="relative">
              {compareIds.map((id, si) => {
                const s = allServices.find((x: Service) => x.id === id);
                if (!s || s.category !== 'security') return null; // refine later
                return null;
              })}
              <p className="text-slate-400 text-sm">
                Implementation timelines show the typical phased roll-out for a service engagement.
                Pick services in the same category to see aligned timelines.
              </p>
            </div>
          )}
        </section>
      )}

      {/* ── All Services (filter) ─────────────────────────────── */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Browse All Services</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCatFilter('')}
              className={`px-3 py-1.5 rounded-full text-xs transition ${
                !catFilter ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              All
            </button>
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCatFilter(c)}
                className={`px-3 py-1.5 rounded-full text-xs transition ${
                  catFilter === c ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {CAT_LABELS[c] || c}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pool.slice(0, 24).map((svc: Service) => (
            <SmartServiceCard
              key={svc.id}
              service={svc}
              relationship={svc.popular ? 'featured' : 'related'}
              showPricing
            />
          ))}
        </div>
        {pool.length > 24 && (
          <p className="text-slate-500 text-sm text-center mt-4">
            Showing 24 of {pool.length} — <Link href="/services/" className="text-purple-400 hover:underline">View all →</Link>
          </p>
        )}
      </section>
    </div>
  );
}
