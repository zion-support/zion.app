'use client';

import { useState } from 'react';

// Simple ROI Calculator — estimates cost recovery vs internal build
export default function ROICalculator({ serviceTitle, category }: { serviceTitle: string; category: string }) {
  const [monthlyInvest, setMonthlyInvest] = useState(5000);

  const annualInvest = monthlyInvest * 12;
  const perceivedLift = category === 'ai' ? 3.2 : category === 'automation' ? 2.5 : category === 'cloud' ? 2.0 : 1.5;
  const monthlyReturn = Math.round(monthlyInvest * perceivedLift);
  const paybackMonths = 6;
  const annualGain = Math.round(monthlyReturn * 12 - annualInvest);

  return (
    <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-slate-900/40 p-6">
      <h3 className="text-xl font-bold text-white mb-1">ROI Calculator</h3>
      <p className="text-slate-400 text-sm mb-5">
        Estimate the business value of <span className="text-purple-300">{serviceTitle}</span> for your organization.
      </p>

      <label className="block text-sm text-slate-300 mb-1.5">
        Monthly investment budget
        <span className="text-slate-400 ml-1">(ready to invest)</span>
      </label>
      <div className="flex items-center gap-3 mb-5">
        <input
          id="invest"
          type="range"
          min={500}
          max={50000}
          step={500}
          value={monthlyInvest}
          onChange={(e) => setMonthlyInvest(Number(e.target.value))}
          className="flex-1 accent-purple-500"
          aria-label="Monthly investment"
        />
        <div className="w-28 shrink-0">
          <span className="text-2xl font-bold text-purple-400">
            ${monthlyInvest.toLocaleString()}
          </span>
          <span className="text-slate-500 text-xs block">/ month</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="rounded-xl bg-slate-800/50 px-4 py-3 border border-slate-700/50">
          <div className="text-slate-400 text-xs mb-0.5">Monthlyest. return</div>
          <div className="text-xl font-bold text-emerald-400">
            ${monthlyReturn.toLocaleString()}
          </div>
        </div>
        <div className="rounded-xl bg-slate-800/50 px-4 py-3 border border-slate-700/50">
          <div className="text-slate-400 text-xs mb-0.5">Payback period</div>
          <div className="text-xl font-bold text-blue-400">{paybackMonths} months</div>
        </div>
        <div className="rounded-xl bg-slate-800/50 px-4 py-3 border border-slate-700/50">
          <div className="text-slate-400 text-xs mb-0.5">Year 1 net gain</div>
          <div className="text-xl font-bold text-purple-400">
            ${annualGain.toLocaleString()}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500 bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
        Estimates based on {perceivedLift}x average productivity lift for <span className="text-slate-300">{category}</span> category services.
        Actual results vary by workflow maturity, organisation size, and implementation depth.
      </p>

      <section aria-label="Why {serviceTitle}" className="mt-4">
        <h4 className="text-white text-sm font-semibold mb-2">Why {serviceTitle}?</h4>
        <ul className="space-y-1.5">
          <li className="flex items-start gap-2 text-sm text-slate-300">
            <span className="text-purple-400 mt-0.5" aria-hidden="true">✓</span>
            <span>Pre-built by experts — no multi-month build cycle</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-slate-300">
            <span className="text-purple-400 mt-0.5" aria-hidden="true">✓</span>
            <span>Fully managed 24/7 — zero DevSecOps burden</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-slate-300">
            <span className="text-purple-400 mt-0.5" aria-hidden="true">✓</span>
            <span>Unlimited proposals, custom pricing &amp; SLAs</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
