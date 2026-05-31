// app/page.tsx — Home / Landing Page
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { allServices } from './data/servicesData';
import AnimatedCounter from '@/components/AnimatedCounter';
import type { Service } from './data/servicesData';
import ServiceBrowser from '@/components/ServiceBrowser';
import ServiceSpotlight from '@/components/ServiceSpotlight';
import ServiceGridWithSearch from '@/components/ServiceGridWithSearch';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactFunnel from '@/components/ContactFunnel';
import ServiceCounter from '@/components/ServiceCounter';
import FloatingActionDock from '@/components/FloatingActionDock';
import ServiceMatchQuiz from '@/components/ServiceMatchQuiz';
import V204V208Showcase from '@/components/V204V208Showcase';
import V251V255Showcase from '@/components/V251V255Showcase';
import V256V260Showcase from '@/components/V256V260Showcase';
import V261V265Showcase from '@/components/V261V265Showcase';
import V266V270Showcase from '@/components/V266V270Showcase';
import V271V275Showcase from '@/components/V271V275Showcase';
import V276V280Showcase from '@/components/V276V280Showcase';
import V281V285Showcase from '@/components/V281V285Showcase';
import V286V290Showcase from '@/components/V286V290Showcase';
import V291V295Showcase from '@/components/V291V295Showcase';
import V296V300Showcase from '@/components/V296V300Showcase';
import V301V305Showcase from '@/components/V301V305Showcase';
import V306V310Showcase from '@/components/V306V310Showcase';
import V311V315Showcase from '@/components/V311V315Showcase';
import V316V320Showcase from '@/components/V316V320Showcase';
import V321V325Showcase from '@/components/V321V325Showcase';
import V326V330Showcase from '@/components/V326V330Showcase';
import V331V335Showcase from '@/components/V331V335Showcase';
import V336V340Showcase from '@/components/V336V340Showcase';
import V341V345Showcase from '@/components/V341V345Showcase';
import V346V350Showcase from '@/components/V346V350Showcase';
import V351V355Showcase from '@/components/V351V355Showcase';
import V356V360Showcase from '@/components/V356V360Showcase';
import V361V365Showcase from '@/components/V361V365Showcase';
import V366V370Showcase from '@/components/V366V370Showcase';
import V371V375Showcase from '@/components/V371V375Showcase';
import V376V380Showcase from '@/components/V376V380Showcase';
import V381V385Showcase from '@/components/V381V385Showcase';
import V386V390Showcase from '@/components/V386V390Showcase';
import V391V395Showcase from '@/components/V391V395Showcase';
import V396V400Showcase from '@/components/V396V400Showcase';
import V401V405Showcase from '@/components/V401V405Showcase';
import V491V495Showcase from '@/components/V491V495Showcase';
import V496V500Showcase from '@/components/V496V500Showcase';
import V501V505Showcase from '@/components/V501V505Showcase';
import V506V510Showcase from '@/components/V506V510Showcase';
import V511V515Showcase from '@/components/V511V515Showcase';
import V516V520Showcase from '@/components/V516V520Showcase';
import V521V525Showcase from '@/components/V521V525Showcase';
import V526V530Showcase from '@/components/V526V530Showcase';
import V531V535Showcase from '@/components/V531V535Showcase';
import V536V540Showcase from '@/components/V536V540Showcase';
import V541V545Showcase from '@/components/V541V545Showcase';
import V546V550Showcase from '@/components/V546V550Showcase';


// Category accent color for showcase cards (maps category key → gradient)
// Category accent color for showcase card styles (static RGBA + hex)
const catAccent: Record<string, string> = {
  ai:        '#a78bfa',
  it:        '#38bdf8',
  cloud:     '#7dd3fc',
  security:  '#fb923c',
  data:      '#34d399',
  automation:'#fb7185',
  'micro-saas': '#fbbf24',
  devops:    '#22d3ee',
  blockchain: '#fbbf24',
  iot:       '#2dd4bf',
  'email-intelligence': '#a78bfa',
};

const getCategoryMeta = (key: string) => CATEGORIES.find(c => c.key === key) || CATEGORIES[0];

// Stat labels
const STAT_SERVICES = 'Services & Solutions';
const STAT_MONITOR  = 'Monitoring & Support';
const STAT_SLA      = 'SLA Uptime Guarantee';

// Featured: pull 2 per category so every category is represented
// Dynamic featured: popular services + first per category (auto-updates with catalog changes)

