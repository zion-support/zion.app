// app/pricing-calculator/PricingCalculatorClient.tsx — Interactive pricing estimator
'use client';

import { useState } from 'react';
import Link from 'next/link';

// ── Tiers ────────────────────────────────────────────────────────────────
const TIERS = [
  {
    id: 'starter',
    label: 'Starter',
    description: 'Up to 5 services · Email support · Standard SLA',
    basePrice: 2500,
    serviceLimit: 5,
    multiplier: 1.0,
  },
  {
    id: 'professional',
    label: 'Professional',
    description: 'Up to 20 services · Priority support · 99.9% SLA · Dedicated AM',
    basePrice: 7500,
    serviceLimit: 20,
    featured: true,
    multiplier: 1.0,
  },
  {
    id: 'enterprise',
    label: 'Enterprise',
    description: 'Unlimited services · 24/7 support · 99.99% SLA · Custom integrations',
    basePrice: 0,
    serviceLimit: Infinity,
    multiplier: 1.15,
  },
];

// ── Service categories priced per-unit ───────────────────────────────────
interface Category {
  key: string;
  label: string;
  emoji: string;
  unitPrice: number;     // per-service monthly cost
}

const CATEGORIES: Category[] = [
  { key: 'ai',         label: 'AI & Automation',   emoji: '🤖', unitPrice: 1800 },
  { key: 'it',         label: 'IT Infrastructure',  emoji: '💻', unitPrice: 1200 },
  { key: 'cloud',      label: 'Cloud & DevOps',     emoji: '☁️', unitPrice: 1100 },
  { key: 'security',   label: 'Security & Compliance', emoji: '🔒', unitPrice: 1600 },
  { key: 'data',       label: 'Data & Analytics',   emoji: '📊', unitPrice: 1400 },
  { key: 'automation', label: 'Workflow Automation', emoji: '⚙️', unitPrice: 900 },
];

// ── Support SLA premium ──────────────────────────────────────────────────
const SUPPORT_LEVELS = [
  { id: 'standard', label: 'Standard (included in tier)',   multiplier: 1.0  },
  { id: 'priority', label: 'Priority (+25%)',               multiplier: 1.25 },
  { id: 'dedicated',label: 'Dedicated Account Manager (+50%)', multiplier: 1.5 },
];

