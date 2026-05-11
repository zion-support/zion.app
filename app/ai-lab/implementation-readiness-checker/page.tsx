'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

function band(score: number): 'Ready' | 'Conditionally ready' | 'Not ready' {
  if (score >= 75) return 'Ready';
  if (score >= 55) return 'Conditionally ready';
  return 'Not ready';
}

export default function ImplementationReadinessCheckerPage() {
  const [dataReadiness, setDataReadiness] = useState(65);
  const [integrationReadiness, setIntegrationReadiness] = useState(60);
  const [teamReadiness, setTeamReadiness] = useState(70);
  const [governanceReadiness, setGovernanceReadiness] = useState(55);

  const score = useMemo(() => {
    return Math.round(
      dataReadiness * 0.3 + integrationReadiness * 0.25 + teamReadiness * 0.25 + governanceReadiness * 0.2,
    );
  }, [dataReadiness, integrationReadiness, teamReadiness, governanceReadiness]);

  const readinessBand = band(score);

  return (
    <main className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">AI Lab - Rollout Readiness</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">AI Implementation Readiness Checker</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300 sm:text-base">
          Score your readiness across data, integrations, team enablement, and governance before committing to a major AI rollout.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr,1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 text-xs">
            <label className="block">
              <span className="mb-1 block text-slate-300">Data quality and access: {dataReadiness}</span>
              <input type="range" min={0} max={100} value={dataReadiness} onChange={(e) => setDataReadiness(Number(e.target.value))} className="w-full accent-cyan-400" />
            </label>
            <label className="block">
              <span className="mb-1 block text-slate-300">Integration maturity: {integrationReadiness}</span>
              <input type="range" min={0} max={100} value={integrationReadiness} onChange={(e) => setIntegrationReadiness(Number(e.target.value))} className="w-full accent-cyan-400" />
            </label>
            <label className="block">
              <span className="mb-1 block text-slate-300">Team capability and ownership: {teamReadiness}</span>
              <input type="range" min={0} max={100} value={teamReadiness} onChange={(e) => setTeamReadiness(Number(e.target.value))} className="w-full accent-cyan-400" />
            </label>
            <label className="block">
              <span className="mb-1 block text-slate-300">Governance and risk controls: {governanceReadiness}</span>
              <input type="range" min={0} max={100} value={governanceReadiness} onChange={(e) => setGovernanceReadiness(Number(e.target.value))} className="w-full accent-cyan-400" />
            </label>
          </div>

          <div className="rounded-2xl border border-cyan-500/40 bg-cyan-500/10 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-cyan-300">Readiness result</p>
            <h2 className="mt-1 text-3xl font-bold text-cyan-50">{score}/100</h2>
            <p className="mt-2 text-sm text-slate-100">Status: <span className="font-semibold">{readinessBand}</span></p>

            <ul className="mt-4 space-y-2 text-xs text-slate-100">
              <li className="rounded-lg border border-slate-700/80 bg-slate-950/70 px-3 py-2">Prioritize one high-value workflow with measurable baseline metrics.</li>
              <li className="rounded-lg border border-slate-700/80 bg-slate-950/70 px-3 py-2">Define ownership for model quality, operations, and incident response.</li>
              <li className="rounded-lg border border-slate-700/80 bg-slate-950/70 px-3 py-2">Gate production rollout on readiness + governance checks.</li>
            </ul>

            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              <a href="/ai-lab/rollout-blueprint" className="rounded-full border border-cyan-300/70 bg-cyan-400/20 px-3 py-1.5 font-semibold text-cyan-50">
                Generate rollout blueprint
              </a>
              <a href="/ai-lab/ai-governance-risk-advisor" className="rounded-full border border-amber-300/70 bg-amber-400/15 px-3 py-1.5 font-semibold text-amber-50">
                Review governance risk
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
