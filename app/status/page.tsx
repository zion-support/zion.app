'use client';

import { useEffect, useState, useCallback } from 'react';

import { allServices } from '@/data/servicesData';

type CheckStatus = 'checking' | 'operational' | 'degraded' | 'outage' | 'unknown';

interface CheckResult {
  label: string;
  path: string;
  status: CheckStatus;
  statusCode?: number;
  responseTime?: number; // ms
  lastChecked: Date;
}

const statusLabel: Record<CheckStatus, string> = {
  checking:  'Checking…',
  operational: 'Operational',
  degraded:  'Degraded',
  outage:    'Outage',
  unknown:   'Unknown',
};

const badgeColor: Record<CheckStatus, string> = {
  checking:  'bg-sky-500/20 ring-sky-500/30 text-sky-400',
  operational: 'bg-green-500/20 ring-green-500/30 text-green-400',
  degraded:  'bg-yellow-500/20 ring-yellow-500/30 text-yellow-400',
  outage:    'bg-red-500/20 ring-red-500/30 text-red-400',
  unknown:   'bg-slate-500/20 ring-slate-500/30 text-slate-400',
};

const dotColor: Record<CheckStatus, string> = {
  checking:  'bg-sky-400',
  operational: 'bg-green-400',
  degraded:  'bg-yellow-400',
  outage:    'bg-red-400 animate-pulse',
  unknown:   'bg-slate-400',
};

function probeUrl(path: string): Promise<CheckResult> {
  const start = performance.now();
  const label = (() => {
    const map: Record<string, string> = {
      '/': 'Homepage',
      '/services/': 'Services Catalog',
      '/pricing-calculator/': 'Pricing Calculator',
      '/proposal-generator/': 'Proposal Generator',
      '/configurator/': 'Configurator',
      '/contact/': 'Contact Page',
    };
    return map[path] || path;
  })();

  return new Promise((resolve) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
      const elapsed = Math.round(performance.now() - start);
      resolve({
        label, path, status: 'outage', responseTime: elapsed,
        lastChecked: new Date(),
      });
    }, 6000);

    fetch(path, { signal: controller.signal, cache: 'no-store' })
      .then(async (res) => {
        clearTimeout(timeout);
        const elapsed = Math.round(performance.now() - start);
        const code = res.status;
        let status: CheckStatus = 'operational';
        if (code >= 300 && code < 400) status = 'degraded';
        else if (code >= 400) status = 'outage';
        resolve({ label, path, status, statusCode: code, responseTime: elapsed, lastChecked: new Date() });
      })
      .catch((err) => {
        clearTimeout(timeout);
        const elapsed = Math.round(performance.now() - start);
        if (err instanceof DOMException && err.name === 'AbortError') {
          resolve({ label, path, status: 'outage', responseTime: elapsed, lastChecked: new Date() });
        } else {
          resolve({ label, path, status: 'unknown', responseTime: elapsed, lastChecked: new Date() });
        }
      });
  });
}

export default function StatusPage() {
  const [checks, setChecks] = useState<CheckResult[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [overall, setOverall] = useState<CheckStatus>('checking');

  const paths = [
    '/',
    '/services/',
    '/pricing-calculator/',
    '/proposal-generator/',
    '/configurator/',
    '/contact/',
  ];

  const runChecks = useCallback(async () => {
    const results = await Promise.all(paths.map((p) => probeUrl(p)));
    setChecks(results);
    setLastRefresh(new Date());

    const degraded = results.some((r) => r.status === 'degraded' || r.status === 'unknown');
    const outage   = results.some((r) => r.status === 'outage');
    if (outage)   setOverall('outage');
    else if (degraded) setOverall('degraded');
    else          setOverall('operational');
  }, []);

  useEffect(() => {
    runChecks();
    const interval = setInterval(runChecks, 60_000);
    return () => clearInterval(interval);
  }, [runChecks]);

  const totalSvcs = allServices.length;
  const avgRt = checks.length > 0
    ? Math.round(
        checks
          .filter((c) => c.responseTime != null)
          .reduce((a, b) => a + (b.responseTime ?? 0), 0) /
        Math.max(1, checks.filter((c) => c.responseTime != null).length),
      )
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 py-20">
      <div className="container-page max-w-3xl">
        <h1 className="text-4xl font-bold text-white mb-2">System Status</h1>
        <p className="text-slate-400 mb-10">Live health summary — refreshed every 60 seconds via client-side probes</p>

        {/* Overall status card */}
        <div className="glass-card mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`h-5 w-5 rounded-full ${dotColor[overall]} ${overall === 'checking' ? 'animate-pulse' : ''}`} />
              <div>
                <p className="text-slate-400 text-sm">
                  {overall === 'operational' ? 'All systems operational' :
                   overall === 'degraded'   ? 'Some systems degraded' :
                   overall === 'outage'     ? 'Systems experiencing outage' :
                   'Checking system status…'}
                </p>
                <p className="text-white text-2xl font-bold mt-1">{statusLabel[overall]}</p>
              </div>
            </div>
            <div className="flex gap-6 sm:gap-10">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{avgRt > 0 ? `${avgRt}ms` : '—'}</p>
                <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">Avg Response</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{totalSvcs}+</p>
                <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">Services Active</p>
              </div>
              {lastRefresh && (
                <div className="text-center">
                  <p className="text-xs text-slate-500">
                    {lastRefresh.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </p>
                  <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">Last Checked</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Checks table */}
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left text-slate-400 font-medium pb-4 pr-4">Service / Page</th>
                <th className="text-left text-slate-400 font-medium pb-4 pr-4">Status</th>
                <th className="text-right text-slate-400 font-medium pb-4">Response</th>
              </tr>
            </thead>
            <tbody>
              {checks.map((c) => (
                <tr key={c.path} className="border-b border-slate-800/50 last:border-0">
                  <td className="py-4">
                    <a href={c.path} className="text-purple-300 hover:text-purple-200 font-medium transition">
                      {c.label}
                    </a>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 ${badgeColor[c.status]}`}>
                      <span className={`h-2 w-2 rounded-full ${dotColor[c.status]}`} />
                      {statusLabel[c.status]}
                    </span>
                  </td>
                  <td className="py-4 text-right text-slate-500">
                    {c.responseTime != null ? `${c.responseTime}ms` : '—'}
                    {c.statusCode != null && (
                      <span className="ml-2 text-slate-600">({c.statusCode})</span>
                    )}
                  </td>
                </tr>
              ))}
              {checks.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-500">
                    Running health checks…
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-6 justify-center text-xs text-slate-500 mt-6">
          {Object.entries(statusLabel).filter(([k]) => k !== 'checking').map(([k, v]) => (
            <span key={k} className="inline-flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${dotColor[k as CheckStatus]}`} />
              {v}
            </span>
          ))}
        </div>

        <p className="text-center text-slate-500 text-sm mt-10">
          Probes run in-browser on every page visit and auto-refresh every 60 seconds.{' '}
          Results reflect the last client-side fetch — not an external monitor.{' '}
          For immediate assistance contact{' '}
          <a href="mailto:kleber@ziontechgroup.com" className="text-purple-400 hover:text-purple-300">
            kleber@ziontechgroup.com
          </a>{' '}
          or call{' '}
          <a href="tel:+13024640950" className="text-purple-400 hover:text-purple-300">
            +1 302 464 0950
          </a>.
        </p>
      </div>
    </div>
  );
}
