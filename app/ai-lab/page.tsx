// app/ai-lab/page.tsx — AI Lab: Interactive Playgrounds & Demos
'use client';

import Link from 'next/link';
import { useState } from 'react';

// ─── Tool/Playground card data ─────────────────────────────────────────────

interface ToolCard {
  emoji: string;
  name: string;
  href: string;
  description: string;
  tag: string;
  tagColor: string;
}

const PLAYGROUND_CARDS: ToolCard[] = [
  {
    emoji: '🧩',
    name: 'Solutions Configurator',
    href: '/ai/solutions-configurator',
    description:
      'Tell us where you are, what you want to improve, and which systems you rely on. Get a deterministic, in-browser blueprint of how Zion\'s autonomous platform would be assembled for you.',
    tag: 'Interactive',
    tagColor: 'purple',
  },
  {
    emoji: '🔍',
    name: 'URL Audit Assistant',
    href: '/ai/url-audit-assistant',
    description:
      'Analyze URLs for SEO, content, and technical factors. Get actionable insights on how AI could optimize your web presence — all client-side, no data leaves your browser.',
    tag: 'Tool',
    tagColor: 'pink',
  },
  {
    emoji: '🧪',
    name: 'AI Service Demo Sandbox',
    href: '/ai/demo',
    description:
      'Try Zion\'s AI service matching tool live — no sign-up, no API key. Type a use case and get ranked service recommendations computed instantly in your browser.',
    tag: 'Demo',
    tagColor: 'emerald',
  },
  {
    emoji: '⚡',
    name: 'Platform Health Check',
    href: '/tools/health-check',
    description:
      'Autonomous diagnostic that runs every check without any API key. Tests page render, memory, Next.js runtime, network reachability, and SSL — all client-side.',
    tag: 'Utility',
    tagColor: 'amber',
  },
  {
    emoji: '🛡️',
    name: 'SSL Certificate Checker',
    href: '/tools/ssl-checker',
    description:
      'Verify SSL/TLS certificate validity, issuer, and expiration for any domain. Quick in-browser probe with detailed certificate chain information.',
    tag: 'Utility',
    tagColor: 'sky',
  },
  {
    emoji: '🌐',
    name: 'Port Scanner',
    href: '/tools/port-scanner',
    description:
      'Scan common ports on any hostname to check service availability. Lightweight TCP probe that runs entirely in your browser.',
    tag: 'Tool',
    tagColor: 'indigo',
  },
];

// ─── Demo/Feature highlight cards ─────────────────────────────────────────

interface DemoCard {
  emoji: string;
  title: string;
  description: string;
  features: string[];
}

const DEMO_CARDS: DemoCard[] = [
  {
    emoji: '🤖',
    title: 'Autonomous Agent Workflows',
    description:
      'See how Zion\'s multi-agent orchestration can automate complex business processes — from lead qualification to code review to support escalation.',
    features: [
      'Multi-agent coordination',
      'Deterministic task graphs',
      'Client-side simulation',
    ],
  },
  {
    emoji: '🧠',
    title: 'AI Service Matchmaker',
    description:
      'Describe what you need in plain English and watch the AI matchmaker rank Zion\'s service catalog by relevance — no API keys, no server calls.',
    features: [
      'Natural language matching',
      'Real-time ranking',
      'Full catalog coverage',
    ],
  },
  {
    emoji: '📊',
    title: 'Architecture Blueprint Generator',
    description:
      'Generate a visual architecture proposal from business requirements. The configurator builds a complete technical blueprint with service dependencies.',
    features: [
      'Deterministic assembly',
      'Dependency mapping',
      'Exportable summaries',
    ],
  },
];

// ─── Key AI Pages ─────────────────────────────────────────────────────────

const AI_PAGES = [
  { href: '/ai-services', label: '🧠 AI Services', desc: 'Browse all AI services' },
  { href: '/configurator', label: '⚡ Get a Custom Proposal', desc: 'AI-powered proposal engine' },
  { href: '/services?category=ai', label: '🗂️ AI Service Catalog', desc: 'Filtered by AI category' },
  { href: '/blog', label: '📖 AI Blog', desc: 'Latest AI insights & guides' },
  { href: '/status', label: '📡 System Status', desc: 'Live platform health' },
  { href: '/contact', label: '✉️ Contact Us', desc: 'Get in touch' },
];

// ─── Tag badge helper ─────────────────────────────────────────────────────

const TAG_COLORS: Record<string, string> = {
  purple:  'bg-purple-500/15 text-purple-300 border-purple-500/25',
  pink:    'bg-pink-500/15 text-pink-300 border-pink-500/25',
  emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  amber:   'bg-amber-500/15 text-amber-300 border-amber-500/25',
  sky:     'bg-sky-500/15 text-sky-300 border-sky-500/25',
  indigo:  'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',
};

function TagBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className={`inline-block rounded-full border px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${TAG_COLORS[color] || TAG_COLORS.purple}`}
    >
      {label}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────

