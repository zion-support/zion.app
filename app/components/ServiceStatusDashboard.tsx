'use client';

import React, { useState, useEffect, useMemo } from 'react';

interface ServiceNode {
  id: string;
  name: string;
  category: string;
  icon: string;
  status: 'operational' | 'degraded' | 'maintenance' | 'incident';
  uptime: number;
  responseTime: number;
  lastChecked: string;
}

const CATEGORY_GROUPS = [
  { key: 'ai', label: 'AI & Machine Learning', color: 'from-purple-500 to-indigo-500', icon: '🧠' },
  { key: 'it', label: 'IT Infrastructure', color: 'from-blue-500 to-cyan-500', icon: '🖥️' },
  { key: 'cloud', label: 'Cloud Platform', color: 'from-sky-400 to-blue-600', icon: '☁️' },
  { key: 'security', label: 'Security & Compliance', color: 'from-red-500 to-orange-500', icon: '🔐' },
  { key: 'data', label: 'Data & Analytics', color: 'from-green-500 to-emerald-500', icon: '📊' },
  { key: 'automation', label: 'Automation & RPA', color: 'from-pink-500 to-rose-500', icon: '🤖' },
];

function generateMockServices(): ServiceNode[] {
  const now = new Date().toISOString();
  const services: ServiceNode[] = [];
  let counter = 0;

  for (const group of CATEGORY_GROUPS) {
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      counter++;
      const rand = Math.random();
      const status: ServiceNode['status'] =
        rand > 0.92 ? 'maintenance' :
        rand > 0.85 ? 'degraded' :
        rand > 0.97 ? 'incident' : 'operational';

      services.push({
        id: `${group.key}-svc-${counter}`,
        name: `${group.label.split(' ')[0]} Service ${counter}`,
        category: group.key,
        icon: group.icon,
        status,
        uptime: status === 'operational' ? 99.5 + Math.random() * 0.49 : 95 + Math.random() * 4,
        responseTime: status === 'operational' ? 50 + Math.random() * 150 : 200 + Math.random() * 500,
        lastChecked: now,
      });
    }
  }
  return services;
}

const STATUS_CONFIG = {
  operational: { label: 'Operational', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
  degraded: { label: 'Degraded', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', dot: 'bg-amber-400' },
  maintenance: { label: 'Maintenance', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', dot: 'bg-blue-400' },
  incident: { label: 'Incident', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', dot: 'bg-red-400' },
};

export default function ServiceStatusDashboard() {
  const [services, setServices] = useState<ServiceNode[]>([]);
  const [lastUpdate, setLastUpdate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    setServices(generateMockServices());
    setLastUpdate(new Date().toLocaleTimeString());

    if (!isLive) return;
    const interval = setInterval(() => {
      setServices(prev => prev.map(s => ({
        ...s,
        uptime: Math.min(99.99, s.uptime + (Math.random() - 0.4) * 0.01),
        responseTime: Math.max(30, s.responseTime + (Math.random() - 0.5) * 20),
        lastChecked: new Date().toISOString(),
      })));
      setLastUpdate(new Date().toLocaleTimeString());
    }, 5000);
    return () => clearInterval(interval);
  }, [isLive]);

  const stats = useMemo(() => {
    const total = services.length;
    const operational = services.filter(s => s.status === 'operational').length;
    const degraded = services.filter(s => s.status === 'degraded').length;
    const maintenance = services.filter(s => s.status === 'maintenance').length;
    const incidents = services.filter(s => s.status === 'incident').length;
    const avgUptime = total > 0 ? services.reduce((sum, s) => sum + s.uptime, 0) / total : 0;
    const avgResponse = total > 0 ? services.reduce((sum, s) => sum + s.responseTime, 0) / total : 0;
    return { total, operational, degraded, maintenance, incidents, avgUptime, avgResponse };
  }, [services]);

  const filtered = useMemo(() => {
    if (!selectedCategory) return services;
    return services.filter(s => s.category === selectedCategory);
  }, [services, selectedCategory]);

  const overallStatus = stats.incidents > 0 ? 'incident' : stats.degraded > 0 ? 'degraded' : 'operational';
  const overallConfig = STATUS_CONFIG[overallStatus];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-4">
            Live Dashboard
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            📊 Service Health Dashboard
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Real-time operational status of all {stats.total} AI, IT, cloud, security, data, and automation services.
          </p>
        </div>

        {/* Overall Status Banner */}
        <div className={`rounded-2xl border p-6 mb-8 ${overallConfig.bg} ${overallConfig.border}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-4 h-4 rounded-full ${overallConfig.dot} ${overallStatus === 'operational' ? 'animate-pulse' : ''}`} />
              <div>
                <h3 className={`text-xl font-bold ${overallConfig.color}`}>
                  {overallStatus === 'operational' ? 'All Systems Operational' :
                   overallStatus === 'degraded' ? 'Partial Degradation' : 'Active Incident'}
                </h3>
                <p className="text-gray-400 text-sm">
                  Avg uptime: {stats.avgUptime.toFixed(3)}% · Avg response: {Math.round(stats.avgResponse)}ms
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">{stats.operational}</div>
                <div className="text-gray-500">Operational</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">{stats.degraded}</div>
                <div className="text-gray-500">Degraded</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{stats.maintenance}</div>
                <div className="text-gray-500">Maintenance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{stats.incidents}</div>
                <div className="text-gray-500">Incidents</div>
              </div>
              <button
                onClick={() => setIsLive(!isLive)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isLive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-700 text-gray-400 border border-gray-600'
                }`}
              >
                {isLive ? '🟢 Live' : '⏸ Paused'}
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              !selectedCategory ? 'bg-indigo-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            All Categories
          </button>
          {CATEGORY_GROUPS.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                selectedCategory === cat.key ? 'bg-indigo-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
              <span className="text-xs opacity-60">
                ({services.filter(s => s.category === cat.key).length})
              </span>
            </button>
          ))}
        </div>

        {/* Service Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {filtered.map(service => {
            const config = STATUS_CONFIG[service.status];
            return (
              <div
                key={service.id}
                className={`bg-gray-800/50 rounded-xl border p-4 hover:border-gray-600 transition-all ${config.border}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{service.icon}</span>
                    <span className="text-white font-medium text-sm">{service.name}</span>
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full ${config.dot} ${service.status === 'operational' ? 'animate-pulse' : ''}`} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500">Status</span>
                    <div className={`font-medium ${config.color}`}>{config.label}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Uptime</span>
                    <div className="text-gray-300 font-medium">{service.uptime.toFixed(2)}%</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Response</span>
                    <div className="text-gray-300 font-medium">{Math.round(service.responseTime)}ms</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Checked</span>
                    <div className="text-gray-400 font-medium">{new Date(service.lastChecked).toLocaleTimeString()}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-4">Need real-time monitoring for your infrastructure? We build custom dashboards.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="mailto:kleber@ziontechgroup.com" className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-700 text-sm">
              📧 kleber@ziontechgroup.com
            </a>
            <a href="tel:+130****0950" className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-700 text-sm">
              📞 +1 302 464 0950
            </a>
          </div>
          <p className="text-gray-600 text-xs mt-3">364 E Main St STE 1008, Middletown DE 19709</p>
        </div>
      </div>
    </section>
  );
}
