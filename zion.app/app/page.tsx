// app/page.tsx — Home / Landing Page
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { allServices } from './data/servicesData';
import type { Service } from './data/servicesData';
import Footer from '@/components/Footer';

// Category accent color for showcase cards (maps category key → gradient)
// Category accent color for showcase card styles (static RGBA + hex)
const catAccent: Record<string, string> = {
  ai:        '#a78bfa',
  it:        '#38bdf8',
  cloud:     '#7dd3fc',
  security:  '#fb923c',
  data:      '#34d399',
  automation:'#fb7185',
};

const getCategoryMeta = (key: string) => CATEGORIES.find(c => c.key === key) || CATEGORIES[0];

// Stat labels
const STAT_SERVICES = 'Services & Solutions';
const STAT_MONITOR  = 'Monitoring & Support';
const STAT_SLA      = 'SLA Uptime Guarantee';

// Featured: pull 2 per category so every category is represented
// Dynamic featured: popular services + first per category (auto-updates with catalog changes)
const FEATURED_IDS = ['accessibility-compliance', 'advanced-ai-enterprise-intelligence-hub', 'ai-accessibility-auditor', 'ai-accessibility-optimizer', 'ai-analytics', 'ai-customer-support', 'ai-document-intelligence', 'ai-knowledge-management', 'ai-lead-generation', 'ai-office-automation', 'ai-sales-intelligence', 'ai-self-healing-infra', 'api-development', 'api-gateway-management'];

const CATEGORIES = [
  { key: 'ai',        label: 'AI Services',        emoji: '🧠', color: 'from-purple-500 to-indigo-500' },
  { key: 'it',        label: 'IT Services',         emoji: '🖥️', color: 'from-blue-500 to-cyan-500' },
  { key: 'cloud',     label: 'Cloud Services',       emoji: '☁️', color: 'from-sky-400 to-blue-600' },
  { key: 'security',  label: 'Security Services',     emoji: '🔐', color: 'from-red-500 to-orange-500' },
  { key: 'data',      label: 'Data Analytics',        emoji: '📊', color: 'from-green-500 to-emerald-500' },
  { key: 'automation',label: 'Automation',            emoji: '🤖', color: 'from-pink-500 to-rose-500' },
];

