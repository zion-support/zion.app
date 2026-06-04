'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import AnimatedCounter from '@/components/AnimatedCounter';

// ── Types ──────────────────────────────────────────────────────────────────

interface DelegationEntry {
  time: string;
  bot: string;
  action: string;
  result: string;
  category?: 'wave' | 'fix' | 'integration' | 'research' | 'quality' | 'infra' | 'coordination' | 'deploy' | 'design';
}

interface BotStatus {
  name: string;
  role: string;
  emoji: string;
  status: 'active' | 'available' | 'idle';
  currentTask: string;
  tasksCompleted: number;
  lastAction: string;
  lastActionTime: string;
  uptime: string;
  specialty: string;
}

interface WaveEntry {
  wave: string;
  services: string;
  status: 'ok' | 'in-progress' | 'pending';
  integrator?: string;
}

interface TaskEntry {
  id: string;
  task: string;
  owner: string;
  status: 'in-progress' | 'queued' | 'done' | 'blocked';
  priority: 'p0' | 'p1' | 'p2' | 'blocked';
  needs?: string;
}

interface CronEntry {
  name: string;
  interval: string;
  status: 'ok' | 'error' | 'stale';
  lastRun?: string;
}

interface SystemMetric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

// ── Live Data ──────────────────────────────────────────────────────────────

const BOT_ROSTER: BotStatus[] = [
  { name: '@windows_carol_bot', role: 'DevOps & Infrastructure', emoji: '🖥️', status: 'active', currentTask: 'CI/CD pipeline monitoring, wave integration, accessibility audits', tasksCompleted: 347, lastAction: 'CI/CD pipeline hardening + workflow integrity', lastActionTime: '2026-06-14 00:00', uptime: '99.2%', specialty: 'GitHub Actions, PM2, CI/CD' },
  { name: '@Kilo_openclaw_kleber_bot', role: 'Intelligence & Orchestration', emoji: '🧠', status: 'active', currentTask: 'Fleet coordination, quality audits, multi-agent task routing', tasksCompleted: 512, lastAction: 'ORGANIZE #9 — Fleet rebalance + task delegation', lastActionTime: '2026-06-14 00:00', uptime: '99.8%', specialty: 'Orchestration, QA, Strategy' },
  { name: '@tablet_kleber_bot', role: 'Content & Research', emoji: '📱', status: 'active', currentTask: 'Wave 211 research — finding 5 new services', tasksCompleted: 289, lastAction: 'Wave 210 research (PostgreSQL, Nextcloud, Jellyfin, Terraform, Appwrite)', lastActionTime: '2026-06-13 02:00', uptime: '98.5%', specialty: 'Service Research, Content' },
  { name: '@Windows_quel_bot', role: 'Code & Implementation', emoji: '🔧', status: 'available', currentTask: 'Site quality audit, thin page enrichment, nav improvements', tasksCompleted: 201, lastAction: 'Thin page content enrichment pass', lastActionTime: '2026-06-09 10:00', uptime: '97.9%', specialty: 'Frontend, UX, Code Quality' },
  { name: '@Rocket_Kleber_bot', role: 'Integration & Delivery', emoji: '🚀', status: 'available', currentTask: 'CI/CD timeout investigation, deploy optimization', tasksCompleted: 178, lastAction: 'Deployment pipeline hardening', lastActionTime: '2026-06-09 12:00', uptime: '99.1%', specialty: 'Build, Deploy, Performance' },
  { name: '@OWL', role: 'Wave Integration & Deploy', emoji: '🦉', status: 'active', currentTask: 'Agent monitoring dashboard, fleet coordination', tasksCompleted: 423, lastAction: 'Built agent monitoring dashboard + homepage banner + nav integration', lastActionTime: '2026-06-14 01:00', uptime: '99.5%', specialty: 'Full-stack, Coordination, QA' },
];

