import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free Tools & Calculators',
  description:
    'Free online tools: ROI Calculator, Port Scanner, SSL Checker, Service Comparison, AI Service Router, and Service Recommender — no sign-up required.',
  alternates: { canonical: '/tools' },
};

const TOOLS = [
  {
    href: '/tools/roi-calculator',
    emoji: '📈',
    title: 'ROI Calculator',
    desc: 'Estimate the return on your AI, cloud, or automation investment. Set your budget, pick a category, get a 3-year projection.',
  },
  {
    href: '/tools/port-scanner',
    emoji: '🔍',
    title: 'Port Scanner',
    desc: 'Scan 21 common ports on any host in seconds. Check which services are exposed without installing anything.',
  },
  {
    href: '/tools/ssl-checker',
    emoji: '🔒',
    title: 'SSL Checker',
    desc: 'Verify SSL certificate expiry, issuer, and chain trust for any domain. Catch expiring certs before your users do.',
  },
  {
    href: '/tools/service-comparison',
    emoji: '⚖️',
    title: 'Service Comparison',
    desc: 'Compare Zion Tech Group AI, IT, cloud, and automation services side by side. Add to shortlist, deep-compare features, pricing, and timelines.',
  },
  {
    href: '/tools/ai-service-router',
    emoji: '🧭',
    title: 'AI Service Router',
    desc: 'Answer a few questions and instantly find the right AI service for your use case — from chatbots to fraud detection.',
  },
  {
    href: '/tools/service-recommender',
    emoji: '🎯',
    title: 'Service Recommender',
    desc: 'Describe your business challenge and get a ranked list of recommended services across all six categories.',
  },
  {
    href: '/tools/health-check',
    emoji: '🏥',
    title: 'Platform Status',
    desc: 'Run a free autonomous health check on Zion Tech Group infrastructure. No API key, no sign-up — just click and see.',
  },
];

export default function ToolsIndexPage() {
  return (
    <div className="relative min-h-screen bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-16 left-[-10rem] h-[30rem] w-[30rem] rounded-full bg-purple-500/15 blur-3xl" />
        <div className="absolute right-[-10rem] top-32 h-[26rem] w-[26rem] rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <header className="mb-16 text-center">
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-purple-400">
            Free Online Tools
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5">
            Tools &amp; Calculators
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {TOOLS.length} free, no-sign-up tools for network diagnostics, SSL checks,
            service comparison, AI recommendations, and ROI planning — built by the
            Zion Tech Group team.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map(({ href, emoji, title, desc }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-7 hover:border-purple-500/40 hover:bg-slate-800/60 transition-all duration-200 flex flex-col"
            >
              <span className="text-3xl mb-3">{emoji}</span>
              <h2 className="text-lg font-semibold text-white group-hover:text-purple-200 transition-colors mb-2">
                {title}
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed flex-grow">{desc}</p>
              <span className="mt-4 text-sm font-medium text-purple-400 group-hover:text-purple-300">
                Open tool →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/contact/"
            className="inline-flex items-center rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-base font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Get Free Consultation →
          </Link>
        </div>
      </div>
    </div>
  );
}
