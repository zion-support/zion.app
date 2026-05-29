'use client';
import { useState } from 'react';
import Link from 'next/link';

const FIELDS = [
  { key: 'employees', label: 'Employees Doing Manual Work', default: 50, prefix: '', suffix: ' people', costLabel: 'Avg salary cost/year' },
  { key: 'manualHours', label: 'Manual Hours per Employee/Week', default: 20, prefix: '', suffix: ' hrs', costLabel: '' },
  { key: 'hourlyCost', label: 'Average Hourly Labor Cost', default: 35, prefix: '$', suffix: '/hr', costLabel: '' },
  { key: 'softwareSpend', label: 'Annual Software/Tools Spend', default: 120000, prefix: '$', suffix: '/yr', costLabel: '' },
  { key: 'errorRate', label: 'Current Error Rate', default: 8, prefix: '', suffix: '%', costLabel: 'Cost per error resolution' },
  { key: 'errorCost', label: 'Cost Per Error (rework, delay, etc.)', default: 500, prefix: '$', suffix: '', costLabel: '' },
];

interface ROICalculatorProps {
  serviceTitle?: string;
  category?: string;
}

export default function ROICalculator({ serviceTitle, category }: ROICalculatorProps) {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(FIELDS.map(f => [f.key, f.default]))
  );
  const [showResult, setShowResult] = useState(false);

  const set = (key: string, val: number) => setValues(prev => ({ ...prev, [key]: val }));

  const annualManualCost = values.employees * values.manualHours * values.hourlyCost * 52;
  const annualErrorCost = (values.errorRate / 100) * values.employees * values.manualHours * 52 * values.errorCost;
  const totalCurrentCost = annualManualCost + annualErrorCost + values.softwareSpend;

  // Assume 60% automation of manual work, 80% error reduction, 30% software consolidation
  const savingsManual = annualManualCost * 0.60;
  const savingsErrors = annualErrorCost * 0.80;
  const savingsSoftware = values.softwareSpend * 0.30;
  const totalSavings = savingsManual + savingsErrors + savingsSoftware;
  const roi = ((totalSavings - 24000) / 24000) * 120; // Assume $24K/yr platform cost

  return (
    <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900/50">
      <div className="container-page">
        <div className="text-center mb-12">
          <h2 className="section-heading">📊 ROI Calculator</h2>
          <p className="section-subheading">See how much you could save by automating with our services</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 mb-6">
            <h3 className="text-lg font-semibold text-white mb-6">Your Current Operations</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {FIELDS.map(f => (
                <div key={f.key}>
                  <label className="text-sm text-slate-300 mb-2 block">{f.label}</label>
                  <input
                    type="range"
                    min={f.key.includes('Rate') ? 1 : f.key.includes('Cost') && !f.key.includes('Hourly') ? 100 : 1}
                    max={f.key.includes('Rate') ? 30 : f.key === 'employees' ? 1000 : f.key === 'hourlyCost' ? 200 : f.key === 'errorCost' ? 5000 : f.key === 'softwareSpend' ? 1000000 : 40}
                    value={values[f.key]}
                    onChange={e => set(f.key, Number(e.target.value))}
                    className="w-full accent-emerald-500 mb-1"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{f.prefix}{(f.key.includes('Rate') ? 1 : f.key.includes('Cost') && !f.key.includes('Hourly') ? 100 : f.key === 'employees' ? 1 : f.key === 'hourlyCost' ? 1 : 1)}{f.suffix}</span>
                    <span className="text-white font-bold">{f.prefix}{values[f.key].toLocaleString()}{f.suffix}</span>
                    <span>{(f.key.includes('Rate') ? 30 : f.key === 'employees' ? 1000 : f.key === 'hourlyCost' ? 200 : f.key === 'errorCost' ? 5000 : f.key === 'softwareSpend' ? '1M' : 40)}{f.suffix}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => setShowResult(true)} className="btn-primary text-lg px-10 py-4 w-full mb-6">
            📊 Calculate My ROI →
          </button>

          {showResult && (
            <div className="glass-card p-8 bg-gradient-to-br from-emerald-900/20 to-slate-900/50 border-emerald-500/30">
              <div className="grid sm:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <p className="text-slate-400 text-sm">Current Annual Cost</p>
                  <p className="text-3xl font-bold text-red-400">${totalCurrentCost.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-sm">Projected Annual Savings</p>
                  <p className="text-3xl font-bold text-emerald-400">${Math.round(totalSavings).toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-sm">Estimated ROI</p>
                  <p className="text-3xl font-bold gradient-text">{Math.round(roi)}%</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 text-xs text-slate-400 mb-8">
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <p className="font-semibold text-white mb-1">Labor Savings</p>
                  <p className="text-emerald-400">${Math.round(savingsManual).toLocaleString()}/yr</p>
                  <p>60% manual work automated</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <p className="font-semibold text-white mb-1">Error Reduction</p>
                  <p className="text-emerald-400">${Math.round(savingsErrors).toLocaleString()}/yr</p>
                  <p>80% fewer errors</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <p className="font-semibold text-white mb-1">Software Consolidation</p>
                  <p className="text-emerald-400">${Math.round(savingsSoftware).toLocaleString()}/yr</p>
                  <p>30% tool reduction</p>
                </div>
              </div>
              <div className="text-center">
                <Link href="/configurator/" className="btn-primary text-lg px-10 py-4 inline-block">
                  ⚡ Get Your Custom ROI Analysis →
                </Link>
                <p className="text-[11px] text-slate-500 mt-3">
                  Estimates based on industry averages. Actual results vary.
                  <a href="mailto:kleber@ziontechgroup.com" className="text-purple-400 hover:text-purple-300 ml-1">kleber@ziontechgroup.com</a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