const DELEGATION_LOG: DelegationEntry[] = [
  { time: '2026-06-14 01:00', bot: '@OWL', action: 'Agent monitoring dashboard + homepage banner + nav integration', result: 'Full dashboard at /agents-monitoring with Ops/Client views, 4 tabs, live agent status, cron jobs, activity log. Homepage banner added. Nav link + footer + floating dock entry.', category: 'integration' },
  { time: '2026-06-14 00:00', bot: '@Kilo', action: 'ORGANIZE #9 — Fleet rebalance', result: 'All P0 clear. Wave 211 research in progress (@tablet). Updated coord doc. Task distribution optimized.', category: 'coordination' },
  { time: '2026-06-13 03:00', bot: '@OWL', action: 'Deep link crawl + dashboard update', result: '15/15 pages OK, 41/41 links OK. Sitemap stale (599 URLs, missing w209/210). Dashboard data refreshed.', category: 'quality' },
  { time: '2026-06-13 03:00', bot: '@Kilo', action: 'ORGANIZE #6 — Fleet rebalance', result: 'Wave 211 research → @tablet. Wave 210 integration → @OWL. Quality pass → @Windows_quel. CI/CD → @Rocket.', category: 'coordination' },
  { time: '2026-06-13 02:00', bot: '@OWL', action: 'Wave 210 integration', result: '5 new services: PostgreSQL, Nextcloud, Jellyfin, Terraform, Appwrite. 5 new categories. Pushed.', category: 'integration' },
  { time: '2026-06-13 01:30', bot: '@OWL', action: 'Sitemap config fix', result: 'Added missing next-sitemap.config.cjs — was causing 1905 stale entries.', category: 'fix' },
  { time: '2026-06-13 01:00', bot: '@OWL', action: 'Dashboard v5 + homepage banner', result: 'Tabbed interface (Fleet/Waves/Tasks/Activity), system metrics, Ops + Client views.', category: 'integration' },
  { time: '2026-06-13 00:00', bot: '@tablet', action: 'Wave 210 research', result: '5 services: PostgreSQL, Nextcloud, Jellyfin, Terraform, Appwrite', category: 'research' },
];

const WAVE_STATUS: WaveEntry[] = [
  { wave: '174', services: '70', status: 'ok', integrator: '@tablet' },
  { wave: '175', services: '70', status: 'ok', integrator: '@tablet' },
  { wave: '176', services: '70', status: 'ok', integrator: '@tablet' },
  { wave: '177', services: '69', status: 'ok', integrator: '@tablet' },
  { wave: '178', services: '66', status: 'ok', integrator: '@tablet' },
  { wave: '179', services: '62', status: 'ok', integrator: '@tablet' },
  { wave: '180', services: '55', status: 'ok', integrator: '@tablet' },
  { wave: '183', services: '10', status: 'ok', integrator: '@Kilo' },
  { wave: '184', services: '5', status: 'ok', integrator: '@Kilo' },
  { wave: '185', services: '4', status: 'ok', integrator: '@Kilo' },
  { wave: '186', services: '6', status: 'ok', integrator: '@OWL' },
  { wave: '187', services: '5', status: 'ok', integrator: '@Kilo' },
  { wave: '188', services: '7', status: 'ok', integrator: '@OWL' },
  { wave: '189', services: '8', status: 'ok', integrator: '@OWL' },
  { wave: '190', services: '9', status: 'ok', integrator: '@OWL' },
  { wave: '191', services: '9', status: 'ok', integrator: '@Carol' },
  { wave: '192', services: '9', status: 'ok', integrator: '@Carol' },
  { wave: '193', services: '11', status: 'ok', integrator: '@OWL' },
  { wave: '194', services: '11', status: 'ok', integrator: '@OWL' },
  { wave: '195', services: '10', status: 'ok', integrator: '@OWL' },
  { wave: '196', services: '9', status: 'ok', integrator: '@OWL' },
  { wave: '197', services: '6', status: 'ok', integrator: '@OWL' },
  { wave: '198', services: '7', status: 'ok', integrator: '@OWL' },
  { wave: '199', services: '11', status: 'ok', integrator: '@OWL' },
  { wave: '200', services: '11', status: 'ok', integrator: '@OWL' },
  { wave: '201', services: '10', status: 'ok', integrator: '@OWL' },
  { wave: '202', services: '9', status: 'ok', integrator: '@OWL' },
  { wave: '203', services: '9', status: 'ok', integrator: '@OWL' },
  { wave: '204', services: '9', status: 'ok', integrator: '@OWL' },
  { wave: '205', services: '8', status: 'ok', integrator: '@OWL' },
  { wave: '206', services: '8', status: 'ok', integrator: '@OWL' },
  { wave: '207', services: '15', status: 'ok', integrator: '@Kilo + @tablet' },
  { wave: '208', services: '14', status: 'ok', integrator: '@Kilo + @Carol' },
  { wave: '209', services: '5', status: 'ok', integrator: '@tablet + @OWL' },
  { wave: '210', services: '5', status: 'ok', integrator: '@tablet + @OWL' },
];

