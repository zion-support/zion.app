import fs from 'fs';
import path from 'path';
import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';

type ReadinessCheck = {
  name: string;
  ok: boolean;
};

type ReadinessDetails = {
  uxScore?: number;
  automationIssues?: number;
  brokenLinks?: number;
};

type ReadinessReport = {
  timestamp: string;
  ready: boolean;
  checks: ReadinessCheck[];
  failedChecks?: ReadinessCheck[];
  details?: ReadinessDetails;
};

function loadReadinessReport(): ReadinessReport | null {
  try {
    const reportPath = path.join(
      process.cwd(),
      'automation',
      'reports',
      'deployment-readiness-latest.json',
    );
    const raw = fs.readFileSync(reportPath, 'utf8');
    return JSON.parse(raw) as ReadinessReport;
  } catch {
    return null;
  }
}

export const metadata = {
  title: 'Deployment Readiness Console – Zion AI Lab',
  description:
    'Inspect the latest automation, UX, and link-health checks that gate autonomous deploys for ziontechgroup.com.',
};

export default function DeploymentReadinessConsolePage() {
  const report = loadReadinessReport();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <section className="mx-auto max-w-5xl px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-16 lg:pt-16">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-sky-400">
              Autonomous Platform · Deploy Gate
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl">
              Deployment Readiness Console
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              This view summarizes the latest checks run by the automation deployment readiness
              agent before autonomous cycles are allowed to run full improvement pipelines and
              trigger production deploys.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 text-xs text-slate-300 sm:items-end">
            <a
              href="/ai-lab"
              className="inline-flex items-center rounded-full border border-slate-600 bg-slate-900/80 px-3 py-1.5 text-[11px] font-semibold text-slate-100 transition hover:border-sky-400 hover:text-white"
            >
              ← Back to Zion AI Lab
            </a>
            <p className="text-[11px] text-slate-400">
              Data sourced from{' '}
              <code className="rounded bg-slate-900/80 px-1.5 py-0.5 text-[10px] text-slate-200">
                automation/reports/deployment-readiness-latest.json
              </code>
              .
            </p>
          </div>
        </header>

        {!report ? (
          <div className="rounded-2xl border border-slate-700/70 bg-slate-950/80 p-6 text-sm text-slate-200">
            <p className="font-semibold text-slate-100">No readiness report found yet.</p>
            <p className="mt-2 text-slate-300">
              Run{' '}
              <code className="rounded bg-slate-900/80 px-1.5 py-0.5 text-[11px] text-slate-100">
                npm run deploy:readiness
              </code>{' '}
              or one of the autonomy cycles to generate the first report.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/80 p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                    Current readiness state
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-50">
                    {report.ready ? 'Ready to deploy' : 'Blocked – needs attention'}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Last run at{' '}
                    <span className="font-mono">
                      {new Date(report.timestamp).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                    .
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1.5 font-semibold ${
                      report.ready
                        ? 'border border-emerald-500/60 bg-emerald-500/10 text-emerald-100'
                        : 'border border-amber-400/70 bg-amber-500/10 text-amber-100'
                    }`}
                  >
                    {report.ready ? 'Green light' : 'Blocked by readiness gate'}
                  </span>
                  {typeof report.details?.uxScore === 'number' ? (
                    <span className="inline-flex items-center rounded-full border border-slate-600 bg-slate-900/80 px-3 py-1.5 font-semibold text-slate-200">
                      UX score: {report.details.uxScore}/100
                    </span>
                  ) : null}
                  {typeof report.details?.automationIssues === 'number' ? (
                    <span className="inline-flex items-center rounded-full border border-slate-600 bg-slate-900/80 px-3 py-1.5 font-semibold text-slate-200">
                      Automation issues: {report.details.automationIssues}
                    </span>
                  ) : null}
                  {typeof report.details?.brokenLinks === 'number' ? (
                    <span className="inline-flex items-center rounded-full border border-slate-600 bg-slate-900/80 px-3 py-1.5 font-semibold text-slate-200">
                      Broken links: {report.details.brokenLinks}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-700/70 bg-slate-950/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                  Individual checks
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Each run validates automation health, UX heuristics, and live-site link integrity
                  before allowing autonomous deploys to proceed.
                </p>
                <ul className="mt-3 space-y-2 text-xs">
                  {report.checks.map((check) => (
                    <li
                      key={check.name}
                      className="flex items-center justify-between rounded-xl border border-slate-700/80 bg-slate-950/80 px-3 py-2"
                    >
                      <span className="font-medium text-slate-100">{check.name}</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          check.ok
                            ? 'border border-emerald-500/60 bg-emerald-500/10 text-emerald-100'
                            : 'border border-amber-400/70 bg-amber-500/10 text-amber-100'
                        }`}
                      >
                        {check.ok ? 'pass' : 'fail'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-700/70 bg-slate-950/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                  Suggested next actions
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Use these next steps when readiness is blocked but you still want autonomous
                  improvements to continue in a safe way.
                </p>
                <ul className="mt-3 space-y-2 text-xs text-slate-200">
                  <li className="rounded-xl border border-slate-700/80 bg-slate-950/80 px-3 py-2">
                    <span className="font-semibold text-slate-100">1. Inspect automation audit</span>
                    <p className="mt-1 text-[11px] text-slate-300">
                      Run{' '}
                      <code className="rounded bg-slate-900/80 px-1.5 py-0.5 text-[10px]">
                        npm run automation:audit-summary
                      </code>{' '}
                      to see which workflow or agent is currently degraded.
                    </p>
                  </li>
                  <li className="rounded-xl border border-slate-700/80 bg-slate-950/80 px-3 py-2">
                    <span className="font-semibold text-slate-100">
                      2. Apply safe self-healing fixes
                    </span>
                    <p className="mt-1 text-[11px] text-slate-300">
                      Use{' '}
                      <code className="rounded bg-slate-900/80 px-1.5 py-0.5 text-[10px]">
                        npm run automation:self-heal
                      </code>{' '}
                      for low-risk fixes (missing log dirs, etc), then re-run the readiness check.
                    </p>
                  </li>
                  <li className="rounded-xl border border-slate-700/80 bg-slate-950/80 px-3 py-2">
                    <span className="font-semibold text-slate-100">
                      3. Promote a fresh autonomy cycle
                    </span>
                    <p className="mt-1 text-[11px] text-slate-300">
                      Once readiness is green, trigger{' '}
                      <code className="rounded bg-slate-900/80 px-1.5 py-0.5 text-[10px]">
                        npm run app:autonomy-quick-cycle
                      </code>{' '}
                      or{' '}
                      <code className="rounded bg-slate-900/80 px-1.5 py-0.5 text-[10px]">
                        npm run app:autonomy-full-cycle
                      </code>{' '}
                      to let agents improve and deploy.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

