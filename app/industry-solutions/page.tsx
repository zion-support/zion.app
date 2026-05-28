// app/industry-solutions/page.tsx — Industry Solutions Landing (dynamic)
'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { allServices, type Service } from '@/data/servicesData';

const IND_COLORS: Record<string, string> = {
  Technology:         'from-blue-500 to-indigo-500',
  'Financial Services':'from-emerald-500 to-teal-500',
  'Retail & E-Commerce':'from-pink-500 to-rose-500',
  'Marketing & Sales': 'from-violet-500 to-purple-500',
  Cybersecurity:      'from-red-500 to-orange-500',
  Healthcare:         'from-green-500 to-teal-500',
  Manufacturing:      'from-orange-500 to-amber-500',
  'Media & Entertainment':'from-fuchsia-500 to-pink-500',
  Education:          'from-yellow-500 to-amber-500',
  'Data & Analytics':  'from-cyan-500 to-sky-500',
  Telecommunications: 'from-sky-500 to-blue-500',
  'Transportation & Logistics':'from-lime-500 to-green-600',
  'Government & Public Sector':'from-slate-500 to-gray-600',
  'Real Estate & Construction':'from-amber-500 to-yellow-600',
  'Energy & Sustainability':'from-green-600 to-emerald-600',
  'Business Operations':'from-indigo-500 to-blue-600',
};

const IND_EMOJI: Record<string, string> = {
  Technology: '💻',
  'Financial Services': '🏦',
  'Retail & E-Commerce': '🛒',
  'Marketing & Sales': '📈',
  Cybersecurity: '🔒',
  Healthcare: '🏥',
  Manufacturing: '🏭',
  'Media & Entertainment': '🎬',
  Education: '🎓',
  'Data & Analytics': '📊',
  Telecommunications: '📡',
  'Transportation & Logistics': '🚚',
  'Government & Public Sector': '🏛️',
  'Real Estate & Construction': '🏗️',
  'Energy & Sustainability': '⚡',
  'Business Operations': '⚙️',
};

export default function IndustrySolutionsPage() {
  const [filter, setFilter] = useState<string | null>(null);

  // Compute industries dynamically from data
  const industries = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of allServices) {
      const ind = s.industry || 'General';
      map.set(ind, (map.get(ind) || 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, []);

  const services = allServices;

  const filtered = filter ? services.filter((s) => s.industry === filter) : services;

  const byIndustry = useMemo(() => {
    const m: Record<string, { count: number; byCat: Record<string, number> }> = {};
    for (const svc of services) {
      const ind = svc.industry || 'General';
      if (!m[ind]) m[ind] = { count: 0, byCat: {} };
      m[ind].count++;
      m[ind].byCat[svc.category] = (m[ind].byCat[svc.category] || 0) + 1;
    }
    return m;
  }, [services]);

  return (
    <main className="min-h-screen bg-slate-950">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(120,50,200,0.18),rgba(20,10,40,0.92))]" />
        <div className="relative container-page pt-28 pb-16">
          <div className="text-center max-w-4xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 text-sm mb-6 transition">
              ← Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">📊 Industry Solutions</span>
            </h1>
            <p className="text-xl text-slate-300 mb-2">
              {services.length}+ services across {industries.length} industries — mapped to where they deliver the highest value
            </p>
            <p className="text-slate-400 mb-8">
              Filter by industry to see only the solutions that fit your vertical — or browse all {services.length}+ services below.
            </p>

            {/* Filter pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <button
                onClick={() => setFilter(null)}
                className={
                  'px-4 py-2 rounded-full text-sm font-medium transition ' +
                  (!filter ? 'bg-white text-slate-900 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700')
                }
              >
                All ({services.length})
              </button>
              {industries.map(([ind, count]) => (
                <button
                  key={ind}
                  onClick={() => setFilter(ind)}
                  className={
                    'px-4 py-2 rounded-full text-sm font-medium transition ' +
                    (filter === ind ? 'bg-white text-slate-900 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700')
                  }
                >
                  {IND_EMOJI[ind] || '🔹'} {ind} ({count})
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              🗺️ Keyword-mapped — many tools apply to multiple verticals.
            </p>
          </div>
        </div>
      </section>

      {/* ── Industry Stats Row ── */}
      <section className="py-10 bg-slate-900/30">
        <div className="container-page">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {industries.map(([ind, count]) => {
              const bd = byIndustry[ind];
              if (!bd) return null;
              return (
                <button
                  key={ind}
                  onClick={() => setFilter(filter === ind ? null : ind)}
                  className={`glass-card p-5 text-center cursor-pointer transition hover:border-purple-500/40 ${filter === ind ? 'ring-2 ring-purple-500/50 border-purple-500/30' : ''}`}
                >
                  <div className="text-2xl mb-1">{IND_EMOJI[ind] || '🔹'}</div>
                  <div className="text-2xl font-bold gradient-text" style={{ backgroundImage: 'linear-gradient(135deg,#fff,#999)' }}>
                    {bd.count}
                  </div>
                  <div className="text-sm text-slate-400 mt-1">{ind}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {Object.entries(bd.byCat)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 3)
                      .map(([c, n]) => c + '(' + n + ')')
                      .join(', ')}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Service Cards ── */}
      <section className="py-12">
        <div className="container-page">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">
              {filter !== null ? filter + ' Solutions' : 'All Industry Solutions'}
            </h2>
            <span className="text-sm text-slate-400">{filtered.length} services</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((svc) => (
              <Link
                key={svc.id}
                href={'/services/' + svc.id}
                className="glass-card flex flex-col hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10 group cursor-pointer relative"
              >
                {svc.popular && (
                  <span className="absolute -top-2 -right-2 z-10 text-[9px] font-bold uppercase tracking-wider bg-gradient-to-r from-orange-500 to-pink-500 text-white px-2 py-0.5 rounded-full shadow-md">
                    🔥 Popular
                  </span>
                )}
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-xl group-hover:scale-110 transition-transform">{svc.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white leading-snug group-hover:text-purple-300 transition-colors line-clamp-2">
                      {svc.title}
                    </h3>
                  </div>
                </div>
                <p className="text-slate-400 text-xs mb-3 line-clamp-2 flex-1 leading-relaxed">
                  {svc.description}
                </p>
                <div className="mt-auto pt-3 border-t border-slate-700/50 flex justify-between items-center">
                  <span className="text-purple-300 text-xs font-semibold">
                    From {(svc.pricing as any).basic}/mo
                  </span>
                  <span className="text-xs text-purple-400 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16">
        <div className="container-page">
          <div className="cta-section text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Ready to Build?</h2>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Start a custom proposal — AI matches your industry and budget to the right services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/configurator/" className="btn-primary text-lg px-10 py-4">
                ⚙️ AI Configurator →
              </Link>
              <Link href="/services/" className="btn-secondary text-lg px-10 py-4">
                🛠️ All Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
