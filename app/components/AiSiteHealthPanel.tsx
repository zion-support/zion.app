import Link from 'next/link';
import { latestSiteEvolutionSnapshot } from '../ai-lab/ai-site-evolution-data';

type SiteHealthReport = {
  timestamp: string;
  uptime: number;
  pages?: {
    total?: number;
    ok?: number;
    failed?: number;
    avgResponseTime?: number;
  };
};

let siteHealthReport: SiteHealthReport | null = null;

try {
   
  const healthJson = require('../../automation/reports/site-health-report.json') as SiteHealthReport;
  siteHealthReport = healthJson;
} catch {
  siteHealthReport = null;
}

const snapshot = latestSiteEvolutionSnapshot;

export default function AiSiteHealthPanel() {
  const healthSummary = snapshot.healthBreakdown.slice(0, 3);
  const topRecommendation = snapshot.topRecommendations[0];

  const uptime = siteHealthReport?.uptime ?? null;
  const pagesOk = siteHealthReport?.pages?.ok ?? null;
  const pagesTotal = siteHealthReport?.pages?.total ?? null;
  const avgResponseTime = siteHealthReport?.pages?.avgResponseTime ?? null;

  return (
    <section
      className="mt-10 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/25 via-slate-950/80 to-slate-950/90 p-6 sm:p-7 ring-1 ring-emerald-500/15"
      aria-labelledby="ai-site-health-heading"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
            AI Health & Evolution
          </p>
          <h2 id="ai-site-health-heading" className="mt-2 text-lg font-bold text-white sm:text-xl">
            Live snapshot of how AI keeps this site healthy
          </h2>
          <p className="mt-2 text-sm text-slate-200">
            Autonomous agents continuously audit performance, accessibility, SEO, content, navigation, and architecture
            across <span className="font-mono text-slate-100">ziontechgroup.com</span>. Below is a summarized view of
            the latest checks and where they&apos;re focusing next.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-200">
            <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-100">
              Overall health: {snapshot.overallHealthScore}/100
            </span>
            {uptime != null ? (
              <span className="inline-flex items-center rounded-full border border-slate-500/50 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-200">
                Uptime (recent window): {uptime.toFixed(1)}%
              </span>
            ) : null}
            {pagesOk != null && pagesTotal != null ? (
              <span className="inline-flex items-center rounded-full border border-slate-500/50 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-200">
                Monitored routes: {pagesOk}/{pagesTotal} healthy
              </span>
            ) : null}
            {avgResponseTime != null ? (
              <span className="inline-flex items-center rounded-full border border-slate-500/50 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-200">
                Avg response time: {avgResponseTime} ms
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-2 flex flex-1 flex-col gap-3 text-xs text-slate-200 lg:mt-0 lg:max-w-sm">
          <div className="rounded-xl border border-slate-700/80 bg-slate-950/80 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
              Current focus areas
            </p>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {healthSummary.map((item) => (
                <div
                  key={item.category}
                  className="rounded-lg border border-slate-700/70 bg-slate-950/80 px-3 py-2.5"
                >
                  <p className="text-[11px] font-semibold capitalize text-slate-100">{item.category}</p>
                  <p className="mt-0.5 text-sm font-bold text-emerald-300">{item.score}</p>
                  <p className="mt-0.5 text-[10px] text-slate-300">{item.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {topRecommendation ? (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-200">
                Top AI recommendation
              </p>
              <p className="mt-1 text-xs font-semibold text-emerald-50">{topRecommendation.title}</p>
              <p className="mt-1 text-[11px] leading-5 text-emerald-50/90">{topRecommendation.description}</p>
              <p className="mt-1 text-[10px] text-emerald-200/90">
                Area: <span className="capitalize">{topRecommendation.area}</span> · Suggested by{' '}
                {topRecommendation.suggestedBy}
              </p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <a
              href="/ai-lab/ai-site-evolution-advisor"
              className="inline-flex items-center rounded-full border border-emerald-400/60 bg-emerald-500/15 px-3 py-1.5 text-[11px] font-semibold text-emerald-50 transition hover:bg-emerald-500/25"
            >
              Open AI Site Evolution Advisor →
            </a>
            <a
              href="/automation"
              className="inline-flex items-center rounded-full border border-slate-600/80 bg-slate-900/80 px-3 py-1.5 text-[11px] font-semibold text-slate-100 transition hover:border-emerald-300/70 hover:text-white"
            >
              See automation services
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

