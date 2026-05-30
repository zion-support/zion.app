'use client';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { allServices } from '@/data/servicesData';
import type { Service } from '@/data/servicesData';

const catServices = allServices.filter((s: Service) => s.category === 'email-intelligence');

export default function EmailIntelligencePage() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => catServices.filter((s: Service) =>
    !query.trim() || s.title.toLowerCase().includes(query.toLowerCase()) || s.description.toLowerCase().includes(query.toLowerCase())
  ), [query]);

  return (
    <main className="min-h-screen bg-slate-950 py-20">
      <div className="container-page">
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/" className="hover:text-purple-400 transition">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/services/" className="hover:text-purple-400 transition">Services</Link>
          <span className="mx-2">/</span>
          <span className="text-purple-400">Email Intelligence</span>
        </nav>
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">📧</div>
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-purple-600 mb-4">Email Intelligence Engines</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">AI-powered email intelligence, automation, and optimization. Explore {filtered.length}+ cutting-edge email intelligence engines (V199-V365).</p>
        </div>
        <div className="max-w-2xl mx-auto mb-12">
          <input type="text" placeholder="Search email intelligence engines..." value={query} onChange={(e) => setQuery(e.target.value)}
            className="w-full px-6 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filtered.map((service) => (
            <Link key={service.id} href={service.href || `/services/${service.id}`}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/20">
              <div className="text-4xl mb-3">{service.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-3">{service.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-purple-400 text-sm font-semibold">Learn More →</span>
                {service.popular && <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">Popular</span>}
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center">
          <Link href="/contact/" className="inline-block bg-gradient-to-r from-violet-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all">Need Custom Email Intelligence? Contact Us</Link>
          <p className="text-slate-400 mt-4">📱 +1 302 464 0950 | ✉️ kleber@ziontechgroup.com</p>
          <p className="text-slate-500 mt-1">📍 364 E Main St STE 1008, Middletown DE 19709</p>
        </div>
      </div>
    </main>
  );
}
