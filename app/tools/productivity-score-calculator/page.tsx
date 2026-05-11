'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface ProductivityInputs {
  currentTaskVolume: number; // tasks per day
  averageTaskDuration: number; // minutes
  teamSize: number;
  aiAdoptionLevel: number; // 0-100%
  automationPotential: number; // 0-100%
  collaborationOverhead: number; // hours per week
}

interface ProductivityResults {
  currentDailyTaskHours: number;
  aiEnhancedTaskHours: number;
  hoursSavedPerDay: number;
  daysSavedPerYear: number;
  productivityGain: number;
  annualValue: number;
  efficiencyScore: number;
}

export default function ProductivityScoreCalculator() {
  const [inputs, setInputs] = useState<ProductivityInputs>({
    currentTaskVolume: 50,
    averageTaskDuration: 30,
    teamSize: 10,
    aiAdoptionLevel: 50,
    automationPotential: 40,
    collaborationOverhead: 5,
  });

  const [showDetails, setShowDetails] = useState(false);

  const results = useMemo<ProductivityResults>(() => {
    const currentDailyTaskHours = (inputs.currentTaskVolume * inputs.averageTaskDuration * inputs.teamSize) / 60;
    const aiAdoptionFactor = inputs.aiAdoptionLevel / 100;
    const automationFactor = inputs.automationPotential / 100;
    
    // AI reduces time based on adoption and automation potential
    const reductionFactor = aiAdoptionFactor * (0.3 + automationFactor * 0.5);
    const aiEnhancedTaskHours = currentDailyTaskHours * (1 - reductionFactor);
    
    const hoursSavedPerDay = Math.max(0, currentDailyTaskHours - aiEnhancedTaskHours);
    const daysSavedPerYear = (hoursSavedPerDay * 250) / 8; // assuming 8 hour work days
    
    const productivityGain = currentDailyTaskHours > 0 
      ? ((currentDailyTaskHours - aiEnhancedTaskHours) / currentDailyTaskHours) * 100 
      : 0;
    
    // Calculate annual value (assuming $75/hour average rate)
    const hourlyRate = 75;
    const annualValue = hoursSavedPerDay * 250 * hourlyRate;
    
    // Efficiency score (0-100)
    const efficiencyScore = Math.min(100, Math.round(
      (inputs.aiAdoptionLevel * 0.4) + 
      (inputs.automationPotential * 0.4) + 
      (100 - (inputs.collaborationOverhead * 2)) * 0.2
    ));

    return {
      currentDailyTaskHours,
      aiEnhancedTaskHours,
      hoursSavedPerDay,
      daysSavedPerYear,
      productivityGain: Math.round(productivityGain),
      annualValue,
      efficiencyScore,
    };
  }, [inputs]);

  const updateInput = (field: keyof ProductivityInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Moderate';
    return 'Needs Improvement';
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
          <div className="mb-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            New Tool
          </div>
          <h1 className="text-4xl font-bold text-slate-900">AI Productivity Score Calculator</h1>
          <p className="mt-2 text-lg text-slate-600">
            Measure your team's productivity potential with AI adoption
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-xl font-semibold text-slate-900">Your Team Profile</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Tasks Per Day (per person)
                </label>
                <input
                  type="number"
                  min="1"
                  value={inputs.currentTaskVolume}
                  onChange={(e) => updateInput('currentTaskVolume', Number(e.target.value))}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Average Task Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  value={inputs.averageTaskDuration}
                  onChange={(e) => updateInput('averageTaskDuration', Number(e.target.value))}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Team Size
                </label>
                <input
                  type="number"
                  min="1"
                  value={inputs.teamSize}
                  onChange={(e) => updateInput('teamSize', Number(e.target.value))}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="border-t border-slate-200 pt-5">
                <h3 className="mb-4 text-sm font-semibold text-slate-900">AI Adoption Metrics</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    AI Adoption Level: {inputs.aiAdoptionLevel}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={inputs.aiAdoptionLevel}
                    onChange={(e) => updateInput('aiAdoptionLevel', Number(e.target.value))}
                    className="mt-2 w-full accent-emerald-600"
                  />
                  <p className="mt-1 text-xs text-slate-500">How actively your team uses AI tools</p>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700">
                    Automation Potential: {inputs.automationPotential}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={inputs.automationPotential}
                    onChange={(e) => updateInput('automationPotential', Number(e.target.value))}
                    className="mt-2 w-full accent-emerald-600"
                  />
                  <p className="mt-1 text-xs text-slate-500">Percentage of tasks that can be automated</p>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700">
                    Collaboration Overhead (hours/week)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.collaborationOverhead}
                    onChange={(e) => updateInput('collaborationOverhead', Number(e.target.value))}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-600 to-teal-600 p-6 shadow-lg text-white">
              <h2 className="text-xl font-semibold">Productivity Analysis</h2>
              
              <div className="mt-6">
                <div className="text-sm text-emerald-100">Efficiency Score</div>
                <div className={`mt-1 text-5xl font-bold ${getScoreColor(results.efficiencyScore)}`}>
                  {results.efficiencyScore}
                </div>
                <div className="mt-1 text-emerald-100">{getScoreLabel(results.efficiencyScore)}</div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-white/10 p-4">
                  <div className="text-2xl font-bold">+{results.productivityGain}%</div>
                  <div className="text-sm text-emerald-100">Productivity Gain</div>
                </div>
                <div className="rounded-lg bg-white/10 p-4">
                  <div className="text-2xl font-bold">{results.daysSavedPerYear}</div>
                  <div className="text-sm text-emerald-100">Days Saved/Year</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Impact Breakdown</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-600">Current Daily Task Hours</span>
                  <span className="font-semibold text-slate-900">{results.currentDailyTaskHours.toFixed(1)} hrs</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-600">With AI Enhancement</span>
                  <span className="font-semibold text-emerald-600">{results.aiEnhancedTaskHours.toFixed(1)} hrs</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-600">Hours Saved Per Day</span>
                  <span className="font-semibold text-green-600">+{results.hoursSavedPerDay.toFixed(1)} hrs</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-600">Annual Value (at $75/hr)</span>
                  <span className="font-semibold text-green-600">${results.annualValue.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => setShowDetails(!showDetails)}
                className="mt-4 text-sm text-emerald-600 hover:underline"
              >
                {showDetails ? 'Hide' : 'Show'} calculation details
              </button>

              {showDetails && (
                <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm">
                  <h4 className="font-semibold text-slate-900">How this is calculated</h4>
                  <ul className="mt-2 space-y-1 text-slate-600">
                    <li>• Base: {inputs.currentTaskVolume} tasks × {inputs.averageTaskDuration} min × {inputs.teamSize} people</li>
                    <li>• AI reduction: {(inputs.aiAdoptionLevel * (0.3 + inputs.automationPotential/100 * 0.5)).toFixed(0)}%</li>
                    <li>• Efficiency score factors: adoption level, automation potential, collaboration overhead</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-violet-200 bg-violet-50 p-6">
              <h3 className="mb-2 text-lg font-semibold text-violet-900">Want to maximize your productivity?</h3>
              <p className="mb-4 text-sm text-violet-700">
                Our AI implementation experts can help you develop a roadmap to achieve optimal productivity gains.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="/ai-services/ai-strategy-roadmap"
                  className="inline-block rounded-lg bg-violet-600 px-6 py-2 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  Get AI Strategy
                </a>
                <a
                  href="/contact"
                  className="inline-block rounded-lg border border-violet-300 bg-white px-6 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50"
                >
                  Talk to Expert
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