const CATEGORIES = [
  { key: 'ai',        label: 'AI Services',          emoji: '🧠', color: 'from-purple-500 to-indigo-500' },
  { key: 'it',        label: 'IT Services',            emoji: '🖥️', color: 'from-blue-500 to-cyan-500' },
  { key: 'cloud',     label: 'Cloud Services',          emoji: '☁️', color: 'from-sky-400 to-blue-600' },
  { key: 'security',  label: 'Security Services',       emoji: '🔐', color: 'from-red-500 to-orange-500' },
  { key: 'data',      label: 'Data Analytics',          emoji: '📊', color: 'from-green-500 to-emerald-500' },
  { key: 'automation',label: 'Automation',              emoji: '🤖', color: 'from-pink-500 to-rose-500' },
  { key: 'micro-saas',label: 'Micro-SaaS Products',     emoji: '🚀', color: 'from-amber-500 to-orange-500' },
  { key: 'devops',    label: 'DevOps and Platform',     emoji: '⚙️', color: 'from-cyan-500 to-blue-500' },
  { key: 'blockchain',label: 'Blockchain and Web3',     emoji: '⛓️', color: 'from-yellow-500 to-amber-600' },
  { key: 'iot',       label: 'IoT and Edge',            emoji: '📡', color: 'from-teal-500 to-green-500' },
  { key: 'email-intelligence', label: 'Email Intelligence', emoji: '📧', color: 'from-violet-500 to-purple-600' },
];

// Per-industry service-category mapping (derived from service catalog)
const INDUSTRY_CATS: Record<string,string> = {
  "technology-&-saas": "it",
  "media-&-entertainment": "ai",
  "legal-&-compliance": "ai",
  "energy-&-utilities": "ai",
  "retail-&-e-commerce": "ai",
  "logistics-&-supply-chain": "ai",
  "manufacturing-&-industrial": "ai",
  "financial-services-&-fintech": "ai",
  "education-&-research": "ai",
  "healthcare-&-life-sciences": "ai",
};


// Industries we serve — derived live from service catalog
const INDUSTRIES = [
  { key: "technology-&-saas",          label: "Technology & SaaS",          emoji: "🏭", color: "from-amber-500 to-orange-500", count: 145, sample: "AI Analytics & BI" },
  { key: "media-&-entertainment",      label: "Media & Entertainment",      emoji: "🎬", color: "from-blue-500 to-cyan-500",    count: 95,  sample: "AI Knowledge Management" },
  { key: "legal-&-compliance",         label: "Legal & Compliance",         emoji: "⚖️", color: "from-purple-500 to-pink-500",   count: 77,  sample: "Contract Lifecycle Intelligence" },
  { key: "energy-&-utilities",          label: "Energy & Utilities",          emoji: "⚡", color: "from-green-500 to-emerald-500", count: 69,  sample: "Grid Demand Forecaster" },
  { key: "retail-&-e-commerce",        label: "Retail & E-Commerce",        emoji: "🛒", color: "from-sky-500 to-blue-600",    count: 57,  sample: "Personalised Product Recommendations" },
  { key: "logistics-&-supply-chain",   label: "Logistics & Supply Chain",   emoji: "🚚", color: "from-rose-500 to-red-500",    count: 57,  sample: "Sustainable Supply Chain Radar" },
  { key: "manufacturing-&-industrial", label: "Manufacturing & Industrial", emoji: "🏗️", color: "from-yellow-500 to-amber-500", count: 25,  sample: "Computer Vision Quality Inspection" },
  { key: "financial-services-&-fintech", label: "Financial Services & FinTech", emoji: "💳", color: "from-indigo-500 to-purple-500", count: 23, sample: "Integrated Commerce Flow Orchestrator" },
  { key: "education-&-research",       label: "Education & Research",       emoji: "🎓", color: "from-cyan-500 to-teal-500",   count: 15,  sample: "Reinforcement Learning Optimiser" },
  { key: "healthcare-&-life-sciences", label: "Healthcare & Life Sciences", emoji: "🏥", color: "from-pink-500 to-rose-500",   count: 12,  sample: "AI Drug Discovery & Molecular Design" },
];