export default function AILabPage() {
  const [demoVisible, setDemoVisible] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 py-20">
      <div className="container-page">
        {/* ── Breadcrumb ── */}
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/" className="hover:text-purple-400 transition">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-300">AI Lab</span>
        </nav>

        {/* ── Hero ── */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <span className="text-5xl mb-4 block">🧪</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">AI Lab</span>
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed mb-6">
            Interactive playgrounds, autonomous demos, and architecture planning
            tools — all running in your browser. No API keys, no sign-up, no data
            ever leaves your machine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ai/demo/" className="btn-primary text-lg px-10 py-4">
              🧪 Try the Demo Sandbox
            </Link>
            <Link href="/ai/solutions-configurator/" className="btn-secondary text-lg px-10 py-4">
              ⚡ Launch Configurator
            </Link>
          </div>
        </div>

        {/* ── Stats Strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16">
          {[
            { value: '6', label: 'Interactive Tools & Demos' },
            { value: '100%', label: 'Client-Side (No Server)' },
            { value: '0', label: 'API Keys Required' },
            { value: '24/7', label: 'Available On-Demand' },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-slate-900/60 rounded-xl p-5 border border-slate-700/50 text-center hover:border-purple-500/30 transition-colors"
            >
              <div className="text-3xl font-bold gradient-text">{s.value}</div>
              <div className="text-xs text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Interactive Playground ── */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-2xl">🎮</span>
            <h2 className="text-2xl font-bold text-white">Interactive Playground</h2>
            <span className="text-sm text-slate-400">
              Tools you can use right now
            </span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLAYGROUND_CARDS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="glass-card flex flex-col group hover:border-purple-500/40 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{tool.emoji}</span>
                  <TagBadge label={tool.tag} color={tool.tagColor} />
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition leading-snug mb-2">
                  {tool.name}
                </h3>
                <p className="text-slate-400 text-sm flex-1 leading-relaxed">
                  {tool.description}
                </p>
                <span className="text-purple-400 text-sm mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform font-medium">
                  Launch <span>→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Live Demos ── */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-2xl">🧪</span>
            <h2 className="text-2xl font-bold text-white">Live Demos</h2>
            <span className="text-sm text-slate-400">
              See autonomous AI in action
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {DEMO_CARDS.map((demo, i) => (
              <div
                key={i}
                className="glass-card flex flex-col"
              >
                <span className="text-4xl mb-4 block">{demo.emoji}</span>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {demo.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4 flex-1 leading-relaxed">
                  {demo.description}
                </p>
                <ul className="space-y-1.5 mb-4">
                  {demo.features.map((f, j) => (
                    <li
                      key={j}
                      className="text-slate-300 text-sm flex items-start gap-2"
                    >
                      <span className="text-purple-400 mt-0.5 shrink-0">✦</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {i === 0 && (
                  <button
                    onClick={() => setDemoVisible(!demoVisible)}
                    className="text-purple-400 text-sm font-medium hover:text-purple-300 transition inline-flex items-center gap-1"
                  >
                    {demoVisible ? '▼ Hide simulation' : '▶ Simulate workflow'}
                  </button>
                )}
                {i === 0 && demoVisible && (
                  <div className="mt-4 rounded-lg bg-slate-800/60 border border-slate-700/50 p-4 text-xs font-mono text-slate-300 space-y-2">
                    <p className="text-purple-400 font-semibold text-xs">
                      Agent Orchestration Simulation
                    </p>
                    <p className="text-emerald-400">✓ Lead qualification agent → intent classified</p>
                    <p className="text-emerald-400">✓ Routing agent → assigned to sales workflow</p>
                    <p className="text-amber-400">⏳ Knowledge retrieval agent → fetching context…</p>
                    <p className="text-slate-500">[simulation — real output when connected to live agents]</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Key AI Pages Quick Links ── */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-2xl">🔗</span>
            <h2 className="text-2xl font-bold text-white">Key AI Pages</h2>
            <span className="text-sm text-slate-400">
              Explore more AI resources
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AI_PAGES.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="glass-card flex items-center gap-4 group hover:border-purple-500/40 transition-all duration-300"
              >
                <span className="text-2xl shrink-0">{page.label.split(' ')[0]}</span>
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition">
                    {page.label}
                  </h3>
                  <p className="text-xs text-slate-400">{page.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="text-center glass-card p-10 max-w-3xl mx-auto">
          <span className="text-5xl block mb-4">🚀</span>
          <h2 className="text-2xl font-bold text-white mb-3">
            Ready to Go Beyond the Lab?
          </h2>
          <p className="text-slate-400 mb-6 max-w-xl mx-auto">
            The AI Lab is just a preview. When you're ready to deploy autonomous
            AI agents into your production environment, we build the full stack.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/configurator/" className="btn-primary text-lg px-10 py-4">
              ⚡ Get Your Custom Proposal
            </Link>
            <Link href="/contact/" className="btn-secondary text-lg px-10 py-4">
              ✉️ Contact Sales
            </Link>
          </div>
          <p className="text-slate-500 text-sm mt-4">
            Or call{' '}
            <a href="tel:+13024640950" className="text-purple-400 hover:text-purple-300">
              +1 302 464 0950
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}