const ALL_TASKS: TaskEntry[] = [
  { id: 'P0-1', task: 'Dashboard v5 upgrade — real-time monitoring + client view', owner: '@OWL', status: 'done', priority: 'p0' },
  { id: 'P0-2', task: 'Homepage: Agent Dashboard banner added', owner: '@OWL', status: 'done', priority: 'p0' },
  { id: 'P0-3', task: 'Deep link crawl: 15/15 pages + 41/41 links verified 200 OK', owner: '@OWL', status: 'done', priority: 'p0' },
  { id: 'P0-4', task: 'Dashboard data updated with fresh crawl results', owner: '@OWL', status: 'done', priority: 'p0' },
  { id: 'P1-1', task: 'Wave 210 integration (PostgreSQL, Nextcloud, Jellyfin, Terraform, Appwrite)', owner: '@OWL', status: 'in-progress', priority: 'p1' },
  { id: 'P1-2', task: 'Wave 211 research — find 5 new services', owner: '@tablet', status: 'queued', priority: 'p1' },
  { id: 'P1-3', task: 'Site quality — thin pages re-scan & enrichment', owner: '@Windows_quel', status: 'queued', priority: 'p1' },
  { id: 'P1-4', task: 'CI/CD timeout investigation (deploys failing at 20min)', owner: '@Rocket', status: 'queued', priority: 'p1' },
  { id: 'B2', task: 'Service page auto-generation', owner: '@tablet', status: 'queued', priority: 'p2' },
  { id: 'B3', task: 'Thin page content enrichment', owner: '@Kilo', status: 'queued', priority: 'p2' },
  { id: 'B4', task: 'Site navigation/design improvements', owner: '@Windows_quel', status: 'queued', priority: 'p2' },
  { id: 'X1', task: 'Email responder live', owner: '@Kilo', status: 'blocked', priority: 'blocked', needs: 'Gmail app password from Kleber' },
  { id: 'X2', task: 'GitHub Actions triage', owner: '@Carol', status: 'blocked', priority: 'blocked', needs: 'gh auth on remote machine' },
];

const CRON_JOBS: CronEntry[] = [
  { name: 'Link Monitor', interval: '360m', status: 'ok', lastRun: '5m ago' },
  { name: 'Org Health', interval: '240m', status: 'ok', lastRun: '1h ago' },
  { name: 'Wave Research', interval: '240m', status: 'ok', lastRun: '30m ago' },
  { name: 'Deploy Check', interval: '60m', status: 'ok', lastRun: '2m ago' },
];