export default function HomePage() {
  const services: Service[] = allServices;

  // Stage health counts — deterministic from catalog
  const byStage = useMemo(() => {
    const acc: Record<string,number> = { published:0, beta:0, planned:0 };
    services.forEach((s: any) => { if (s.stage in acc) acc[s.stage]++; });
    return acc;
  }, [services]);

  const serviceCount = allServices.length;
    const [quickView, setQuickView] = useState<Service | null>(null);
    const [releaseNotes, setReleaseNotes] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState<string | null>(null);

  // Dynamic stats — auto-update when catalog changes
  const stats = [
    { value: <AnimatedCounter target={serviceCount} suffix="+" />, label: STAT_SERVICES },
    { value: '10 Categories', label: 'AI · IT · Cloud · Security · Data · Automation · Micro-SaaS · DevOps · Blockchain · IoT' },
    { value: '24/7', label: STAT_MONITOR },
    { value: '99.9%', label: STAT_SLA },
  ];

  // Fetch release-signal dataset on mount
  useEffect(() => {
    const ac = new AbortController();
    const t  = setTimeout(() => ac.abort(), 8_000);
    fetch('/data/release_notes.json', { signal: ac.signal })
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(d  => setReleaseNotes(d.entries || []))
      .catch(() => {/* leave empty — freshFeatures fallback handles it */})
      .finally(() => clearTimeout(t));
  }, []);

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

  // Dynamic popular services — changes automatically when catalog updates
  const popularServices = useMemo(() =>
    services
      .filter((s: any) => s.popular == true)
      .map(s => ({
        ...s,
        _score: (s.features?.length || 0) * 3
              + (s.benefits?.length || 0) * 2
              + (s.description || '').length * 0.3
      }))
      .sort((a: any, b: any) => b._score - a._score)
      .slice(0, 50),
    [services]
  );

  const byCategory = useMemo(() => {
    const map: Record<string, Service[]> = {};
    for (const c of CATEGORIES) map[c.key] = services.filter((s: any) => s.category === c.key);
    return map;
  }, [services]);

  // ── Release-signal news arranger ──────────────────────────────────────
  // Pulls featured services using data/release_notes.json scoring.
  // Falls back to freshFeatures if dataset not loaded or empty.
  const newsItems = useMemo(() => {
    if (!releaseNotes.length) {
      return allServices
        .map(s => ({ ...s, _score: (s.features?.length || 0) * 3 + (s.benefits?.length || 0) * 2 + (s.description || '').length * 0.3 }))
        .sort((a:any,b:any) => b._score - a._score)
        .slice(0, 6);
    }
    const ENTRY_TAG_MAP: Record<string,string> = {
      ai: 'AI & ML', it: 'IT & Infrastructure', cloud: 'Cloud Platform',
      security: 'Security', data: 'Data & Analytics', automation: 'Automation'
    };
    const now   = Date.now();
    const DAY   = 86_400_000;
    const SCORE_RECENCY   = 5;   // +5 per day-newer
    const SCORE_TAG       = 2;   // +2 per matched tag
    const SCORE_FEATURED  = 3;   // +3 if featured
    const SCORE_FEATURES  = 1;   // +1 per feature bullet
    const lookup = new Map(allServices.map(s => [s.id, s]));
    const merged = releaseNotes
      .filter(r => r.featured !== false)
      .map(r => {
        const svc = lookup.get(r.id);
        if (!svc) return null;
        const daysAgo = Math.max(0, Math.round((now - new Date(r.released_at).getTime()) / DAY));
        const tagCount = (r.tags || []).filter(t => ENTRY_TAG_MAP[t]).length;
        return {
          id: r.id, title: r.changelog_summary || r.changelog.slice(0, 80) + '...',
          desc: r.changelog,
          tag: ENTRY_TAG_MAP[(r.tags || [])[0]] || 'New',
          color: CATEGORIES.find(c => c.key === svc.category)?.color || 'from-purple-500 to-indigo-500',
          _score: SCORE_FEATURED * (r.featured ? 1 : 0)
                   + SCORE_TAG       * tagCount
                   + SCORE_FEATURES  * (svc.features?.length || 0)
                   - SCORE_RECENCY   * daysAgo,
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .sort((a, b) => b!._score - a!._score)
      .slice(0, 6);
    if (merged.length) return merged;
    // Fallback: same formula as original freshFeatures
    return allServices
      .map(s => ({ ...s, _score: (s.features?.length || 0) * 3 + (s.benefits?.length || 0) * 2 + (s.description || '').length * 0.3 }))
      .sort((a:any,b:any) => b._score - a._score)
      .slice(0, 6);

  }, [allServices, releaseNotes]);

  return (
    <main className="min-h-screen bg-slate-950">
      {/* ── JSON-LD: Organization + WebSite ── */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Zion Tech Group',
            url: 'https://ziontechgroup.com',
            logo: 'https://ziontechgroup.com/icon.svg',
            description: 'AI services, IT solutions, micro-SaaS products, and strategic consulting for businesses of all sizes.',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '364 E Main St STE 1008',
              addressLocality: 'Middletown',
              addressRegion: 'DE',
              postalCode: '19709',
              addressCountry: 'US'
            },
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+1-302-464-0950',
              contactType: 'sales',
              email: 'kleber@ziontechgroup.com'
            },
            sameAs: [
              'https://www.linkedin.com/company/ziontechgroup'
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Zion Tech Group',
            url: 'https://ziontechgroup.com',
            description: 'AI services, IT solutions, micro-SaaS products, and strategic consulting.',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://ziontechgroup.com/search?q={search_term_string}'
              },
              'query-input': 'required name=search_term_string'
            }
          })
        }}
      />
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(120,50,200,0.18),rgba(20,10,40,0.92))]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(59,130,246,0.12),transparent_60%)]" />
        <div className="relative container-page pt-32 pb-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300 text-sm mb-6">
              <span className="text-green-400">●</span> <ServiceCounter /> Services — Live Now
            </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="gradient-text">AI & IT Services</span><br />
            <span className="text-white">for Your Business</span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            <ServiceCounter /> real-world AI, IT, cloud, security, data, automation, micro-SaaS, DevOps, blockchain, and IoT services — from machine learning to cybersecurity, CRM to 5G networks.
            Get a free, custom proposal in minutes.
          </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/configurator/" className="btn-primary text-lg px-10 py-4">
                ⚡ Get Your Custom Proposal →
              </Link>
              <Link href="/services/" className="btn-secondary text-lg px-10 py-4">
                {`🛠️ Explore All ${serviceCount}+ Services`}
              </Link>
              <a href="tel:+13024640950" className="btn-secondary text-lg px-10 py-4">
                ☎ +1 302 464 0950
              </a>
            </div>

            {/* ── Secondary CTAs — extra discovery links ── */}
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              <Link href="/search/" className="px-4 py-2 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-300 text-sm hover:bg-slate-700/80 hover:text-purple-300 hover:border-purple-500/30 transition-all">
                🔍 Search Services
              </Link>
              <Link href="/testimonials/" className="px-4 py-2 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-300 text-sm hover:bg-slate-700/80 hover:text-purple-300 hover:border-purple-500/30 transition-all">
                ⭐ Client Reviews
              </Link>
              <Link href="/pricing/" className="px-4 py-2 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-300 text-sm hover:bg-slate-700/80 hover:text-purple-300 hover:border-purple-500/30 transition-all">
                💰 Pricing
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-8 text-slate-400 text-sm mb-12">
              {['US-Based Team','SLA Guaranteed','HIPAA Compliant','24/7 Support',`${serviceCount}+ Services`].map(t => (
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

            {/* Trust Badges */}
            <div className="mt-14 flex flex-wrap justify-center gap-4">
              {[
                { icon: '🏆', text: 'Industry Leading' },
                { icon: '🔒', text: 'SOC 2 Compliant' },
                { icon: '⚡', text: '24/7 Support' },
                { icon: '🇺🇸', text: 'US-Based Team' },
                { icon: '🔐', text: 'HIPAA Ready' },
                { icon: '✅', text: '99.9% SLA' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/40 border border-slate-700/40 text-sm text-slate-300">
                  <span className="text-base">{badge.icon}</span>
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>

            {/* ── Contact Bar ── */}
            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm">
              <a href="mailto:kleber@ziontechgroup.com" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-purple-300 hover:border-purple-500/30 transition-all">
                ✉ kleber@ziontechgroup.com
              </a>
              <a href="tel:+130****0950" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-purple-300 hover:border-purple-500/30 transition-all">
                ☎ +1 302 464 0950
              </a>
              <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-400">
                📍 364 E Main St STE 1008, Middletown, DE 19709
              </span>
            </div>

            {/* ── Service Pipeline — live stage counts ── */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {[
                { stage:'published', emoji:'✅', color:'emerald', label:'Published',  sub:'Live production services' },
                { stage:'beta',      emoji:'🧪', color:'purple',   label:'Beta',       sub:'Early access — refined live' },
                { stage:'planned',   emoji:'🚧', color:'amber',    label:'Coming Soon',sub:'In the pipeline — scheduled' },
              ].map((s) => {
                const n = (byStage as Record<string,number>)[s.stage] || 0;
                const colorMap: Record<string,string> = {
                  emerald:'from-emerald-500/20 to-green-500/10 border-emerald-500/30',
                  purple:  'from-purple-500/20 to-indigo-500/10 border-purple-500/30',
                  amber:   'from-amber-500/20 to-yellow-500/10 border-amber-500/30',
                };
                return (
                  <div key={s.stage}
                    className={`block rounded-xl border bg-gradient-to-br ${colorMap[s.color]} px-5 py-4 min-w-[140px]`}
                  >
                    <div className="text-2xl mb-1">{s.emoji}</div>
                    <div className="text-xl font-bold text-white">{n}</div>
                    <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mt-1">{s.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{s.sub}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Service Match Quiz — Interactive AI Tool ── */}
      <ServiceMatchQuiz />

      {/* ── V204-V208 Email Intelligence Showcase ── */}
      <V204V208Showcase />
      <V251V255Showcase />
      <V256V260Showcase />
      <V261V265Showcase />
      <V266V270Showcase />
      <V271V275Showcase />
      <V276V280Showcase />
      <V281V285Showcase />
      <V286V290Showcase />
      <V291V295Showcase />
      <V296V300Showcase />
      <V301V305Showcase />
      <V306V310Showcase />
      <V311V315Showcase />
      <V316V320Showcase />
      <V321V325Showcase />
      <V326V330Showcase />
      <V331V335Showcase />
      <V336V340Showcase />
      <V341V345Showcase />
      <V346V350Showcase />
      <V351V355Showcase />
      <V356V360Showcase />
      <V361V365Showcase />
      <V366V370Showcase />
      <V371V375Showcase />
      <V376V380Showcase />
      <V381V385Showcase />
      <V386V390Showcase />
      <V391V395Showcase />
      <V396V400Showcase />
      <V401V405Showcase />
      <V491V495Showcase />
      <V496V500Showcase />
      <V501V505Showcase />
      <V506V510Showcase />
      <V511V515Showcase />
      <V516V520Showcase />
      <V521V525Showcase />
      <V526V530Showcase />
      <V531V535Showcase />
      <V536V540Showcase />
      <V541V545Showcase />
      <V546V550Showcase />

      {/* ── How It Works ── */}
      <section className="py-20">
        <div className="container-page">
          <h2 className="section-heading text-center">How It Works</h2>
          <p className="section-subheading text-center">From inquiry to implementation in 4 simple steps</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
            {[
              { num: '01', title: 'Tell Us Your Needs', desc: 'Share your business goals, budget, and technical requirements.' },
              { num: '02', title: 'AI-Powered Matching', desc: `Our AI engine recommends the best-fit services from ${serviceCount}+ options.` },
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

      {/* ── Services by Category ── */}
      <section className="py-16">
        <div className="container-page">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-2xl">🗂️</span>
            <h2 className="text-2xl font-bold text-white">Browse by Category</h2>
            <span className="text-sm text-slate-400">All {services.length}+ services — pick a domain below</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {CATEGORIES.map(cat => {
              const n = byCategory[cat.key]?.length ?? 0;
              return (
              <Link key={cat.key} href={`/services/?category=${cat.key}`}
                className="glass-card group hover:border-purple-500/40 hover:scale-[1.015] transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `linear-gradient(135deg, ${cat.color.replace('from-','').replace('to-','').split(' ')[0]}22, transparent 60%)` }}/>
                <div className="relative flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-lg
                    group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                    {cat.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors leading-tight">
                      {cat.label}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-slate-400 text-sm">{n} service{n !== 1 ? 's' : ''}</p>
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

        {/* ── Popular Services ── */}

      <section className="py-16">
        <div className="container-page">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-2xl">🔥</span>
            <h2 className="text-2xl font-bold text-white">Popular Services</h2>
            <span className="text-sm text-slate-400">({popularServices.length} services chosen by our clients — data-driven)</span>
          </div>
          <div className="overflow-x-auto pb-4 -mb-4">
            <div className="flex gap-4" style={{ minWidth:'max-content', paddingBottom:'8px' }}>
              {popularServices.map((service: any) => {
                const catMeta = CATEGORIES.find(c => c.key === service.category) || CATEGORIES[0];
                return (
                  <Link
                    key={service.id}
                    href={`/services/${service.id}`}
                    className="min-w-[240px] max-w-[240px] glass-card flex flex-col hover:border-purple-500/40 group"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-2xl shrink-0">{service.icon}</span>
                      <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">{service.title}</h3>
                    </div>
                    <p className="text-slate-400 text-xs line-clamp-2 flex-1">{service.description}</p>
                    <div className="mt-auto pt-3 border-t border-slate-700/50 flex justify-between items-center">
                      <span className="text-[10px] font-semibold uppercase tracking-wider bg-orange-500/12 text-orange-300 border-orange-500/25">★ Popular</span>
                      <span className="text-purple-300 text-xs font-semibold">
                        From {(service.pricing as Record<string, string>)[Object.keys(service.pricing)[0]]}/mo
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Deep-Link Strip — every category with count + gradient bar ── */}
      <section className="py-12">
        <div className="container-page">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-2xl">🔗</span>
            <h2 className="text-xl font-bold text-white">Quick Links by Category</h2>
            <span className="text-sm text-slate-400">{services.length}+ services across 6 domains</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map(cat => {
              const catServices = services.filter((s: any) => s.category === cat.key);
              const n = catServices.length;
              const catCounts: number[] = CATEGORIES.map(c => services.filter((s: any) => s.category === c.key).length);
              const maxN = Math.max(...(catCounts.length > 0 ? catCounts : [1]));
              const pct = maxN > 0 ? (n / maxN) * 100 : 0;
              return (
                <Link
                  key={cat.key}
                  href={`/services/?category=${cat.key}`}
                  className="block group"
                >
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden mb-3">
                    <div
                      className="h-full rounded-full transition-all duration-500 group-hover:opacity-80"
                      style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${cat.color.replace(/from-|to-/g,'').split(' ')[0]}, ${cat.color.split(' ').pop()})` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{cat.emoji}</span>
                    <span className="text-2xl font-bold text-white tabular-nums">{n}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 group-hover:text-purple-300 transition-colors">{cat.label}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Full Service Catalog by Category ── */}
      <section className="py-20">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="section-heading">📚 Full Service Catalog</h2>
            <p className="section-subheading">
              Browse all {services.length}&#43; services across {CATEGORIES.length} categories — clean, organized, fast
            </p>
          </div>
          {CATEGORIES.map(cat => {
            const catServices = (byCategory[cat.key] || []).slice(0, 30);
            if (catServices.length === 0) return null;
            return (
              <div key={cat.key} className="mb-16 last:mb-0">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">{cat.emoji}</span>
                  <h3 className="text-xl font-bold text-white">{cat.label}</h3>
                  <span className="text-sm text-slate-400">
                    ({catServices.length} of {(byCategory[cat.key] || []).length})
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {catServices.map((service: any) => {
                    const benefit = (service.benefits && service.benefits.length > 0)
                      ? service.benefits[0] : '';
                    return (
                      <Link
                        key={service.id}
                        href={`/services/${service.id}`}
                        className="glass-card flex flex-col gap-2 p-4 hover:border-purple-500/40 group transition-all"
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-xl group-hover:scale-110 transition-transform">{service.icon}</span>
                          <h4 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">
                            {service.title}
                          </h4>
                        </div>
                        {benefit && (
                          <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">{benefit}</p>
                        )}
                        <div className="mt-auto pt-2 border-t border-slate-700/40 flex justify-end">
                          <span className="text-purple-300 text-[10px] font-semibold">View details →</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                {(byCategory[cat.key] || []).length > 30 && (
                  <p className="text-slate-500 text-xs mt-2 text-center">
                    Showing 30 of {(byCategory[cat.key] || []).length} {cat.label.toLowerCase()} services
                    {' '}<Link href={`/services/?category=${cat.key}`} className="text-purple-400 hover:text-purple-300 underline">view all →</Link>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── From the Blog ── */}
      <section className="py-20 bg-slate-900/20 border-t border-slate-800/60">
        <div className="container-page">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-heading text-center">📝 From the Blog</h2>
              <p className="section-subheading text-center">AI automation strategies, industry insights &amp; platform updates</p>
            </div>
            <Link href="/blog/" className="hidden sm:inline-flex px-5 py-2.5 rounded-xl text-sm font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/25 hover:bg-purple-500/25 transition-all">Read all articles →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: '5 Proven AI Automation Strategies for Enterprise Workflow Optimization',
                date: '2026-04-28',
                excerpt: 'Discover five battle-tested AI automation patterns that cut operational overhead and accelerate enterprise workflow throughput — with real-world implementation examples.',
                slug: '/blog/5-proven-ai-automation-strategies-for-enterprise-workflow-optimization/',
                emoji: '🤖',
              },
              {
                title: 'AI Agent Frameworks for Business Automation',
                date: '2026-04-21',
                excerpt: 'A deep dive into AI agent architectures: LLM orchestration, tool use, memory, and multi-agent coordination — what actually works in production.',
                slug: '/blog/ai-agent-frameworks-for-business-automation/',
                emoji: '🧠',
              },
              {
                title: 'AI FinOps: Cloud Cost Optimization with Machine Learning',
                date: '2026-04-14',
                excerpt: 'Machine learning approaches to FinOps: workload-aware rightsizing, anomaly detection for runaway cloud bills, and predictive capacity planning.',
                slug: '/blog/ai-finops-and-cloud-cost-optimization-with-machine-learning/',
                emoji: '💡',
              },
            ].map((post: any) => (
              <Link key={post.slug} href={post.slug} className="glass-card flex flex-col gap-3 p-6 hover:border-purple-500/40 group">
                <span className="text-3xl">{post.emoji}</span>
                <div>
                  <h3 className="text-base font-semibold text-white leading-snug group-hover:text-purple-300 transition-colors line-clamp-2">{post.title}</h3>
                  <span className="text-xs text-slate-500 mt-1 block">{post.date}</span>
                </div>
                <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">{post.excerpt}</p>
                <div className="mt-auto pt-3 border-t border-slate-700/40 flex justify-end">
                  <span className="text-purple-300 text-xs font-semibold">Read more →</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link href="/blog/" className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/25 hover:bg-purple-500/25 transition-all inline-block">Read all articles →</Link>
          </div>
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
                <Link href="/configurator/" className="btn-secondary px-6 py-3 text-sm" onClick={() => setQuickView(null)}>
                  ⚙️ Configure This Service
                </Link>
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
                href={`/services/?category=${cat.key}`}
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
              <Link href="/configurator/" className="btn-primary text-lg px-10 py-4">
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

      {/* ── Category Deep-Link Strip — all 6 categories, live counts ───────── */}
      <section className="py-12 bg-slate-900/20 border-y border-slate-800/60">
        <div className="container-page">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-white">Browse by Category</h2>
            <p className="text-slate-400 text-sm mt-1">
              {`${serviceCount}+ services across 6 core capability areas`}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => {
              const count = services.filter((s: any) => s.category === cat.key).length;
              return (
                <Link
                  key={cat.key}
                  href={`/services/?category=${cat.key}`}
                  className="group relative flex flex-col items-center gap-2 p-5 rounded-2xl border border-slate-700/60 bg-slate-800/40 hover:border-purple-500/50 hover:bg-slate-800/70 transition-all"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">{cat.emoji}</span>
                  <span className="text-sm font-semibold text-slate-200 group-hover:text-white text-center leading-snug">
                    {cat.label}
                  </span>
                  <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                    {count} services
                  </span>
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-[0.06] transition-opacity pointer-events-none`} />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── What's New / Fresh Features ── */}
      <section className="py-20">
        <div className="container-page">
          <h2 className="section-heading text-center">✨ What's New at Zion Tech Group</h2>
          <p className="section-subheading text-center">The latest platform upgrades, services, and capabilities — always evolving</p>

          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {newsItems.map((feat, i) => (
              <div key={i} className="glass-card flex flex-col gap-3 hover:border-purple-500/40 group">
                <div className={`h-1 rounded-full bg-gradient-to-r ${feat.color || 'from-purple-500 to-indigo-500'}`} />
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

      {/* ── Service Search — find any of {serviceCount}+ services ── */}
      <ServiceGridWithSearch />

      {/* ── Spotlight Carousel ── */}
      <section className="py-16">
        <div className="container-page">
          <ServiceSpotlight services={popularServices} />
        </div>
      </section>
      {/* ── Trust Badges — Persuasion Proof Matrix ── */}
      <section className="py-16 border-t border-slate-800">
        <div className="container-page">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            Why Choose Zion Tech Group
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { emoji: '🏆', label: 'Service Catalog', sub: 'AI & IT catalog', color: 'from-amber-500/20 to-yellow-500/10' },
              { emoji: '🚀', label: 'Latest Tech', sub: 'Modern stacks', color: 'from-purple-500/20 to-blue-500/10' },
              { emoji: '🌐', label: 'Cross-Industry', sub: '9 sectors served', color: 'from-purple-500/20 to-blue-500/10' },
              { emoji: '💡', label: 'Plug & Play', sub: 'No AI team needed', color: 'from-purple-500/20 to-blue-500/10' },
            ].map((badge, i) => (
              <div key={i} className={`bg-gradient-to-br ${badge.color} border border-slate-700/50 rounded-xl p-6 text-center group hover:border-purple-500/30 transition-all`}>
                <div className="text-4xl mb-4">{badge.emoji}</div>
                <div className="text-xl font-bold text-white mb-1">{badge.label}</div>
                <div className="text-sm text-slate-400">{badge.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials — client social proof ── */}
      <TestimonialsSection />

      <ContactFunnel />

      {/* Quick Links */}
      <section className="py-8 border-t border-slate-800">
        <div className="container-page">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <Link href="/faq/" className="hover:text-purple-400 transition">❓ FAQ</Link>
            <Link href="/industry-solutions/" className="hover:text-purple-400 transition">🏭 Industry Solutions</Link>
            <Link href="/services/" className="hover:text-purple-400 transition">🛠️ All Services</Link>
            <Link href="/configurator/" className="hover:text-purple-400 transition">⚙️ Configurator</Link>
            <Link href="/proposals/" className="hover:text-purple-400 transition">📄 Proposals</Link>
            <Link href="/partners/" className="hover:text-purple-400 transition">🤝 Partners</Link>
            <Link href="/status/" className="hover:text-green-400 transition">● System Status</Link>
          </div>
        </div>
      </section>

      {/* ── Free Tools & Interactive Utilities — {serviceCount}+-service catalog ── */}
      <section className="py-16 border-t border-slate-800">
        <div className="container-page">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">🛠️ Free Tools & Interactive Utilities</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Explore our service catalog, calculate ROI, compare solutions, and route your needs — directly from
              our <strong className="text-white">{services.length}+</strong> services across <strong className="text-white">{CATEGORIES.length}</strong> categories.
            </p>
          </div>
          <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                name: 'AI Service Router',
                path: '/tools/ai-service-router/',
                emoji: '🧭',
                gradient: 'from-purple-500 to-indigo-500',
                desc: 'Type your need in plain language — AI matches you to the top services in real time. Zero server calls.',
                tag: 'New',
                features: ['627 services scored live', 'Keyword + synonym expansion', 'Top-12 ranked results'],
              },
              {
                name: 'ROI Calculator',
                path: '/tools/roi-calculator/',
                emoji: '📈',
                gradient: 'from-purple-500 to-pink-500',
                desc: 'Estimate return on investment across AI, Automation, Cloud, Data, IT, or Security with category-specific lift multipliers.',
                tag: '',
                features: ['Small / Mid / Enterprise', '6-category lift model', 'Instant annual projection'],
              },
              {
                name: 'Service Comparison',
                path: '/tools/service-comparison/',
                emoji: '⚖️',
                gradient: 'from-purple-500 to-blue-600',
                desc: 'Pick up to 3 services side-by-side on Overview, Features, Pricing, Benefits, and Timeline with full detail expansion.',
                tag: '',
                features: ['Up to 3-way compare', '5-tab deep breakdown', 'Full catalog browse'],
              },
              {
                name: 'Service Recommender',
                path: '/tools/service-recommender/',
                emoji: '🎯',
                gradient: 'from-amber-500 to-orange-500',
                desc: 'Answer 4 quick qualification questions and get a personalised ranked shortlist of services matched to your industry and use case.',
                tag: '',
                features: ['4-question qualifier', 'Industry-aware ranking', 'Direct service links'],
              },
              {
                name: 'Port Scanner',
                path: '/tools/port-scanner/',
                emoji: '🔍',
                gradient: 'from-red-500 to-orange-500',
                desc: 'Free online port scanner — enter a hostname or IP and instantly see which ports are open, filtered, or closed.',
                tag: 'Free tool',
                features: ['TCP + UDP scan', 'Public API powered', 'Instant results'],
              },
              {
                name: 'SSL Certificate Checker',
                path: '/tools/ssl-checker/',
                emoji: '🔒',
                gradient: 'from-purple-500 to-green-500',
                desc: 'Check TLS certificate validity, issuer, expiry date, and chain depth for any domain — free, no account needed.',
                tag: 'Free tool',
                features: ['Expiry & issuer info', 'Chain depth check', 'Domain look-up'],
              },
            ].map(tool => (
              <Link
                key={tool.name}
                href={tool.path}
                className="group block rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 hover:border-purple-500/30 p-5 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{tool.emoji}</span>
                  <div className="flex gap-1">
                    {tool.tag && (
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-purple-300 bg-purple-400/10 border border-purple-500/30 px-2 py-0.5 rounded-full">
                        {tool.tag}
                      </span>
                    )}
                    <span className="text-xs text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded-full">Free →</span>
                  </div>
                </div>
                <h3 className="text-base font-semibold text-white group-hover:text-purple-300 transition-colors">{tool.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-3">{tool.desc}</p>
                {tool.features.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {tool.features.map(f => (
                      <span key={f} className="text-[10px] text-slate-400 bg-slate-800/60 border border-slate-700/60 px-1.5 py-0.5 rounded">{f}</span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/tools/ai-service-router/" className="btn-primary text-base px-8 py-3">🚀 Find Your Perfect Service</Link>
            <p className="text-slate-500 text-xs mt-3">All tools are 100% free — no sign-up required. Your data never leaves your browser.</p>
          </div>
        </div>
      </section>
      {/* ── Industries We Serve — 10 verticals from service catalog ── */}
      <section className="py-16 border-t border-slate-800">
        <div className="container-page">
          <h2 className="text-2xl font-bold text-white text-center mb-3">Industries We Serve</h2>
          <p className="text-slate-400 text-center mb-10">
            Our AI & IT services cover <strong className="text-white font-semibold text-lg">{services.length}+</strong> solutions across <strong className="text-white">{INDUSTRIES.length}</strong> industries — from Healthcare to Retail.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {INDUSTRIES.map(ind => {
              const catKey = INDUSTRY_CATS[ind.key] || ind.key.split('-')[0];
              return (
                <Link key={ind.key}
                  href={`/services/?category=${catKey}`}
                  className="group block rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 hover:border-purple-500/30 p-5 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{ind.emoji}</span>
                    <span className="text-xs text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded-full">{ind.count}+</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors mb-1 leading-snug">{ind.label}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{ind.sample}</p>
                  <div className="mt-3 h-1 rounded-full overflow-hidden bg-slate-800">
                    <div className="h-full rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                      style={{ width: '100%', background: `linear-gradient(90deg, ${ind.color})` }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    <FloatingActionDock />
    </main>
  );
}

