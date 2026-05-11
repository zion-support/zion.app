import fs from 'fs';
import path from 'path';

type SummaryStatus = 'ok' | 'warning' | 'critical' | 'unknown';

type AggregateDashboard = {
  status?: SummaryStatus;
  lastUpdated?: string;
  sections?: {
    id: string;
    title: string;
    status: SummaryStatus;
    score?: number;
  }[];
};

function loadAggregateDashboard(): AggregateDashboard | null {
  try {
    const filePath = path.join(process.cwd(), 'automation', 'reports', 'aggregate-dashboard.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw) as AggregateDashboard;
  } catch {
    return null;
  }
}

export const metadata = {
  title: 'Automation Status | Zion Tech Group',
  description:
    'Internal view of AI automation health for Zion Tech Group, including app quality, content freshness, and deployment readiness.',
};

export default function AutomationStatusPage() {
  const aggregate = loadAggregateDashboard();

  const overallStatus: SummaryStatus = aggregate?.status ?? 'unknown';
  const lastUpdated = aggregate?.lastUpdated;
  const sections = aggregate?.sections ?? [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container-page pb-16 pt-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Internal Automation View
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Automation Status</h1>
          <p className="mt-3 text-slate-300">
            Snapshot of AI-driven app improvement systems, based on the latest aggregated reports
            from Lighthouse, accessibility checks, content freshness, site health, and automation
            audits.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-5">
            <p className="text-sm font-medium text-slate-300">Overall Status</p>
            <p className="mt-2 text-2xl font-semibold text-white capitalize">{overallStatus}</p>
            {lastUpdated && (
              <p className="mt-2 text-xs text-slate-400">Last updated {lastUpdated}</p>
            )}
          </div>
          <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-5">
            <p className="text-sm font-medium text-slate-300">Tracked Sections</p>
            <p className="mt-2 text-2xl font-semibold text-white">{sections.length}</p>
            <p className="mt-2 text-xs text-slate-400">
              Includes app quality, automation health, content freshness, and more.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-5">
            <p className="text-sm font-medium text-slate-300">Source</p>
            <p className="mt-2 text-sm text-slate-100">automation/reports/aggregate-dashboard.json</p>
            <p className="mt-2 text-xs text-slate-400">
              Updated by the AI Report Aggregator agent.
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className="flex items-center justify-between rounded-xl border border-slate-700/70 bg-slate-900/70 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-slate-100">{section.title}</p>
                <p className="mt-1 text-xs text-slate-400 capitalize">
                  Status: {section.status ?? 'unknown'}
                </p>
              </div>
              {typeof section.score === 'number' && (
                <div className="text-right">
                  <p className="text-lg font-semibold text-white">{section.score}</p>
                  <p className="text-xs text-slate-400">Score</p>
                </div>
              )}
            </div>
          ))}

          {sections.length === 0 && (
            <p className="text-sm text-slate-400">
              No aggregate dashboard report found yet. Run{' '}
              <code className="rounded bg-slate-800 px-1.5 py-0.5 text-xs">
                npm run reports:aggregate
              </code>{' '}
              or wait for the scheduled automation to generate one.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

