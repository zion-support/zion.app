// app/tools/page.tsx — Free Interactive Tools Hub
'use client';

import Link from 'next/link';

const tools = [
  {
    href: '/tools/port-scanner',
    title: 'Port Scanner',
    desc: 'Scan any host for open ports and services. Free network reconnaissance tool.',
    icon: '🔍',
  },
  {
    href: '/tools/ssl-checker',
    title: 'SSL/TLS Checker',
    desc: 'Check SSL certificate grade, expiry, protocol support, and known vulnerabilities via SSL Labs.',
    icon: '🔒',
  },
  {
    href: '/tools/service-comparison',
    title: 'Service Comparison',
    desc: 'Compare features, pricing tiers, and benefits across our catalog of 626+ services side-by-side.',
    icon: '📊',
  },
  {
    href: '/tools/service-recommender',
    title: 'Service Recommender',
    desc: 'Answer a few questions and our AI matches you with the best-fit services from our catalog.',
    icon: '🤖',
  },
];

export default function ToolsPage() {
  return (
    <div className="container-page py-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-5xl mb-4 block">🧰</span>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Free Tools</h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          Interactive utilities — no sign-up required. Try them right now.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="glass-card flex flex-col p-6 hover:border-purple-500/40 group"
          >
            <span className="text-4xl mb-4">{t.icon}</span>
            <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors mb-2">
              {t.title}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed flex-1">{t.desc}</p>
            <span className="text-purple-400 text-sm font-medium mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Try it free <span>→</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
