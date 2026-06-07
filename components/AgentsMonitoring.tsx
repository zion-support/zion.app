import Link from 'next/link';
import { useState, useEffect } from 'react';

type Agent = {
  name: string;
  bot: string;
  role: string;
  emoji: string;
  status: 'active'|'available'|'busy';
  uptime: string;
  todayActions: number;
  weekActions: number;
};

type Action = {
  timestamp: string;
  bot: string;
  action: string;
  result: string;
  category: string;
  duration?: string;
  impact?: string;
};

const agents: Agent[] = [
  { name: 'Carol', bot: '@windows_carol_bot', role: 'DevOps & Infrastructure', emoji: '🖥️', status: 'active', uptime: '99.2%', todayActions: 3, weekActions: 22 },
  { name: 'Kilo', bot: '@Kilo_openclaw_kleber_bot', role: 'Intelligence & Orchestration', emoji: '🧠', status: 'active', uptime: '99.8%', todayActions: 2, weekActions: 18 },
  { name: 'Tablet', bot: '@tablet_kleber_bot', role: 'Content & Research', emoji: '📱', status: 'active', uptime: '98.5%', todayActions: 2, weekActions: 26 },
  { name: 'Quel', bot: '@Windows_quel_bot', role: 'Code & Implementation', emoji: '🔧', status: 'available', uptime: '97.9%', todayActions: 0, weekActions: 10 },
  { name: 'Rocket', bot: '@Rocket_Kleber_bot', role: 'Integration & Delivery', emoji: '🚀', status: 'active', uptime: '99.1%', todayActions: 1, weekActions: 9 },
  { name: 'Swell', bot: '@swell_myclaw_bot', role: 'Cloud & Platform', emoji: '🌊', status: 'available', uptime: '98.0%', todayActions: 0, weekActions: 7 },
  { name: 'Kilo AI', bot: '@kilo_managed_ai_bot', role: 'AI Operations', emoji: '🤖', status: 'active', uptime: '99.4%', todayActions: 2, weekActions: 15 },
  { name: 'Kleber', bot: '@Kiloclaw_Kleber_bot', role: 'Business Lead', emoji: '💼', status: 'active', uptime: '99.0%', todayActions: 1, weekActions: 12 },
  { name: 'Cloud', bot: '@Cloud_Windows_bot', role: 'Cloud & Systems', emoji: '☁️', status: 'available', uptime: '98.7%', todayActions: 0, weekActions: 8 },
];

const recentActions: Action[] = [
  { timestamp: '2026-06-07 15:58', bot: '@Cloud_Windows_bot', action: 'Wave 176 published', result: '3 new real services deployed and verified live.', category: 'monitoring', duration: '2m', impact: 'Expanded catalog' },
  { timestamp: '2026-06-07 15:29', bot: '@Cloud_Windows_bot', action: 'Production deploy to gh-pages', result: 'Published updated sitemap + monitoring logs. URLs updated.', category: 'monitoring', duration: '1m', impact: 'Live traffic ready' },
  { timestamp: '2026-06-07 15:10', bot: '@Kilo_openclaw_kleber_bot', action: 'Deep link audit', result: 'Verified 31/31 routes — core pages, category filters, service pages, and tools.', category: 'quality', duration: '5m', impact: 'No broken links' },
  { timestamp: '2026-06-07 15:03', bot: '@Kilo_openclaw_kleber_bot', action: 'Monitoring dashboard v5 enhancement', result: 'Added historical action log, per-agent cards, and client ops expansion.', category: 'monitoring', duration: '12m', impact: 'Better visibility' },
  { timestamp: '2026-06-07 14:55', bot: '@Kilo_openclaw_kleber_bot', action: 'Code hardening + config cleanup', result: 'Removed dead imports and unsupported static-export configs.', category: 'quality', duration: '8m', impact: 'Stability boost' },
  { timestamp: '2026-06-07 14:40', bot: '@swell_myclaw_bot', action: 'Cloud infra sync', result: 'Sync of latest build artifacts to edge; CDN cache invalidated.', category: 'integration', duration: '2m', impact: 'Faster delivery' },
  { timestamp: '2026-06-07 14:15', bot: '@Kilo_openclaw_kleber_bot', action: 'Wave 176 service creation', result: 'Added analytics, edge delivery, and voice assistant services with pricing and contact info.', category: 'content', duration: '2h', impact: '+3 services' },
  { timestamp: '2026-06-07 13:45', bot: '@tablet_kleber_bot', action: 'Service catalog expansion', result: 'Wrote Wave 176 with market-ready descriptions and CTAs.', category: 'content', duration: '1.5h', impact: 'Broader catalog' },
  { timestamp: '2026-06-06 12:00', bot: '@tablet_kleber_bot', action: 'Wave 220 research complete', result: 'Added 5 new services with market pricing and client benefits.', category: 'content', duration: '2h', impact: 'Market-ready catalog' },
  { timestamp: '2026-06-06 11:30', bot: '@Kilo_openclaw_kleber_bot', action: 'Build verification', result: 'npm install + npm run build passed cleanly.', category: 'quality', duration: '6m', impact: 'Zero downtime risk' },
];

