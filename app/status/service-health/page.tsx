// app/status/service-health/page.tsx — Live Service Health Monitor
import { allServices } from '@/data/servicesData';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Service Health',
  description: 'Live health status for individual Zion Tech Group services — response time, uptime, and incident history.',
  alternates: { canonical: '/status/service-health' },};


import { readFileSync } from 'fs';
import { join } from 'path';
import Link from 'next/link';

type HealthEntry = {
  last_status: number;
  last_duration: number;
  last_run_ts: number;
  consec_fails: number;
  first_fail_ts: number | null;
};

type HealthData = Record<string, HealthEntry>;

function loadHealth(): HealthData {
  try {
    const raw = readFileSync(join(process.cwd(), '..', '..', '..', 'data', 'service-health.json'), 'utf-8');
    return JSON.parse(raw);
  } catch { return {}; }
}

function ago(ts: number | null): string {
  if (!ts) return '—';
  const s = Math.floor(Date.now() / 1000 - ts);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

function fmtDur(v: number): string {
  if (v < 0) return '—';
  return `${v}s`;
}

export default function ServiceHealthPage() {
  const health = loadHealth();
  const entries = Object.entries(health);
  const total = entries.length;

  const ok   = entries.filter(([,v]) => v.last_status === 200).length;
  const slow = entries.filter(([,v]) => v.last_status === 200 && v.last_duration > 2).length;
  const down = entries.filter(([,v]) => v.last_status !== 200 && v.last_status !== 0).length;
  const err  = entries.filter(([,v]) => v.last_status === 0).length;
  const pct  = total > 0 ? Math.round(ok / total * 100) : 0;

  const rows = entries
    .sort(([,a],[,b]) => a.last_run_ts - b.last_run_ts)
    .map(([id,v]) => {
      const svc = allServices.find(s => s.id === id);
      const title = svc?.title ?? id;
      const badge = v.last_status === 200 ? '🟢' : v.last_status === 0 ? '⚫' : '🟡';
      const cls   = v.last_status === 200 ? 'text-green-400' : v.last_status === 0 ? 'text-red-400' : 'text-yellow-400';
      return { id, title, badge, code: v.last_status, dur: v.last_duration, consec: v.consec_fails, last: ago(v.last_run_ts), cls };
    });

  return (
    <main className="min-h-screen bg-slate-950 py-20 px-4">
      <div className="container-page max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Service Health Monitor</h1>
          <p className="section-subheading mb-2">
            Automated check of <b>{total.toLocaleString()}</b> services — sampled every 5 min via cron
          </p>
          <p className="text-slate-500 text-sm">
            Cron: <code className="text-purple-400">*/5 * * * * cd /root/.openclaw/workspace/zion.app &amp;&amp; python3 app/data/service_health_monitor.py</code>
          </p>
        </div>

        {/* Summary cards */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            ['🟢','OK',ok,'text-green-400'],
            ['🟡','Slow',slow,'text-yellow-400'],
            ['🔴','Down',down,'text-red-400'],
            ['⚫','Error',err,'text-slate-500'],
          ].map(([e,l,n,c]) => (
            <div key={l} className="bg-slate-900/60 border border-slate-700/50 rounded-xl px-6 py-4 text-center min-w-[110px]">
              <div className={`text-3xl ${c}`}>{e}</div>
              <div className="text-white text-2xl font-bold">{n}</div>
              <div className="text-slate-400 text-xs mt-1">{l}</div>
            </div>
          ))}
          <div className="bg-purple-900/40 border border-purple-500/30 rounded-xl px-6 py-4 text-center min-w-[110px]">
            <div className="text-3xl text-purple-300">{pct}%</div>
            <div className="text-white text-2xl font-bold">{total}</div>
            <div className="text-slate-400 text-xs mt-1">Sampled</div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-slate-900/40 border border-slate-700/50 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700/50">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">HTTP</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Fails</th>
                <th className="px-4 py-3">Last Checked</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({id,title,badge,code,dur,consec,last,cls}) => (
                <tr key={id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
                  <td className="px-4 py-2.5 text-slate-500 text-xs font-mono truncate max-w-[180px]">{id}</td>
                  <td className="px-4 py-2.5 text-slate-200 text-sm truncate max-w-[240px]">{title}</td>
                  <td className="px-4 py-2.5 text-lg">{badge}</td>
                  <td className={`px-4 py-2.5 text-sm font-mono ${cls}`}>{code}</td>
                  <td className="px-4 py-2.5 text-slate-400 text-sm">{fmtDur(dur)}</td>
                  <td className="px-4 py-2.5 text-slate-400 text-sm">{consec}</td>
                  <td className="px-4 py-2.5 text-slate-500 text-xs">{last}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-slate-600 text-xs mt-6 text-center">
          Live results • {total.toLocaleString()} entries • Status page build: {new Date().toISOString().slice(0,10)}
        </p>
      </div>
    </main>
  );
}
