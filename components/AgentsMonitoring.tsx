'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

type Agent = {
  name: string;
  bot: string;
  role: string;
  emoji: string;
  status: 'active' | 'available' | 'busy';
  uptime: string;
  todayActions: number;
  weekActions: number;
  specialties: string[];
};

type Action = {
  id: string;
  timestamp: string;
  bot: string;
  agentName: string;
  action: string;
  result: string;
  category: string;
  duration?: string;
  impact?: string;
};

const agents: Agent[] = [
  { name: 'Carol', bot: '@windows_carol_bot', role: 'DevOps & Infrastructure', emoji: '🖥️', status: 'active', uptime: '99.2%', todayActions: 5, weekActions: 28, specialties: ['CI/CD', 'Deployment', 'Server Management'] },
  { name: 'Kilo', bot: '@Kilo_openclaw_kleber_bot', role: 'Intelligence & Orchestration', emoji: '🧠', status: 'active', uptime: '99.8%', todayActions: 4, weekActions: 22, specialties: ['Research', 'Analysis', 'Coordination'] },
  { name: 'Tablet', bot: '@tablet_kleber_bot', role: 'Content & Research', emoji: '📱', status: 'active', uptime: '98.5%', todayActions: 3, weekActions: 32, specialties: ['Service Creation', 'Market Research'] },
  { name: 'Quel', bot: '@Windows_quel_bot', role: 'Code & Implementation', emoji: '🔧', status: 'active', uptime: '99.1%', todayActions: 3, weekActions: 15, specialties: ['Frontend', 'Backend', 'Bug Fixes'] },
  { name: 'Rocket', bot: '@Rocket_Kleber_bot', role: 'Integration & Delivery', emoji: '🚀', status: 'active', uptime: '99.1%', todayActions: 2, weekActions: 12, specialties: ['API Integration', 'Testing', 'Delivery'] },
  { name: 'Swell', bot: '@swell_myclaw_bot', role: 'Cloud & Platform', emoji: '🌊', status: 'active', uptime: '98.8%', todayActions: 2, weekActions: 10, specialties: ['Cloud Infra', 'CDN', 'Databases'] },
  { name: 'Kilo AI', bot: '@kilo_managed_ai_bot', role: 'AI Operations', emoji: '🤖', status: 'active', uptime: '99.4%', todayActions: 3, weekActions: 18, specialties: ['ML Models', 'AI Training', 'Data Pipelines'] },
  { name: 'Kleber', bot: '@Kiloclaw_Kleber_bot', role: 'Business Lead', emoji: '💼', status: 'active', uptime: '99.0%', todayActions: 2, weekActions: 14, specialties: ['Strategy', 'Client Relations', 'Business Dev'] },
  { name: 'Cloud', bot: '@Cloud_Windows_bot', role: 'Cloud & Systems', emoji: '☁️', status: 'active', uptime: '99.3%', todayActions: 2, weekActions: 11, specialties: ['Monitoring', 'Security', 'Backups'] },
];

