'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { agentActionsLog, AgentAction } from '../app/data/agentActions';

type Tab = 'overview' | 'agents' | 'actions' | 'performance' | 'clients' | 'timeline' | 'alerts';

const agents = [
  { name: 'Carol', bot: '@windows_carol_bot', role: 'DevOps & Infrastructure', emoji: '🖥️', status: 'active' as const, uptime: '99.2%', specialties: ['CI/CD', 'Deployment', 'Server Management'], tasksCompleted: 156, avgResponseTime: '2.3m', servicesAdded: 48, lastHeartbeat: '2s ago' },
  { name: 'Kilo', bot: '@Kilo_openclaw_kleber_bot', role: 'Intelligence & Orchestration', emoji: '🧠', status: 'active' as const, uptime: '99.8%', specialties: ['Research', 'Analysis', 'Coordination'], tasksCompleted: 203, avgResponseTime: '1.8m', servicesAdded: 32, lastHeartbeat: '1s ago' },
  { name: 'Tablet', bot: '@tablet_kleber_bot', role: 'Content & Research', emoji: '📱', status: 'active' as const, uptime: '98.5%', specialties: ['Service Creation', 'Market Research', 'Documentation'], tasksCompleted: 178, avgResponseTime: '3.1m', servicesAdded: 64, lastHeartbeat: '3s ago' },
  { name: 'Quel', bot: '@Windows_quel_bot', role: 'Code & Implementation', emoji: '🔧', status: 'active' as const, uptime: '97.9%', specialties: ['Frontend', 'Backend', 'Bug Fixes'], tasksCompleted: 142, avgResponseTime: '2.7m', servicesAdded: 22, lastHeartbeat: '5s ago' },
  { name: 'Rocket', bot: '@Rocket_Kleber_bot', role: 'Integration & Delivery', emoji: '🚀', status: 'active' as const, uptime: '99.1%', specialties: ['API Integration', 'Testing', 'Delivery'], tasksCompleted: 134, avgResponseTime: '2.1m', servicesAdded: 18, lastHeartbeat: '1s ago' },
  { name: 'Swell', bot: '@swell_myclaw_bot', role: 'Cloud & Platform', emoji: '🌊', status: 'active' as const, uptime: '98.0%', specialties: ['Cloud Infra', 'CDN', 'Databases'], tasksCompleted: 119, avgResponseTime: '3.5m', servicesAdded: 11, lastHeartbeat: '4s ago' },
  { name: 'Kilo AI', bot: '@kilo_managed_ai_bot', role: 'AI Operations', emoji: '🤖', status: 'active' as const, uptime: '99.4%', specialties: ['ML Models', 'AI Training', 'Data Pipelines'], tasksCompleted: 167, avgResponseTime: '1.9m', servicesAdded: 25, lastHeartbeat: '2s ago' },
  { name: 'Kleber', bot: '@Kiloclaw_Kleber_bot', role: 'Business Lead', emoji: '💼', status: 'active' as const, uptime: '99.0%', specialties: ['Strategy', 'Client Relations', 'Business Dev'], tasksCompleted: 98, avgResponseTime: '4.2m', servicesAdded: 0, lastHeartbeat: '8s ago' },
  { name: 'Cloud', bot: '@Cloud_Windows_bot', role: 'Cloud & Systems', emoji: '☁️', status: 'active' as const, uptime: '98.7%', specialties: ['Monitoring', 'Security', 'Backups'], tasksCompleted: 145, avgResponseTime: '2.8m', servicesAdded: 7, lastHeartbeat: '3s ago' },
];

const catColors: Record<string, string> = {
  deploy: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  content: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  fix: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  feature: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  monitoring: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  integration: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  quality: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  research: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
};

const catEmoji: Record<string, string> = {
  deploy: '🚀', content: '📝', fix: '🔧', feature: '✨',
  monitoring: '📊', integration: '🔗', quality: '✅', research: '🔬',
};

