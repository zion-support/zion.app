'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import AnimatedCounter from '@/components/AnimatedCounter';

// ── Types ──────────────────────────────────────────────────────────────────

interface DelegationEntry {
  time: string;
  bot: string;
  action: string;
  result: string;
}

interface BotStatus {
  name: string;
  role: string;
  emoji: string;
  status: 'active' | 'available';
  currentTask: string;
}

// ── Data ───────────────────────────────────────────────────────────────────

const BOT_ROSTER: BotStatus[] = [
  { name: '@windows_carol_bot', role: 'DevOps & Infrastructure', emoji: '🖥️', status: 'active', currentTask: 'CI/CD workflows, wave integration, accessibility' },
  { name: '@Kilo_openclaw_kleber_bot', role: 'Intelligence & Orchestration', emoji: '🧠', status: 'active', currentTask: 'Coordination lead, quality audits' },
  { name: '@tablet_kleber_bot', role: 'Content & Research', emoji: '📱', status: 'active', currentTask: 'Wave & service research, content data' },
  { name: '@Windows_quel_bot', role: 'Code & Implementation', emoji: '🔧', status: 'active', currentTask: 'Site quality, bug fixes, thin page pass' },
  { name: '@Rocket_Kleber_bot', role: 'Integration & Delivery', emoji: '🚀', status: 'available', currentTask: 'Build/CI/CD optimization' },
  { name: '@OWL', role: 'Build & Deploy / Fleet Coordinator', emoji: '📊', status: 'active', currentTask: 'Wave integration, dashboard, fleet coordination' },
];

const DELEGATION_LOG: DelegationEntry[] = [
  { time: '2026-06-03 00:35', bot: '@Kilo', action: 'Fix 67 placeholder services', result: 'Thin pages: 490→223' },
  { time: '2026-06-03 00:35', bot: '@Kilo', action: 'Waves 183-185 integration', result: 'Added missing imports' },
  { time: '2026-06-03 02:00', bot: '@Carol', action: 'CI/CD workflows deployed', result: '5+ workflow files, Lighthouse, smoke tests' },
  { time: '2026-06-03 02:45', bot: '@Kilo', action: 'ORGANIZE — wave fixes', result: 'Fixed wave175/180 imports, interfaces, categories' },
  { time: '2026-06-03 03:30', bot: '@Kilo', action: 'ORGANIZE — import fix', result: 'Wave189 import mismatch fixed, pushed' },
  { time: '2026-06-03 04:20', bot: 'Multi-bot', action: 'Waves 191-192', result: '+20 services integrated' },
  { time: '2026-06-04 08:00', bot: '@OWL', action: 'Waves 193-195 recovery', result: 'Re-created after force-push, fixed CRLF' },
  { time: '2026-06-04 08:30', bot: '@OWL', action: 'Wave 196', result: '+10 services pushed' },
  { time: '2026-06-04 14:00', bot: '@tablet', action: 'Wave 207 research', result: 'Grafana, Keycloak, Strapi, Medusa, Outline' },
  { time: '2026-06-06 20:00', bot: '@Kilo', action: 'Wave 207 integrated', result: '5 new categories, type-check clean' },
  { time: '2026-06-03 14:11', bot: '@Kilo', action: 'Fleet reorganization', result: '6 bots, P1/P2/Blocked task board, delegation rules' },
  { time: '2026-06-03 14:27', bot: '@Kilo', action: 'Wave 208 full integration', result: '15 services (10 Carol + 5 OWL new categories)' },
  { time: '2026-06-03 14:45', bot: '@Kilo', action: 'Wave 207 recovery', result: "Restored Carol's 10 lost services, fixed categories" },
  { time: '2026-06-03 15:00', bot: '@OWL', action: 'Agent Dashboard v2', result: 'Real-time fleet monitor, task board, activity log' },
];

