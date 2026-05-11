'use client';

import React, { useMemo, useState } from 'react';
import { AILabToolLayout } from '../../components/ai-lab/AILabToolLayout';

type ImpactLevel = 1 | 2 | 3 | 4 | 5;

interface ScoreInput {
  currentManualHoursPerWeek: number;
  avgTicketOrCaseVolumePerMonth: number;
  revenueImpactPotential: ImpactLevel;
  opsPainLevel: ImpactLevel;
  customerExperiencePain: ImpactLevel;
}

interface Scorecard {
  roiScore: number;
  opsScore: number;
  experienceScore: number;
  priorityBand: 'quick-win' | 'high-upside' | 'strategic';
  narrative: string;
  suggestedTracks: {
    label: string;
    description: string;
    links: { label: string; href: string }[];
  }[];
}

function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function buildScorecard(input: ScoreInput): Scorecard {
  const hours = clamp(input.currentManualHoursPerWeek, 0, 200);
  const volume = clamp(input.avgTicketOrCaseVolumePerMonth, 0, 100000);

  const normalizedHours = Math.min(1, hours / 80);
  const normalizedVolume = Math.min(1, volume / 5000);

  const revenueWeight = input.revenueImpactPotential / 5;
  const opsWeight = input.opsPainLevel / 5;
  const experienceWeight = input.customerExperiencePain / 5;

  const roiScore = Math.round(
    (60 * revenueWeight + 25 * normalizedHours + 15 * normalizedVolume) * 1.1,
  );
  const opsScore = Math.round((50 * opsWeight + 30 * normalizedHours + 20 * normalizedVolume) * 1.1);
  const experienceScore = Math.round(
    (55 * experienceWeight + 20 * revenueWeight + 10 * normalizedVolume) * 1.05,
  );

  const composite = (roiScore + opsScore + experienceScore) / 3;

  let priorityBand: Scorecard['priorityBand'] = 'strategic';
  if (composite >= 75) {
    priorityBand = 'quick-win';
  } else if (composite >= 55) {
    priorityBand = 'high-upside';
  }

  const narrativeParts: string[] = [];

  if (hours > 30) {
    narrativeParts.push(
      'There is a clear opportunity to reclaim significant manual hours with workflow automation and document intelligence.',
    );
  } else if (hours > 10) {
    narrativeParts.push(
      'The current manual load is meaningful but not overwhelming; a focused pilot could quickly prove value.',
    );
  } else {
    narrativeParts.push(
      'Manual effort is relatively contained; AI can still help with quality, observability, and guardrails.',
    );
  }

  if (input.revenueImpactPotential >= 4) {
    narrativeParts.push(
      'Revenue impact is high, so tying initiatives to pipeline, conversion, or retention metrics is critical.',
    );
  } else if (input.opsPainLevel >= 4) {
    narrativeParts.push(
      'Operational pain is acute; freeing teams from repetitive work should be the first focus area.',
    );
  } else if (input.customerExperiencePain >= 4) {
    narrativeParts.push(
      'Customer experience is a major concern; AI copilots and support flows can create visible improvements.',
    );
  } else {
    narrativeParts.push(
      'Impact is more incremental; a small, well-instrumented experiment is better than a large, diffuse rollout.',
    );
  }

  if (experienceScore >= 70) {
    narrativeParts.push(
      'Because experience impact is high, prioritize journeys where AI can reduce wait time or cognitive load.',
    );
  }

  const suggestedTracks: Scorecard['suggestedTracks'] = [];

  if (priorityBand === 'quick-win') {
    suggestedTracks.push({
      label: 'Launch a 90-day AI pilot',
      description:
        'Pick one workflow with high volume and clear ownership. Ship a vertical slice that combines automation, analytics, and human-in-the-loop review.',
      links: [
        { label: 'AI Strategy & Roadmap', href: '/ai-services/ai-strategy-roadmap' },
        { label: 'Zion Workflow Automation', href: '/zion-workflow-automation' },
      ],
    });
  } else if (priorityBand === 'high-upside') {
    suggestedTracks.push({
      label: 'Design a two-track rollout',
      description:
        'Frame one track for measurable efficiency and another for revenue or experience, then iterate based on which shows signal first.',
      links: [
        { label: 'AI Agents & Autonomous Workflows', href: '/ai-services/ai-agents-autonomous' },
        { label: 'Zion AI Lead Scoring', href: '/zion-ai-lead-scoring' },
      ],
    });
  } else {
    suggestedTracks.push({
      label: 'Prepare the runway',
      description:
        'Invest in data quality, observability, and governance so future AI pilots can move faster with less risk.',
      links: [
        { label: 'AI Governance & Trust', href: '/ai-services/ai-governance-trust' },
        { label: 'AI Integration & APIs', href: '/ai-services/ai-integration-apis' },
      ],
    });
  }

  suggestedTracks.push({
    label: 'Connect with Zion architects',
    description:
      'Share this scorecard with our team; we can map it to a concrete proposal and a realistic delivery timeline.',
    links: [{ label: 'Talk with a human architect', href: '/contact#engagement' }],
  });

  return {
    roiScore: clamp(roiScore, 10, 100),
    opsScore: clamp(opsScore, 10, 100),
    experienceScore: clamp(experienceScore, 10, 100),
    priorityBand,
    narrative: narrativeParts.join(' '),
    suggestedTracks,
  };
}

