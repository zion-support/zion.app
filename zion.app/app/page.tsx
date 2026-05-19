// app/page.tsx — Home / Landing Page
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { allServices } from './data/servicesData';
import serviceIndex from '../public/service-index.json';
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
const FEATURED_IDS = [
  'accessibility-compliance',
  'advanced-ai-enterprise-intelligence-hub',
  'ai-accessibility-auditor',
  'ai-accessibility-optimizer',
  'ai-analytics',
  'ai-customer-support',
  'ai-document-intelligence',
  'ai-knowledge-management',
  'ai-lead-generation',
  'ai-office-automation',
  'ai-sales-intelligence',
  'ai-self-healing-infra',
  'api-development',
  'api-gateway-management',
  'ai-deepfake-detection',
  'ai-supply-chain-predictor',
  'ai-chronic-disease-tracker',
  'ai-marine-fisheries-sustainability',
  'ai-self-healing-kubernetes-platform',
  'it-zero-trust-1'
];

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
              <span className="text-green-400">●</span> {serviceCount}+ Services — Live Now
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
                🛠️ Browse All {serviceCount}+ Services
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
      {/* ── Quick Access Platform Grid ── */}
      <section className="py-20 bg-slate-900/40">
        <div className="container-page">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Explore the <span className="gradient-text">Platform</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Jump straight into the tools and services you need — all in one place.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                title: "AI Services",
                desc: "AI-powered tools & intelligent platforms",
                href: "/ai-services",
                iconBg: "bg-purple-500/15",
                icon: "🧠",
                accent: "border-purple-500/30 hover:border-purple-400/60",
              },
              {
                title: "Tools",
                desc: "Diagnostic & configurator utilities",
                href: "/tools",
                iconBg: "bg-blue-500/15",
                icon: "⚙️",
                accent: "border-blue-500/30 hover:border-blue-400/60",
              },
              {
                title: "Pricing",
                desc: "Transparent plans & cost estimates",
                href: "/pricing",
                iconBg: "bg-amber-500/15",
                icon: "💎",
                accent: "border-amber-500/30 hover:border-amber-400/60",
              },
              {
                title: "Contact",
                desc: "Get in touch with our team",
                href: "/contact",
                iconBg: "bg-cyan-500/15",
                icon: "📬",
                accent: "border-cyan-500/30 hover:border-cyan-400/60",
              },
              {
                title: "Client Portal",
                desc: "Billing, projects & support tickets",
                href: "/portal",
                iconBg: "bg-emerald-500/15",
                icon: "🌐",
                accent: "border-emerald-500/30 hover:border-emerald-400/60",
              },
              {
                title: "Industry Solutions",
                desc: "Healthcare, finance, SaaS & more",
                href: "/industry-solutions",
                iconBg: "bg-sky-500/15",
                icon: "🏢",
                accent: "border-sky-500/30 hover:border-sky-400/60",
              },
            ].map((card, i) => (
              <Link
                key={i}
                href={card.href}
                className={`glass-card flex flex-col items-center text-center gap-3 p-6 transition-all duration-300 group border ${card.accent} cursor-pointer`}
              >
                <div className={`${card.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                  {card.icon}
                </div>
                <div>
                  <div className="font-bold text-white text-sm mb-1 group-hover:text-purple-300">{card.title}</div>
                  <div className="text-xs text-slate-500 leading-relaxed">{card.desc}</div>
                </div>
              </Link>
            ))}
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
              { num: '02', title: 'AI-Powered Matching', desc: 'Our AI engine recommends the best-fit services from {serviceCount}+ options.' },
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

      {/* ── Services by Category (all 626 services advertised) ── */}


      {/* ── Service Spotlight ── */}
      <section className="py-16">
        <div className="container-page">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-2xl">✨</span>
            <h2 className="text-2xl font-bold text-white">Today’s Service Spotlight</h2>
            <span className="text-xs text-slate-500 bg-slate-800 rounded-full px-3 py-1">
              Auto-updated · Quality-ranked
            </span>
          </div>
          <SpotlightCard />
        </div>
      </section>
      {/* ── Popular Services ── */}
      <section className="py-16">
        <div className="container-page">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-2xl">🔥</span>
            <h2 className="text-2xl font-bold text-white">Popular Services</h2>
            <span className="text-sm text-slate-400">(30+ top services — hard to miss)</span>
          </div>
          <div className="overflow-x-auto pb-4 -mb-4">
            <div className="flex gap-4" style={{ minWidth:'max-content', paddingBottom:'8px' }}>
              <div key="ai-analytics" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">📊</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">AI Analytics & BI</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">Transform your data into actionable insights with our advanced AI analytics platform.</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-purple-500/12 text-purple-300 border-purple-500/25">AI</span>
                  <Link href="/services/ai-analytics" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="ai-carbon-optimizer" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">🌿</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">AI Carbon Footprint Optimizer</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">Automated Scope 1-3 carbon accounting: ingests utility bills, cloud usage, travel itineraries, suppl</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-purple-500/12 text-purple-300 border-purple-500/25">AI</span>
                  <Link href="/services/ai-carbon-optimizer" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="ai-customer-support" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">💬</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">AI Customer Support</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">24/7 AI-powered customer service with intelligent ticket routing, auto-resolution, and sentiment ana</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-purple-500/12 text-purple-300 border-purple-500/25">AI</span>
                  <Link href="/services/ai-customer-support" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="ai-document-intelligence" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">📄</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">AI Document Intelligence</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">End-to-end intelligent document processing with 99%+ accuracy OCR, classification, field-level data </p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-purple-500/12 text-purple-300 border-purple-500/25">AI</span>
                  <Link href="/services/ai-document-intelligence" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="ai-knowledge-graph-search-deep" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">🔍</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">AI Knowledge Graph Search Engine</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">Deep semantic search across structured + unstructured corporate knowledge: auto-builds a navigable k</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-purple-500/12 text-purple-300 border-purple-500/25">AI</span>
                  <Link href="/services/ai-knowledge-graph-search-deep" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="ai-knowledge-management" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">🧠</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">AI Knowledge Management</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">Centralize organizational knowledge with AI-powered semantic search, auto-tagging, content gap detec</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-purple-500/12 text-purple-300 border-purple-500/25">AI</span>
                  <Link href="/services/ai-knowledge-management" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="ai-lead-generation" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">🎯</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">AI Lead Generation & Enrichment</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">Automatically discover, qualify, and enrich B2B leads with web scraping, firmographic scoring, and i</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-purple-500/12 text-purple-300 border-purple-500/25">AI</span>
                  <Link href="/services/ai-lead-generation" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="ai-sales-intelligence" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">📈</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">AI Sales Intelligence</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">Boost revenue with AI-driven lead scoring, pipeline prediction, deal insights, and automated outreac</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-purple-500/12 text-purple-300 border-purple-500/25">AI</span>
                  <Link href="/services/ai-sales-intelligence" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="ai-contract-lifecycle-intelligence" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">★</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">Contract Lifecycle Intelligence</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">AI contract lifecycle management: extract clauses and dates, auto-flag risk, renewal calendar, bench</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-purple-500/12 text-purple-300 border-purple-500/25">AI</span>
                  <Link href="/services/ai-contract-lifecycle-intelligence" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="ai-fintech-fraud-graph" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">★</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">Fintech Fraud Graph</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">Real-time fraud detection as a knowledge graph: entity resolution across accounts, IP, device, and c</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-purple-500/12 text-purple-300 border-purple-500/25">AI</span>
                  <Link href="/services/ai-fintech-fraud-graph" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="ai-sustainable-supply-chain-radar" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">★</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">Sustainable Supply Chain Radar</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">Supply-chain ESG tracking: carbon-intensity per supplier tier, green-alternative sourcing score, Sco</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-purple-500/12 text-purple-300 border-purple-500/25">AI</span>
                  <Link href="/services/ai-sustainable-supply-chain-radar" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="ai-voice-first-crm" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">📞</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">Voice-First CRM & Sales Assistant</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">Voice-first CRM for field sales and inside sales teams: automatic call transcription, real-time deal</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-purple-500/12 text-purple-300 border-purple-500/25">AI</span>
                  <Link href="/services/ai-voice-first-crm" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="ai-crm-automation-suite" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">🎯</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">AI CRM Automation Suite</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">Full CRM automation platform: AI lead scoring, email sequences, pipeline tracking, deal insights, au</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-purple-500/12 text-purple-300 border-purple-500/25">AI</span>
                  <Link href="/services/ai-crm-automation-suite" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="ai-chronic-disease-tracker" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">🏥</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">AI Chronic Disease Progression Tracker</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">Longitudinal patient analytics: track chronic disease progression across EHR data, lab results, and </p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-purple-500/12 text-purple-300 border-purple-500/25">AI</span>
                  <Link href="/services/ai-chronic-disease-tracker" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="devops-cicd" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">⚙️</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">DevOps & CI/CD Automation</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">End-to-end CI/CD pipelines, container orchestration, GitOps workflows, and site reliability engineer</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-orange-500/12 text-orange-300 border-orange-500/25">AUTOMATION</span>
                  <Link href="/services/devops-cicd" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="automation-integrated-commerce-flows" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">◆</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">Integrated Commerce Flow Orchestrator</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">Commerce workflow automation: cart-to-delivery orchestrator connecting Shopify/BigCommerce/WooCommer</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-orange-500/12 text-orange-300 border-orange-500/25">AUTOMATION</span>
                  <Link href="/services/automation-integrated-commerce-flows" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="automation-document-intelligence-pipeline" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">◆</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">Legal Document Intelligence Pipeline</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">OCR + NLP document-intelligence: pipeline-abstract multi-service orchestration for contracts, invoic</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-orange-500/12 text-orange-300 border-orange-500/25">AUTOMATION</span>
                  <Link href="/services/automation-document-intelligence-pipeline" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="automation-multi-channel-campaign-manager" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">◆</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">Multi-Channel Campaign Manager</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">Orchestrate campaigns across email, SMS, social, push, and ads from one campaign studio: audience-se</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-orange-500/12 text-orange-300 border-orange-500/25">AUTOMATION</span>
                  <Link href="/services/automation-multi-channel-campaign-manager" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="automation-multi-channel-campaign-orchestrator" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">★</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">Multi-Channel Campaign Orchestrator</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">Orchestrate campaigns across email, SMS, WhatsApp, Telegram, and LinkedIn with sequence branching, p</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-orange-500/12 text-orange-300 border-orange-500/25">AUTOMATION</span>
                  <Link href="/services/automation-multi-channel-campaign-orchestrator" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="cloud-migration" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">☁️</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">Cloud Migration & Modernization</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">Seamless migration to AWS, Azure, or GCP with zero downtime, cost optimization, and infrastructure-a</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-500/12   text-blue-300   border-blue-500/25">CLOUD</span>
                  <Link href="/services/cloud-migration" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="cloud-data-lakehouse-platform" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">★</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">Data Lakehouse Platform</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">Unified data lakehouse: ingest CSV, JSON, Parquet, and streams; implement ACID semantics with open-t</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-500/12   text-blue-300   border-blue-500/25">CLOUD</span>
                  <Link href="/services/cloud-data-lakehouse-platform" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="cloud-edge-ai-deployment-platform" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">🌍</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">Edge AI Deployment Platform</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">One-click edge AI model deployment to 50k+ global edge points-of-presence: ONNX/TensorRT/GGUF model </p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-500/12   text-blue-300   border-blue-500/25">CLOUD</span>
                  <Link href="/services/cloud-edge-ai-deployment-platform" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="cloud-event-driven-microservices" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">★</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">Event-Driven Microservices Platform</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">Event backbone as a service: managed Pub-Sub broker, event schema registry, replay from any timestam</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-500/12   text-blue-300   border-blue-500/25">CLOUD</span>
                  <Link href="/services/cloud-event-driven-microservices" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="cloud-hybrid-multicloud-networking" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">◆</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">Hybrid + Multi-Cloud Networking</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">Zero-trust networking across on-prem/edge/cloud: cloud-router fabric connects VPCs across AWS/GCP/Az</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-500/12   text-blue-300   border-blue-500/25">CLOUD</span>
                  <Link href="/services/cloud-hybrid-multicloud-networking" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="data-graph-analytics-platform" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">★</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">Graph Analytics & Network Intelligence</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">Large-scale network analytics: entity relationship graph builder, centrality and community detection</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/12 text-emerald-300 border-emerald-500/25">DATA</span>
                  <Link href="/services/data-graph-analytics-platform" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="data-realtime-trending-aggregator" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">◆</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">Real-time Event & Trending Aggregator</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">Streaming data platform: Flink/Redpanda backbone, windowed aggregation at sub-second latency, trend-</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/12 text-emerald-300 border-emerald-500/25">DATA</span>
                  <Link href="/services/data-realtime-trending-aggregator" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="it-api-gateway-openapi" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">◆</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">API Gateway + OpenAPI Management</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">Enterprise API gateway: OpenAPI 3.1 lifecycle, rate-limit/quota per key, threat-protection WAF rules</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-cyan-500/12   text-cyan-300   border-cyan-500/25">IT</span>
                  <Link href="/services/it-api-gateway-openapi" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="it-api-management-gateway" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">★</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">API Management & Gateway</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">Full API lifecycle management: unified gateway with auth, rate-limit, circuit-breaker, developer por</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-cyan-500/12   text-cyan-300   border-cyan-500/25">IT</span>
                  <Link href="/services/it-api-management-gateway" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="it-backup-disaster-recovery-solution" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">★</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">Backup & Disaster Recovery Solution</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">Immutable backup engine with RPO as low as 5 minutes, RTO of 30 minutes, off-site air-gapped storage</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-cyan-500/12   text-cyan-300   border-cyan-500/25">IT</span>
                  <Link href="/services/it-backup-disaster-recovery-solution" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="it-backup-dr-bc-as-a-service" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">◆</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">Backup / DR/BCaaS</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">Managed backup and disaster recovery: 3-2-1-1-airgap policy, every-30s WORM snapshots, point-in-time</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-cyan-500/12   text-cyan-300   border-cyan-500/25">IT</span>
                  <Link href="/services/it-backup-dr-bc-as-a-service" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="cybersecurity" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">🔒</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">Cybersecurity & Penetration Testing</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">Comprehensive security assessments, vulnerability management, and incident response to protect your </p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-red-500/12    text-red-300    border-red-500/25">SECURITY</span>
                  <Link href="/services/cybersecurity" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="security-privileged-access-management" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">★</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">Privileged Access Management</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">PAM platform: just-in-time privilege elevation, live session recording with playback, FIPS-140-2 cer</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-red-500/12    text-red-300    border-red-500/25">SECURITY</span>
                  <Link href="/services/security-privileged-access-management" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="security-sbom-supply-chain" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">◆</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">SBOM & Supply Chain Security</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">Supply chain security platform: SBOM & VEX generation (every build/build event), CVE SLSA provenance</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-red-500/12    text-red-300    border-red-500/25">SECURITY</span>
                  <Link href="/services/security-sbom-supply-chain" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="security-supply-chain-sbom-manager" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">★</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">Software Bill-of-Materials Manager</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">Full SBOM lifecycle management: auto-generate SPDX and Cyclone-DX per build, license-compliance chec</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-red-500/12    text-red-300    border-red-500/25">SECURITY</span>
                  <Link href="/services/security-supply-chain-sbom-manager" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div key="security-web-application-firewall" className="min-w-[240px] glass-card flex flex-col gap-2 group hover:border-purple-500/40">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">★</span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">Web Application Firewall</h3>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">Managed WAF with OWASP Top-10 rulesets, API-protection for OWASP API Top-10, bot management with hum</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-red-500/12    text-red-300    border-red-500/25">SECURITY</span>
                  <Link href="/services/security-web-application-firewall" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group">
                    Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                  <Link href={`/services/${cat.key}/`} className="ml-2 text-sm text-purple-300 hover:text-purple-200 font-medium transition">
                    View all →
                  </Link>
                </div>
                
                {/* Top-6 service grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {top6.map((service: any) => (
                  <div
                    key={service.id}
                    className="glass-card flex flex-col hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10 group cursor-pointer relative"
                  >
                    {/* Popular badge — only if flagged in data */}
                    {service.popular && (
                    <span className="absolute -top-2 -right-2 z-10 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-orange-500 to-pink-500 text-white px-2.5 py-1 rounded-full shadow-md">
                      🔥 Popular
                    </span>
                    )}
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{service.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-white leading-snug group-hover:text-purple-300 transition-colors line-clamp-2">
                          {service.title}
                        </h3>
                        <span className="text-xs text-slate-500 uppercase tracking-wider">{service.category}</span>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm mb-3 line-clamp-2 flex-1 leading-relaxed">
                      {service.description}
                    </p>
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
                      <Link
                        href={`/services/${service.id}`}
                        className="text-sm text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group/learn"
                      >
                        Learn more <span className="group-hover/learn:translate-x-1 transition-transform">→</span>
                      </Link>
                    </div>
                  </div>
                  ))}
                </div>
                
                {/* Show-more link for oversized categories */}
                {catSvcs.length > 6 && (
                  <div className="text-center mt-4">
                    <Link href={`/services/${cat.key}/`} className="text-sm text-slate-400 hover:text-purple-300 transition">
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
          <p className="section-subheading text-center">
            Six core domains — {services.length}+ services total — click any category to filter
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {CATEGORIES.map(cat => {
              const catCount = byCategory[cat.key]?.length ?? 0;
              return (
              <Link
                key={cat.key}
                href={`/services/${cat.key}/`}
                className="glass-card group hover:border-purple-500/40 hover:scale-[1.015] transition-all duration-300 relative overflow-hidden"
              >
                {/* Gradient border glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${cat.color.replace('from-','').replace('to-','').split(' ')[0]}22, transparent 60%)`,
                  }}
                />
                <div className="relative flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                    {cat.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors leading-tight">
                      {cat.label}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-slate-400 text-sm">{catCount} service{catCount !== 1 ? 's' : ''}</p>
                      <span className="text-slate-600 text-xs">·</span>
                      <span className="text-purple-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                        Browse →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
            })}
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

      {/* ── What's New / Fresh Features ── */}
      <section className="py-20">
        <div className="container-page">
          <h2 className="section-heading text-center">✨ What's New at Zion Tech Group</h2>
          <p className="section-subheading text-center">The latest platform upgrades, services, and capabilities — always evolving</p>

          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              {
                title: '🤖 Autonomous Email Responder',
                desc: 'V15/V16 AI-driven email intelligence — predictive response with auto-reply monitoring. Handles your inbox 24/7 without lifting a finger.',
                tag: 'AI Tools',
                color: 'from-purple-600 to-pink-500',
              },
              {
                title: '⚡ Dynamic Hero Stats',
                desc: 'Homepage numbers now auto-sync from the live service catalog. Add, rename, or retire services and the count updates instantly across the whole site.',
                tag: 'Platform',
                color: 'from-cyan-500 to-blue-600',
              },
              {
                title: '🔍 Smart Fuzzy Search',
                desc: 'Find exactly the right service in milliseconds. Category pill filters + hit counts show results at a glance before you even click.',
                tag: 'Search',
                color: 'from-green-500 to-emerald-500',
              },
              {
                title: '⚙️ AI-Powered Configurator',
                desc: 'Get a custom-tailored proposal as a PDF delivered to your inbox within 24 hours. AI matches your budget + needs to the right services.',
                tag: 'Sales',
                color: 'from-orange-500 to-amber-500',
              },
              {
                title: '🛠️ Full Service Catalog',
                desc: '626+ micro-SaaS, AI, IT, Cloud, Security, Data, and Automation services — all documented with pricing, features, and direct contact.',
                tag: 'Catalog',
                color: 'from-indigo-500 to-violet-500',
              },
              {
                title: '🗺️ Industry Solutions',
                desc: 'Healthcare, Finance, E-Commerce, Manufacturing, SaaS, and more — discover how our services apply directly to your industry.',
                tag: 'Industries',
                color: 'from-sky-500 to-cyan-600',
              },
            ].map((feat, i) => (
              <div key={i} className="glass-card flex flex-col gap-3 hover:border-purple-500/40 group">
                <div className={`h-1 rounded-full bg-gradient-to-r ${feat.color}`} />
                <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">{feat.tag}</span>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">{feat.title}</h3>
                <p className="text-slate-400 text-sm flex-1 leading-relaxed">{feat.desc}</p>
                <div className="mt-auto">
                  <span
                    role="img"
                    aria-hidden
                    className="inline-block transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </div>
              </div>
            ))}
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

