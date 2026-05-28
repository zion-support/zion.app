// app/services/page.tsx — Full Service Catalog
'use client';

import { useState, useMemo, Suspense } from 'react';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SmartSearchBar from '@/components/SmartSearchBar';
import { allServices } from '../data/servicesData';
import type { Service } from '../data/servicesData';



const SVC_CAT_LABELS: Record<string,string> = { ai: 'AI Services', it: 'IT', cloud: 'Cloud', security: 'Security', data: 'Data & AI', automation: 'Automation' };
const CATEGORIES = [
  { key: 'all' as const, label: 'All' },
  { key: 'ai' as const, label: 'AI' },
  { key: 'it' as const, label: 'IT' },
  { key: 'cloud' as const, label: 'Cloud' },
  { key: 'security' as const, label: 'Security' },
  { key: 'data' as const, label: 'Data & AI' },
  { key: 'automation' as const, label: 'Automation' },
];

function ServicesContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams?.get('category') || 'all';
  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [searchQuery, setSearchQuery] = useState('');

  const firstTier = (pricing: Record<string,string>): string =>
    Object.values(pricing)[0] || 'Contact for Quote';

  const filteredServices = useMemo(() => {
    let services = allServices;
    if (activeCategory !== 'all') services = services.filter((s: Service) => s.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      services = services.filter((s: Service) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
    }
    return services;
  }, [activeCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-slate-950 py-20">
      <div className="container-page">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">Our Complete Service Catalog</h1>
        <p className="section-subheading text-center">{allServices.length}+ real-world services across 6 categories</p>
        {/* Smart Fuzzy Search Bar */}
        <div className="max-w-3xl mx-auto mt-8">
          <SmartSearchBar
            initialQuery={urlCategory !== 'all' ? '' : ''}
            initialCategory={urlCategory}
          />
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-8 mb-12">
          {CATEGORIES.map((cat) => (
            <button key={cat.key} onClick={() => setActiveCategory(cat.key)} className={`rounded-full px-6 py-2.5 text-sm font-semibold transition ${activeCategory === cat.key ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'bg-slate-900/50 text-slate-400 border border-slate-700/50 hover:border-purple-500/50'}`}>{cat.label}</button>
          ))}
        </div>
        <div className="text-center mb-12"><span className="text-slate-400">Showing <span className="text-purple-400 font-semibold">{filteredServices.length}</span> of <span className="text-purple-400 font-semibold">{allServices.length}</span> services</span></div>
        <div className="feature-grid">
          {filteredServices.map((service: Service) => (
            <div key={service.id} className="glass-card flex flex-col h-full">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-900/30 text-purple-300 uppercase tracking-wider">{SVC_CAT_LABELS[service.category as string] || service.category}</span>
                  <span className="text-xs text-slate-500">{service.category}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 leading-snug">{service.title}</h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">{service.description}</p>
                <ul className="space-y-2 mb-4">{service.features.slice(0,5).map((f:string,i:number) => <li key={i} className="text-slate-300 text-sm flex items-start gap-2"><span className="text-purple-400 mt-1 shrink-0">•</span><span>{f}</span></li>)}</ul>
              </div>
              <div className="mt-auto pt-4 border-t border-slate-700/50">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300 text-sm font-medium">Starting at {firstTier(service.pricing)}</span>
                </div>
                <Link href={`/services/${service.id}`} className="text-sm text-purple-400 hover:underline inline-flex items-center gap-1 mt-1">View Details →</Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-16">
          <Link href="/configurator/" className="btn-primary text-lg">Get Your Custom Proposal →</Link>
          <p className="text-slate-500 text-sm mt-4">Or call us: <a href="tel:+13024640950" className="text-purple-300">+1 302 464 0950</a></p>
        </div>
      </div>
    </main>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-950 py-20"><div className="container-page text-center py-20"><div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /><p className="text-slate-400 mt-4">Loading services…</p></div></main>}>
      <ServicesContent />
    </Suspense>
  );
}