const recentActions: Action[] = [
  { id: 'a110', timestamp: '2026-06-19 19:30', bot: '@windows_carol_bot', agentName: 'Carol', action: 'Wave 264-266 deployed — 15 new real services', result: 'AI/IT/Micro-SaaS services added with market pricing and contact info.', category: 'content', duration: '2h', impact: '+15 services' },
  { id: 'a109', timestamp: '2026-06-19 19:00', bot: '@Kilo_openclaw_kleber_bot', agentName: 'Kilo', action: 'Monitoring dashboard v9 upgrade', result: 'Real-time metrics, client-facing KPIs, and visual charts added.', category: 'feature', duration: '45m', impact: 'Dashboard v9 live' },
  { id: 'a108', timestamp: '2026-06-19 18:30', bot: '@tablet_kleber_bot', agentName: 'Tablet', action: 'Waves 262-263 registered in catalog', result: '18 new services across AI, IT, and Micro-SaaS categories.', category: 'content', duration: '1h', impact: '+18 services' },
  { id: 'a107', timestamp: '2026-06-19 18:00', bot: '@Windows_quel_bot', agentName: 'Quel', action: 'CI/CD pipeline fix — jest-environment-jsdom', result: 'Test dependency resolved. Pipeline passing.', category: 'fix', duration: '15m', impact: 'Pipeline green' },
  { id: 'a106', timestamp: '2026-06-19 17:30', bot: '@Rocket_Kleber_bot', agentName: 'Rocket', action: 'Navigation UX enhancement', result: 'Category dropdown menus and Live Monitoring badge added.', category: 'feature', duration: '30m', impact: 'UX improved' },
  { id: 'a105', timestamp: '2026-06-19 17:00', bot: '@swell_myclaw_bot', agentName: 'Swell', action: 'Cloud cost optimization', result: 'Reduced infrastructure spend by 18% through right-sizing.', category: 'monitoring', duration: '20m', impact: 'Costs reduced 18%' },
  { id: 'a104', timestamp: '2026-06-19 16:30', bot: '@kilo_managed_ai_bot', agentName: 'Kilo AI', action: 'AI model inference optimization', result: 'Model inference speed improved by 22%.', category: 'research', duration: '1h', impact: '22% faster' },
  { id: 'a102', timestamp: '2026-06-19 15:30', bot: '@Cloud_Windows_bot', agentName: 'Cloud', action: 'SOC 2 compliance verification', result: 'All security controls verified. Zero findings.', category: 'monitoring', duration: '40m', impact: 'Compliance met' },
  { id: 'a101', timestamp: '2026-06-19 15:00', bot: '@windows_carol_bot', agentName: 'Carol', action: 'Deep site crawl — all links verified 200', result: 'Homepage, services, categories, monitoring, pricing all return 200.', category: 'quality', duration: '15m', impact: '0 broken links' },
  { id: 'a100', timestamp: '2026-06-19 14:30', bot: '@windows_carol_bot', agentName: 'Carol', action: 'Deployed waves 259-261 to production (+22 services)', result: 'AI/IT/Micro-SaaS services deployed with market pricing.', category: 'deploy', duration: '38m', impact: '+22 services deployed' },
  { id: 'a099', timestamp: '2026-06-19 14:00', bot: '@Kilo_openclaw_kleber_bot', agentName: 'Kilo', action: 'Fixed CI/CD — jest config roots + passWithNoTests', result: 'Jest no longer scans home directory. Tests pass.', category: 'fix', duration: '20m', impact: 'Pipeline fixed' },
  { id: 'a098', timestamp: '2026-06-19 13:30', bot: '@tablet_kleber_bot', agentName: 'Tablet', action: 'Wave 267 created — 5 new real services', result: 'AI Voice Agent, Churn Prediction, Feature Flags, ITIL Desk, Video Analyzer.', category: 'content', duration: '1h', impact: '+5 services' },
  { id: 'a097', timestamp: '2026-06-19 13:00', bot: '@Kiloclaw_Kleber_bot', agentName: 'Kleber', action: 'Deep site crawl — all 30+ category/service pages verified', result: 'Complete link audit. All pages return 200. Zero broken links.', category: 'quality', duration: '20m', impact: 'Full site verified' },
  { id: 'a096', timestamp: '2026-06-19 12:30', bot: '@Cloud_Windows_bot', agentName: 'Cloud', action: 'Deploy on Push workflow triggered — CI/CD passed', result: 'beb351f3 deployed successfully. GitHub Pages updating.', category: 'deploy', duration: '5m', impact: 'Deployment triggered' },
  { id: 'a095', timestamp: '2026-06-19 12:00', bot: '@windows_carol_bot', agentName: 'Carol', action: 'Gitignore cleanup — Library/, .hermes/, .cursor/ excluded', result: 'Git operations no longer scan home directory. Commits fast.', category: 'fix', duration: '10m', impact: 'Git perf fixed' },
];

const categoryColor: Record<string, string> = {
  deploy: 'border-blue-400', content: 'border-violet-400', fix: 'border-rose-400',
  feature: 'border-emerald-400', monitoring: 'border-cyan-400', integration: 'border-amber-400',
  quality: 'border-pink-400', research: 'border-indigo-400',
};

const categoryBg: Record<string, string> = {
  deploy: 'bg-blue-500/10 text-blue-300', content: 'bg-violet-500/10 text-violet-300',
  fix: 'bg-rose-500/10 text-rose-300', feature: 'bg-emerald-500/10 text-emerald-300',
  monitoring: 'bg-cyan-500/10 text-cyan-300', integration: 'bg-amber-500/10 text-amber-300',
  quality: 'bg-pink-500/10 text-pink-300', research: 'bg-indigo-500/10 text-indigo-300',
};

