'use client';

import { useState, useEffect } from 'react';

interface ServiceStats {
  generated_at: string;
  total_services: number;
  unique_service_ids: number;
  by_category: Record<string, number>;
  by_stage: Record<string, number>;
  by_industry: Record<string, number>;
  features_count: number;
  benefits_count: number;
  pricing_count: number;
  avg_rating: number;
  total_ratings: number;
  avg_starter_price: number;
  avg_pro_price: number;
  avg_enterprise_price: number;
  starter_price_range: number[];
  top_tags: Record<string, number>;
}

interface HealthSummary {
  total_urls: number;
  ok: number;
  failed: number;
  ok_percentage: number;
  avg_load_time_ms: number;
  total_load_time_ms: number;
}

interface HealthReport {
  timestamp: string;
  site: string;
  summary: HealthSummary;
  service_stats: ServiceStats;
  failures: Array<{ url: string; status: number; load_time_ms: number; ok: boolean; error?: string }>;
  slow_pages: Array<{ url: string; status: number; load_time_ms: number; ok: boolean }>;
}

const CATEGORY_COLORS: Record<string, string> = {
  ai: '#a78bfa', it: '#38bdf8', cloud: '#7dd3fc', security: '#fb923c',
  data: '#34d399', automation: '#fb7185', 'micro-saas': '#fbbf24',
  devops: '#22d3ee', blockchain: '#fbbf24', iot: '#2dd4bf',
};

const CATEGORY_LABELS: Record<string, string> = {
  ai: '🧠 AI Services', it: '🖥️ IT Services', cloud: '☁️ Cloud Services',
  security: '🔐 Security', data: '📊 Data & Analytics', automation: '🤖 Automation',
  'micro-saas': '🚀 Micro-SaaS', devops: '⚙️ DevOps', blockchain: '⛓️ Blockchain',
  iot: '📡 IoT & Edge',
};

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

export default function HealthDashboard() {
  const [stats, setStats] = useState<ServiceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/serviceStats.json')
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Loading Service Statistics...</p>
        </div>
      </div>
    );
  }

  const cats = Object.entries(stats.by_category).sort((a, b) => b[1] - a[1]);
  const industries = Object.entries(stats.by_industry).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const maxCat = cats.length > 0 ? cats[0][1] : 1;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 via-gray-900 to-blue-900/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🏥</span>
            <h1 className="text-3xl font-bold">Sitemap Health & Service Statistics</h1>
          </div>
          <p className="text-gray-400">Zion Tech Group — Real-time service catalog analytics</p>
          <p className="text-gray-500 text-sm mt-1">Last updated: {stats.generated_at}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <p className="text-gray-400 text-sm">Total Services</p>
            <p className="text-3xl font-bold text-purple-400">{stats.total_services.toLocaleString()}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <p className="text-gray-400 text-sm">Categories</p>
            <p className="text-3xl font-bold text-blue-400">{Object.keys(stats.by_category).length}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <p className="text-gray-400 text-sm">Industries Served</p>
            <p className="text-3xl font-bold text-green-400">{Object.keys(stats.by_industry).length}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <p className="text-gray-400 text-sm">Total Features</p>
            <p className="text-3xl font-bold text-amber-400">{stats.features_count.toLocaleString()}</p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>📊</span> Services by Category
            </h2>
            <div className="space-y-3">
              {cats.map(([cat, count]) => (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{CATEGORY_LABELS[cat] || cat}</span>
                    <span className="text-gray-400 font-mono">{count}</span>
                  </div>
                  <ProgressBar value={count} max={maxCat} color={CATEGORY_COLORS[cat] || '#6b7280'} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>🏭</span> Industries Served
            </h2>
            <div className="space-y-2">
              {industries.map(([ind, count], i) => (
                <div key={ind} className="flex items-center gap-3">
                  <span className="text-gray-500 text-sm font-mono w-6">{i + 1}.</span>
                  <span className="text-gray-300 flex-1">{ind}</span>
                  <span className="text-gray-400 font-mono text-sm">{count}</span>
                  <div className="w-20 bg-gray-800 rounded-full h-2">
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

        {/* Catalog Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
            <p className="text-2xl font-bold text-emerald-400">{stats.pricing_count}</p>
            <p className="text-gray-400 text-sm">Services with Pricing</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
            <p className="text-2xl font-bold text-cyan-400">{stats.features_count}</p>
            <p className="text-gray-400 text-sm">Feature Descriptions</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
            <p className="text-2xl font-bold text-pink-400">{stats.benefits_count}</p>
            <p className="text-gray-400 text-sm">Benefit Descriptions</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
            <p className="text-2xl font-bold text-amber-400">{stats.unique_service_ids}</p>
            <p className="text-gray-400 text-sm">Unique Services</p>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-gray-800 text-center">
          <h3 className="text-xl font-bold mb-2">Ready to get started?</h3>
          <p className="text-gray-400 mb-4">Explore {stats.total_services}+ services or contact our team</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="text-gray-300">📧 kleber@ziontechgroup.com</span>
            <span className="text-gray-300">📞 +1 302 464 0950</span>
            <span className="text-gray-300">📍 364 E Main St, Middletown DE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
