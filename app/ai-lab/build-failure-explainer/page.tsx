'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type FailureClass = 'missing-dep' | 'type-error' | 'route-export' | 'env-misconfig' | 'unknown';

function classifyBuildLog(log: string): FailureClass {
  const text = log.toLowerCase();
  if (text.includes('cannot find module') || text.includes('module not found')) return 'missing-dep';
  if (text.includes('type error') || text.includes('ts') || text.includes('typescript')) return 'type-error';
  if (text.includes('next export') || text.includes('route') || text.includes('app router')) return 'route-export';
  if (text.includes('env') || text.includes('undefined') || text.includes('missing required')) return 'env-misconfig';
  return 'unknown';
}

function runbook(type: FailureClass) {
  if (type === 'missing-dep') {
    return [
      'Run npm ci to install dependencies exactly from lockfile.',
      'Check package.json and import path spelling/casing.',
      'Confirm file exists and path aliases are valid in tsconfig.json.',
      'Re-run npm run type-check and npm run build.',
    ];
  }
  if (type === 'type-error') {
    return [
      'Run npm run type-check and open first failing file.',
      'Fix strict type mismatch first; avoid any-casting as a quick patch.',
      'Re-check shared types and exported interfaces used by pages/components.',
      'Re-run npm run type-check and npm run build.',
    ];
  }
  if (type === 'route-export') {
    return [
      'Verify each route has a valid app router page.tsx default export.',
      'Check dynamic route params and generateStaticParams usage for static export.',
      'Run npm run lint:check to catch invalid route-level imports.',
      'Re-run npm run build --webpack and validate problematic route directly.',
    ];
  }
  if (type === 'env-misconfig') {
    return [
      'Inspect the failing symbol and confirm env var is defined where required.',
      'Avoid leaking secrets into client bundles; keep sensitive keys server-side only.',
      'Add guarded fallbacks for optional vars and clear error for required vars.',
      'Re-run npm run type-check and npm run build.',
    ];
  }
  return [
    'Extract the first concrete stack trace line and isolate the earliest root cause.',
    'Run npm run lint:check, npm run type-check, and npm run build for reproducibility.',
    'Check recent commits touching the failing area and diff for regressions.',
    'Apply smallest safe fix, then verify full build and route health checks.',
  ];
}

export default function BuildFailureExplainerPage() {
  const [buildLog, setBuildLog] = useState('');

  const classification = useMemo(() => classifyBuildLog(buildLog), [buildLog]);
  const steps = useMemo(() => runbook(classification), [classification]);

  return (
    <main className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">AI Lab - DevOps Intelligence</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">AI Build Failure Explainer</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300 sm:text-base">
          Paste a build error and get a deterministic root-cause class plus a practical recovery runbook.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr,1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <label className="block text-xs text-slate-300">
              Build log snippet
              <textarea
                value={buildLog}
                onChange={(e) => setBuildLog(e.target.value)}
                placeholder="Paste build output here..."
                className="mt-2 h-72 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-xs text-slate-100"
              />
            </label>
          </div>

          <div className="rounded-2xl border border-cyan-500/40 bg-cyan-500/10 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-cyan-300">Classification</p>
            <h2 className="mt-1 text-xl font-bold text-cyan-50">{classification.replace('-', ' ')}</h2>
            <ul className="mt-4 space-y-2 text-xs text-slate-100">
              {steps.map((step) => (
                <li key={step} className="rounded-lg border border-slate-700/80 bg-slate-950/70 px-3 py-2">
                  {step}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              <a href="/ai-lab/deployment-readiness-console" className="rounded-full border border-cyan-300/70 bg-cyan-400/20 px-3 py-1.5 font-semibold text-cyan-50">
                Open deployment readiness
              </a>
              <a href="/ai-lab" className="rounded-full border border-slate-600 bg-slate-900/80 px-3 py-1.5 font-semibold text-slate-200">
                Back to AI Lab
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
