'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface MeetingInputs {
  attendeeCount: number;
  averageHourlyRate: number;
  meetingDurationMinutes: number;
  meetingsPerWeek: number;
  effectivenessGain: number; // percentage
}

interface MeetingResults {
  costPerMeeting: number;
  weeklyCost: number;
  monthlyCost: number;
  annualCost: number;
  effectiveAnnualCost: number;
  wastedAnnualCost: number;
}

export default function MeetingCostCalculator() {
  const [inputs, setInputs] = useState<MeetingInputs>({
    attendeeCount: 8,
    averageHourlyRate: 75,
    meetingDurationMinutes: 60,
    meetingsPerWeek: 5,
    effectivenessGain: 20,
  });

  const results = useMemo<MeetingResults>(() => {
    const costPerMeeting = (inputs.attendeeCount * inputs.averageHourlyRate * inputs.meetingDurationMinutes) / 60;
    const weeklyCost = costPerMeeting * inputs.meetingsPerWeek;
    const monthlyCost = weeklyCost * 4;
    const annualCost = monthlyCost * 12;
    
    // Calculate effective cost after improvement
    const effectiveAnnualCost = annualCost * (1 - inputs.effectivenessGain / 100);
    const wastedAnnualCost = annualCost - effectiveAnnualCost;

    return {
      costPerMeeting,
      weeklyCost,
      monthlyCost,
      annualCost,
      effectiveAnnualCost,
      wastedAnnualCost,
    };
  }, [inputs]);

  const updateInput = (field: keyof MeetingInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <a
            href="/tools"
            className="text-sm text-emerald-600 hover:underline"
          >
            ← Back to Tools
          </a>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900">Meeting Cost Calculator</h1>
          <p className="mt-2 text-lg text-slate-600">
            Understand the true cost of meetings and see potential savings with AI-powered improvements
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-xl font-semibold text-slate-900">Meeting Details</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Number of Attendees
                </label>
                <input
                  type="number"
                  min="1"
                  value={inputs.attendeeCount}
                  onChange={(e) => updateInput('attendeeCount', Number(e.target.value))}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Average Hourly Rate per Person ($)
                </label>
                <input
                  type="number"
                  min="1"
                  value={inputs.averageHourlyRate}
                  onChange={(e) => updateInput('averageHourlyRate', Number(e.target.value))}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Meeting Duration (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="480"
                  value={inputs.meetingDurationMinutes}
                  onChange={(e) => updateInput('meetingDurationMinutes', Number(e.target.value))}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Meetings per Week
                </label>
                <input
                  type="number"
                  min="1"
                  value={inputs.meetingsPerWeek}
                  onChange={(e) => updateInput('meetingsPerWeek', Number(e.target.value))}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="border-t border-slate-200 pt-5">
                <label className="block text-sm font-medium text-slate-700">
                  Expected Efficiency Gain with AI Tools (%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={inputs.effectivenessGain}
                  onChange={(e) => updateInput('effectivenessGain', Number(e.target.value))}
                  className="mt-2 w-full"
                />
                <div className="mt-1 text-center text-sm text-slate-500">
                  {inputs.effectivenessGain}% - Save {Math.round(results.annualCost * inputs.effectivenessGain / 100).toLocaleString()}/year
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-600 to-teal-600 p-6 shadow-lg text-white">
              <h2 className="text-xl font-semibold">Annual Meeting Cost</h2>
              <div className="mt-6">
                <div className="text-5xl font-bold">${results.annualCost.toLocaleString()}</div>
                <div className="mt-2 text-emerald-100">Total yearly cost for all meetings</div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-white/10 p-4">
                  <div className="text-2xl font-bold">${results.costPerMeeting.toLocaleString()}</div>
                  <div className="text-sm text-emerald-100">Per Meeting</div>
                </div>
                <div className="rounded-lg bg-white/10 p-4">
                  <div className="text-2xl font-bold">{inputs.meetingsPerWeek * 4}</div>
                  <div className="text-sm text-emerald-100">Per Month</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Cost Breakdown</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-600">Per Meeting</span>
                  <span className="font-semibold text-slate-900">${results.costPerMeeting.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-600">Weekly</span>
                  <span className="font-semibold text-slate-900">${results.weeklyCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-600">Monthly</span>
                  <span className="font-semibold text-slate-900">${results.monthlyCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-600">Annual</span>
                  <span className="font-semibold text-slate-900">${results.annualCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h3 className="mb-2 text-lg font-semibold text-amber-900">Potential Savings</h3>
              <p className="mb-4 text-sm text-amber-700">
                With {inputs.effectivenessGain}% efficiency improvement using AI meeting assistants:
              </p>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-emerald-600">
                  ${results.wastedAnnualCost.toLocaleString()}
                </div>
                <div className="text-sm text-amber-700">saved per year</div>
              </div>
              
              <div className="mt-6">
                <a
                  href="/ai-services"
                  className="inline-block rounded-lg bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Explore AI Meeting Solutions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
