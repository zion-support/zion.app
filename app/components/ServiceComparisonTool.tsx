'use client';

import { useState, useMemo } from 'react';
import { allServices } from '@/app/data/servicesData';
import Link from 'next/link';

const CATEGORY_EMOJI: Record<string, string> = {
  ai: '🧠', it: '🖥️', cloud: '☁️', security: '🔐', data: '📊', automation: '🤖',
};

const CATEGORY_LABEL: Record<string, string> = {
  ai: 'AI Services', it: 'IT Services', cloud: 'Cloud', security: 'Security', data: 'Data & Analytics', automation: 'Automation',
};

export default function ServiceComparisonTool() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showPicker, setShowPicker] = useState(false);

  const filteredServices = useMemo(() => {
    let services = allServices;
    if (categoryFilter !== 'all') {
      services = services.filter(s => s.category === categoryFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      services = services.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }
    return services.slice(0, 50);
  }, [searchQuery, categoryFilter]);

  const selectedServices = useMemo(() => {
    return selectedIds.map(id => allServices.find(s => s.id === id)).filter(Boolean) as typeof allServices;
  }, [selectedIds]);

  const addService = (id: string) => {
    if (selectedIds.length < 3 && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
    }
    if (selectedIds.length >= 2) {
      setShowPicker(false);
    }
  };

  const removeService = (id: string) => {
    setSelectedIds(selectedIds.filter(s => s !== id));
  };

  const clearAll = () => {
    setSelectedIds([]);
    setShowPicker(true);
  };

  // Collect all unique features across selected services
  const allFeatures = useMemo(() => {
    const featureSet = new Set<string>();
    selectedServices.forEach(s => {
      (s.features || []).forEach(f => featureSet.add(f));
    });
    return Array.from(featureSet);
  }, [selectedServices]);

  const categories = ['all', 'ai', 'it', 'cloud', 'security', 'data', 'automation'];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900 border-t border-slate-800">
      <div className="container-page">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 text-sm mb-4">
            <span>⚖️</span> New Tool
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Compare Services Side-by-Side
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Select up to 3 services and compare features, pricing, and benefits.
            Make confident decisions with our interactive comparison tool.
          </p>
        </div>

        {/* Selected Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[0, 1, 2].map(slot => {
            const service = selectedServices[slot];
            return (
              <div
                key={slot}
                className={`rounded-xl border-2 min-h-[200px] transition-all ${
                  service
                    ? 'border-purple-500/50 bg-slate-800/50'
                    : 'border-dashed border-slate-700 bg-slate-900/30 hover:border-purple-500/30'
                }`}
              >
                {service ? (
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs uppercase tracking-wider text-purple-400 font-semibold flex items-center gap-1">
                        {CATEGORY_EMOJI[service.category]} {CATEGORY_LABEL[service.category]}
                      </span>
                      <button
                        onClick={() => removeService(service.id)}
                        className="text-slate-500 hover:text-red-400 text-sm transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
                    <p className="text-sm text-slate-400 line-clamp-3 mb-4">{service.description}</p>
                    <div className="space-y-1">
                      {(service.features || []).slice(0, 4).map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <span className="text-green-400 mt-0.5">✓</span>
                          <span className="line-clamp-1">{f}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Starting at</span>
                        <span className="text-lg font-bold text-green-400">
                          ${service.pricing?.basic || '99'}<span className="text-xs text-slate-500">/mo</span>
                        </span>
                      </div>
                    </div>
                    <Link
                      href={service.href || `/services/${service.id}`}
                      className="mt-3 block text-center text-xs text-purple-400 hover:text-purple-300 font-semibold"
                    >
                      View Full Details →
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowPicker(true)}
                    className="w-full h-full min-h-[200px] flex flex-col items-center justify-center text-slate-500 hover:text-purple-400 transition-colors p-5"
                  >
                    <span className="text-3xl mb-2">+</span>
                    <span className="text-sm">Add Service {slot + 1}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        {selectedServices.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setShowPicker(true)}
              disabled={selectedIds.length >= 3}
              className="px-6 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              + Add Another Service
            </button>
            <button
              onClick={clearAll}
              className="px-6 py-2 bg-slate-800 border border-red-900/50 text-red-400 rounded-lg hover:bg-red-900/20 transition-colors text-sm"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Feature Comparison Table */}
        {selectedServices.length >= 2 && (
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-slate-700">
              <h3 className="text-lg font-bold text-white">📋 Feature Comparison</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left text-xs text-slate-400 font-semibold px-6 py-3 min-w-[200px]">Feature</th>
                    {selectedServices.map(s => (
                      <th key={s.id} className="text-center text-xs text-purple-400 font-semibold px-4 py-3 min-w-[150px]">
                        {s.title.length > 25 ? s.title.slice(0, 25) + '...' : s.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allFeatures.map((feature, i) => (
                    <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                      <td className="text-sm text-slate-300 px-6 py-3">{feature}</td>
                      {selectedServices.map(s => (
                        <td key={s.id} className="text-center px-4 py-3">
                          {(s.features || []).includes(feature) ? (
                            <span className="text-green-400 text-lg">✓</span>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {/* Pricing Row */}
                  <tr className="bg-slate-900/50">
                    <td className="text-sm font-semibold text-white px-6 py-4">💰 Basic Plan</td>
                    {selectedServices.map(s => (
                      <td key={s.id} className="text-center px-4 py-4">
                        <span className="text-green-400 font-bold">${s.pricing?.basic || '99'}</span>
                        <span className="text-xs text-slate-500">/mo</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-slate-900/30">
                    <td className="text-sm font-semibold text-white px-6 py-4">🚀 Pro Plan</td>
                    {selectedServices.map(s => (
                      <td key={s.id} className="text-center px-4 py-4">
                        <span className="text-green-400 font-bold">${s.pricing?.pro || '299'}</span>
                        <span className="text-xs text-slate-500">/mo</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-slate-900/50">
                    <td className="text-sm font-semibold text-white px-6 py-4">🏢 Enterprise</td>
                    {selectedServices.map(s => (
                      <td key={s.id} className="text-center px-4 py-4">
                        <span className="text-purple-400 font-bold text-sm">{s.pricing?.enterprise || 'Custom'}</span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Service Picker Modal */}
        {showPicker && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowPicker(false)}>
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
              {/* Picker Header */}
              <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Select a Service ({selectedIds.length}/3)</h3>
                <button onClick={() => setShowPicker(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
              </div>

              {/* Search & Filter */}
              <div className="px-6 py-4 border-b border-slate-700 space-y-3">
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                />
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        categoryFilter === cat
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {cat === 'all' ? '🌐 All' : `${CATEGORY_EMOJI[cat] || ''} ${CATEGORY_LABEL[cat] || cat}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Service List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
                {filteredServices
                  .filter(s => !selectedIds.includes(s.id))
                  .map(service => (
                    <button
                      key={service.id}
                      onClick={() => addService(service.id)}
                      className="w-full text-left px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-purple-500/50 hover:bg-slate-800 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs">{CATEGORY_EMOJI[service.category]}</span>
                            <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 truncate">
                              {service.title}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1">{service.description}</p>
                        </div>
                        <span className="text-xs text-green-400 font-semibold ml-4 whitespace-nowrap">
                          ${service.pricing?.basic || '99'}/mo
                        </span>
                      </div>
                    </button>
                  ))}
                {filteredServices.filter(s => !selectedIds.includes(s.id)).length === 0 && (
                  <p className="text-center text-slate-500 py-8">No services found. Try a different search.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        {selectedServices.length >= 2 && (
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-4">
              Need help choosing? Our team will create a custom comparison report for you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full hover:opacity-90 transition-all"
              >
                📧 Get Expert Recommendation
              </Link>
              <a
                href="tel:+13024640950"
                className="px-8 py-3 bg-slate-800 border border-slate-700 text-white font-semibold rounded-full hover:bg-slate-700 transition-all"
              >
                ☎ +1 302 464 0950
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