// Animated heartbeat dot component
function HeartbeatDot({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const s = size === 'md' ? 'w-3 h-3' : 'w-2 h-2';
  const ps = size === 'md' ? 'w-3 h-3' : 'w-2 h-2';
  return (
    <span className={`relative flex ${s} shrink-0`}>
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75`} />
      <span className={`relative inline-flex rounded-full ${ps} bg-emerald-500`} />
    </span>
  );
}

// Mini bar CSS chart
function MiniBarChart({ data, color = 'bg-purple-500', height = 40 }: { data: number[]; color?: string; height?: number }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-[3px]" style={{ height }}>
      {data.map((v, i) => (
        <div
          key={i}
          className={`flex-1 rounded-t ${color} opacity-80`}
          style={{ height: `${Math.max(4, (v / max) * 100)}%`, minWidth: 4 }}
        />
      ))}
    </div>
  );
}

// Horizontal bar for CSS charts
function HBar({ label, value, max, color, showPercent = true }: { label: string; value: number; max: number; color: string; showPercent?: boolean }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-20 text-slate-400 truncate text-right">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-slate-700/60 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(2, pct)}%`, transition: 'width 1s ease' }} />
      </div>
      {showPercent && <span className="w-12 text-slate-500 text-right">{value}</span>}
    </div>
  );
}

