'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface ROIInputs {
  teamSize: number;
  hourlyRate: number;
  hoursSavedPerWeek: number;
  currentToolCost: number;
  implementationHours: number;
  aiToolCost: number;
}

interface ROIResults {
  weeklyTimeSaved: number;
  weeklyCostSaved: number;
  monthlyCostSaved: number;
  annualCostSaved: number;
  roi: number;
  paybackPeriod: number;
  firstYearNetSavings: number;
}

export default function ROICalculator() {
  const [inputs, setInputs] = useState<ROIInputs>({
    teamSize: 10,
    hourlyRate: 75,
    hoursSavedPerWeek: 5,
    currentToolCost: 500,
    implementationHours: 40,
    aiToolCost: 199,
  });

  const [showDetails, setShowDetails] = useState(false);

  const results = useMemo<ROIResults>(() => {
    const weeklyTimeSaved = inputs.teamSize * inputs.hoursSavedPerWeek;
    const weeklyCostSaved = weeklyTimeSaved * inputs.hourlyRate;
    const monthlyCostSaved = weeklyCostSaved * 4;
    const annualCostSaved = weeklyCostSaved * 52;
    
    const implementationCost = inputs.implementationHours * inputs.hourlyRate;
    const annualAiCost = inputs.aiToolCost * 12;
    const annualOldCost = inputs.currentToolCost * 12;
    
    const totalFirstYearCost = implementationCost + annualAiCost;
    const totalOldCost = annualOldCost;
    const firstYearNetSavings = totalOldCost - totalFirstYearCost;
    
    const roi = totalFirstYearCost > 0 ? (firstYearNetSavings / totalFirstYearCost) * 100 : 0;
    const paybackPeriod = weeklyCostSaved > 0 ? implementationCost / weeklyCostSaved : 0;

    return {
      weeklyTimeSaved,
      weeklyCostSaved,
      monthlyCostSaved,
      annualCostSaved,
      roi: Math.round(roi),
      paybackPeriod: Math.round(paybackPeriod * 10) / 10,
      firstYearNetSavings,
    };
  }, [inputs]);

  const updateInput = (field: keyof ROIInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <a
            href="/tools"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Tools
          </a>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900">AI ROI Calculator</h1>
          <p className="mt-2 text-lg text-slate-600">
            Calculate the return on investment for implementing AI tools in your organization
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-xl font-semibold text-slate-900">Enter Your Details</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Team Size
                </label>
                <input
                  type="number"
                  min="1"
                  value={inputs.teamSize}
                  onChange={(e) => updateInput('teamSize', Number(e.target.value))}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <p className="mt-1 text-xs text-slate-500">Number of employees who will use the AI tool</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Average Hourly Rate ($)
                </label>
                <input
                  type="number"
                  min="1"
                  value={inputs.hourlyRate}
                  onChange={(e) => updateInput('hourlyRate', Number(e.target.value))}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <p className="mt-1 text-xs text-slate-500">Average hourly cost per employee</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Hours Saved Per Person/Week
                </label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  step="0.5"
                  value={inputs.hoursSavedPerWeek}
                  onChange={(e) => updateInput('hoursSavedPerWeek', Number(e.target.value))}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <p className="mt-1 text-xs text-slate-500">Estimated hours saved per employee each week</p>
              </div>

              <div className="border-t border-slate-200 pt-5">
                <h3 className="mb-4 text-sm font-semibold text-slate-900">Current Costs (Monthly)</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Current Tool Cost ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.currentToolCost}
                    onChange={(e) => updateInput('currentToolCost', Number(e.target.value))}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-5">
                <h3 className="mb-4 text-sm font-semibold text-slate-900">Implementation & AI Tool Costs</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Implementation Hours
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.implementationHours}
                    onChange={(e) => updateInput('implementationHours', Number(e.target.value))}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <p className="mt-1 text-xs text-slate-500">One-time setup hours</p>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700">
                    AI Tool Monthly Cost ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.aiToolCost}
                    onChange={(e) => updateInput('aiToolCost', Number(e.target.value))}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-600 to-indigo-600 p-6 shadow-lg text-white">
              <h2 className="text-xl font-semibold">Your Projected ROI</h2>
              <div className="mt-6">
                <div className="text-5xl font-bold">{results.roi}%</div>
                <div className="mt-2 text-blue-100">Return on Investment</div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-white/10 p-4">
                  <div className="text-2xl font-bold">${results.annualCostSaved.toLocaleString()}</div>
                  <div className="text-sm text-blue-100">Annual Savings</div>
                </div>
                <div className="rounded-lg bg-white/10 p-4">
                  <div className="text-2xl font-bold">{results.paybackPeriod} weeks</div>
                  <div className="text-sm text-blue-100">Payback Period</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Detailed Breakdown</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-600">Weekly Time Saved</span>
                  <span className="font-semibold text-slate-900">{results.weeklyTimeSaved} hours</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-600">Weekly Cost Saved</span>
                  <span className="font-semibold text-green-600">${results.weeklyCostSaved.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-600">Monthly Cost Saved</span>
                  <span className="font-semibold text-green-600">${results.monthlyCostSaved.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-600">Annual Cost Saved</span>
                  <span className="font-semibold text-green-600">${results.annualCostSaved.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-600">First Year Net Savings</span>
                  <span className={`font-semibold ${results.firstYearNetSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${results.firstYearNetSavings.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowDetails(!showDetails)}
                className="mt-4 text-sm text-blue-600 hover:underline"
              >
                {showDetails ? 'Hide' : 'Show'} cost breakdown
              </button>

              {showDetails && (
                <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm">
                  <h4 className="font-semibold text-slate-900">First Year Costs</h4>
                  <ul className="mt-2 space-y-1 text-slate-600">
                    <li>Implementation: ${(inputs.implementationHours * inputs.hourlyRate).toLocaleString()}</li>
                    <li>AI Tool (12 months): ${(inputs.aiToolCost * 12).toLocaleString()}</li>
                    <li>Current Tools (12 months): ${(inputs.currentToolCost * 12).toLocaleString()}</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h3 className="mb-2 text-lg font-semibold text-amber-900">Ready to calculate your exact ROI?</h3>
              <p className="mb-4 text-sm text-amber-700">
                Get a personalized analysis from our AI experts with detailed projections for your specific use case.
              </p>
              <a
                href="/contact"
                className="inline-block rounded-lg bg-amber-600 px-6 py-2 text-sm font-semibold text-white hover:bg-amber-700"
              >
                Talk to an Expert
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