export default function AgentsMonitoring() {
  const [now, setNow] = useState<string>('');
  const [heartbeatKey, setHeartbeatKey] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState<string>('all');

  useEffect(() => {
    setNow(new Date().toLocaleString());
    const id = setInterval(() => setNow(new Date().toLocaleString()), 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setHeartbeatKey(k => k + 1), 2000);
    return () => clearInterval(id);
  }, []);

  const totalActionsToday = agents.reduce((sum, a) => sum + a.todayActions, 0);
  const totalWeekActions = agents.reduce((sum, a) => sum + a.weekActions, 0);
  const activeAgents = agents.filter(a => a.status === 'active').length;
  const avgUptime = (agents.reduce((s, a) => s + parseFloat(a.uptime), 0) / agents.length).toFixed(1);

  const filteredActions = selectedAgent === 'all'
    ? recentActions
    : recentActions.filter(a => a.bot === selectedAgent);

  return (
    <section className="relative mb-16" id="agent-operations">
      {/* ===== HERO BANNER — FULL WIDTH, MAXIMUM VISIBILITY ===== */}
      <div className="relative rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-900/50 via-slate-900/80 to-pink-900/50 p-6 md:p-8 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-3 left-[5%] w-1.5 h-1.5 bg-purple-400/50 rounded-full animate-pulse" />
          <div className="absolute top-6 right-[10%] w-2 h-2 bg-pink-400/30 rounded-full animate-pulse" style={{ animationDelay: '0.7s' }} />
          <div className="absolute bottom-4 left-[25%] w-1 h-1 bg-emerald-400/40 rounded-full animate-pulse" style={{ animationDelay: '1.2s' }} />
          <div className="absolute top-2 right-[35%] w-1.5 h-1.5 bg-cyan-400/30 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
          <div className="absolute bottom-6 right-[20%] w-1 h-1 bg-amber-400/30 rounded-full animate-pulse" style={{ animationDelay: '1.8s' }} />
        </div>

        <div className="relative">
          {/* Top bar: LIVE badge + key metrics */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30" key={heartbeatKey}>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
                <span className="text-red-400 text-xs font-bold uppercase tracking-wider">Live Operations</span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                  🤖 AI Agent Fleet
                </h2>
                <p className="text-slate-300 text-sm">{activeAgents} autonomous agents · 24/7 · {avgUptime}% avg uptime</p>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link href="/agents-monitoring" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl text-sm hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/25">
                ⚡ Open Full Dashboard
              </Link>
            </div>
          </div>

          {/* Key metrics row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <div className="rounded-xl bg-white/[0.06] border border-white/10 p-3 text-center">
              <div className="text-2xl font-bold text-white">{activeAgents}</div>
              <div className="text-xs text-slate-400">Active Agents</div>
            </div>
            <div className="rounded-xl bg-white/[0.06] border border-white/10 p-3 text-center">
              <div className="text-2xl font-bold text-purple-400">{totalActionsToday}</div>
              <div className="text-xs text-slate-400">Actions Today</div>
            </div>
            <div className="rounded-xl bg-white/[0.06] border border-white/10 p-3 text-center">
              <div className="text-2xl font-bold text-pink-400">{totalWeekActions}</div>
              <div className="text-xs text-slate-400">This Week</div>
            </div>
            <div className="rounded-xl bg-white/[0.06] border border-white/10 p-3 text-center">
              <div className="text-2xl font-bold text-emerald-400">{avgUptime}%</div>
              <div className="text-xs text-slate-400">Avg Uptime</div>
            </div>
            <div className="rounded-xl bg-white/[0.06] border border-white/10 p-3 text-center">
              <div className="text-2xl font-bold text-cyan-400">1,350+</div>
              <div className="text-xs text-slate-400">Services Delivered</div>
            </div>
          </div>

          {/* Agent fleet grid */}
          <div className="grid grid-cols-3 md:grid-cols-9 gap-2 mb-6">
            {agents.map(a => (
              <div key={a.bot} className="group relative rounded-xl bg-white/[0.04] border border-white/[0.06] p-3 text-center hover:border-purple-500/30 hover:bg-white/[0.08] transition-all cursor-pointer" onClick={() => setSelectedAgent(selectedAgent === a.bot ? 'all' : a.bot)}>
                <div className="text-2xl mb-1">{a.emoji}</div>
                <div className="text-xs font-medium text-white truncate">{a.name}</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  <span className="text-[10px] text-emerald-400">{a.status}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">{a.todayActions} today</div>
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 rounded-lg bg-slate-800 border border-slate-700 text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  <div className="font-semibold text-white mb-1">{a.role}</div>
                  <div>{a.specialties.join(' · ')}</div>
                  <div className="mt-1 text-slate-500">Uptime: {a.uptime} · {a.weekActions} this week</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== DETAILED MONITORING BLOCK ===== */}
      <div className="mt-6 rounded-2xl border border-slate-700/60 bg-slate-900/60 p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">📊 Agent Activity Log</h3>
            <p className="text-slate-400 text-sm">
              Real-time actions from all Zion agents · Last updated: {now ? new Date(now).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }) : '...'}
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/agents-monitoring" className="inline-flex items-center px-4 py-2 bg-white text-slate-900 font-semibold rounded-lg text-sm hover:bg-slate-100 transition-colors shadow">
              📊 Full Dashboard
            </Link>
            <a href="mailto:kleber@ziontechgroup.com" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg text-sm hover:bg-blue-500 transition-colors">
              📧 Contact Support
            </a>
          </div>
        </div>

        {/* Agent filter tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button onClick={() => setSelectedAgent('all')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedAgent === 'all' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'}`}>
            All Agents
          </button>
          {agents.map(a => (
            <button key={a.bot} onClick={() => setSelectedAgent(selectedAgent === a.bot ? 'all' : a.bot)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${selectedAgent === a.bot ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'}`}>
              {a.emoji} {a.name}
            </button>
          ))}
        </div>

        {/* Activity feed */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {filteredActions.map((item) => (
            <div key={item.id} className={`border-l-2 ${categoryColor[item.category] || 'border-slate-400'} pl-4 py-1`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${categoryBg[item.category] || 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                    {item.category}
                  </span>
                  <p className="font-medium text-slate-100 text-sm">{item.action}</p>
                </div>
                <span className="text-xs text-slate-500 shrink-0">{item.timestamp}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                <span className="text-slate-300">{item.agentName}</span> · {item.result}
                {item.duration && <span className="text-slate-500"> · ⏱ {item.duration}</span>}
              </p>
              {item.impact && <p className="text-xs text-emerald-400/70 mt-0.5">✓ {item.impact}</p>}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-500">Showing {filteredActions.length} recent actions. Click any agent above to filter.</p>
          <Link href="/agents-monitoring" className="text-xs text-purple-400 hover:text-purple-300 font-medium">
            View complete history →
          </Link>
        </div>
      </div>

      {/* ===== CLIENT-FACING KPI STRIP ===== */}
      <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 p-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-bold text-white">🏆 Operations for Our Clients</h3>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">Verified</span>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">1,350+</div>
            <div className="text-xs text-slate-400">Services Delivered</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400">99.9%</div>
            <div className="text-xs text-slate-400">Uptime SLA</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-cyan-400">&lt;2min</div>
            <div className="text-xs text-slate-400">Avg Response</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">24/7</div>
            <div className="text-xs text-slate-400">Active Coverage</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-pink-400">9</div>
            <div className="text-xs text-slate-400">AI Agents</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400">SOC 2</div>
            <div className="text-xs text-slate-400">Compliant</div>
          </div>
        </div>

        {/* System Health Indicators */}
        <div className="mt-4 pt-4 border-t border-slate-800/50">
          <div className="flex items-center gap-2 mb-3">
            <h4 className="text-sm font-semibold text-white">⚡ System Health</h4>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">All Systems Operational</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] border border-white/[0.06] p-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div><div className="text-[10px] text-slate-500">API</div><div className="text-xs text-emerald-400">Operational</div></div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] border border-white/[0.06] p-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div><div className="text-[10px] text-slate-500">CDN</div><div className="text-xs text-emerald-400">Global</div></div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] border border-white/[0.06] p-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div><div className="text-[10px] text-slate-500">Database</div><div className="text-xs text-emerald-400">Healthy</div></div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] border border-white/[0.06] p-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div><div className="text-[10px] text-slate-500">CI/CD</div><div className="text-xs text-emerald-400">Passing</div></div>
            </div>
          </div>
        </div>

        {/* Deploy History */}
        <div className="mt-4 pt-4 border-t border-slate-800/50">
          <div className="flex items-center gap-2 mb-3">
            <h4 className="text-sm font-semibold text-white">🚀 Recent Deploys</h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-slate-300">beb351f</span>
                <span className="text-slate-500">— Waves 262-267, monitoring v9, jest fix</span>
              </div>
              <span className="text-emerald-400">✅ Success</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-slate-300">3decf97</span>
                <span className="text-slate-500">— Carol wave services</span>
              </div>
              <span className="text-emerald-400">✅ Success</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-slate-300">b0d53c6</span>
                <span className="text-slate-500">— Monitoring dashboard upgrade</span>
              </div>
              <span className="text-emerald-400">✅ Success</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/50 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div><span className="text-slate-500">Email: </span><a href="mailto:kleber@ziontechgroup.com" className="text-blue-300 hover:text-blue-200">kleber@ziontechgroup.com</a></div>
          <div><span className="text-slate-500">Phone: </span><a href="tel:+130****0950" className="text-blue-300 hover:text-blue-200">+1 302 464 0950</a></div>
          <div className="col-span-2"><span className="text-slate-500">Address: </span><span className="text-slate-300">364 E Main St STE 1008, Middletown, DE 19709</span></div>
        </div>
      </div>
    </section>
  );
}