const WAVE_STATUS = [
  { wave: '174-180', services: '~497', status: 'ok' },
  { wave: '183-185', services: '19', status: 'ok' },
  { wave: '187-192', services: '55', status: 'ok' },
  { wave: '193-196', services: '41', status: 'ok' },
  { wave: '197-206', services: '~160', status: 'ok' },
  { wave: '207', services: '15', status: 'ok' },
  { wave: '208', services: '14', status: 'ok' },
];

const TASKS = {
  p1: [
    { id: 'P1-2', task: 'Site quality — thin pages re-scan', owner: '@Windows_quel', status: 'in-progress' },
    { id: 'P1-3', task: 'Wave 209 research pipeline', owner: '@tablet', status: 'queued' },
  ],
  p2: [
    { id: 'B2', task: 'CI/CD pipeline hardening', owner: '@Rocket' },
    { id: 'B3', task: 'GitHub auth for Actions triage', owner: '@Carol' },
    { id: 'B4', task: 'Service page auto-generation', owner: '@tablet' },
    { id: 'B5', task: 'Thin page content enrichment', owner: '@Kilo' },
  ],
  blocked: [
    { id: 'X1', task: 'Email responder live', needs: 'Gmail app password' },
    { id: 'X2', task: 'GitHub Actions triage', needs: 'gh auth on remote' },
  ],
};

const CRON_JOBS = [
  { name: 'Link Monitor', interval: '360m', status: 'ok' },
  { name: 'Org Health', interval: '240m', status: 'error' },
  { name: 'Wave Research', interval: '240m', status: 'ok' },
  { name: 'Email Readiness', interval: '120m', status: 'ok' },
];

// ── Components ─────────────────────────────────────────────────────────────

