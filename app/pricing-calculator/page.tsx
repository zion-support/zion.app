// app/pricing-calculator/page.tsx — Interactive Pricing Estimator
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

const SERVICE_MULTIPLIERS: Record<string, { label: string; factor: number }> = {
  ai:         { label: 'AI / Machine Learning',      factor: 1.8 },
  it:         { label: 'IT Infrastructure',           factor: 1.1 },
  cloud:      { label: 'Cloud Migration / Managed',    factor: 1.2 },
  security:   { label: 'Cybersecurity',               factor: 1.5 },
  data:       { label: 'Data & Analytics',            factor: 1.3 },
  automation: { label: 'Process Automation',          factor: 1.4 },
};

type Tier = 'basic' | 'pro' | 'enterprise';
const MONTHS = ['1', '3', '6', '12', '24'];
const TIERS: Record<Tier, { label: string; baseMult: number }> = {
  basic:     { label: 'Starter',     baseMult: 0.5 },
  pro:       { label: 'Professional',baseMult: 1.0 },
  enterprise:{ label: 'Enterprise',  baseMult: 2.5 },
};

export default function PricingCalculatorPage() {
  const [selected, setSelected] = useState<string[]>(['ai']);
  const [tier, setTier]       = useState<Tier>('pro');
  const [months, setMonths]   = useState('12');
  const [users, setUsers]     = useState('25');
  const [showEstimate, setShowEstimate] = useState(false);

  const estimate = useMemo(() => {
    const base = 2000;
    const serviceMult = selected.reduce((sum, key) => sum + (SERVICE_MULTIPLIERS[key]?.factor || 1), 0);
    const tierMult    = TIERS[tier].baseMult;
    const usersMult   = Math.max(1, parseInt(users || '1') / 10);
    const monthsMult  = Math.max(1, parseFloat(months || '1') * 0.9);
    return Math.round(base * serviceMult * tierMult * usersMult * monthsMult);
  }, [selected, tier, months, users]);

  const estimatedMonthly = useMemo(() => Math.round(estimate / (parseInt(months || '1') * 12)), [estimate, months]);
  const effectiveRate    = useMemo(() => selected.length > 0 ? Math.round(estimate / selected.length) : 0, [estimate, selected]);

  function toggleService(key: string) {
    setSelected(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 py-20">
      <div className="container-page">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-slate-400">
          <Link href="/" className="hover:text-purple-400 transition">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-300">Pricing Calculator</span>
        </nav>

        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Pricing Calculator</h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            Get an instant estimate for your AI, IT, or automation project. Share a few details and we will produce a rough cost range to guide your planning.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Left — service selection */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-white mb-5 flex items-center gap-2">
              <span>⚙️</span> Services
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(SERVICE_MULTIPLIERS).map(([key, { label: lbl }]) => {
                const active = selected.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => toggleService(key)}
                    className={`p-3 rounded-xl border text-sm font-medium transition cursor-pointer
                      ${active
                        ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                        : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                  >
                    {active ? '✓ ' : ''}{lbl}
                  </button>
                );
              })}
            </div>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-5 flex items-center gap-2">
              <span>⏱</span> Timeline
            </h2>
            <div className="flex flex-wrap gap-3">
              {MONTHS.map(m => (
                <button
                  key={m}
                  onClick={() => setMonths(m)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition cursor-pointer
                    ${months === m
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900/50 border border-slate-700 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-300'
                    }`}
                >
                  {m} {m === '1' ? 'month' : 'months'}
                </button>
              ))}
            </div>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-5 flex items-center gap-2">
              <span>👤</span> Team Size
            </h2>
            <input
              type="range"
              min="1" max="200" value={users}
              onChange={e => setUsers(e.target.value)}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <p className="mt-2 text-slate-400 text-sm">
              Current: <span className="text-white font-semibold">{users}</span> active users
            </p>
          </div>

          {/* Right — summary card */}
          <div className="lg:col-span-1">
            <div className="glass-card sticky top-24 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Estimate Summary</h3>

              <div className="flex gap-3 mb-6">
                {(Object.keys(TIERS) as Tier[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setTier(t)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold transition cursor-pointer
                      ${tier === t
                        ? t === 'basic'     ? 'bg-emerald-600 text-white'
                          : t === 'pro'   ? 'bg-purple-600 text-white'
                          : 'bg-alert-600/80 text-white'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                  >
                    {TIERS[t].label}
                  </button>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <SummaryRow label="Services selected"    value={selected.length > 0 ? `${selected.length} service${selected.length > 1 ? 's' : ''}` : '—'} />
                <SummaryRow label="Timeline"             value={`${months} month${months !== '1' ? 's' : ''}`} />
                <SummaryRow label="Team size"            value={`${users} user${users !== '1' ? 's' : ''}`} />
                <SummaryRow label="Selected services"    value={selected.length > 0 ? selected.map(k => SERVICE_MULTIPLIERS[k].label).join(', ') : 'None'} />
              </div>

              <hr className="border-slate-700 my-5" />

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Total ({months} month{months !== '1' ? 's' : ''})</span>
                  <span className="text-white font-semibold">${estimate.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Estimated monthly</span>
                  <span className="text-white font-semibold">${estimatedMonthly.toLocaleString()}/month</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Avg per service</span>
                  <span className="text-emerald-400 font-semibold">{selected.length > 0 ? `$${effectiveRate.toLocaleString()}` : '—'}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setShowEstimate(true)}
                  className="btn-primary w-full text-center"
                  disabled={selected.length === 0}
                >
                  ⚡ Get Custom Proposal
                </button>
                <Link href="/contact" className="btn-secondary w-full text-center block">
                  Talk to Us
                </Link>
              </div>

              <p className="text-slate-500 text-xs mt-4 text-center">
                Estimates are indicative only. A full proposal is tailored to your exact needs.
                Not a formal quote.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <section className="cta-section text-center mt-16">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            This estimate is just the beginning. Contact us to get a formal proposal tailored to your exact requirements.
          </p>
          <Link href="/configurator" className="btn-primary text-lg px-10 py-4">
            ⚙️ Build Your Proposal →
          </Link>
        </section>
      </div>
    </main>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}
