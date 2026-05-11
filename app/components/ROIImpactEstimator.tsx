'use client';

import Link from 'next/link';
import { ChangeEvent, useMemo, useState } from 'react';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

type SliderFieldProps = {
  id: string;
  label: string;
  helperText: string;
  min: number;
  max: number;
  step: number;
  value: number;
  displayValue: string;
  onChange: (nextValue: number) => void;
};

type EstimatorPreset = {
  id: string;
  label: string;
  teamSize: number;
  hourlyCost: number;
  automatableHoursPerWeek: number;
  automationCoverage: number;
  implementationInvestment: number;
};

const estimatorPresets: EstimatorPreset[] = [
  {
    id: 'support-ops',
    label: 'Support operations',
    teamSize: 24,
    hourlyCost: 52,
    automatableHoursPerWeek: 6,
    automationCoverage: 42,
    implementationInvestment: 22000,
  },
  {
    id: 'sales-enablement',
    label: 'Sales enablement',
    teamSize: 16,
    hourlyCost: 68,
    automatableHoursPerWeek: 5,
    automationCoverage: 38,
    implementationInvestment: 18000,
  },
  {
    id: 'engineering-delivery',
    label: 'Engineering delivery',
    teamSize: 30,
    hourlyCost: 92,
    automatableHoursPerWeek: 4,
    automationCoverage: 32,
    implementationInvestment: 36000,
  },
];

function clampValue(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function SliderField({
  id,
  label,
  helperText,
  min,
  max,
  step,
  value,
  displayValue,
  onChange,
}: SliderFieldProps) {
  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.target.value));
  };

  const handleNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const parsedValue = Number(event.target.value);

    if (Number.isNaN(parsedValue)) {
      return;
    }

    onChange(clampValue(parsedValue, min, max));
  };

  return (
    <div className="rounded-xl border border-slate-700/70 bg-slate-950/70 p-4">
      <div className="flex items-start justify-between gap-4">
        <label htmlFor={id} className="text-sm font-semibold text-slate-100">
          {label}
        </label>
        <span className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-semibold text-purple-200">
          {displayValue}
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-400">{helperText}</p>

      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_6.5rem]">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="w-full accent-purple-400"
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleNumberChange}
          aria-label={label}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-sm text-slate-100 outline-none transition focus:border-purple-400"
        />
      </div>
    </div>
  );
}