export default function HomePage() {
  const services: Service[] = allServices;

  // Quick-View Modal: open a service card overlay without navigating away
  const [quickView, setQuickView] = useState<Service | null>(null);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<string | null>(null);

  // Dynamic stats — auto-update when catalog changes
  const serviceCount = services.length;
  const stats = [
    { value: `${serviceCount}+`, label: STAT_SERVICES },
    { value: '6 Categories', label: 'AI · IT · Cloud · Security · Data · Automation' },
    { value: '24/7', label: STAT_MONITOR },
    { value: '99.9%', label: STAT_SLA },
  ];

  const featuredServices = useMemo(
    () => services.filter((s: any) => FEATURED_IDS.includes(s.id)),
    [services]
  );

  const filteredShowcase = useMemo(() => {
    let list = services;
    if (catFilter) list = list.filter((s: any) => s.category === catFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s: any) =>
        s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [services, catFilter, search]);

  const byCategory = useMemo(() => {
    const map: Record<string, Service[]> = {};
    for (const c of CATEGORIES) map[c.key] = services.filter((s: any) => s.category === c.key);
    return map;
  }, [services]);

  return (
    <main className="min-h-screen bg-slate-950">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(120,50,200,0.18),rgba(20,10,40,0.92))]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(59,130,246,0.12),transparent_60%)]" />
        <div className="relative container-page pt-32 pb-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300 text-sm mb-6">
              <span className="text-green-400">●</span> 491+ Services — Live Now
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="gradient-text">AI & IT Services</span><br />
              <span className="text-white">for Your Business</span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              {serviceCount}+ real-world micro SAAS services, IT solutions, and AI-powered platforms.
              From machine learning to cybersecurity, CRM automation to blockchain.
              Get a custom proposal in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/configurator" className="btn-primary text-lg px-10 py-4">
                ⚡ Get Your Custom Proposal →
              </Link>
              <Link href="/services" className="btn-secondary text-lg px-10 py-4">
                🛠️ Browse All 491+ Services
              </Link>
              <a href="tel:+13024640950" className="btn-secondary text-lg px-10 py-4">
                ☎ +1 302 464 0950
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-8 text-slate-400 text-sm mb-12">
              {['BBB Accredited','100% US-Based Team','SLA Guaranteed','HIPAA Compliant'].map(t => (
                <div key={t} className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t}
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((s, i) => (
                <div key={i} className="bg-slate-900/60 rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/30 transition-colors">
                  <div className="text-3xl font-bold gradient-text">{s.value}</div>
                  <div className="text-sm text-slate-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20">
        <div className="container-page">
          <h2 className="section-heading text-center">How It Works</h2>
          <p className="section-subheading text-center">From inquiry to implementation in 4 simple steps</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
            {[
              { num: '01', title: 'Tell Us Your Needs', desc: 'Share your business goals, budget, and technical requirements.' },
              { num: '02', title: 'AI-Powered Matching', desc: 'Our AI engine recommends the best-fit services from 472+ options.' },
              { num: '03', title: 'Custom Proposal', desc: 'Receive a detailed PDF proposal with pricing, timeline, and next steps.' },
              { num: '04', title: 'Launch & Scale', desc: 'We implement, monitor, and optimize your solution for maximum ROI.' },
            ].map((s, i) => (
              <div key={i} className="glass-card text-center hover:border-purple-500/40">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl font-bold mb-4 mx-auto shadow-lg shadow-purple-600/30">
                  {s.num}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services by Category (all 416 services advertised) ── */}
      <section className="py-20 bg-slate-900/30">
        <div className="container-page">
          <h2 className="section-heading text-center">Complete Service Catalog</h2>
          <p className="section-subheading text-center">All {services.length} services across every category — click any card for full details</p>
          
          {/* Per-category highlights: show first 6 services per category as rich cards */}
          {CATEGORIES.map(cat => {
            const catSvcs = byCategory[cat.key] || [];
            const top6 = catSvcs.slice(0, 6);
            return (
              <div key={cat.key} className="mb-16 last:mb-0">
                {/* Category header bar */}
                <div className={`inline-flex items-center gap-3 mb-6 px-5 py-3 rounded-full bg-gradient-to-r ${cat.color} bg-opacity-10 border border-slate-700/50`}>
                  <span className="text-2xl">{cat.emoji}</span>
                  <h3 className="text-xl font-bold text-white">{cat.label}</h3>
                  <span className="text-sm text-slate-400">({catSvcs.length} services)</span>
                  <Link href={`/services?category=${cat.key}`} className="ml-2 text-sm text-purple-300 hover:text-purple-200 font-medium transition">
                    View all →
                  </Link>
                </div>
                
                {/* Top-6 grid for this category */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {top6.map((service: any) => (
                    <div key={service.id} className="glass-card flex flex-col hover:border-purple-500/40 group">
                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-2xl">{service.icon}</span>
                        <div>
                          <h3 className="text-base font-semibold text-white leading-snug group-hover:text-purple-300 transition-colors">{service.title}</h3>
                          <span className="text-xs text-slate-500 uppercase tracking-wider">{service.category}</span>
                        </div>
                      </div>
                      <p className="text-slate-400 text-sm mb-3 line-clamp-2 flex-1">{service.description}</p>
                      <ul className="space-y-1 mb-3">
                        {service.features.slice(0, 2).map((f: string, i: number) => (
                          <li key={i} className="text-slate-300 text-xs flex items-start gap-2">
                            <span className="text-purple-400 mt-0.5 shrink-0">✓</span>
                            <span className="line-clamp-1">{f}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto pt-3 border-t border-slate-700/50 flex justify-between items-center">
                        <span className="text-purple-300 text-sm font-semibold">
                          From {(service.pricing as Record<string, string>)[Object.keys(service.pricing)[0]]}/mo
                        </span>
                        <Link href={`/services/${service.id}`} className="text-sm text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                          Learn more <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Show-more link for oversized categories */}
                {catSvcs.length > 6 && (
                  <div className="text-center mt-4">
                    <Link href={`/services?category=${cat.key}`} className="text-sm text-slate-400 hover:text-purple-300 transition">
                      + {catSvcs.length - 6} more {cat.label.toLowerCase()} →
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Complete Service Showcase (Horizontal Scroll + Quick-View Modal) ── */}
      <section className="py-20">
        <div className="container-page">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="section-heading">📋 Complete Service Showcase</h2>
              <p className="section-subheading mb-0">All {services.length} services — scroll to explore. Click any card for quick details.</p>
            </div>
          </div>

          {/* Category quick-links navigate to filtered services page */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Link href="/services" className="px-4 py-2 rounded-lg text-sm font-medium transition bg-slate-800 text-slate-300 hover:bg-slate-700">All ({services.length})</Link>
            {CATEGORIES.map(c => (
              <Link key={c.key} href={`/services?category=${c.key}`} className="px-4 py-2 rounded-lg text-sm font-medium transition bg-slate-800 text-slate-300 hover:bg-slate-700">
                {c.emoji} {c.key.charAt(0).toUpperCase() + c.key.slice(1)} ({byCategory[c.key].length})
              </Link>
            ))}
          </div>
{/* Horizontal scroll cards */}
          <div className="overflow-x-auto pb-4 -mb-4">
            <div className="flex gap-4" style={{ minWidth: 'max-content', paddingBottom: '8px' }}>
              {filteredShowcase.map((service: any) => {
                const catMeta = CATEGORIES.find(c => c.key === service.category) || CATEGORIES[0];
                return (
                  <Link
                    key={service.id}
                    href={`/services/${service.id}`}
                    onClick={(e) => { e.preventDefault(); setQuickView(service); }}
                    className="min-w-[260px] max-w-[260px] glass-card flex flex-col hover:border-purple-500/40 group border-l-2"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{service.icon}</span>
                      <h3 className="text-sm font-semibold text-white line-clamp-2 leading-snug">{service.title}</h3>
                    </div>
                    <p className="text-slate-500 text-xs mb-3 line-clamp-2 flex-1">{service.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-700/50">
                      <span className="text-purple-300 text-xs font-semibold">
                        From {(service.pricing as Record<string, string>)[Object.keys(service.pricing)[0]]}/mo
                      </span>
                      <span className="text-xs text-slate-500 group-hover:text-purple-400 transition-colors">→</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {filteredShowcase.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <p className="text-xl mb-2">No services match "{search}"</p>
              <p className="text-sm">Clear filter or try different keywords.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Quick-View Modal ── */}
      {quickView && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setQuickView(null)}
          onKeyDown={(e) => { if (e.key === 'Escape') setQuickView(null); }}
          role="dialog"
          aria-modal="true"
          aria-label={`Quick view: ${quickView.title}`}
        >
          <div
            className="bg-slate-900 border border-purple-500/30 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl shadow-purple-900/30"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`p-6 rounded-t-2xl bg-gradient-to-r ${(CATEGORIES.find(c => c.key === quickView.category) || CATEGORIES[0]).color} bg-opacity-10`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{quickView.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{quickView.title}</h3>
                    <span className="text-xs text-purple-300 uppercase tracking-wider">{(CATEGORIES.find(c => c.key === quickView.category) || CATEGORIES[0]).label}</span>
                  </div>
                </div>
                <button
                  onClick={() => setQuickView(null)}
                  className="text-slate-400 hover:text-white text-2xl leading-none p-1"
                  aria-label="Close"
                >✕</button>
              </div>
              <p className="text-slate-300 text-sm mt-3 leading-relaxed">{quickView.description}</p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Features */}
              <div>
                <h4 className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-3">Key Features</h4>
                <ul className="space-y-2">
                  {quickView.features.slice(0, 5).map((f: string, i: number) => (
                    <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                      <span className="text-purple-400 mt-0.5 shrink-0">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              {quickView.benefits?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-3">Benefits</h4>
                  <ul className="space-y-2">
                    {quickView.benefits.slice(0, 4).map((b: string, i: number) => (
                      <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                        <span className="text-green-400 mt-0.5 shrink-0">▸</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pricing */}
              <div>
                <h4 className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-3">Pricing</h4>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(quickView.pricing as Record<string, string>).map(([tier, price]) => (
                    <div key={tier} className="bg-slate-800/60 rounded-xl p-4 text-center border border-slate-700/50">
                      <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{tier}</div>
                      <div className="text-xl font-bold text-white">${price}<span className="text-xs text-slate-400 font-normal">/mo</span></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact + CTA */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-700/50">
                <Link
                  href={`/services/${quickView.id}`}
                  onClick={() => setQuickView(null)}
                  className="btn-primary px-6 py-3 text-sm"
                >
                  View Full Page →
                </Link>
                <a href="/configurator" className="btn-secondary px-6 py-3 text-sm" onClick={() => setQuickView(null)}>
                  ⚙️ Configure This Service
                </a>
                <a href="mailto:kleber@ziontechgroup.com" className="text-sm text-purple-300 hover:text-purple-200 px-4 py-3 self-center">
                  ✉ kleber@ziontechgroup.com
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Category Grid ── */}
      <section className="py-20 bg-slate-900/30">
        <div className="container-page">
          <h2 className="section-heading text-center">Our Service Categories</h2>
          <p className="section-subheading text-center">Six core domains of expertise</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {CATEGORIES.map(cat => (
              <Link key={cat.key} href={`/services?category=${cat.key}`} className="glass-card group hover:border-purple-500/40">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-lg`}>
                    {cat.emoji}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors">{cat.label}</h3>
                    <p className="text-slate-400 text-sm">{byCategory[cat.key].length} services available</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20">
        <div className="container-page">
          <div className="cta-section text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Get a custom-tailored proposal with services matched to your budget and needs.
              Delivered to your inbox as a PDF within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/configurator" className="btn-primary text-lg px-10 py-4">
                ⚙️ Start Configurator →
              </Link>
              <a href="mailto:kleber@ziontechgroup.com" className="btn-secondary text-lg px-10 py-4">
                ✉️ Email Us
              </a>
              <a href="tel:+13024640950" className="btn-secondary text-lg px-10 py-4">
                ☎ +1 302 464 0950
              </a>
            </div>
          </div>
        </div>
      </section>

{/* Contact Info */}
      <section className="py-16 border-t border-slate-800">
        <div className="container-page">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">📞 Call Us</h4>
              <a href="tel:+13024640950" className="text-purple-300 text-lg hover:text-purple-200 transition">+1 302 464 0950</a>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">✉️ Email</h4>
              <a href="mailto:kleber@ziontechgroup.com" className="text-purple-300 text-lg hover:text-purple-200 transition">kleber@ziontechgroup.com</a>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">📍 Visit Us</h4>
              <p className="text-slate-300">364 E Main St STE 1008<br />Middletown, DE 19709</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm">
            <Link href="/faq" className="text-slate-400 hover:text-cyan-400 transition">❓ FAQ</Link>
            <Link href="/industry-solutions" className="text-slate-400 hover:text-cyan-400 transition">🏭 Industry Solutions</Link>
            <Link href="/testimonials" className="text-slate-400 hover:text-cyan-400 transition">⭐ Testimonials</Link>
            <Link href="/services" className="text-slate-400 hover:text-cyan-400 transition">🛠️ All Services</Link>
            <Link href="/configurator" className="text-slate-400 hover:text-cyan-400 transition">⚙️ Configurator</Link>
            <Link href="/proposals" className="text-slate-400 hover:text-cyan-400 transition">📄 Proposals</Link>
          </div>
        </div>
      </section>
    <Footer />
    </main>
  );
}
