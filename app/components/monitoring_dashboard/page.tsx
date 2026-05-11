import React from 'react';

export default function MonitoringDashboard() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-300">
            Internal automation
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">
            Automation Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            High-level view of background AI and automation jobs powering the Zion platform.
          </p>
        </div>
      </header>

      <section className="overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-950/70 shadow-xl shadow-black/20">
        <div className="border-b border-slate-800/80 px-6 py-4 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-white">AI Automation Status</h2>
              <p className="mt-1 text-xs text-slate-400">
                Example monitoring view for scheduled jobs and background workers.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
              ● All systems nominal
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
            <thead className="bg-slate-900/80">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium text-slate-300 sm:px-8">
                  Job name
                </th>
                <th scope="col" className="px-6 py-3 font-medium text-slate-300 sm:px-8">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 font-medium text-slate-300 sm:px-8">
                  Last run
                </th>
                <th scope="col" className="px-6 py-3 font-medium text-slate-300 sm:px-8">
                  Next run
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-950/60">
              <tr className="hover:bg-slate-900/60">
                <td className="px-6 py-4 text-slate-100 sm:px-8">GitHub Sync</td>
                <td className="px-6 py-4 text-slate-100 sm:px-8">
                  <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300">
                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Running
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-200 sm:px-8">2026-03-10 08:05</td>
                <td className="px-6 py-4 text-slate-200 sm:px-8">2026-03-10 09:05</td>
              </tr>
              <tr className="hover:bg-slate-900/60">
                <td className="px-6 py-4 text-slate-100 sm:px-8">Lead Discovery</td>
                <td className="px-6 py-4 text-slate-100 sm:px-8">
                  <span className="inline-flex items-center rounded-full bg-slate-700/40 px-2.5 py-1 text-xs font-medium text-slate-100">
                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-slate-400" />
                    Idle
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-200 sm:px-8">2026-03-10 07:30</td>
                <td className="px-6 py-4 text-slate-200 sm:px-8">2026-03-10 08:30</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 px-6 py-4 sm:px-8">
          <p className="text-xs text-slate-400">
            This dashboard is a static example used during static export to validate layout and
            design.
          </p>
          <button
            type="button"
            className="inline-flex items-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:from-purple-500 hover:to-pink-500"
          >
            View logs
          </button>
        </div>
      </section>
    </div>
  );
}