export default function PricingCalculatorClient() {
  const [tierId,      setTierId]      = useState<string>('professional');
  const [services,    setServices]    = useState<Record<string, number>>({
    ai: 1, it: 0, cloud: 0, security: 0, data: 0, automation: 0,
  });
  const [support,     setSupport]     = useState<string>('standard');

  const tier       = TIERS.find(t => t.id === tierId)!;
  const supportLvl = SUPPORT_LEVELS.find(s => s.id === support)!;

  // ── Price math ──────────────────────────────────────────────────────
  const totalUnits   = Object.values(services).reduce((a, b) => a + b, 0);
  const overageUnits = Math.max(0, totalUnits - tier.serviceLimit);

  const categorySubtotal = CATEGORIES.reduce(
    (sum, cat) => sum + (services[cat.key] || 0) * cat.unitPrice, 0,
  );

  let tierCost: number;
  if (tier.id === 'enterprise') {
    // Enterprise: custom per-service multiplier
    tierCost = Math.round(categorySubtotal * tier.multiplier / 100) * 100;
    if (tierCost < 7500) tierCost = 7500; // floor at Professional tier
  } else {
    tierCost = tier.basePrice + overageUnits * 750;
  }
  const supportSurcharge = Math.round(tierCost * (supportLvl.multiplier - 1));
  const totalMonthly = tierCost + supportSurcharge;
  const annualTotal  = totalMonthly * 12;

  // ── Update helper ───────────────────────────────────────────────────
  function setCat(key: string, val: number) {
    setServices(prev => ({ ...prev, [key]: Math.max(0, val) }));
  }

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Tier Selector ── */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {TIERS.map(t => (
          <button
            key={t.id}
            onClick={() => setTierId(t.id)}
            className={`px-5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              tierId === t.id
                ? `${t.featured
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'bg-slate-700 border-slate-500 text-white'}`
                : 'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:text-white hover:border-slate-500'
            }`}
          >
            {t.label}
            {t.featured && (
              <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-purple-300">
                Recommended
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Calculator Card ── */}
      <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-slate-900/40 p-6 mb-6">
        <h3 className="text-xl font-bold text-white mb-1">
          {tier.label} — estimated total
        </h3>
        <p className="text-slate-400 text-sm mb-5">{tier.description}</p>

        {/* ── Service sliders ── */}
        <div className="grid gap-4 sm:grid-cols-2 mb-5">
          {CATEGORIES.map(cat => (
            <div
              key={cat.key}
              className="rounded-xl bg-slate-800/50 px-4 py-3 border border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-slate-200">
                  {cat.emoji} {cat.label}
                </span>
                <span className="text-sm font-bold text-purple-400">
                  {services[cat.key]} × ${cat.unitPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={services[cat.key] || 0}
                onChange={e => setCat(cat.key, Number(e.target.value))}
                className="w-full accent-purple-500"
                aria-label={cat.label}
              />
            </div>
          ))}
        </div>

        {/* ── Support SLA ── */}
        <div className="mb-5">
          <label className="block text-sm text-slate-300 mb-2">Support &amp; SLA</label>
          <div className="flex flex-wrap gap-2">
            {SUPPORT_LEVELS.map(s => (
              <button
                key={s.id}
                onClick={() => setSupport(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  support === s.id
                    ? 'bg-purple-600 border border-purple-500 text-white'
                    : 'bg-slate-700/40 border border-slate-600 text-slate-300 hover:border-purple-500/40 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Results ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-slate-800/50 px-4 py-3 border border-slate-700/50">
            <div className="text-slate-400 text-xs mb-0.5">Services selected</div>
            <div className="text-xl font-bold text-white">{totalUnits}</div>
          </div>
          <div className="rounded-xl bg-slate-800/50 px-4 py-3 border border-slate-700/50">
            <div className="text-slate-400 text-xs mb-0.5">Tier base cost</div>
            <div className="text-xl font-bold text-slate-200">
              {tier.id === 'enterprise'
                ? 'Custom'
                : `$${tierCost.toLocaleString()}/mo`}
            </div>
          </div>
          <div className="rounded-xl bg-slate-800/50 px-4 py-3 border border-slate-700/50">
            <div className="text-slate-400 text-xs mb-0.5">Support surcharge</div>
            <div className={`text-xl font-bold ${supportSurcharge > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
              {supportSurcharge > 0 ? `+$${supportSurcharge.toLocaleString()}` : '—'}
            </div>
          </div>
          <div className="rounded-xl bg-purple-500/10 border border-purple-500/30 px-4 py-3">
            <div className="text-purple-300 text-xs mb-0.5">Monthly estimate</div>
            <div className="text-2xl font-bold text-purple-400">
              {tier.id === 'enterprise'
                ? '$7,500+'
                : `$${totalMonthly.toLocaleString()}`}
              <span className="text-xs text-slate-500 block">/ month</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <div className="rounded-xl bg-slate-800/50 px-4 py-3 border border-slate-700/50">
            <div className="text-slate-400 text-xs mb-0.5">Services subtotal</div>
            <div className="text-lg font-bold text-emerald-400">
              ${categorySubtotal.toLocaleString()}
            </div>
          </div>
          <div className="rounded-xl bg-slate-800/50 px-4 py-3 border border-slate-700/50">
            <div className="text-slate-400 text-xs mb-0.5">Annualised (12×)</div>
            <div className="text-lg font-bold text-blue-400">
              ${annualTotal >= 1_000_000
                ? `${(annualTotal / 1_000_000).toFixed(1)}M`
                : `$${annualTotal.toLocaleString()}`}
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 bg-slate-800/30 rounded-lg p-3 border border-slate-700/30 mt-4">
          Estimates are indicative only. Actual pricing depends on scope, integration depth, data
          volume, and onboarding requirements. Service limits reset monthly; overage rates
          apply beyond tier caps. Contact us for a formal, binding quote.
        </p>
      </div>

      {/* ── Overage notice ─────────────────────────────────────────────── */}
      {!tier.featured && overageUnits > 0 && (
        <p className="text-center text-xs text-amber-400/80 mb-4">
          ⚠️ {overageUnits} service{overageUnits > 1 ? 's' : ''} over the {tier.serviceLimit === Infinity ? '∞' : tier.serviceLimit.toString()} included — adding ${(overageUnits * 750).toLocaleString()}/mo in overage fees.
          <Link href="/pricing/" className="underline ml-1">Upgrade tier →</Link>
        </p>
      )}
    </>
  );
}