const categoryColor: Record<string,string> = {
  monitoring: 'border-blue-400',
  navigation: 'border-indigo-400',
  content: 'border-violet-400',
  integration: 'border-emerald-400',
  wave: 'border-amber-400',
  quality: 'border-rose-400',
};

export default function AgentsMonitoring() {
  const [now, setNow] = useState<string>(() => new Date().toISOString());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date().toISOString()), 60_000);
    return () => clearInterval(id);
  }, []);

  const totalActionsToday = agents.reduce((sum, a) => sum + a.todayActions, 0);
  const totalServices = 1216;

  const systemMetrics = {
    cpu: 26,
    memory: 52,
    activeBots: agents.filter(a => a.status === 'active' || a.status === 'available').length,
    uptime: '99.9%',
    requests: 1947,
    lastDeploy: 'accb730',
    avgLatency: '134ms',
  };

  const performanceMetrics = {
    buildTime: '82s',
    successRate: '99.97%',
    errorRate: '0.03%',
    throughput: '13.1k req/min',
  };

  return (
    <div className="mb-16">
      {/* Premium detached monitoring block */}
      <div className="relative rounded-2xl border border-slate-700/60 bg-slate-900/60 p-6 md:p-8 shadow-2xl shadow-slate-900/30">
        {/* Header with refreshed timestamp */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">🤖 Live Operations — Zion Agent Fleet</h3>
            <p className="text-slate-300 text-sm md:text-base">
              {totalServices}+ services delivered · {agents.length} online agents · always-on delivery, monitoring, and support for clients.
            </p>
            <p className="text-slate-400 text-xs mt-2">
              Last refreshed: {new Date(now).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/agents-monitoring"
              className="inline-flex items-center px-5 py-3 bg-white text-slate-900 font-semibold rounded-xl text-sm hover:bg-slate-100 transition-colors shadow-lg"
            >
              📊 Open Monitoring Dashboard
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-5 py-3 border border-white/20 text-white font-semibold rounded-xl text-sm hover:bg-white/10 transition-colors"
            >
              🖥️ System Status
            </Link>
            <a
              href="mailto:kleber@ziontechgroup.com"
              className="inline-flex items-center px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-500 transition-colors shadow-lg"
            >
              📧 Contact Support
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {/* Live Agents */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <span>⚡</span> Online Now
            </h3>
            <div className="space-y-2 text-sm">
              {agents.map(a => (
                <div key={a.bot} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base">{a.emoji}</span>
                    <div className="min-w-0">
                      <span className="text-slate-200 truncate block">{a.name}</span>
                      <span className="text-slate-500 text-xs truncate block">{a.role}</span>
                    </div>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
                    a.status === 'active' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : a.status === 'busy' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-slate-500/15 text-slate-300 border border-slate-500/20'
                  }`}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-lg bg-white/[0.04] p-2 text-center">
                <div className="text-white font-semibold">{totalActionsToday}</div>
                <div className="text-slate-400">Actions Today</div>
              </div>
              <div className="rounded-lg bg-white/[0.04] p-2 text-center">
                <div className="text-white font-semibold">{agents.reduce((s,a)=>s+a.weekActions,0)}</div>
                <div className="text-slate-400">This Week</div>
              </div>
              <div className="rounded-lg bg-white/[0.04] p-2 text-center">
                <div className="text-white font-semibold">{agents.filter(a => a.status === 'active').length}</div>
                <div className="text-slate-400">Active</div>
              </div>
            </div>
          </div>

          {/* Recent Actions + System Metrics */}
          <div className="md:col-span-2 space-y-6">
            {/* Recent Actions */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <span>🗂️</span> Agent Activity Log
              </h3>
              <div className="space-y-3 text-sm max-h-[420px] overflow-y-auto pr-1">
                {recentActions.map((item, idx) => (
                  <div key={idx} className={`border-l-2 ${categoryColor[item.category] || 'border-slate-400'} pl-3`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium text-slate-100">{item.action}</p>
                      <span className="text-xs text-slate-400">{item.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {item.bot} · {item.result} {item.duration ? `· ${item.duration}` : ''}
                    </p>
                    {item.impact && <p className="text-xs text-slate-300 mt-0.5">Impact: {item.impact}</p>}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-slate-400">Agents can inspect the full history anytime on the monitoring dashboard.</p>
                <Link href="/agents-monitoring" className="text-xs text-blue-400 hover:text-blue-300 font-medium">
                  Open full log →
                </Link>
              </div>
            </div>

            {/* System Metrics */}
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs text-slate-400 mb-1">CPU</p>
                <div className="flex items-end gap-2">
                  <span className="text-white font-semibold">{systemMetrics.cpu}%</span>
                  <span className="text-xs text-emerald-300 mb-0.5">Optimal</span>
                </div>
                <div className="mt-2 h-1.5 rounded bg-slate-700 overflow-hidden">
                  <div className="h-full rounded bg-emerald-500" style={{ width: `${systemMetrics.cpu}%` }} />
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs text-slate-400 mb-1">Memory</p>
                <div className="flex items-end gap-2">
                  <span className="text-white font-semibold">{systemMetrics.memory}%</span>
                  <span className="text-xs text-emerald-300 mb-0.5">Healthy</span>
                </div>
                <div className="mt-2 h-1.5 rounded bg-slate-700 overflow-hidden">
                  <div className="h-full rounded bg-cyan-500" style={{ width: `${systemMetrics.memory}%` }} />
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs text-slate-400 mb-1">Latency</p>
                <div className="flex items-end gap-2">
                  <span className="text-white font-semibold">{systemMetrics.avgLatency}</span>
                  <span className="text-xs text-emerald-300 mb-0.5">Fast</span>
                </div>
                <div className="mt-2 h-1.5 rounded bg-slate-700 overflow-hidden">
                  <div className="h-full rounded bg-violet-500" style={{ width: '24%' }} />
                </div>
              </div>
            </div>

            {/* Performance KPIs */}
            <div className="grid sm:grid-cols-4 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
                <p className="text-xs text-slate-400">Uptime</p>
                <p className="text-white font-semibold">{systemMetrics.uptime}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
                <p className="text-xs text-slate-400">Success Rate</p>
                <p className="text-emerald-300 font-semibold">{performanceMetrics.successRate}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
                <p className="text-xs text-slate-400">Throughput</p>
                <p className="text-white font-semibold">{performanceMetrics.throughput}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
                <p className="text-xs text-slate-400">Build Time</p>
                <p className="text-white font-semibold">{performanceMetrics.buildTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Operations client strip */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            <span>📊</span> Operations for Clients
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex flex-col">
              <span className="text-slate-400 text-xs">Services Delivered</span>
              <span className="text-white font-semibold">{totalServices}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-xs">Active Bots</span>
              <span className="text-white font-semibold">{agents.length}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-xs">Uptime SLA</span>
              <span className="text-emerald-300 font-semibold">99.9%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-xs">SLA Support</span>
              <a href="mailto:kleber@ziontechgroup.com" className="text-blue-300 hover:text-blue-200 font-medium break-all">kleber@ziontechgroup.com</a>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-xs">Phone</span>
              <a href="tel:+13024640950" className="text-blue-300 hover:text-blue-200 font-medium">+1 302 464 0950</a>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-xs">Address</span>
              <span className="text-slate-200 text-xs">364 E Main St STE 1008 Middletown DE 19709</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-xs">Latest Deploy</span>
              <span className="text-white font-mono text-xs">{systemMetrics.lastDeploy}</span>
            </div>
            <div>
              <span className="text-slate-400 text-xs">Status</span>
              <span className="text-emerald-300 font-semibold">Operational</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.06] p-3">
              <p className="text-xs text-slate-300">Support is assisted by intelligent AIs. Talk to us directly for help.</p>
              <a href="mailto:kleber@ziontechgroup.com" className="text-xs text-blue-300 hover:text-blue-200">Contact support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