export default function ROIImpactEstimator() {
  const [teamSize, setTeamSize] = useState(22);
  const [hourlyCost, setHourlyCost] = useState(58);
  const [automatableHoursPerWeek, setAutomatableHoursPerWeek] = useState(6);
  const [automationCoverage, setAutomationCoverage] = useState(35);
  const [implementationInvestment, setImplementationInvestment] = useState(18000);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const metrics = useMemo(() => {
    const weeklyHoursSaved = teamSize * automatableHoursPerWeek * (automationCoverage / 100);
    const monthlyHoursSaved = weeklyHoursSaved * 4.33;
    const monthlySavings = monthlyHoursSaved * hourlyCost;
    const annualSavings = monthlySavings * 12;
    const netYearOneImpact = annualSavings - implementationInvestment;
    const paybackMonths =
      monthlySavings > 0 ? Math.max(implementationInvestment / monthlySavings, 0) : null;

    return {
      monthlyHoursSaved,
      monthlySavings,
      annualSavings,
      netYearOneImpact,
      paybackMonths,
    };
  }, [
    teamSize,
    automatableHoursPerWeek,
    automationCoverage,
    hourlyCost,
    implementationInvestment,
  ]);

  const roiPercent =
    implementationInvestment > 0
      ? ((metrics.annualSavings - implementationInvestment) / implementationInvestment) * 100
      : 0;

  const activePresetId = useMemo(() => {
    return (
      estimatorPresets.find(
        (preset) =>
          preset.teamSize === teamSize &&
          preset.hourlyCost === hourlyCost &&
          preset.automatableHoursPerWeek === automatableHoursPerWeek &&
          preset.automationCoverage === automationCoverage &&
          preset.implementationInvestment === implementationInvestment
      )?.id ?? null
    );
  }, [automationCoverage, automatableHoursPerWeek, hourlyCost, implementationInvestment, teamSize]);

  const snapshotSummary = useMemo(() => {
    const payback = metrics.paybackMonths ? `${metrics.paybackMonths.toFixed(1)} months` : 'N/A';
    return [
      'Zion AI ROI Snapshot',
      `Team size: ${numberFormatter.format(teamSize)}`,
      `Hourly cost: ${currencyFormatter.format(hourlyCost)}`,
      `Automatable hours/week: ${automatableHoursPerWeek}`,
      `Automation coverage: ${automationCoverage}%`,
      `Implementation investment: ${currencyFormatter.format(implementationInvestment)}`,
      `Monthly savings: ${currencyFormatter.format(metrics.monthlySavings)}`,
      `Annual savings: ${currencyFormatter.format(metrics.annualSavings)}`,
      `Estimated payback: ${payback}`,
      `Year-one ROI: ${roiPercent.toFixed(0)}%`,
    ].join('\n');
  }, [
    automationCoverage,
    automatableHoursPerWeek,
    hourlyCost,
    implementationInvestment,
    metrics.annualSavings,
    metrics.monthlySavings,
    metrics.paybackMonths,
    roiPercent,
    teamSize,
  ]);

  const contactHref = useMemo(() => {
    const paybackMonths = metrics.paybackMonths ? metrics.paybackMonths.toFixed(1) : 'n/a';
    const params = new URLSearchParams({
      estimator: 'roi-snapshot',
      teamSize: String(teamSize),
      hourlyCost: String(hourlyCost),
      automatableHoursPerWeek: String(automatableHoursPerWeek),
      automationCoverage: String(automationCoverage),
      implementationInvestment: String(implementationInvestment),
      monthlySavings: String(Math.round(metrics.monthlySavings)),
      annualSavings: String(Math.round(metrics.annualSavings)),
      paybackMonths,
      roi: roiPercent.toFixed(0),
    });

    return `/contact?${params.toString()}`;
  }, [
    automationCoverage,
    automatableHoursPerWeek,
    hourlyCost,
    implementationInvestment,
    metrics.annualSavings,
    metrics.monthlySavings,
    metrics.paybackMonths,
    roiPercent,
    teamSize,
  ]);

  const applyPreset = (preset: EstimatorPreset) => {
    setTeamSize(preset.teamSize);
    setHourlyCost(preset.hourlyCost);
    setAutomatableHoursPerWeek(preset.automatableHoursPerWeek);
    setAutomationCoverage(preset.automationCoverage);
    setImplementationInvestment(preset.implementationInvestment);
    setCopyStatus('idle');
  };

  const copySnapshot = async () => {
    try {
      if (!navigator?.clipboard?.writeText) {
        throw new Error('Clipboard API unavailable');
      }

      await navigator.clipboard.writeText(snapshotSummary);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('error');
    }

    window.setTimeout(() => {
      setCopyStatus('idle');
    }, 2200);
  };

  return (
    <div className="rounded-3xl border border-purple-400/30 bg-slate-900/70 p-6 shadow-xl shadow-purple-900/15">
      <h3 className="text-xl font-semibold text-white">AI ROI Snapshot</h3>
      <p className="mt-2 text-sm text-slate-300">
        Adjust the assumptions to model potential savings from your first automation rollout.
      </p>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-purple-200">
          Quick scenarios
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {estimatorPresets.map((preset) => {
            const isActive = preset.id === activePresetId;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? 'border-purple-300/80 bg-purple-500/20 text-purple-100'
                    : 'border-slate-700 bg-slate-950/70 text-slate-300 hover:border-purple-400/60 hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <SliderField
          id="roi-team-size"
          label="Team members in the workflow"
          helperText="How many people are involved in this process today."
          min={3}
          max={400}
          step={1}
          value={teamSize}
          displayValue={numberFormatter.format(teamSize)}
          onChange={setTeamSize}
        />
        <SliderField
          id="roi-hourly-cost"
          label="Average blended hourly cost"
          helperText="Include salary, tools, and overhead."
          min={20}
          max={250}
          step={1}
          value={hourlyCost}
          displayValue={currencyFormatter.format(hourlyCost)}
          onChange={setHourlyCost}
        />
        <SliderField
          id="roi-automatable-hours"
          label="Hours/week per person that can be automated"
          helperText="Estimate repetitive or manual work that AI can reduce."
          min={1}
          max={24}
          step={1}
          value={automatableHoursPerWeek}
          displayValue={`${automatableHoursPerWeek} hrs`}
          onChange={setAutomatableHoursPerWeek}
        />
        <SliderField
          id="roi-coverage"
          label="Expected automation coverage"
          helperText="Percent of repetitive work your first release can capture."
          min={10}
          max={90}
          step={1}
          value={automationCoverage}
          displayValue={`${automationCoverage}%`}
          onChange={setAutomationCoverage}
        />
        <SliderField
          id="roi-investment"
          label="Estimated implementation investment"
          helperText="Pilot build, integration, and rollout enablement."
          min={3000}
          max={200000}
          step={500}
          value={implementationInvestment}
          displayValue={currencyFormatter.format(implementationInvestment)}
          onChange={setImplementationInvestment}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Monthly hours saved</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {numberFormatter.format(metrics.monthlyHoursSaved)} hrs
          </p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Monthly savings</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {currencyFormatter.format(metrics.monthlySavings)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Annual savings</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {currencyFormatter.format(metrics.annualSavings)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Year-one net impact</p>
          <p
            className={`mt-1 text-2xl font-bold ${
              metrics.netYearOneImpact >= 0 ? 'text-emerald-300' : 'text-rose-300'
            }`}
          >
            {currencyFormatter.format(metrics.netYearOneImpact)}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-purple-400/30 bg-purple-500/10 p-4">
        <p className="text-xs uppercase tracking-wide text-purple-200">Estimated payback window</p>
        <p className="mt-1 text-lg font-semibold text-white">
          {metrics.paybackMonths ? `${metrics.paybackMonths.toFixed(1)} months` : 'N/A'}
        </p>
        <p className="mt-1 text-xs text-purple-100/90">
          Approximate ROI after year one: {roiPercent.toFixed(0)}%
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-slate-700/80 bg-slate-950/70 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-300">Snapshot handoff</p>
        <p className="mt-2 text-xs leading-5 text-slate-300">
          {`Potential annual savings ${currencyFormatter.format(metrics.annualSavings)} with an estimated ${roiPercent.toFixed(0)}% year-one ROI.`}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copySnapshot}
            className="rounded-lg border border-slate-600 bg-slate-900/80 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-purple-400 hover:text-white"
          >
            {copyStatus === 'copied' ? 'Snapshot copied' : 'Copy snapshot'}
          </button>
          <a
            href={contactHref}
            className="rounded-lg border border-purple-400/40 bg-purple-500/10 px-3 py-2 text-xs font-semibold text-purple-100 transition hover:bg-purple-500/20"
          >
            Send this estimate to Zion
          </a>
        </div>
        {copyStatus === 'error' && (
          <p className="mt-2 text-xs text-rose-300">
            Clipboard access was unavailable. You can still use the contact handoff link.
          </p>
        )}
      </div>
    </div>
  );
}