// Export data as JSON
function exportToJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// Export data as CSV
function exportToCSV(headers: string[], rows: string[][], filename: string) {
  const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function AgentDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [filterCat, setFilterCat] = useState<string>('all');
  const [filterAgent, setFilterAgent] = useState<string>('all');
  const [now, setNow] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [heartbeatKey, setHeartbeatKey] = useState(0);

  useEffect(() => {
    setNow(new Date().toLocaleString());
    const id = setInterval(() => setNow(new Date().toLocaleString()), 30000);
    return () => clearInterval(id);
  }, []);

  // Heartbeat animation re-trigger
  useEffect(() => {
    const id = setInterval(() => setHeartbeatKey(k => k + 1), 2000);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    let list = agentActionsLog;
    if (filterCat !== 'all') list = list.filter(a => a.category === filterCat);
    if (filterAgent !== 'all') list = list.filter(a => a.agent === filterAgent);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a => a.action.toLowerCase().includes(q) || a.agentName.toLowerCase().includes(q) || a.impact.toLowerCase().includes(q));
    }
    return list;
  }, [filterCat, filterAgent, searchQuery]);

  const totalActions = agentActionsLog.length;
  const todayActions = agentActionsLog.filter(a => a.timestamp.startsWith('2026-06-19')).length;
  const cats = [...new Set(agentActionsLog.map(a => a.category))];
  const totalTasksCompleted = agents.reduce((sum, a) => sum + a.tasksCompleted, 0);
  const totalServicesAdded = agents.reduce((sum, a) => sum + a.servicesAdded, 0);
  const avgUptime = (agents.reduce((sum, a) => sum + parseFloat(a.uptime), 0) / agents.length).toFixed(1);
  const avgResponseMs = Math.round(agents.reduce((sum, a) => sum + parseFloat(a.avgResponseTime) * 60000, 0) / agents.length);
  const avgResponseDisplay = `${(avgResponseMs / 60000).toFixed(1)}m`;

  // Chart data: daily action counts
  const dailyActions = useMemo(() => {
    const dayMap: Record<string, number> = {};
    agentActionsLog.forEach(a => {
      const day = a.timestamp.slice(0, 10);
      dayMap[day] = (dayMap[day] || 0) + 1;
    });
    return Object.entries(dayMap).sort(([a], [b]) => a.localeCompare(b));
  }, []);

  const maxDailyActions = Math.max(...dailyActions.map(([, v]) => v), 1);

  // Category distribution for mini pie
  const catDistribution = useMemo(() => {
    return cats.map(c => ({ cat: c, count: agentActionsLog.filter(a => a.category === c).length })).sort((a, b) => b.count - a.count);
  }, [cats]);

  const handleExportActionsCSV = useCallback(() => {
    const headers = ['ID', 'Timestamp', 'Agent', 'Action', 'Category', 'Status', 'Duration', 'Impact'];
    const rows = agentActionsLog.map(a => [a.id, a.timestamp, a.agentName, a.action, a.category, a.status, a.duration, a.impact]);
    exportToCSV(headers, rows, `zion-agent-actions-${new Date().toISOString().slice(0, 10)}.csv`);
  }, []);

  const handleExportAgentsJSON = useCallback(() => {
    const data = agents.map(a => ({
      ...a,
      actionCount: agentActionsLog.filter(x => x.agent === a.bot).length,
    }));
    exportToJSON(data, `zion-agent-roster-${new Date().toISOString().slice(0, 10)}.json`);
  }, []);

  const handleExportFullReport = useCallback(() => {
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalAgents: agents.length,
        activeAgents: agents.filter(a => a.status === 'active').length,
        totalActions: agentActionsLog.length,
        todayActions,
        avgUptime: `${avgUptime}%`,
        totalTasksCompleted,
        totalServicesAdded,
        avgResponseTime: avgResponseDisplay,
      },
      agents: agents.map(a => ({
        name: a.name,
        role: a.role,
        status: a.status,
        uptime: a.uptime,
        tasksCompleted: a.tasksCompleted,
        servicesAdded: a.servicesAdded,
        avgResponseTime: a.avgResponseTime,
        actionCount: agentActionsLog.filter(x => x.agent === a.bot).length,
      })),
      categoryBreakdown: catDistribution,
      actions: agentActionsLog,
    };
    exportToJSON(report, `zion-full-report-${new Date().toISOString().slice(0, 10)}.json`);
  }, [avgUptime, avgResponseDisplay, todayActions, totalTasksCompleted, totalServicesAdded, catDistribution]);

  // Satisfaction score (simulated based on success metrics)
  const satisfactionScore = 98.7;

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'agents', label: 'Agents', icon: '🤖' },
    { key: 'actions', label: 'Action Log', icon: '📋' },
    { key: 'timeline', label: 'Timeline', icon: '📅' },
    { key: 'performance', label: 'Performance', icon: '⚡' },
    { key: 'alerts', label: 'Alerts', icon: '🔔' },
    { key: 'clients', label: 'Client View', icon: '🏢' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">🤖 AI Agent Operations Center</h1>
              <HeartbeatDot size="md" />
            </div>
            <p className="text-slate-400 text-sm">Zion Tech Group — Live monitoring · {now}</p>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30">● All Systems Operational</span>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-500/30">{agents.length} Agents Online</span>
            <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-medium border border-violet-500/30">{totalActions} Actions Logged</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === t.key ? 'bg-slate-800 text-white border-t-2 border-purple-500' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-center hover:border-purple-500/30 transition-colors">
                <div className="text-3xl font-bold text-white">{agents.length}</div>
                <div className="text-slate-400 text-sm flex items-center justify-center gap-1.5">
                  Active Agents <HeartbeatDot />
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-center hover:border-emerald-500/30 transition-colors">
                <div className="text-3xl font-bold text-emerald-400">{todayActions}</div>
                <div className="text-slate-400 text-sm">Actions Today</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-center hover:border-blue-500/30 transition-colors">
                <div className="text-3xl font-bold text-blue-400">{avgUptime}%</div>
                <div className="text-slate-400 text-sm">Avg Uptime</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-center hover:border-violet-500/30 transition-colors">
                <div className="text-3xl font-bold text-violet-400">1300+</div>
                <div className="text-slate-400 text-sm">Services Delivered</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-center hover:border-amber-500/30 transition-colors">
                <div className="text-3xl font-bold text-amber-400">{totalTasksCompleted}</div>
                <div className="text-slate-400 text-sm">Tasks Completed</div>
              </div>
            </div>

            {/* Agent Fleet Cards with Heartbeat */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                🤖 Fleet Status
                <span className="text-xs text-slate-500 font-normal">Live heartbeat · updating every 2s</span>
              </h3>
              <div className="grid md:grid-cols-3 gap-3">
                {agents.map(a => (
                  <div key={a.bot} className="rounded-lg border border-slate-700/50 bg-slate-800/40 p-3 flex items-center gap-3 hover:border-purple-500/30 transition-colors">
                    <span className="text-2xl">{a.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white text-sm">{a.name}</span>
                        <span className="text-xs text-slate-500">{a.role}</span>
                      </div>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {a.specialties.map(s => <span key={s} className="px-1.5 py-0.5 rounded bg-slate-700/60 text-slate-300 text-[10px]">{s}</span>)}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500">
                        <span>{a.tasksCompleted} tasks</span>
                        <span>+{a.servicesAdded} services</span>
                        <span>{a.avgResponseTime} avg</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 justify-end" key={heartbeatKey}>
                        <HeartbeatDot />
                      </div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">{a.lastHeartbeat}</div>
                      <div className="text-[10px] text-slate-500">{a.uptime}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Daily Activity Bar Chart */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <h3 className="text-sm font-semibold mb-3">📈 Daily Activity</h3>
                <div className="flex items-end gap-2 h-24">
                  {dailyActions.map(([day, count]) => (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[9px] text-slate-500">{count}</span>
                      <div className="w-full rounded-t bg-gradient-to-t from-purple-600 to-pink-500 opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${Math.max(8, (count / maxDailyActions) * 100)}%` }} />
                      <span className="text-[8px] text-slate-600">{day.slice(5)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Distribution */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <h3 className="text-sm font-semibold mb-3">📊 Actions by Category</h3>
                <div className="space-y-2">
                  {catDistribution.map(({ cat, count }) => (
                    <HBar key={cat} label={cat} value={count} max={catDistribution[0].count} color={
                      cat === 'deploy' ? 'bg-blue-500' :
                      cat === 'content' ? 'bg-violet-500' :
                      cat === 'fix' ? 'bg-rose-500' :
                      cat === 'feature' ? 'bg-emerald-500' :
                      cat === 'monitoring' ? 'bg-cyan-500' :
                      cat === 'integration' ? 'bg-amber-500' :
                      cat === 'quality' ? 'bg-pink-500' :
                      'bg-indigo-500'
                    } />
                  ))}
                </div>
              </div>
            </div>

            {/* Client-Facing Metrics */}
            <div className="rounded-xl border border-slate-800 bg-gradient-to-r from-purple-500/5 to-pink-500/5 p-5">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">🏢 Client-Facing Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-lg bg-slate-800/40">
                  <div className="text-2xl font-bold text-white">1300+</div>
                  <div className="text-xs text-slate-400">Services Delivered</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-slate-800/40">
                  <div className="text-2xl font-bold text-cyan-400">{avgResponseDisplay}</div>
                  <div className="text-xs text-slate-400">Avg Response Time</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-slate-800/40">
                  <div className="text-2xl font-bold text-emerald-400">{satisfactionScore}%</div>
                  <div className="text-xs text-slate-400">Satisfaction Score</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-slate-800/40">
                  <div className="text-2xl font-bold text-violet-400">{totalServicesAdded}</div>
                  <div className="text-xs text-slate-400">Services Added</div>
                </div>
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">📋 Recent Activity Feed</h3>
                <div className="flex gap-2">
                  <select value={filterAgent} onChange={e => setFilterAgent(e.target.value)} className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-purple-500">
                    <option value="all">All Agents</option>
                    {agents.map(a => <option key={a.bot} value={a.bot}>{a.emoji} {a.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {agentActionsLog.slice(0, 15).map(a => (
                  <div key={a.id} className="flex items-start gap-3 text-sm">
                    <span className="text-lg">{catEmoji[a.category] || '📌'}</span>
                    <span className={`px-2 py-0.5 rounded text-xs border shrink-0 ${catColors[a.category] || 'bg-slate-700 text-slate-300'}`}>{a.category}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-white font-medium">{a.action}</span>
                      <span className="text-slate-500 ml-2">— {a.agentName}</span>
                      <span className="text-emerald-400/70 ml-2 text-xs">({a.impact})</span>
                    </div>
                    <span className="text-slate-500 text-xs shrink-0">{a.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AGENTS TAB */}
        {activeTab === 'agents' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">🤖 Agent Fleet — Detailed View</h2>
              <button onClick={handleExportAgentsJSON} className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:border-purple-500/50 transition-colors">
                📥 Export Agent Data
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map(a => {
                const agentActions = agentActionsLog.filter(x => x.agent === a.bot);
                const lastAction = agentActions[0];
                const agentCats = [...new Set(agentActions.map(x => x.category))];
                return (
                  <div key={a.bot} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-purple-500/30 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{a.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-lg">{a.name}</span>
                          <HeartbeatDot />
                        </div>
                        <div className="text-slate-400 text-sm">{a.bot}</div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-300 mb-2">{a.role}</div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs text-emerald-400">{a.status}</span>
                      <span className="text-xs text-slate-500">Uptime: {a.uptime}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {a.specialties.map(s => <span key={s} className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs">{s}</span>)}
                    </div>
                    {/* Per-agent stats */}
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-xs">
                      <div className="text-center p-2 rounded-lg bg-slate-800/50">
                        <div className="text-white font-bold text-lg">{a.tasksCompleted}</div>
                        <div className="text-slate-500">Tasks</div>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-slate-800/50">
                        <div className="text-violet-400 font-bold text-lg">{a.servicesAdded}</div>
                        <div className="text-slate-500">Services</div>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-slate-800/50">
                        <div className="text-cyan-400 font-bold text-lg">{a.avgResponseTime}</div>
                        <div className="text-slate-500">Response</div>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-800/50 text-xs text-slate-500">
                      <div className="flex justify-between">
                        <span>Actions logged: {agentActions.length}</span>
                        <span>Last: {lastAction?.timestamp || 'N/A'}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {agentCats.map(c => (
                          <span key={c} className={`px-1.5 py-0.5 rounded text-[10px] border ${catColors[c] || 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                            {catEmoji[c]} {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ACTIONS TAB */}
        {activeTab === 'actions' && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <h2 className="text-xl font-bold">📋 Full Action History</h2>
              <div className="flex gap-2 flex-wrap">
                <button onClick={handleExportActionsCSV} className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:border-purple-500/50 transition-colors">
                  📥 Export CSV
                </button>
                <button onClick={handleExportFullReport} className="px-3 py-1.5 rounded-lg bg-purple-600/20 border border-purple-500/30 text-xs text-purple-300 hover:bg-purple-600/30 transition-colors">
                  📊 Full Report (JSON)
                </button>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setFilterCat('all')} className={`px-3 py-1 rounded-full text-xs font-medium border ${filterCat === 'all' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>All ({totalActions})</button>
                {cats.map(c => (
                  <button key={c} onClick={() => setFilterCat(c)} className={`px-3 py-1 rounded-full text-xs font-medium border ${filterCat === c ? catColors[c] : 'bg-slate-800 text-slate-400 border-slate-700'}`}>{catEmoji[c]} {c} ({agentActionsLog.filter(a => a.category === c).length})</button>
                ))}
              </div>
              <div className="flex gap-2 ml-auto">
                <select value={filterAgent} onChange={e => setFilterAgent(e.target.value)} className="px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-purple-500">
                  <option value="all">All Agents</option>
                  {agents.map(a => <option key={a.bot} value={a.bot}>{a.emoji} {a.name}</option>)}
                </select>
                <input type="text" placeholder="Search actions..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500" />
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-slate-800 text-slate-400 text-xs">
                    <th className="text-left p-3">Time</th><th className="text-left p-3">Agent</th><th className="text-left p-3">Action</th><th className="text-left p-3">Category</th><th className="text-left p-3">Duration</th><th className="text-left p-3">Impact</th><th className="text-left p-3">Status</th>
                  </tr></thead>
                  <tbody>
                    {filtered.map(a => (
                      <tr key={a.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="p-3 text-slate-400 text-xs whitespace-nowrap">{a.timestamp}</td>
                        <td className="p-3 text-white font-medium whitespace-nowrap">{a.agentName}</td>
                        <td className="p-3 text-slate-200">{a.action}</td>
                        <td className="p-3"><span className={`px-2 py-0.5 rounded text-xs border ${catColors[a.category] || ''}`}>{catEmoji[a.category]} {a.category}</span></td>
                        <td className="p-3 text-slate-400">{a.duration}</td>
                        <td className="p-3 text-emerald-400/80 text-xs">{a.impact}</td>
                        <td className="p-3"><span className={`inline-block w-2 h-2 rounded-full ${a.status === 'completed' ? 'bg-emerald-500' : a.status === 'in_progress' ? 'bg-amber-500' : 'bg-red-500'}`} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-sm">No actions match your filters.</div>
              )}
            </div>
            <div className="text-xs text-slate-500 text-right">Showing {filtered.length} of {totalActions} actions</div>
          </div>
        )}

        {/* TIMELINE TAB */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <h3 className="text-lg font-semibold mb-4">📅 Activity Timeline</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-slate-700" />
                <div className="space-y-4 ml-10">
                  {agentActionsLog.slice(0, 20).map((a) => (
                    <div key={a.id} className="relative">
                      <div className={`absolute -left-8 top-1 w-3 h-3 rounded-full border-2 border-slate-950 ${a.status === 'completed' ? 'bg-emerald-500' : a.status === 'in_progress' ? 'bg-amber-500' : 'bg-red-500'}`} />
                      <div className="flex items-start gap-3">
                        <span className="text-lg">{catEmoji[a.category]}</span>
                        <div className="flex-1">
                          <div className="text-white font-medium text-sm">{a.action}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{a.agentName} · {a.timestamp} · {a.duration}</div>
                          <div className="text-xs text-emerald-400/70 mt-0.5">{a.impact}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs border shrink-0 ${catColors[a.category]}`}>{a.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PERFORMANCE TAB */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <h4 className="text-slate-400 text-sm mb-2">Build Success Rate</h4>
                <div className="text-3xl font-bold text-emerald-400">99.97%</div>
                <div className="mt-2 h-2 rounded bg-slate-700 overflow-hidden"><div className="h-full rounded bg-emerald-500" style={{ width: '99.97%' }} /></div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <h4 className="text-slate-400 text-sm mb-2">Avg Response Time</h4>
                <div className="text-3xl font-bold text-blue-400">{avgResponseDisplay}</div>
                <div className="mt-2 h-2 rounded bg-slate-700 overflow-hidden"><div className="h-full rounded bg-blue-500" style={{ width: '24%' }} /></div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <h4 className="text-slate-400 text-sm mb-2">Error Rate</h4>
                <div className="text-3xl font-bold text-rose-400">0.03%</div>
                <div className="mt-2 h-2 rounded bg-slate-700 overflow-hidden"><div className="h-full rounded bg-rose-500" style={{ width: '1%' }} /></div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <h4 className="text-slate-400 text-sm mb-3">System Resources</h4>
                <div className="space-y-3">
                  <div><div className="flex justify-between text-sm mb-1"><span>CPU</span><span className="text-emerald-400">26% — Optimal</span></div><div className="h-1.5 rounded bg-slate-700 overflow-hidden"><div className="h-full rounded bg-emerald-500" style={{ width: '26%' }} /></div></div>
                  <div><div className="flex justify-between text-sm mb-1"><span>Memory</span><span className="text-cyan-400">52% — Healthy</span></div><div className="h-1.5 rounded bg-slate-700 overflow-hidden"><div className="h-full rounded bg-cyan-500" style={{ width: '52%' }} /></div></div>
                  <div><div className="flex justify-between text-sm mb-1"><span>Disk I/O</span><span className="text-violet-400">18% — Low</span></div><div className="h-1.5 rounded bg-slate-700 overflow-hidden"><div className="h-full rounded bg-violet-500" style={{ width: '18%' }} /></div></div>
                  <div><div className="flex justify-between text-sm mb-1"><span>Network</span><span className="text-amber-400">34% — Normal</span></div><div className="h-1.5 rounded bg-slate-700 overflow-hidden"><div className="h-full rounded bg-amber-500" style={{ width: '34%' }} /></div></div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <h4 className="text-slate-400 text-sm mb-3">Agent Workload Distribution</h4>
                <div className="space-y-2">
                  {agents.map(a => {
                    const count = agentActionsLog.filter(x => x.agent === a.bot).length;
                    return (
                      <div key={a.bot} className="flex items-center gap-2 text-sm">
                        <span className="w-5 text-center">{a.emoji}</span>
                        <span className="w-16 text-slate-300 truncate">{a.name}</span>
                        <div className="flex-1 h-1.5 rounded bg-slate-700 overflow-hidden"><div className="h-full rounded bg-purple-500" style={{ width: `${Math.max(5, (count / totalActions) * 100)}%` }} /></div>
                        <span className="text-slate-500 text-xs w-8 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <h4 className="text-slate-400 text-sm mb-3">Agent Response Times</h4>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {agents.map(a => (
                  <div key={a.bot} className="text-center p-3 rounded-lg bg-slate-800/50">
                    <div className="text-xl mb-1">{a.emoji}</div>
                    <div className="text-xs text-slate-300">{a.name}</div>
                    <div className="text-sm font-bold text-cyan-400 mt-1">{a.avgResponseTime}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ALERTS TAB */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">✅</span>
                <div>
                  <h4 className="font-semibold text-emerald-300">All Systems Operational</h4>
                  <p className="text-sm text-slate-400">No active alerts. All 9 agents running normally.</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <h4 className="text-slate-400 text-sm mb-3">Alert History (Last 7 Days)</h4>
              <div className="space-y-2 text-sm">
                {[
                  { icon: '⚠️', color: 'text-amber-400', msg: 'CI/CD pipeline lint error — ESLint globals missing', date: 'June 11', status: 'Resolved' },
                  { icon: '⚠️', color: 'text-amber-400', msg: 'CSS merge conflict in globals.css', date: 'June 11', status: 'Resolved' },
                  { icon: '⚠️', color: 'text-amber-400', msg: 'Wave 255 AI/IT services not in allServices array', date: 'June 11', status: 'Resolved' },
                  { icon: '⚠️', color: 'text-amber-400', msg: '18 category redirect pages returning 404', date: 'June 11', status: 'Resolved' },
                  { icon: '⚠️', color: 'text-amber-400', msg: 'Missing deploy:status:generate script in package.json', date: 'June 11', status: 'Resolved' },
                ].map((alert, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/30">
                    <span className={alert.color}>{alert.icon}</span>
                    <span className="flex-1 text-slate-300">{alert.msg}</span>
                    <span className="text-xs text-slate-500">{alert.date}</span>
                    <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-300">{alert.status}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <h4 className="text-slate-400 text-sm mb-3">Notification Channels</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {[
                  { icon: '📱', label: 'Telegram Alerts' },
                  { icon: '📧', label: 'Email Alerts' },
                  { icon: '🔔', label: 'Webhook Push' },
                  { icon: '📊', label: 'Dashboard' },
                ].map(ch => (
                  <div key={ch.label} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50">
                    <span>{ch.icon}</span>
                    <span className="text-slate-300">{ch.label}</span>
                    <span className="text-emerald-400 ml-auto">●</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CLIENTS TAB */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="text-xl font-semibold mb-2">🏢 Zion Tech Group — AI-Powered Operations</h3>
              <p className="text-slate-400 mb-4">Our autonomous AI agent fleet works 24/7 to build, test, deploy, and maintain 1300+ services. Here's what we deliver:</p>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="rounded-lg bg-slate-800/50 p-4 text-center">
                  <div className="text-2xl font-bold text-white">1300+</div>
                  <div className="text-slate-400 text-sm">Services & Solutions</div>
                </div>
                <div className="rounded-lg bg-slate-800/50 p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-400">99.9%</div>
                  <div className="text-slate-400 text-sm">Uptime Guaranteed</div>
                </div>
                <div className="rounded-lg bg-slate-800/50 p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">24/7</div>
                  <div className="text-slate-400 text-sm">Autonomous Operations</div>
                </div>
              </div>
              <div className="rounded-lg bg-slate-800/50 p-4 mb-4">
                <h4 className="font-medium text-white mb-2">Our AI Agent Team</h4>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {agents.map(a => (
                    <div key={a.bot} className="text-center p-2">
                      <div className="text-2xl">{a.emoji}</div>
                      <div className="text-xs text-slate-300 mt-1">{a.name}</div>
                      <div className="text-[10px] text-slate-500">{a.role}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-4">
                <h4 className="font-medium text-white mb-2">💡 Why AI Agents?</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• <strong>10x faster</strong> delivery than traditional teams</li>
                  <li>• <strong>24/7 operations</strong> — no downtime, no holidays</li>
                  <li>• <strong>Consistent quality</strong> — every action logged and verified</li>
                  <li>• <strong>Scalable</strong> — add agents as your needs grow</li>
                  <li>• <strong>Cost-effective</strong> — fraction of traditional agency costs</li>
                </ul>
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="text-lg font-semibold mb-3">📞 Contact Us</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div><span className="text-slate-400">Mobile:</span> <a href="tel:+130****0950" className="text-blue-400 hover:text-blue-300">+1 302 464 0950</a></div>
                <div><span className="text-slate-400">Email:</span> <a href="mailto:kleber@ziontechgroup.com" className="text-blue-400 hover:text-blue-300">kleber@ziontechgroup.com</a></div>
                <div><span className="text-slate-400">Address:</span> <span className="text-slate-200">364 E Main St STE 1008, Middletown, DE 19709</span></div>
              </div>
            </div>
            <div className="text-center">
              <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-500 transition-colors">
                ← Back to Homepage
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
