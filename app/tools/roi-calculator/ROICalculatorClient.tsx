// app/tools/roi-calculator/ROICalculatorClient.tsx — Client-isolated ROI interactive shell
'use client';

import { useState } from 'react';

const PRESETS = [
  { label: 'Small Team',   value: 5000 },
  { label: 'Mid-Size Org', value: 25000 },
  { label: 'Enterprise',   value: 75000 },
];

const CAT_LIFTS: Record<string, number> = {
  ai: 3.2, automation: 2.5, cloud: 2.0, it: 1.8, security: 1.6, data: 2.1,
};

export default function ROICalculatorClient() {
  const [monthly, setMonthly] = useState(5000);
  const lift = CAT_LIFTS['ai'] ?? 2.0;
  const monthlyReturn = Math.round(monthly * lift);
  const annualGain    = monthlyReturn * 12 - monthly * 12;

  return (
    <>
      {/* ── Preset Buttons ── */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {PRESETS.map(p => (
          <button
            key={p.label}
            onClick={() => setMonthly(p.value)}
            className="px-4 py-2 rounded-full bg-slate-800/60 border border-slate-700/50 text-sm text-slate-300 hover:text-white hover:border-purple-500/30 transition-all"
          >
            {p.label} (${p.value.toLocaleString()}/mo)
          </button>
        ))}
      </div>

      {/* ── Calculator Card ── */}
      <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-slate-900/40 p-6">
        <h3 className="text-xl font-bold text-white mb-1">ROI Calculator</h3>
        <p className="text-slate-400 text-sm mb-5">
          Estimate the business value of <span className="text-purple-300">AI &amp; IT Services</span> for your organisation.
        </p>

        <label htmlFor="invest" className="block text-sm text-slate-300 mb-1.5">
          Monthly investment budget<span className="text-slate-400 ml-1">(ready to invest)</span>
        </label>
        <div className="flex items-center gap-3 mb-5">
          <input
            id="invest"
            type="range"
            min={500}
            max={50000}
            step={500}
            value={monthly}
            onChange={(e) => setMonthly(Number(e.target.value))}
            className="flex-1 accent-purple-500"
            aria-label="Monthly investment"
          />
          <div className="w-28 shrink-0 text-right">
            <span className="text-2xl font-bold text-purple-400">${monthly.toLocaleString()}</span>
            <span className="text-slate-500 text-xs block">/ month</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="rounded-xl bg-slate-800/50 px-4 py-3 border border-slate-700/50">
            <div className="text-slate-400 text-xs mb-0.5">Monthly est. return</div>
            <div className="text-xl font-bold text-emerald-400">${monthlyReturn.toLocaleString()}</div>
          </div>
          <div className="rounded-xl bg-slate-800/50 px-4 py-3 border border-slate-700/50">
            <div className="text-slate-400 text-xs mb-0.5">Payback period</div>
            <div className="text-xl font-bold text-blue-400">6 months</div>
          </div>
          <div className="rounded-xl bg-slate-800/50 px-4 py-3 border border-slate-700/50">
            <div className="text-slate-400 text-xs mb-0.5">Year 1 net gain</div>
            <div className="text-xl font-bold text-purple-400">${annualGain.toLocaleString()}</div>
          </div>
        </div>

        <p className="text-xs text-slate-500 bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
          Estimates based on {lift}x average productivity lift for AI &amp; IT category services.
          Actual results vary by workflow maturity, organisation size, and implementation depth.
        </p>
      </div>
    </>
  );
}