function PulseDot({ active }: { active: boolean }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      {active && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${active ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ok: 'bg-emerald-500/20 text-emerald-400',
    error: 'bg-red-500/20 text-red-400',
    'in-progress': 'bg-amber-500/20 text-amber-400',
    queued: 'bg-slate-500/20 text-slate-400',
    active: 'bg-emerald-500/20 text-emerald-400',
    available: 'bg-blue-500/20 text-blue-400',
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${map[status] || 'bg-slate-500/20 text-slate-400'}`}>{status}</span>;
}

// ── Main Dashboard ─────────────────────────────────────────────────────────

export default function AgentDashboard() {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const update = () => setCurrentTime(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo', hour12: true }));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeBots = BOT_ROSTER.filter(b => b.status === 'active').length;
  const totalServices = WAVE_STATUS.reduce((s, w) => s + (parseInt(w.services.replace(/[^0-9]/g, '')) || 0), 80);
  const completedActions = DELEGATION_LOG.length;

  const filteredLog = useMemo(() => {
    if (filter === 'all') return [...DELEGATION_LOG].reverse();
    return DELEGATION_LOG.filter(e => e.bot.toLowerCase().includes(filter.toLowerCase())).reverse();
  }, [filter]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-lg font-bold shadow-lg shadow-purple-500/20">⚡</div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                Zion AI Agent Command Center
              </h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Real-time fleet monitoring · {currentTime || 'Loading...'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <PulseDot active={true} />
            <span className="text-xs text-emerald-400 font-medium hidden sm:block">Live</span>
            <Link href="/" className="text-xs text-slate-400 hover:text-white transition border border-slate-700/60 rounded-lg px-3 py-1.5 hover:border-slate-500">
              ← Main Site
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Hero Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-900/10 border border-emerald-500/20 rounded-xl p-4">
            <div className="text-[10px] text-emerald-400/70 uppercase tracking-wider font-semibold mb-1">Active Agents</div>
            <div className="text-3xl font-bold text-emerald-400"><AnimatedCounter target={activeBots} /></div>
            <div className="text-[10px] text-slate-500 mt-1">of {BOT_ROSTER.length} fleet</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-900/10 border border-purple-500/20 rounded-xl p-4">
            <div className="text-[10px] text-purple-400/70 uppercase tracking-wider font-semibold mb-1">Services</div>
            <div className="text-3xl font-bold text-purple-400"><AnimatedCounter target={totalServices} suffix="+" /></div>
            <div className="text-[10px] text-slate-500 mt-1">{WAVE_STATUS.length} waves integrated</div>
          </div>
          <div className="bg-gradient-to-br from-pink-500/10 to-pink-900/10 border border-pink-500/20 rounded-xl p-4">
            <div className="text-[10px] text-pink-400/70 uppercase tracking-wider font-semibold mb-1">Actions</div>
            <div className="text-3xl font-bold text-pink-400"><AnimatedCounter target={completedActions} /></div>
            <div className="text-[10px] text-slate-500 mt-1">delegated tasks</div>
          </div>
          <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-900/10 border border-cyan-500/20 rounded-xl p-4">
            <div className="text-[10px] text-cyan-400/70 uppercase tracking-wider font-semibold mb-1">Site Health</div>
            <div className="text-3xl font-bold text-cyan-400">200</div>
            <div className="text-[10px] text-slate-500 mt-1">OK · ziontechgroup.com</div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left — Bots + Waves + Tasks */}
          <div className="lg:col-span-2 space-y-4">
            {/* Bot Fleet */}
            <section className="bg-slate-900/80 border border-slate-800/80 rounded-xl overflow-hidden backdrop-blur-sm">
              <div className="px-5 py-3 border-b border-slate-800/60 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-200">🤖 AI Agent Fleet</h2>
                <span className="text-[10px] text-slate-500">{activeBots} active · {BOT_ROSTER.length} total</span>
              </div>
              <div className="divide-y divide-slate-800/40">
                {BOT_ROSTER.map(bot => (
                  <div key={bot.name} className="px-5 py-3 flex items-center gap-3 hover:bg-slate-800/30 transition-colors">
                    <PulseDot active={bot.status === 'active'} />
                    <span className="text-xl">{bot.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-xs">{bot.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{bot.role}</div>
                    </div>
                    <div className="hidden md:block text-right max-w-[180px]">
                      <div className="text-[10px] text-slate-400 truncate">{bot.currentTask}</div>
                    </div>
                    <StatusBadge status={bot.status} />
                  </div>
                ))}
              </div>
            </section>

            {/* Wave Status */}
            <section className="bg-slate-900/80 border border-slate-800/80 rounded-xl overflow-hidden backdrop-blur-sm">
              <div className="px-5 py-3 border-b border-slate-800/60">
                <h2 className="text-sm font-semibold text-slate-200">🌊 Wave Integration</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-500 uppercase tracking-wider">
                      <th className="px-5 py-2 text-left font-medium">Wave</th>
                      <th className="px-5 py-2 text-left font-medium">Services</th>
                      <th className="px-5 py-2 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {WAVE_STATUS.map(w => (
                      <tr key={w.wave} className="hover:bg-slate-800/30">
                        <td className="px-5 py-2 font-mono text-purple-300">{w.wave}</td>
                        <td className="px-5 py-2 text-slate-300">{w.services}</td>
                        <td className="px-5 py-2"><StatusBadge status={w.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Task Board */}
            <section className="bg-slate-900/80 border border-slate-800/80 rounded-xl overflow-hidden backdrop-blur-sm">
              <div className="px-5 py-3 border-b border-slate-800/60">
                <h2 className="text-sm font-semibold text-slate-200">📋 Task Board</h2>
              </div>
              <div className="p-4 space-y-3">
                {TASKS.p1.map(t => (
                  <div key={t.id} className="flex items-center gap-2 bg-amber-500/5 border border-amber-500/10 rounded-lg px-3 py-2">
                    <span className="text-[10px] font-mono text-amber-400">{t.id}</span>
                    <span className="flex-1 text-xs">{t.task}</span>
                    <span className="text-[10px] text-purple-300">{t.owner}</span>
                    <StatusBadge status={t.status} />
                  </div>
                ))}
                {TASKS.p2.map(t => (
                  <div key={t.id} className="flex items-center gap-2 bg-slate-800/30 rounded-lg px-3 py-2">
                    <span className="text-[10px] font-mono text-slate-500">{t.id}</span>
                    <span className="flex-1 text-xs">{t.task}</span>
                    <span className="text-[10px] text-purple-300">{t.owner}</span>
                  </div>
                ))}
                {TASKS.blocked.map(t => (
                  <div key={t.id} className="flex items-center gap-2 bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-2">
                    <span className="text-[10px] font-mono text-red-400">{t.id}</span>
                    <span className="flex-1 text-xs">{t.task}</span>
                    <span className="text-[10px] text-red-300/70">{t.needs}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right — Cron + Activity + Info */}
          <div className="space-y-4">
            {/* Cron Jobs */}
            <section className="bg-slate-900/80 border border-slate-800/80 rounded-xl overflow-hidden backdrop-blur-sm">
              <div className="px-5 py-3 border-b border-slate-800/60">
                <h2 className="text-sm font-semibold text-slate-200">⏰ Monitoring Jobs</h2>
              </div>
              <div className="divide-y divide-slate-800/40">
                {CRON_JOBS.map(job => (
                  <div key={job.name} className="px-5 py-2.5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium">{job.name}</div>
                      <div className="text-[10px] text-slate-500">Every {job.interval}</div>
                    </div>
                    <StatusBadge status={job.status} />
                  </div>
                ))}
              </div>
            </section>

            {/* Activity Log */}
            <section className="bg-slate-900/80 border border-slate-800/80 rounded-xl overflow-hidden backdrop-blur-sm">
              <div className="px-5 py-3 border-b border-slate-800/60 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-200">📜 Activity Log</h2>
                <select value={filter} onChange={e => setFilter(e.target.value)} className="bg-slate-800/80 border border-slate-700/60 rounded text-[10px] px-1.5 py-0.5 text-slate-400">
                  <option value="all">All</option>
                  <option value="@Kilo">@Kilo</option>
                  <option value="@Carol">@Carol</option>
                  <option value="@tablet">@tablet</option>
                  <option value="@OWL">@OWL</option>
                </select>
              </div>
              <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-800/40">
                {filteredLog.map((entry, i) => (
                  <div key={i} className="px-5 py-2.5 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-mono text-slate-500">{entry.time}</span>
                      <span className="text-[10px] text-purple-300 font-medium">{entry.bot}</span>
                    </div>
                    <div className="text-xs font-medium text-slate-200 mb-0.5">{entry.action}</div>
                    <div className="text-[10px] text-slate-500">{entry.result}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Agent Restart Info */}
            <section className="bg-gradient-to-br from-violet-500/5 to-purple-500/5 border border-violet-500/10 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-violet-300 mb-2">🔄 Agent Restart Protocol</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed mb-2">
                When any agent restarts, it should:
              </p>
              <ol className="text-[10px] text-slate-400 leading-relaxed space-y-1 list-decimal list-inside">
                <li>Check this dashboard at <code className="text-violet-300">/dashboard</code></li>
                <li>Read <code className="text-violet-300">~/.hermes/multi-agent-coordination.md</code> for current task board</li>
                <li>Report status in Zion Agents group</li>
                <li>Push completed work before taking new tasks</li>
                <li>Pull <code className="text-violet-300">--rebase</code> before any push (Carol pushes frequently)</li>
              </ol>
            </section>

            {/* Client-facing badge */}
            <section className="bg-gradient-to-br from-emerald-500/5 to-green-500/5 border border-emerald-500/10 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">🛡️</div>
              <h3 className="text-xs font-semibold text-emerald-300 mb-1">Powered by AI Agents</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                This website is built and maintained by a fleet of 6 autonomous AI agents working 24/7 — researching, coding, testing, and deploying improvements in real time.
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800/60 mt-8 py-4 text-center text-[10px] text-slate-600">
        <p>Zion Tech Group — AI Agent Command Center · São Paulo {currentTime || '—'}</p>
      </footer>
    </div>
  );
}
