'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface PricingEstimatorProps {
  categories: { key: string; label: string; emoji: string }[];
  categoryCounts: Record<string, number>;
  categoryPricing: Record<string, { min: number; avg: number; max: number }>;
}

export default function PricingEstimator({ categories, categoryCounts, categoryPricing }: PricingEstimatorProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [teamSize, setTeamSize] = useState(10);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const toggleCategory = (key: string) => {
    setSelectedCategories(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const estimate = useMemo(() => {
    if (selectedCategories.length === 0) return { min: 0, avg: 0, max: 0, savings: 0 };

    let min = 0, avg = 0, max = 0;
    for (const cat of selectedCategories) {
      const p = categoryPricing[cat];
      if (!p) continue;
      // Scale by team size (assume per-user pricing for team sizes > 1)
      const scale = cat === 'ai' || cat === 'automation' || cat === 'it' ? Math.ceil(teamSize / 10) : 1;
      min += p.min * scale;
      avg += p.avg * scale;
      max += p.max * scale;
    }

    const annual = billingCycle === 'annual';
    const discount = annual ? 0.2 : 0; // 20% annual discount
    const savings = avg * 12 * discount;
    const multiplier = annual ? 12 : 1;

    return {
      min: min * multiplier * (1 - discount),
      avg: avg * multiplier * (1 - discount),
      max: max * multiplier * (1 - discount),
      savings: annual ? savings : 0,
    };
  }, [selectedCategories, teamSize, billingCycle, categoryPricing]);

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900/50 to-slate-950">
      <div className="container-page">
        <div className="text-center mb-12">
          <h2 className="section-heading">💰 Pricing Estimator</h2>
          <p className="section-subheading">Get an instant estimate — no signup required</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Category Selector */}
          <div className="glass-card p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Select Service Categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {categories.map(cat => {
                const isSelected = selectedCategories.includes(cat.key);
                const count = categoryCounts[cat.key] || 0;
                const pricing = categoryPricing[cat.key];
                return (
                  <button
                    key={cat.key}
                    onClick={() => toggleCategory(cat.key)}
                    className={`relative p-4 rounded-xl border text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-purple-500/60 bg-purple-900/30 shadow-lg shadow-purple-500/10'
                        : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600/60 hover:bg-slate-800/50'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    <span className="text-2xl mb-2 block">{cat.emoji}</span>
                    <div className="text-sm font-medium text-white leading-tight">{cat.label}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{count} services</div>
                    {pricing && (
                      <div className="text-[10px] text-emerald-400 mt-1">From ${pricing.min}/mo</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Team Size & Billing */}
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">👥 Team Size</h3>
              <input
                type="range"
                min={1}
                max={500}
                value={teamSize}
                onChange={e => setTeamSize(Number(e.target.value))}
                className="w-full accent-purple-500 mb-2"
              />
              <div className="flex justify-between text-sm text-slate-400">
                <span>1 user</span>
                <span className="text-white font-bold text-lg">{teamSize} users</span>
                <span>500 users</span>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">📅 Billing Cycle</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`flex-1 py-3 rounded-lg border text-center transition-all ${
                    billingCycle === 'monthly'
                      ? 'border-purple-500/60 bg-purple-900/30 text-white'
                      : 'border-slate-700/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`flex-1 py-3 rounded-lg border text-center transition-all relative ${
                    billingCycle === 'annual'
                      ? 'border-purple-500/60 bg-purple-900/30 text-white'
                      : 'border-slate-700/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  Annual
                  <span className="absolute -top-2 -right-2 text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">-20%</span>
                </button>
              </div>
            </div>
          </div>

          {/* Estimate Result */}
          <div className="glass-card p-8 bg-gradient-to-br from-purple-900/20 to-slate-900/50 border-purple-500/30">
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">Estimated {billingCycle === 'annual' ? 'Annual' : 'Monthly'} Cost</p>
              {selectedCategories.length > 0 ? (
                <>
                  <div className="flex items-baseline justify-center gap-2 mb-4">
                    <span className="text-4xl md:text-5xl font-bold text-white">
                      ${estimate.min.toLocaleString()}
                    </span>
                    <span className="text-slate-400">—</span>
                    <span className="text-4xl md:text-5xl font-bold gradient-text">
                      ${estimate.max.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-6">
                    Average estimate: <span className="text-emerald-400 font-bold text-lg">${estimate.avg.toLocaleString()}/{billingCycle === 'annual' ? 'yr' : 'mo'}</span>
                    {estimate.savings > 0 && (
                      <span className="text-emerald-400 ml-2">(Save ${estimate.savings.toLocaleString()}/yr)</span>
                    )}
                  </p>
                  <Link href="/configurator/" className="btn-primary text-lg px-10 py-4 inline-block">
                    ⚡ Get Exact Quote →
                  </Link>
                  <p className="text-[11px] text-slate-500 mt-4">
                    Final pricing may vary based on specific services, customization, and contract terms.
                    Contact us at <a href="mailto:kleber@ziontechgroup.com" className="text-purple-400 hover:text-purple-300">kleber@ziontechgroup.com</a> or
                    <a href="tel:+130****0950" className="text-purple-400 hover:text-purple-300 ml-1">+1 302 464 0950</a>
                  </p>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-slate-500 mb-2">—</div>
                  <p className="text-slate-400 mb-6">Select categories above to get an instant estimate</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
