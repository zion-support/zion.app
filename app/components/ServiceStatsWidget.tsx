'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ServiceStats {
  total_services: number;
  by_category: Record<string, number>;
  by_industry: Record<string, number>;
  pricing_count: number;
  features_count: number;
  benefits_count: number;
  avg_rating: number;
  unique_service_ids: number;
}

const CATEGORY_META: Record<string, { label: string; emoji: string; color: string }> = {
  ai: { label: 'AI Services', emoji: '🧠', color: 'from-purple-500 to-indigo-500' },
  it: { label: 'IT Services', emoji: '🖥️', color: 'from-blue-500 to-cyan-500' },
  cloud: { label: 'Cloud Services', emoji: '☁️', color: 'from-sky-400 to-blue-600' },
  security: { label: 'Security', emoji: '🔐', color: 'from-red-500 to-orange-500' },
  data: { label: 'Data & Analytics', emoji: '📊', color: 'from-green-500 to-emerald-500' },
  automation: { label: 'Automation', emoji: '🤖', color: 'from-pink-500 to-rose-500' },
  'micro-saas': { label: 'Micro-SaaS', emoji: '🚀', color: 'from-amber-500 to-orange-500' },
  devops: { label: 'DevOps', emoji: '⚙️', color: 'from-cyan-500 to-blue-500' },
  blockchain: { label: 'Blockchain', emoji: '⛓️', color: 'from-yellow-500 to-amber-600' },
  iot: { label: 'IoT & Edge', emoji: '📡', color: 'from-teal-500 to-green-500' },
};

export default function ServiceStatsWidget() {
  const [stats, setStats] = useState<ServiceStats | null>(null);

  useEffect(() => {
    fetch('/data/serviceStats.json')
      .then(r => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats) return null;

  const cats = Object.entries(stats.by_category).sort((a, b) => b[1] - a[1]);
  const maxCat = cats.length > 0 ? cats[0][1] : 1;
  const industries = Object.entries(stats.by_industry).sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <div className="container-page">
      <div className="text-center mb-10">
        <h2 className="section-heading">📊 Service Catalog Statistics</h2>
        <p className="section-subheading">
          Real-time analytics from {stats.total_services}+ micro-SaaS, AI, IT, Cloud & Security services
        </p>
        <Link href="/health-dashboard/" className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-lg bg-purple-900/30 border border-purple-500/30 text-purple-300 text-sm hover:bg-purple-800/40 transition-all">
          🏥 View Full Health Dashboard →
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { value: stats.total_services, label: 'Total Services', icon: '🚀', color: 'text-purple-400' },
          { value: Object.keys(stats.by_category).length, label: 'Categories', icon: '📂', color: 'text-blue-400' },
          { value: Object.keys(stats.by_industry).length, label: 'Industries', icon: '🏭', color: 'text-green-400' },
          { value: stats.features_count, label: 'Features Listed', icon: '✨', color: 'text-amber-400' },
        ].map((card, i) => (
          <div key={i} className="bg-slate-900/60 rounded-xl p-5 border border-slate-700/50 text-center">
            <div className="text-2xl mb-1">{card.icon}</div>
            <div className={`text-3xl font-bold ${card.color}`}>{card.value}</div>
            <div className="text-sm text-slate-400 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Category Breakdown */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-900/40 rounded-xl p-6 border border-slate-700/40">
          <h3 className="text-lg font-bold mb-4 text-white">Services by Category</h3>
          <div className="space-y-3">
            {cats.slice(0, 8).map(([cat, count]) => {
              const meta = CATEGORY_META[cat] || { label: cat, emoji: '📦', color: 'from-gray-500 to-gray-600' };
              const pct = Math.min(100, (count / maxCat) * 100);
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{meta.emoji} {meta.label}</span>
                    <span className="text-gray-400 font-mono">{count}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${meta.color} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-900/40 rounded-xl p-6 border border-slate-700/40">
          <h3 className="text-lg font-bold mb-4 text-white">Top Industries Served</h3>
          <div className="space-y-2">
            {industries.map(([ind, count], i) => (
              <div key={ind} className="flex items-center gap-3">
                <span className="text-gray-500 text-sm font-mono w-5">{i + 1}.</span>
                <span className="text-gray-300 flex-1 text-sm truncate">{ind}</span>
                <span className="text-gray-400 font-mono text-xs">{count}</span>
                <div className="w-16 bg-slate-800 rounded-full h-1.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    style={{ width: `${Math.min(100, (count / (industries[0]?.[1] || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact bar */}
      <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
        <a href="mailto:kleber@ziontechgroup.com" className="hover:text-purple-300 transition-colors">✉ kleber@ziontechgroup.com</a>
        <a href="tel:+130****0950" className="hover:text-purple-300 transition-colors">☎ +1 302 464 0950</a>
        <span>📍 364 E Main St, Middletown DE 19709</span>
      </div>
    </div>
  );
}