export default function RoiOpsScorecardPage() {
  const [input, setInput] = useState<ScoreInput>({
    currentManualHoursPerWeek: 20,
    avgTicketOrCaseVolumePerMonth: 1000,
    revenueImpactPotential: 4,
    opsPainLevel: 3,
    customerExperiencePain: 3,
  });

  const scorecard = useMemo(() => buildScorecard(input), [input]);

  return (
    <div className="bg-slate-950/90">
      <AILabToolLayout
        title="AI ROI & Ops Scorecard"
        subtitle="Estimate impact across revenue, operations, and customer experience. The scorecard highlights where AI should start and how Zion would structure the first wave."
      >
        <div className="grid gap-8 lg:grid-cols-5">
          <form
            className="space-y-5 lg:col-span-2 lg:border-r lg:border-slate-800/80 lg:pr-6"
            aria-label="AI ROI & operations inputs"
          >
            <div>
              <label
                htmlFor="hours"
                className="block text-xs font-medium uppercase tracking-wide text-slate-200"
              >
                Manual hours per week
              </label>
              <p className="mt-1 text-[11px] text-slate-400">
                Rough weekly total across the team for the workflow or area you have in mind.
              </p>
              <input
                id="hours"
                type="number"
                min={0}
                max={200}
                value={input.currentManualHoursPerWeek}
                onChange={(event) =>
                  setInput((prev) => ({
                    ...prev,
                    currentManualHoursPerWeek: Number(event.target.value || 0),
                  }))
                }
                className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm text-slate-50 outline-none ring-sky-500/60 focus:border-sky-500 focus:ring"
              />
            </div>

            <div>
              <label
                htmlFor="volume"
                className="block text-xs font-medium uppercase tracking-wide text-slate-200"
              >
                Tickets / cases per month
              </label>
              <p className="mt-1 text-[11px] text-slate-400">
                Volume of items (tickets, documents, orders, requests, etc.) touching this area.
              </p>
              <input
                id="volume"
                type="number"
                min={0}
                max={100000}
                value={input.avgTicketOrCaseVolumePerMonth}
                onChange={(event) =>
                  setInput((prev) => ({
                    ...prev,
                    avgTicketOrCaseVolumePerMonth: Number(event.target.value || 0),
                  }))
                }
                className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm text-slate-50 outline-none ring-sky-500/60 focus:border-sky-500 focus:ring"
              />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-200">
                Potential revenue impact
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                If this area improved meaningfully, how much would it affect revenue or pipeline?
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() =>
                      setInput((prev) => ({
                        ...prev,
                        revenueImpactPotential: level as ImpactLevel,
                      }))
                    }
                    className={`rounded-full border px-2.5 py-1 font-medium ${
                      input.revenueImpactPotential === level
                        ? 'border-emerald-500/70 bg-emerald-500/15 text-emerald-100'
                        : 'border-slate-700 bg-slate-950/60 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-100'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-200">
                Operational pain
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                How painful is this area for internal teams today?
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() =>
                      setInput((prev) => ({
                        ...prev,
                        opsPainLevel: level as ImpactLevel,
                      }))
                    }
                    className={`rounded-full border px-2.5 py-1 font-medium ${
                      input.opsPainLevel === level
                        ? 'border-sky-500/70 bg-sky-500/20 text-sky-100'
                        : 'border-slate-700 bg-slate-950/60 text-slate-300 hover:border-sky-500/40 hover:text-sky-100'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-200">
                Customer experience pain
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                How visible is this area to customers or end users when it goes wrong?
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() =>
                      setInput((prev) => ({
                        ...prev,
                        customerExperiencePain: level as ImpactLevel,
                      }))
                    }
                    className={`rounded-full border px-2.5 py-1 font-medium ${
                      input.customerExperiencePain === level
                        ? 'border-pink-500/70 bg-pink-500/20 text-pink-100'
                        : 'border-slate-700 bg-slate-950/60 text-slate-300 hover:border-pink-500/40 hover:text-pink-100'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </form>

          <div className="space-y-6 lg:col-span-3">
            <section className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5 text-xs text-slate-200">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                Composite scores
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                  <p className="text-[11px] font-semibold text-slate-300">ROI potential</p>
                  <p className="mt-2 text-3xl font-bold text-emerald-300">
                    {scorecard.roiScore}
                    <span className="ml-1 text-base font-semibold text-slate-400">/100</span>
                  </p>
                  <p className="mt-2 text-[11px] text-slate-400">
                    Blend of revenue upside and scale of the underlying workflow.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                  <p className="text-[11px] font-semibold text-slate-300">Ops impact</p>
                  <p className="mt-2 text-3xl font-bold text-sky-300">
                    {scorecard.opsScore}
                    <span className="ml-1 text-base font-semibold text-slate-400">/100</span>
                  </p>
                  <p className="mt-2 text-[11px] text-slate-400">
                    How much manual toil and operational drag AI can remove.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                  <p className="text-[11px] font-semibold text-slate-300">Experience impact</p>
                  <p className="mt-2 text-3xl font-bold text-pink-300">
                    {scorecard.experienceScore}
                    <span className="ml-1 text-base font-semibold text-slate-400">/100</span>
                  </p>
                  <p className="mt-2 text-[11px] text-slate-400">
                    How strongly customers or end users will feel the improvement.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-slate-300">
                <span className="rounded-full border border-emerald-500/60 bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-200">
                  Priority:{' '}
                  {scorecard.priorityBand === 'quick-win'
                    ? 'Quick win'
                    : scorecard.priorityBand === 'high-upside'
                    ? 'High-upside bet'
                    : 'Strategic foundation'}
                </span>
                <p className="max-w-xl">{scorecard.narrative}</p>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5 text-xs text-slate-200">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                Suggested next tracks
              </p>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                {scorecard.suggestedTracks.map((track) => (
                  <div
                    key={track.label}
                    className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"
                  >
                    <p className="text-[11px] font-semibold text-slate-100">{track.label}</p>
                    <p className="mt-2 text-[11px] text-slate-300">{track.description}</p>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] text-slate-300">
                      {track.links.map((link) => (
                        <li key={link.href}>{link.label}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </AILabToolLayout>
    </div>
  );
}