function SpotlightCard() {
  // 14-day rotation: one "best" service per day based on quality score
  const rotateIdx = useMemo(() => {
    if (typeof window === 'undefined') return 0;
    const stored = parseInt(localStorage.getItem('spotlightIdx') || '0', 10);
    // advance once per 4-day period
    return stored;
  }, []);

  const [spotlight, setSpotlight] = useState<Service | null>(null);

  useEffect(() => {
    const idx = Math.floor(Date.now() / 86400000 / 4) % 14; // cycle 0–13 every 4 days
    localStorage.setItem('spotlightIdx', String(idx));
    const pool = serviceIndex.services.slice(0, 14); // pre-ranked top-14 by quality
    const pick = pool[idx] || pool[0];
    const full = allServices.find((s: any) => s.id === pick.id) || pick;
    setSpotlight(full as any);
  }, []);

  if (!spotlight) return <p className="text-slate-400">Loading spotlight…</p>;

  const catLabel = (() => {
    switch (spotlight.category) {
      case 'ai': return 'AI Service'; case 'it': return 'IT'; case 'cloud': return 'Cloud';
      case 'security': return 'Security'; case 'data': return 'Data'; case 'automation': return 'Automation';
      default: return spotlight.category;
    }
  })();

  return (
    <div className="glass-card p-8 border-purple-500/30 bg-gradient-to-br from-slate-900/80 via-purple-900/10 to-slate-900/60">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full px-3 py-0.5">
              {catLabel}
            </span>
            <span className="text-xs text-slate-500">
              {Math.floor(spotlight.features?.length || 0)} features · {Object.keys(spotlight.pricing || {}).length} pricing tiers
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{spotlight.title}</h3>
          <p className="text-slate-300 text-sm mb-5 leading-relaxed">{spotlight.description}</p>
          <div className="grid sm:grid-cols-2 gap-2 mb-5">
            {(spotlight.features || []).slice(0, 4).map((f: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-purple-400 mt-0.5">✦</span>
                <span className="line-clamp-1">{f}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-5">
            {Object.entries(spotlight.pricing || {}).map(([tier, price]) => (
              <span key={tier} className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300">
                {tier}: {price as string}
              </span>
            ))}
          </div>
          <div className="flex gap-3">
            <Link href={`/services/${spotlight.id}`} className="btn-primary text-sm px-7 py-3">
              View Details →
            </Link>
            <Link href="/configurator" className="btn-secondary text-sm px-7 py-3">
              Get Proposal
            </Link>
          </div>
        </div>
        <div className="lg:w-72 flex flex-col gap-3 shrink-0">
          <div className="glass-card p-5 text-center border-purple-500/20 bg-purple-900/10">
            <div className="text-3xl font-bold text-white mb-1">#{Math.floor(rotateIdx) + 1}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">Today’s Rank</div>
            <div className="text-xs text-slate-500 mt-2">{14 - (rotateIdx % 14)} days left in rotation</div>
          </div>
          <div className="glass-card p-5">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Why Featured?</div>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>• {(spotlight.features || []).length || 0} features</li>
              <li>• {Object.keys(spotlight.pricing || {}).length} pricing tiers</li>
              <li>• AI quality-ranked</li>
              <li>• Auto-rotates daily</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
