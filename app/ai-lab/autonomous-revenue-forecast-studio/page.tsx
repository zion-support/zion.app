'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AILabToolLayout } from '../../components/ai-lab/AILabToolLayout';

type Segment = 'SMB' | 'Mid-market' | 'Enterprise';

const SEGMENT_BASELINES: Record<Segment, { avgDeal: number; cycleFactor: number }> = {
  SMB: { avgDeal: 1800, cycleFactor: 0.92 },
  'Mid-market': { avgDeal: 6200, cycleFactor: 1 },
  Enterprise: { avgDeal: 24000, cycleFactor: 1.12 },
};

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export default function AutonomousRevenueForecastStudioPage() {
  const [segment, setSegment] = useState<Segment>('Mid-market');
  const [pipelineOpportunities, setPipelineOpportunities] = useState(48);
  const [closeRate, setCloseRate] = useState(26);
  const [avgSalesCycleDays, setAvgSalesCycleDays] = useState(44);
  const [automationCoverage, setAutomationCoverage] = useState(62);

  const forecast = useMemo(() => {
    const baseline = SEGMENT_BASELINES[segment];
    const winCount = pipelineOpportunities * (closeRate / 100);
    const quarterlyRevenue = Math.round(winCount * baseline.avgDeal);

    const velocityScore = clamp(
      100 - avgSalesCycleDays * 0.9 + automationCoverage * 0.45 + baseline.cycleFactor * 8,
    );
    const confidenceScore = clamp(
      closeRate * 1.1 + automationCoverage * 0.35 + Math.log10(pipelineOpportunities + 1) * 18,
    );
    const expansionPotential = clamp(
      confidenceScore * 0.4 + velocityScore * 0.3 + (100 - Math.min(avgSalesCycleDays, 100)) * 0.3,
    );

    const recommendation =
      expansionPotential >= 78
        ? 'Strong scale signal: expand outbound + retention automation in parallel.'
        : expansionPotential >= 62
          ? 'Healthy baseline: improve close-rate workflows before scaling paid acquisition.'
          : 'Risk zone: tighten qualification and reduce sales-cycle friction first.';

    const actions = [
      `Pipeline opportunities: ${pipelineOpportunities} active (${segment} mix).`,
      `Expected wins: ${winCount.toFixed(1)} at ${closeRate}% close rate.`,
      `Automation coverage: ${automationCoverage}% across qualification, follow-up, and expansion.`,
      `Quarterly forecast: $${quarterlyRevenue.toLocaleString()} before expansion uplift.`,
    ];

    return {
      quarterlyRevenue,
      velocityScore,
      confidenceScore,
      expansionPotential,
      recommendation,
      actions,
    };
  }, [avgSalesCycleDays, automationCoverage, closeRate, pipelineOpportunities, segment]);

  return (
    <div className="bg-slate-950/95">
      <AILabToolLayout
        title="Autonomous Revenue Forecast Studio"
        subtitle="Model pipeline quality, sales velocity, and automation leverage to produce a deterministic growth forecast."
      >
        <div className="grid gap-8 lg:grid-cols-[1fr,1.2fr]">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <h2 className="text-sm font-semibold text-slate-100">Forecast controls</h2>
            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(SEGMENT_BASELINES) as Segment[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSegment(value)}
                    className={`rounded-lg border px-2 py-1.5 ${
                      segment === value
                        ? 'border-cyan-400/70 bg-cyan-500/20 text-cyan-50'
                        : 'border-slate-700 bg-slate-950/60 text-slate-300 hover:border-cyan-500/40'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>

              <label className="block">
                <span className="mb-1 block text-slate-300">
                  Pipeline opportunities: {pipelineOpportunities}
                </span>
                <input
                  type="range"
                  min={10}
                  max={200}
                  value={pipelineOpportunities}
                  onChange={(event) => setPipelineOpportunities(Number(event.target.value))}
                  className="w-full accent-cyan-400"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-slate-300">Close rate: {closeRate}%</span>
                <input
                  type="range"
                  min={5}
                  max={60}
                  value={closeRate}
                  onChange={(event) => setCloseRate(Number(event.target.value))}
                  className="w-full accent-emerald-400"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-slate-300">
                  Average sales cycle: {avgSalesCycleDays} days
                </span>
                <input
                  type="range"
                  min={14}
                  max={120}
                  value={avgSalesCycleDays}
                  onChange={(event) => setAvgSalesCycleDays(Number(event.target.value))}
                  className="w-full accent-indigo-400"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-slate-300">
                  Automation coverage: {automationCoverage}%
                </span>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={automationCoverage}
                  onChange={(event) => setAutomationCoverage(Number(event.target.value))}
                  className="w-full accent-amber-400"
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-violet-500/40 bg-violet-500/10 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-200">
              Growth intelligence
            </p>
            <h2 className="mt-1 text-xl font-bold text-violet-50">Autonomous revenue forecast</h2>
            <p className="mt-3 text-sm text-violet-100">{forecast.recommendation}</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-700/80 bg-slate-950/60 p-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">Quarterly revenue</p>
                <p className="mt-1 text-2xl font-bold text-cyan-300">
                  ${forecast.quarterlyRevenue.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg border border-slate-700/80 bg-slate-950/60 p-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">Velocity score</p>
                <p className="mt-1 text-2xl font-bold text-emerald-300">{forecast.velocityScore}</p>
              </div>
              <div className="rounded-lg border border-slate-700/80 bg-slate-950/60 p-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">Confidence score</p>
                <p className="mt-1 text-2xl font-bold text-amber-300">{forecast.confidenceScore}</p>
              </div>
              <div className="rounded-lg border border-slate-700/80 bg-slate-950/60 p-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">Expansion potential</p>
                <p className="mt-1 text-2xl font-bold text-violet-300">{forecast.expansionPotential}</p>
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-slate-700/80 bg-slate-950/60 p-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">Forecast briefing</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-200">
                {forecast.actions.map((line) => (
                  <li key={line}>- {line}</li>
                ))}
              </ul>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="/ai-services/autonomous-growth-intelligence"
                className="rounded-full border border-cyan-300/70 bg-cyan-400/20 px-4 py-2 text-xs font-semibold text-cyan-50 hover:bg-cyan-400/30"
              >
                Open growth intelligence service
              </a>
              <a
                href="/ai-lab/autonomous-funnel-orchestrator"
                className="rounded-full border border-emerald-300/70 bg-emerald-400/20 px-4 py-2 text-xs font-semibold text-emerald-50 hover:bg-emerald-400/30"
              >
                Open funnel orchestrator
              </a>
            </div>
          </section>
        </div>
      </AILabToolLayout>
    </div>
  );
}
