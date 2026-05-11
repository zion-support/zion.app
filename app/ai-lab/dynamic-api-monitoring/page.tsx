/* eslint-disable */
import Metadata from 'next';
import Link from 'next/link';
import { AILabToolLayout } from '../../components/ai-lab/AILabToolLayout';

export const metadata = {
  title: 'Dynamic API Monitoring',
  description:
    'Real-time performance tracking across QA/staging/prod environments with automated alerting and optimization suggestions.',
};

export default function DynamicAPIMonitoringPage() {
  return (
    <div className="bg-slate-950/90">
      <AILabToolLayout
        title="Dynamic API Monitoring"
        subtitle="Real-time performance tracking across QA/staging/prod environments with automated alerting and optimization suggestions."
      >
        <div className="space-y-8">
          <section className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                API Health Score
              </p>
              <p className="mt-3 text-4xl font-bold text-emerald-300">
                98.7
                <span className="ml-1 text-base font-semibold text-slate-400">/ 100</span>
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Aggregated signal from latency, error rates, throughput, and availability across all monitored endpoints.
              </p>
              <p className="mt-3 text-[11px] text-slate-500">
                Last updated:{' '}
                <time dateTime={new Date().toISOString()}>
                  {new Date().toLocaleString()}
                </time>
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5 md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                Environment Health
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <p className="text-xs font-semibold text-slate-400">Production</p>
                  <p className="mt-2 text-3xl font-bold text-emerald-300">99.2%</p>
                  <p className="text-xs text-slate-500">• 12.4ms avg latency<br/>• 0.3% error rate</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <p className="text-xs font-semibold text-slate-400">Staging</p>
                  <p className="mt-2 text-3xl font-bold text-blue-300">97.8%</p>
                  <p className="text-xs text-slate-500">• 8.9ms avg latency<br/>• 0.8% error rate</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <p className="text-xs font-semibold text-slate-400">QA</p>
                  <p className="mt-2 text-3xl font-bold text-purple-300">96.5%</p>
                  <p className="text-xs text-slate-500">• 15.2ms avg latency<br/>• 1.2% error rate</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <p className="text-xs font-semibold text-slate-400">Development</p>
                  <p className="mt-2 text-3xl font-bold text-indigo-300">94.1%</p>
                  <p className="text-xs text-slate-500">• 22.8ms avg latency<br/>• 2.1% error rate</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <p className="text-xs font-semibold text-slate-400">Edge</p>
                  <p className="mt-2 text-3xl font-bold text-teal-300">98.9%</p>
                  <p className="text-xs text-slate-500">• 32.1ms avg latency<br/>• 0.5% error rate</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <p className="text-xs font-semibold text-slate-400">Mobile API</p>
                  <p className="mt-2 text-3xl font-bold text-pink-300">95.7%</p>
                  <p className="text-xs text-slate-500">• 18.9ms avg latency<br/>• 1.4% error rate</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
              Active Alerts & Incidents
            </p>
            <div className="mt-3 space-y-2">
              <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-700 bg-slate-900/50">
                <div className="flex-shrink-0 h-3 w-3 bg-emerald-400 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-slate-100">All systems nominal</p>
                  <p className="text-xs text-slate-400">No active incidents • Last resolved: 2h ago</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
              Performance Trends (24h)
            </p>
            <div className="mt-4 h-32 bg-slate-900/50 rounded-xl">
              {/* Chart would go here - simplified representation */}
              <div className="flex items-center justify-center h-full text-slate-400">
                Latency & Error Rate Trends
              </div>
            </div>
            <div className="mt-3 flex justify-between text-xs text-slate-500">
              <span>Latency: ▼ 12% improvement</span>
              <span>Error Rate: ▼ 34% improvement</span>
              <span>Throughput: ▲ 18% increase</span>
            </div>
          </section>

          <section className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
              Optimization Suggestions
            </p>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-900/50 p-4">
                <div className="h-3 w-3 flex-shrink-0 rounded-full bg-blue-400"></div>
                <div>
                  <p className="text-sm font-medium text-slate-100">Enable API caching for /analytics endpoints</p>
                  <p className="text-xs text-slate-400">Estimated 40% latency reduction • Priority: High</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-900/50 p-4">
                <div className="h-3 w-3 flex-shrink-0 rounded-full bg-purple-400"></div>
                <div>
                  <p className="text-sm font-medium text-slate-100">Implement circuit breaker for payment service</p>
                  <p className="text-xs text-slate-400">Prevent cascade failures • Priority: Medium</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-900/50 p-4">
                <div className="h-3 w-3 flex-shrink-0 rounded-full bg-indigo-400"></div>
                <div>
                  <p className="text-sm font-medium text-slate-100">Add request/response logging for debug tracing</p>
                  <p className="text-xs text-slate-400">Improve observability • Priority: Low</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                  Monitoring Coverage
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  142 endpoints across 8 microservices • 99.9% uptime SLA
                </p>
              </div>
              <a
                href="/api-docs"
                className="rounded-lg border border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-100"
              >
                View API Documentation
              </a>
            </div>
          </section>
        </div>
      </AILabToolLayout>
    </div>
  );
}