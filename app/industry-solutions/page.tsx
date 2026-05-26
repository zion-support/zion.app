// app/industry-solutions/page.tsx — Industry Solutions Landing
'use client';
import { useState, useMemo } from 'react';


import Link from 'next/link';
import Footer from '@/components/Footer';
import { allServices, type Service } from '@/data/servicesData';

type IndustryService = Service & { industry: string };

const INDUSTRIES = [
  'Finance',
  'Healthcare',
  'E-Commerce',
  'Manufacturing',
  'SaaS',
  'Education',
  'Marketing',
  'Sustainability',
  'General',
] as const;

const IND_COLORS: Record<string, string> = {
  Finance:        'from-blue-500 to-indigo-500',
  Healthcare:     'from-green-500 to-teal-500',
  'E-Commerce':   'from-pink-500 to-rose-500',
  Manufacturing:  'from-orange-500 to-red-500',
  SaaS:           'from-cyan-500 to-sky-500',
  Education:      'from-yellow-500 to-amber-500',
  Marketing:      'from-violet-500 to-purple-500',
  Sustainability: 'from-lime-500 to-green-600',
  General:        'from-slate-500 to-slate-600',
};

const IND_COUNT: Record<string, number> = {
  Finance: 155,
  Healthcare: 20,
  'E-Commerce': 37,
  Manufacturing: 47,
  SaaS: 7,
  Education: 4,
  Marketing: 32,
  Sustainability: 6,
  General: 318,
};

export default function IndustrySolutionsPage() {
  const [filter, setFilter] = useState<string | null>(null);

  const services: IndustryService[] = (allServices as any[]).map((s) => ({
    ...s,
    industry: (s as any).industry as string,
  }));

  const filtered = filter ? services.filter((s) => s.industry === filter) : services;

  const byIndustry = useMemo(() => {
    const m: Record<string, { count: number; byCat: Record<string, number> }> = {};
    for (const svc of services) {
      if (!m[svc.industry]) m[svc.industry] = { count: 0, byCat: {} };
      m[svc.industry].count++;
      m[svc.industry].byCat[svc.category] = (m[svc.industry].byCat[svc.category] || 0) + 1;
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
              {services.length}+ services across {INDUSTRIES.length} industries — mapped to where they deliver the highest value
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
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setFilter(ind)}
                  className={
                    'px-4 py-2 rounded-full text-sm font-medium transition ' +
                    (filter === ind ? 'bg-white text-slate-900 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700')
                  }
                >
                  {ind} ({IND_COUNT[ind] || 0})
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {INDUSTRIES.map((ind) => {
              const bd = byIndustry[ind];
              if (!bd) return null;
              const grad = IND_COLORS[ind] || 'from-slate-500 to-slate-600';
              return (
                <div key={ind} className="glass-card p-5 text-center">
                  <div className="text-2xl font-bold gradient-text" style={{ backgroundImage: 'linear-gradient(135deg,#fff,#999)' }}>
                    {bd.count}
                  </div>
                  <div className="text-sm text-slate-400 mt-1">{ind}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {Object.entries(bd.byCat)
                      .map(([c, n]) => c + '(' + n + ')')
                      .join(', ')}
                  </div>
                </div>
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
            {filtered.map((svc: IndustryService) => (
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

      <Footer />
    </main>
  );
}
