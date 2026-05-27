'use client';

import Link from 'next/link';
import type { SolutionsDropdownProps } from './types';

export function SolutionsDropdown({ open, onClose }: SolutionsDropdownProps) {
  if (!open) return null;

  const industries = [
    { name: 'Healthcare & Life Sciences', emoji: '🏥', desc: 'HIPAA-compliant AI, diagnostics, patient engagement', href: '/industry-solutions/?industry=Healthcare' },
    { name: 'Financial Services & FinTech', emoji: '💳', desc: 'RegTech, fraud detection, trading bots, KYC', href: '/industry-solutions/?industry=Finance' },
    { name: 'Manufacturing & Industrial', emoji: '🏗️', desc: 'Predictive maintenance, supply chain, quality AI', href: '/industry-solutions/?industry=Manufacturing' },
    { name: 'Retail & E-Commerce', emoji: '🛒', desc: 'Recommendation engines, inventory AI, dynamic pricing', href: '/industry-solutions/?industry=E-Commerce' },
    { name: 'Technology & SaaS', emoji: '🏭', desc: 'Dev tools, platform engineering, micro-SaaS', href: '/industry-solutions/?industry=SaaS' },
    { name: 'Logistics & Supply Chain', emoji: '🚚', desc: 'Route optimization, warehouse automation, tracking', href: '/industry-solutions/?industry=General' },
  ];

  return (
    <div className="absolute top-full right-0 mt-2 w-[500px] rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl shadow-purple-500/10 p-4 animate-in fade-in-0 zoom-in-95 backdrop-blur-md">
      <div className="grid grid-cols-2 gap-2">
        {/* Industry cards */}
        {industries.map((ind, i) => (
          <Link
            key={i}
            href={ind.href}
            onClick={onClose}
            className="block px-3 py-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40 hover:border-purple-500/30 hover:bg-slate-800/70 transition-all group"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{ind.emoji}</span>
              <span className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">{ind.name}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 ml-8">{ind.desc}</p>
          </Link>
        ))}
        {/* Category quick-links */}
        <Link
          href="/services/?category=ai"
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-colors"
        >🧠 AI Services</Link>
        <Link
          href="/services/?category=it"
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-colors"
        >🖥️ IT Services</Link>
        <Link
          href="/services/?category=cloud"
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/20 hover:border-sky-500/40 transition-colors"
        >☁️ Cloud Services</Link>
        <Link
          href="/services/?category=security"
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/20 hover:border-orange-500/40 transition-colors"
        >🔐 Security</Link>
      </div>
      <div className="border-t border-slate-800 mt-3 pt-3 flex items-center gap-2">
        <Link
          href="/services/"
          onClick={onClose}
          className="flex-1 text-center px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors border border-purple-500/20"
        >All Services →</Link>
        <Link
          href="/industry-solutions/"
          onClick={onClose}
          className="flex-1 text-center px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors border border-purple-500/20"
        >All Industries →</Link>
      </div>
    </div>
  );
}