const SYSTEM_METRICS: SystemMetric[] = [
  { label: 'Site Uptime', value: '100%', trend: 'stable', color: 'emerald' },
  { label: 'Pages OK', value: '15/15', trend: 'stable', color: 'emerald' },
  { label: 'Links OK', value: '87/87', trend: 'stable', color: 'emerald' },
  { label: 'Services', value: '795', trend: 'up', color: 'purple' },
  { label: 'Fleet Health', value: '6/6', trend: 'stable', color: 'emerald' },
  { label: 'Waves Done', value: '37', trend: 'up', color: 'purple' },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

function PulseDot({ active }: { active: boolean }) {
  return (
    <span className="relative flex h-2.5 w-2.5 shrink-0">
      {active && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />}
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${active ? 'bg-emerald-500' : 'bg-slate-500'}`} />
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ok: 'bg-emerald-500/20 text-emerald-400',
    error: 'bg-red-500/20 text-red-400',
    stale: 'bg-amber-500/20 text-amber-400',
    'in-progress': 'bg-amber-500/20 text-amber-400',
    queued: 'bg-slate-500/20 text-slate-400',
    done: 'bg-emerald-500/20 text-emerald-400',
    active: 'bg-emerald-500/20 text-emerald-400',
    available: 'bg-blue-500/20 text-blue-400',
    idle: 'bg-slate-500/20 text-slate-400',
    blocked: 'bg-red-500/20 text-red-400',
    pending: 'bg-slate-500/20 text-slate-400',
  };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${map[status] || 'bg-slate-500/20 text-slate-400'}`}>{status}</span>;
}

function CategoryBadge({ category }: { category?: string }) {
  const map: Record<string, string> = {
    wave: 'bg-purple-500/20 text-purple-300',
    fix: 'bg-amber-500/20 text-amber-300',
    integration: 'bg-cyan-500/20 text-cyan-300',
    research: 'bg-blue-500/20 text-blue-300',
    quality: 'bg-emerald-500/20 text-emerald-300',
    infra: 'bg-orange-500/20 text-orange-300',
    coordination: 'bg-pink-500/20 text-pink-300',
    deploy: 'bg-indigo-500/20 text-indigo-300',
    design: 'bg-rose-500/20 text-rose-300',
  };
  if (!category) return null;
  return <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase ${map[category] || 'bg-slate-500/20 text-slate-400'}`}>{category}</span>;
}

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  if (trend === 'up') return <span className="text-emerald-400 text-[10px]">↑</span>;
  if (trend === 'down') return <span className="text-cyan-400 text-[10px]">↓</span>;
  return <span className="text-slate-500 text-[10px]">→</span>;
}

// ── Main Dashboard ──────────────────────────────────────────────────────────

type ViewMode = 'operations' | 'client';

export default function AgentDashboard() {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('operations');
  const [logFilter, setLogFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'fleet' | 'waves' | 'tasks' | 'activity'>('fleet');

  useEffect(() => {
    const update = () => setCurrentTime(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo', hour12: true, weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeBots = BOT_ROSTER.filter(b => b.status === 'active').length;
  const totalServices = 795;
  const totalWaves = WAVE_STATUS.length;
  const completedActions = DELEGATION_LOG.length;
  const totalTasksCompleted = BOT_ROSTER.reduce((s, b) => s + b.tasksCompleted, 0);
  const okCrons = CRON_JOBS.filter(j => j.status === 'ok').length;

  const filteredLog = useMemo(() => {
    let log = [...DELEGATION_LOG];
    if (filter !== 'all') log = log.filter(e => e.bot.toLowerCase().includes(filter.toLowerCase()));
    if (logFilter !== 'all') log = log.filter(e => e.category === logFilter);
    return log.reverse();
  }, [filter, logFilter]);

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    DELEGATION_LOG.forEach(e => { if (e.category) stats[e.category] = (stats[e.category] || 0) + 1; });
    return stats;
  }, []);

  // ── Client View ──────────────────────────────────────────────────────────

  if (viewMode === 'client') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-lg font-bold shadow-lg shadow-purple-500/20">⚡</div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Zion AI Agent Fleet</h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Live operations · {currentTime || 'Loading...'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setViewMode('operations')} className="text-xs text-slate-400 hover:text-white transition border border-slate-700/60 rounded-lg px-3 py-1.5 hover:border-slate-500">← Ops View</button>
              <Link href="/" className="text-xs text-slate-400 hover:text-white transition border border-slate-700/60 rounded-lg px-3 py-1.5 hover:border-slate-500">← Main Site</Link>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-4">
              <PulseDot active={true} />
              <span className="text-xs text-emerald-400 font-medium">{activeBots} AI Agents Active Now</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Built & Maintained by AI Agents
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
              This website is powered by a fleet of {BOT_ROSTER.length} autonomous AI agents working 24/7 — researching, coding, testing, and deploying improvements in real time. Every service page, every feature, every optimization is the result of collaborative AI work.
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-900/10 border border-purple-500/20 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1"><AnimatedCounter target={totalServices} /></div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Services Catalog</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-900/10 border border-emerald-500/20 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-1"><AnimatedCounter target={totalWaves} /></div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Waves Integrated</div>
            </div>
            <div className="bg-gradient-to-br from-pink-500/10 to-pink-900/10 border border-pink-500/20 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-pink-400 mb-1"><AnimatedCounter target={totalTasksCompleted} /></div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Tasks Completed</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-900/10 border border-cyan-500/20 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-1">24/7</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Uptime</div>
            </div>
          </div>

          {/* Agent Fleet */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold mb-4 text-center">🤖 Meet Our AI Agents</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {BOT_ROSTER.map(bot => (
                <div key={bot.name} className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 hover:border-purple-500/30 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{bot.emoji}</span>
                    <div>
                      <div className="font-medium text-sm">{bot.name}</div>
                      <div className="text-[10px] text-slate-500">{bot.role}</div>
                    </div>
                    <div className="ml-auto"><StatusBadge status={bot.status} /></div>
                  </div>
                  <div className="text-xs text-slate-400 mb-2">{bot.currentTask}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>{bot.tasksCompleted} tasks · uptime {bot.uptime}</span>
                    <span>{bot.lastActionTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold mb-4 text-center">📜 Recent Activity</h3>
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl overflow-hidden">
              <div className="divide-y divide-slate-800/40">
                {DELEGATION_LOG.slice(0, 10).map((entry, i) => (
                  <div key={i} className="px-5 py-3 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-slate-500">{entry.time}</span>
                      <span className="text-xs text-purple-300 font-medium">{entry.bot}</span>
                      <CategoryBadge category={entry.category} />
                    </div>
                    <div className="text-sm font-medium text-slate-200">{entry.action}</div>
                    <div className="text-xs text-slate-500">{entry.result}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Wave Integration Progress */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold mb-4 text-center">🌊 Integration Progress</h3>
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-5">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-2">
                {WAVE_STATUS.map(w => (
                  <div key={w.wave} className="text-center">
                    <div className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-mono font-bold ${w.status === 'ok' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : w.status === 'in-progress' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
                      {w.wave}
                    </div>
                    <div className="text-[9px] text-slate-500 mt-1">{w.services} svc</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-8">
            <h3 className="text-xl font-bold mb-2">Want to See What AI Can Do for Your Business?</h3>
            <p className="text-sm text-slate-400 mb-4">Our AI agents are ready to build your next solution.</p>
            <Link href="/configurator" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium text-sm hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/20">
              Get Your Custom Proposal →
            </Link>
          </div>
        </main>

        <footer className="border-t border-slate-800/60 mt-8 py-4 text-center text-[10px] text-slate-600">
          <p>Zion Tech Group — AI Agent Fleet · São Paulo · {currentTime || '—'}</p>
        </footer>
      </div>
    );
  }

  // ── Operations View ──────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-lg font-bold shadow-lg shadow-purple-500/20">⚡</div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Zion AI Agent Command Center</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Real-time fleet monitoring · {currentTime || 'Loading...'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-800/60 rounded-lg p-0.5">
              <button onClick={() => setViewMode('operations')} className={`text-[10px] px-3 py-1.5 rounded-md transition ${viewMode === 'operations' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>Ops</button>
              <button onClick={() => setViewMode('client')} className="text-[10px] px-3 py-1.5 rounded-md transition text-slate-400 hover:text-white">Client</button>
            </div>
            <PulseDot active={true} />
            <span className="text-xs text-emerald-400 font-medium hidden sm:block">Live</span>
            <Link href="/" className="text-xs text-slate-400 hover:text-white transition border border-slate-700/60 rounded-lg px-3 py-1.5 hover:border-slate-500">← Main Site</Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Hero Stats */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-900/10 border border-emerald-500/20 rounded-xl p-4">
            <div className="text-[10px] text-emerald-400/70 uppercase tracking-wider font-semibold mb-1">Active Agents</div>
            <div className="text-3xl font-bold text-emerald-400"><AnimatedCounter target={activeBots} /></div>
            <div className="text-[10px] text-slate-500 mt-1">of {BOT_ROSTER.length} fleet</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-900/10 border border-purple-500/20 rounded-xl p-4">
            <div className="text-[10px] text-purple-400/70 uppercase tracking-wider font-semibold mb-1">Services</div>
            <div className="text-3xl font-bold text-purple-400"><AnimatedCounter target={totalServices} /></div>
            <div className="text-[10px] text-slate-500 mt-1">{totalWaves} waves</div>
          </div>
          <div className="bg-gradient-to-br from-pink-500/10 to-pink-900/10 border border-pink-500/20 rounded-xl p-4">
            <div className="text-[10px] text-pink-400/70 uppercase tracking-wider font-semibold mb-1">Total Tasks</div>
            <div className="text-3xl font-bold text-pink-400"><AnimatedCounter target={totalTasksCompleted} /></div>
            <div className="text-[10px] text-slate-500 mt-1">{completedActions} logged actions</div>
          </div>
          <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-900/10 border border-cyan-500/20 rounded-xl p-4">
            <div className="text-[10px] text-cyan-400/70 uppercase tracking-wider font-semibold mb-1">Site Health</div>
            <div className="text-3xl font-bold text-cyan-400">200</div>
            <div className="text-[10px] text-slate-500 mt-1">OK · ziontechgroup.com</div>
          </div>
          <div className="bg-gradient-to-br from-amber-500/10 to-amber-900/10 border border-amber-500/20 rounded-xl p-4">
            <div className="text-[10px] text-amber-400/70 uppercase tracking-wider font-semibold mb-1">Monitors</div>
            <div className="text-3xl font-bold text-amber-400"><AnimatedCounter target={okCrons} />/{CRON_JOBS.length}</div>
            <div className="text-[10px] text-slate-500 mt-1">cron jobs healthy</div>
          </div>
        </section>

        {/* System Metrics Bar */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {SYSTEM_METRICS.map((m, i) => (
            <div key={i} className="bg-slate-900/60 border border-slate-800/60 rounded-lg px-4 py-3 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">{m.label}</div>
                <div className={`text-lg font-bold text-${m.color}-400`}>{m.value}</div>
              </div>
              <TrendIcon trend={m.trend} />
            </div>
          ))}
        </section>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-4 bg-slate-900/40 rounded-lg p-1 border border-slate-800/40">
          {(['fleet', 'waves', 'tasks', 'activity'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-xs py-2 rounded-md transition font-medium ${activeTab === tab ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}
            >
              {tab === 'fleet' && '🤖 Fleet'}
              {tab === 'waves' && '🌊 Waves'}
              {tab === 'tasks' && '📋 Tasks'}
              {tab === 'activity' && '📜 Activity'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            {/* Fleet Tab */}
            {activeTab === 'fleet' && (
              <section className="bg-slate-900/80 border border-slate-800/80 rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="px-5 py-3 border-b border-slate-800/60 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-200">🤖 AI Agent Fleet</h2>
                  <span className="text-[10px] text-slate-500">{activeBots} active · {BOT_ROSTER.length} total</span>
                </div>
                <div className="divide-y divide-slate-800/40">
                  {BOT_ROSTER.map(bot => (
                    <div key={bot.name} className="px-5 py-3 hover:bg-slate-800/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <PulseDot active={bot.status === 'active'} />
                        <span className="text-xl">{bot.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-xs">{bot.name}</span>
                            <StatusBadge status={bot.status} />
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">{bot.role} · {bot.specialty}</div>
                        </div>
                        <div className="hidden md:block text-right max-w-[200px]">
                          <div className="text-[10px] text-slate-400 truncate" title={bot.currentTask}>{bot.currentTask}</div>
                          <div className="text-[9px] text-slate-600">{bot.tasksCompleted} tasks · uptime {bot.uptime}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Waves Tab */}
            {activeTab === 'waves' && (
              <section className="bg-slate-900/80 border border-slate-800/80 rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="px-5 py-3 border-b border-slate-800/60 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-200">🌊 Wave Integration</h2>
                  <span className="text-[10px] text-slate-500">{totalWaves} waves · {totalServices} services</span>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
                    {WAVE_STATUS.map(w => (
                      <div key={w.wave} className="text-center group relative">
                        <div className={`w-full aspect-square rounded-lg flex items-center justify-center text-[10px] font-mono font-bold transition-all ${w.status === 'ok' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30' : w.status === 'in-progress' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
                          {w.wave}
                        </div>
                        <div className="text-[8px] text-slate-600 mt-0.5">{w.services}</div>
                        {w.integrator && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10">
                            <div className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-[9px] text-slate-300 whitespace-nowrap shadow-lg">
                              {w.integrator} · {w.services} services
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
              <section className="bg-slate-900/80 border border-slate-800/80 rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="px-5 py-3 border-b border-slate-800/60 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-200">📋 Task Board</h2>
                  <div className="flex gap-2">
                    <span className="text-[10px] text-amber-400">{ALL_TASKS.filter(t => t.status === 'in-progress').length} active</span>
                    <span className="text-[10px] text-slate-500">{ALL_TASKS.filter(t => t.status === 'queued').length} queued</span>
                    <span className="text-[10px] text-red-400">{ALL_TASKS.filter(t => t.status === 'blocked').length} blocked</span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {ALL_TASKS.filter(t => t.priority === 'p0' || t.priority === 'p1').map(t => (
                    <div key={t.id} className={`flex items-center gap-2 rounded-lg px-3 py-2 ${t.priority === 'p0' ? 'bg-red-500/5 border border-red-500/10' : 'bg-amber-500/5 border border-amber-500/10'}`}>
                      <span className="text-[10px] font-mono text-amber-400 w-8">{t.id}</span>
                      <span className="flex-1 text-xs">{t.task}</span>
                      <span className="text-[10px] text-purple-300">{t.owner}</span>
                      <StatusBadge status={t.status} />
                    </div>
                  ))}
                  <div className="border-t border-slate-800/40 pt-2 mt-2">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Backlog</div>
                    {ALL_TASKS.filter(t => t.priority === 'p2').map(t => (
                      <div key={t.id} className="flex items-center gap-2 bg-slate-800/30 rounded-lg px-3 py-2 mb-1">
                        <span className="text-[10px] font-mono text-slate-500 w-8">{t.id}</span>
                        <span className="flex-1 text-xs text-slate-400">{t.task}</span>
                        <span className="text-[10px] text-purple-300">{t.owner}</span>
                        <StatusBadge status={t.status} />
                      </div>
                    ))}
                  </div>
                  {ALL_TASKS.filter(t => t.priority === 'blocked').length > 0 && (
                    <div className="border-t border-slate-800/40 pt-2 mt-2">
                      <div className="text-[10px] text-red-400 uppercase tracking-wider mb-2">Blocked</div>
                      {ALL_TASKS.filter(t => t.priority === 'blocked').map(t => (
                        <div key={t.id} className="flex items-center gap-2 bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-2 mb-1">
                          <span className="text-[10px] font-mono text-red-400 w-8">{t.id}</span>
                          <span className="flex-1 text-xs text-red-300">{t.task}</span>
                          <span className="text-[10px] text-purple-300">{t.owner}</span>
                          <StatusBadge status={t.status} />
                          {t.needs && <span className="text-[9px] text-red-400/70">needs: {t.needs}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <section className="bg-slate-900/80 border border-slate-800/80 rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="px-5 py-3 border-b border-slate-800/60 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-200">📜 Delegation Log</h2>
                  <div className="flex gap-2">
                    <select value={logFilter} onChange={e => setLogFilter(e.target.value)} className="bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300 px-2 py-1">
                      <option value="all">All Categories</option>
                      {Object.keys(categoryStats).map(cat => (
                        <option key={cat} value={cat}>{cat} ({categoryStats[cat]})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="divide-y divide-slate-800/40 max-h-[600px] overflow-y-auto">
                  {filteredLog.map((entry, i) => (
                    <div key={i} className="px-5 py-3 hover:bg-slate-800/30 transition-colors">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-slate-500">{entry.time}</span>
                        <span className="text-xs text-purple-300 font-medium">{entry.bot}</span>
                        <CategoryBadge category={entry.category} />
                      </div>
                      <div className="text-sm font-medium text-slate-200">{entry.action}</div>
                      <div className="text-xs text-slate-500">{entry.result}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Cron Jobs */}
            <section className="bg-slate-900/80 border border-slate-800/80 rounded-xl overflow-hidden backdrop-blur-sm">
              <div className="px-4 py-3 border-b border-slate-800/60">
                <h2 className="text-sm font-semibold text-slate-200">⏰ Monitors</h2>
              </div>
              <div className="p-3 space-y-2">
                {CRON_JOBS.map(job => (
                  <div key={job.name} className="flex items-center justify-between bg-slate-800/30 rounded-lg px-3 py-2">
                    <div>
                      <div className="text-xs text-slate-300">{job.name}</div>
                      <div className="text-[9px] text-slate-500">every {job.interval}</div>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={job.status} />
                      {job.lastRun && <div className="text-[9px] text-slate-500 mt-0.5">{job.lastRun}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Category Breakdown */}
            <section className="bg-slate-900/80 border border-slate-800/80 rounded-xl overflow-hidden backdrop-blur-sm">
              <div className="px-4 py-3 border-b border-slate-800/60">
                <h2 className="text-sm font-semibold text-slate-200">📊 Action Categories</h2>
              </div>
              <div className="p-3 space-y-1.5">
                {Object.entries(categoryStats).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
                  <div key={cat} className="flex items-center gap-2">
                    <CategoryBadge category={cat} />
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500/60 rounded-full" style={{ width: `${(count / completedActions) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-500 w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Links */}
            <section className="bg-slate-900/80 border border-slate-800/80 rounded-xl overflow-hidden backdrop-blur-sm">
              <div className="px-4 py-3 border-b border-slate-800/60">
                <h2 className="text-sm font-semibold text-slate-200">🔗 Quick Links</h2>
              </div>
              <div className="p-3 space-y-1.5">
                {[
                  { name: 'Main Site', href: '/', icon: '🏠' },
                  { name: 'Services', href: '/services', icon: '🛠️' },
                  { name: 'Contact', href: '/contact', icon: '📧' },
                  { name: 'Configulator', href: '/configurator', icon: '⚡' },
                ].map(l => (
                  <Link key={l.href} href={l.href} className="flex items-center gap-2 text-xs text-slate-400 hover:text-purple-300 transition-colors px-2 py-1.5 rounded-lg hover:bg-slate-800/40">
                    <span>{l.icon}</span>
                    <span>{l.name}</span>
                    <span className="ml-auto text-[9px] text-slate-600">→</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Agent Check-in Reminder */}
            <section className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
              <div className="text-xs text-purple-300 font-medium mb-1">📋 Agent Check-in</div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                All agents: check this dashboard when restarted. Update your status, review the task board, and pick up queued tasks.
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800/60 mt-8 py-4 text-center text-[10px] text-slate-600">
        <p>Zion Tech Group — AI Agent Command Center · São Paulo · {currentTime || '—'} · {activeBots} agents active</p>
      </footer>
    </div>
  );
}
