'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';

type TrafficBand = 'low' | 'medium' | 'high';
type AutomationMode = 'standard' | 'aggressive' | 'conservative';

type SimulatorInputs = {
  monthlyVisitors: number;
  avgDealSize: number;
  baseConversionRate: number;
  modules: number;
  trafficBand: TrafficBand;
  automationMode: AutomationMode;
  contentAutomationEnabled: boolean;
};

type SimulatorOutputs = {
  projectedConversionRate: number;
  projectedPipeline: number;
  projectedRevenue: number;
  opsHoursSaved: number;
  contentThroughputPerMonth: number;
};

function computeOutputs(inputs: SimulatorInputs): SimulatorOutputs {
  const {
    monthlyVisitors,
    avgDealSize,
    baseConversionRate,
    modules,
    automationMode,
    contentAutomationEnabled,
  } = inputs;

  const moduleFactor = 1 + Math.min(modules, 12) * 0.03;

  const modeMultiplier =
    automationMode === 'aggressive' ? 1.35 : automationMode === 'standard' ? 1.15 : 1.05;

  const projectedConversionRate = Math.min(
    baseConversionRate * moduleFactor * modeMultiplier,
    0.25,
  );

  const projectedPipeline = monthlyVisitors * projectedConversionRate;
  const projectedRevenue = projectedPipeline * avgDealSize;

  const opsHoursSaved =
    modules * (automationMode === 'aggressive' ? 12 : automationMode === 'standard' ? 8 : 5);

  const contentThroughputPerMonth = contentAutomationEnabled ? 40 + modules * 4 : 6 + modules * 2;

  return {
    projectedConversionRate,
    projectedPipeline,
    projectedRevenue,
    opsHoursSaved,
    contentThroughputPerMonth,
  };
}

function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return '0%';
  return `${(value * 100).toFixed(1)}%`;
}

export default function ZionAISiteEvolutionSimulatorPage() {
  const [monthlyVisitors, setMonthlyVisitors] = useState(50000);
  const [avgDealSize, setAvgDealSize] = useState(8000);
  const [baseConversionRate, setBaseConversionRate] = useState(0.012);
  const [modules, setModules] = useState(6);
  const [automationMode, setAutomationMode] = useState<AutomationMode>('standard');
  const [contentAutomationEnabled, setContentAutomationEnabled] = useState(true);

  const inputs: SimulatorInputs = useMemo(
    () => ({
      monthlyVisitors,
      avgDealSize,
      baseConversionRate,
      modules,
      automationMode,
      contentAutomationEnabled,
      trafficBand:
        monthlyVisitors < 20000 ? 'low' : monthlyVisitors < 100000 ? 'medium' : 'high',
    }),
    [monthlyVisitors, avgDealSize, baseConversionRate, modules, automationMode, contentAutomationEnabled],
  );

  const outputs = useMemo(() => computeOutputs(inputs), [inputs]);

  const baselinePipeline = inputs.monthlyVisitors * inputs.baseConversionRate;
  const baselineRevenue = baselinePipeline * inputs.avgDealSize;

  const pipelineUplift = outputs.projectedPipeline - baselinePipeline;
  const revenueUplift = outputs.projectedRevenue - baselineRevenue;

  return (
    <main className="bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-6 lg:px-8 lg:pb-16 lg:pt-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr),minmax(0,1.2fr)] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
              Autonomous Site Evolution · Interactive
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Zion AI Site Evolution Simulator
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
              Explore how Zion’s autonomous agents — audits, content engines, and evolution pipelines
              — could impact your traffic, conversion, and operations over time. Adjust a few inputs
              and see the projected lift before you commit to a rollout.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-200">
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/60 bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Live in-browser model
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/60 bg-sky-500/10 px-3 py-1 font-semibold text-sky-100">
                No sign-up · No keys
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/60 bg-purple-500/10 px-3 py-1 font-semibold text-purple-100">
                Aligned with Zion AI Lab
              </span>
            </div>

            <div className="mt-7 flex flex-wrap gap-3 text-sm">
              <a
                href="/contact?topic=project&source=site-evolution-simulator"
                className="inline-flex items-center rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:from-emerald-400 hover:to-sky-400"
              >
                Talk through my scenario
              </a>
              <a
                href="/ai-lab"
                className="inline-flex items-center rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-emerald-400 hover:text-white"
              >
                Explore Zion AI Lab
              </a>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              This simulator uses transparent heuristics inspired by how Zion’s{' '}
              <a
                href="/ai-lab"
                className="font-semibold text-emerald-300 underline-offset-2 hover:underline"
              >
                app evolution pipelines
              </a>{' '}
              behave in production. It&apos;s designed to help you reason about impact — not to replace
              proper forecasting.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/40 bg-slate-950/80 p-5 shadow-xl shadow-emerald-900/30">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-200">
              Scenario summary
            </h2>
            <p className="mt-1 text-xs text-slate-300">
              Based on your inputs, here’s how a Zion rollout could reshape your funnel and operations.
            </p>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-3">
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Current pipeline / mo
                </dt>
                <dd className="mt-1 text-base font-semibold text-slate-50">
                  {Math.round(baselinePipeline).toLocaleString()}
                </dd>
                <p className="mt-1 text-[11px] text-slate-400">
                  {formatCurrency(baselineRevenue)} in baseline revenue.
                </p>
              </div>
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-3">
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-emerald-200">
                  Projected pipeline / mo
                </dt>
                <dd className="mt-1 text-base font-semibold text-emerald-100">
                  {Math.round(outputs.projectedPipeline).toLocaleString()}
                </dd>
                <p className="mt-1 text-[11px] text-emerald-200">
                  {formatCurrency(outputs.projectedRevenue)} projected revenue.
                </p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-3">
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Conversion rate
                </dt>
                <dd className="mt-1 text-base font-semibold text-slate-50">
                  {formatPercent(inputs.baseConversionRate)} →{' '}
                  <span className="text-emerald-300">{formatPercent(outputs.projectedConversionRate)}</span>
                </dd>
                <p className="mt-1 text-[11px] text-slate-400">
                  Uplift of {formatPercent(outputs.projectedConversionRate - inputs.baseConversionRate)}.
                </p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-3">
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Monthly uplift (est.)
                </dt>
                <dd className="mt-1 text-base font-semibold text-emerald-100">
                  {formatCurrency(revenueUplift)}
                </dd>
                <p className="mt-1 text-[11px] text-slate-400">
                  ~{Math.round(pipelineUplift).toLocaleString()} more qualified opportunities / month.
                </p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-3">
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Ops hours saved / mo
                </dt>
                <dd className="mt-1 text-base font-semibold text-slate-50">
                  {Math.round(outputs.opsHoursSaved).toLocaleString()} hrs
                </dd>
                <p className="mt-1 text-[11px] text-slate-400">
                  From automation across support, revenue ops, and operations.
                </p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-3">
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Content velocity / mo
                </dt>
                <dd className="mt-1 text-base font-semibold text-slate-50">
                  {Math.round(outputs.contentThroughputPerMonth).toLocaleString()} pieces
                </dd>
                <p className="mt-1 text-[11px] text-slate-400">
                  Blog posts, case studies, and routes your automation could sustain.
                </p>
              </div>
            </dl>

            <p className="mt-3 text-[11px] text-slate-500">
              Numbers are directional and intentionally conservative for most scenarios. For a
              production forecast, we calibrate against your actual funnel data.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.4fr),minmax(0,1.2fr)]">
          <section className="rounded-2xl border border-slate-700/70 bg-slate-950/80 p-5 sm:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              Configure your scenario
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Start with rough numbers — you can refine later with your Zion team.
            </p>

            <form className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1 text-xs">
                <span className="font-semibold text-slate-200">Monthly visitors</span>
                <input
                  type="number"
                  min={1000}
                  max={1000000}
                  value={monthlyVisitors}
                  onChange={(event) => setMonthlyVisitors(Number(event.target.value) || 0)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none transition focus:border-emerald-400"
                />
                <input
                  type="range"
                  min={5000}
                  max={250000}
                  step={5000}
                  value={monthlyVisitors}
                  onChange={(event) => setMonthlyVisitors(Number(event.target.value) || 0)}
                  className="mt-1"
                />
              </label>

              <label className="flex flex-col gap-1 text-xs">
                <span className="font-semibold text-slate-200">Average deal size (USD)</span>
                <input
                  type="number"
                  min={500}
                  max={50000}
                  step={500}
                  value={avgDealSize}
                  onChange={(event) => setAvgDealSize(Number(event.target.value) || 0)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none transition focus:border-emerald-400"
                />
                <input
                  type="range"
                  min={1000}
                  max={25000}
                  step={500}
                  value={avgDealSize}
                  onChange={(event) => setAvgDealSize(Number(event.target.value) || 0)}
                  className="mt-1"
                />
              </label>

              <label className="flex flex-col gap-1 text-xs">
                <span className="font-semibold text-slate-200">Baseline conversion rate</span>
                <input
                  type="number"
                  min={0.1}
                  max={15}
                  step={0.1}
                  value={inputs.baseConversionRate * 100}
                  onChange={(event) =>
                    setBaseConversionRate(Math.max(0.001, Number(event.target.value) / 100 || 0))
                  }
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none transition focus:border-emerald-400"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Typical SaaS funnels sit between 0.5% and 5% depending on channel and ACV.
                </p>
              </label>

              <label className="flex flex-col gap-1 text-xs">
                <span className="font-semibold text-slate-200">Zion AI modules to launch</span>
                <input
                  type="range"
                  min={1}
                  max={12}
                  step={1}
                  value={modules}
                  onChange={(event) => setModules(Number(event.target.value) || 1)}
                  className="mt-1"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  {modules} modules · Examples:{' '}
                  <span className="text-slate-200">
                    AI Chatbot, Customer Support Pro, Smart CRM Automation, Content Studio, DevOps
                    Automation
                  </span>
                  .
                </p>
              </label>

              <fieldset className="col-span-1 flex flex-col gap-2 text-xs md:col-span-2">
                <legend className="font-semibold text-slate-200">Automation intensity</legend>
                <div className="mt-1 grid grid-cols-3 gap-2">
                  {(['conservative', 'standard', 'aggressive'] as AutomationMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setAutomationMode(mode)}
                      className={`rounded-lg border px-3 py-2 text-[11px] font-semibold transition ${
                        automationMode === mode
                          ? 'border-emerald-400 bg-emerald-500/15 text-emerald-100'
                          : 'border-slate-700 bg-slate-950 text-slate-200 hover:border-emerald-400/60'
                      }`}
                    >
                      {mode === 'conservative'
                        ? 'Conservative'
                        : mode === 'standard'
                          ? 'Standard'
                          : 'Aggressive'}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500">
                  Conservative favors lowest risk and slower rollout. Aggressive mirrors our
                  high-velocity content and evolution pipelines.
                </p>
              </fieldset>

              <label className="col-span-1 flex items-start gap-2 text-xs md:col-span-2">
                <input
                  type="checkbox"
                  checked={contentAutomationEnabled}
                  onChange={(event) => setContentAutomationEnabled(event.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-slate-500 bg-slate-900 text-emerald-500 focus:ring-emerald-400"
                />
                <span className="text-slate-200">
                  Enable continuous content automation (blog, case studies, product pages){' '}
                  <span className="block text-[11px] font-normal text-slate-400">
                    Aligns with agents such as AI Content Maximum Pipeline, Front Page Services
                    Advertiser, and AI Lab evolution workflows.
                  </span>
                </span>
              </label>
            </form>
          </section>

          <section className="rounded-2xl border border-slate-700/70 bg-slate-950/80 p-5 sm:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              How Zion would land this
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              A simplified version of the phased plan our rollout architects typically recommend.
            </p>

            <ol className="mt-4 space-y-3 text-xs">
              <li className="rounded-xl border border-slate-700 bg-slate-950/80 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-purple-200">
                    Phase 1 · Discovery & baselines
                  </p>
                  <span className="rounded-full border border-slate-600 bg-slate-900 px-2 py-0.5 text-[10px] text-slate-300">
                    Weeks 1–2
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-slate-200">
                  Instrument your current funnel, confirm definition of a qualified opportunity, and
                  run a first wave of{' '}
                  <a
                    href="/ai-lab"
                    className="font-semibold text-emerald-300 underline-offset-2 hover:underline"
                  >
                    system intelligence audits
                  </a>
                  .
                </p>
              </li>
              <li className="rounded-xl border border-slate-700 bg-slate-950/80 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-purple-200">
                    Phase 2 · Pilot core modules
                  </p>
                  <span className="rounded-full border border-slate-600 bg-slate-900 px-2 py-0.5 text-[10px] text-slate-300">
                    Weeks 3–6
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-slate-200">
                  Turn on {modules <= 4 ? modules : 4}+ modules across{' '}
                  <a href="/zion-smart-crm-automation" className="font-semibold text-emerald-300">
                    Smart CRM Automation
                  </a>
                  ,{' '}
                  <a href="/zion-ai-chatbot-builder" className="font-semibold text-emerald-300">
                    Chatbots
                  </a>
                  , and{' '}
                  <a href="/zion-content-studio" className="font-semibold text-emerald-300">
                    Content Studio
                  </a>
                  , then measure lift vs. your baselines.
                </p>
              </li>
              <li className="rounded-xl border border-slate-700 bg-slate-950/80 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-purple-200">
                    Phase 3 · Scale & automate evolution
                  </p>
                  <span className="rounded-full border border-slate-600 bg-slate-900 px-2 py-0.5 text-[10px] text-slate-300">
                    Weeks 7–12
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-slate-200">
                  Fold successful journeys into always-on{' '}
                  <a href="/ai-lab" className="font-semibold text-emerald-300">
                    app evolution pipelines
                  </a>
                  , so site health, content velocity, and conversion are continuously improved.
                </p>
              </li>
            </ol>

            <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/80 p-3 text-[11px] text-slate-300">
              <p>
                Ready to see this calibrated against your real data?{' '}
                <a
                  href="/contact?topic=project&source=site-evolution-simulator-footer"
                  className="font-semibold text-emerald-300 underline-offset-2 hover:underline"
                >
                  Book a working session with a Zion architect
                </a>
                . We’ll plug in actual funnel metrics and propose a concrete rollout.
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

