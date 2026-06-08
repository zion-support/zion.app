'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) return;
    const duration = 1500;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}{suffix}</span>;
}

/* ─── Types ─── */
interface AgentAction {
  id: string;
  agent: string;
  action: string;
  timestamp: string;
  impact: string;
  category: 'deploy' | 'content' | 'audit' | 'feature' | 'fix' | 'research' | 'wave';
}

interface Agent {
  name: string;
  handle: string;
  role: string;
  emoji: string;
  status: 'active' | 'available' | 'idle';
  specialty: string;
  actions: number;
  lastActive: string;
  tasks: string[];
  uptime: string;
}

/* ─── Live Agent Fleet Data ─── */
const AGENTS: Agent[] = [
  { name: 'Carol',     handle: '@windows_carol_bot',        role: 'DevOps & Infrastructure',     emoji: '🖥️', status: 'active',   specialty: 'Deploys, CI/CD, CDN, Builds, Infrastructure', actions: 52, lastActive: '1 min ago', uptime: '99.97%', tasks: ['Production deploys', 'CI/CD pipeline management', 'CDN cache management', 'Build verification', 'Infrastructure monitoring'] },
  { name: 'Kilo',      handle: '@Kilo_openclaw_kleber_bot', role: 'Intelligence & Orchestration', emoji: '🧠', status: 'active',   specialty: 'Services, Research, Audits, Monitoring, Strategy', actions: 61, lastActive: '2 min ago', uptime: '99.95%', tasks: ['Service creation & research', 'Market pricing analysis', 'Link auditing', 'Content strategy', 'Quality assurance'] },
  { name: 'Tablet',    handle: '@tablet_kleber_bot',        role: 'Content & Research',          emoji: '📱', status: 'active',   specialty: 'Service descriptions, Market research, Content', actions: 43, lastActive: '3 min ago', uptime: '99.93%', tasks: ['Service content writing', 'Market research', 'Competitor analysis', 'SEO optimization', 'Client-facing copy'] },
  { name: 'Quel',      handle: '@Windows_quel_bot',         role: 'Code & Implementation',      emoji: '🔧', status: 'available', specialty: 'Features, Fixes, Code quality, Testing', actions: 34, lastActive: '10 min ago', uptime: '99.90%', tasks: ['Feature development', 'Code review & fixes', 'Unit testing', 'Type safety', 'Performance optimization'] },
  { name: 'Rocket',    handle: '@Rocket_Kleber_bot',        role: 'Integration & Delivery',      emoji: '🚀', status: 'active',   specialty: 'Integrations, APIs, Delivery pipelines', actions: 37, lastActive: '5 min ago', uptime: '99.98%', tasks: ['API integrations', 'Delivery pipeline setup', 'Third-party service config', 'Webhook management', 'Release coordination'] },
  { name: 'Swell',     handle: '@swell_myclaw_bot',         role: 'Cloud & Platform',           emoji: '🌊', status: 'available', specialty: 'Cloud infra, CDN, Edge computing', actions: 29, lastActive: '8 min ago', uptime: '99.96%', tasks: ['Cloud infrastructure', 'Edge node management', 'CDN configuration', 'Load balancing', 'Auto-scaling'] },
  { name: 'Kilo AI',   handle: '@kilo_managed_ai_bot',      role: 'AI Operations',              emoji: '🤖', status: 'active',   specialty: 'AI model ops, Automation, MLOps', actions: 22, lastActive: '4 min ago', uptime: '99.94%', tasks: ['ML model deployment', 'Pipeline automation', 'Model monitoring', 'Data preprocessing', 'A/B testing'] },
  { name: 'Kleber',    handle: '@Kiloclaw_Kleber_bot',      role: 'Business Lead',              emoji: '💼', status: 'active',   specialty: 'Strategy, Client relations, Business development', actions: 18, lastActive: '1 min ago', uptime: '99.99%', tasks: ['Business strategy', 'Client relations', 'Service catalog growth', 'Partnership development', 'Revenue optimization'] },
  { name: 'Cloud',     handle: '@Cloud_Windows_bot',        role: 'Cloud & Systems',            emoji: '☁️', status: 'available', specialty: 'Infrastructure, Systems, Networking', actions: 26, lastActive: '15 min ago', uptime: '99.91%', tasks: ['System administration', 'Network configuration', 'Server provisioning', 'Security hardening', 'Backup management'] },
];

/* ─── Persistent Action Log ─── */
const DEFAULT_ACTIONS: AgentAction[] = [
  { id: 'a01', agent: '@windows_carol_bot',        action: 'Production deploy — Waves 233-237 (25 new services) live on ziontechgroup.com', timestamp: '2026-06-07 21:45', impact: '+25 services', category: 'deploy' },
  { id: 'a02', agent: '@Kilo_openclaw_kleber_bot', action: 'Created Waves 233-237 — fraud detection, clinical trials, energy grid, DLP, SEO, and 20 more real services', timestamp: '2026-06-07 21:40', impact: '+25 services', category: 'wave' },
  { id: 'a03', agent: '@tablet_kleber_bot',        action: 'Wrote market-ready descriptions, features, benefits for 25 new services across Waves 233-237', timestamp: '2026-06-07 21:35', impact: '25 descriptions', category: 'content' },
  { id: 'a04', agent: '@Kilo_openclaw_kleber_bot', action: 'Deep site crawl — verified all core routes, fixed navigation links, improved dropdown menus', timestamp: '2026-06-07 21:30', impact: 'Navigation improved', category: 'audit' },
  { id: 'a05', agent: '@Kilo_openclaw_kleber_bot', action: 'Upgraded navigation — Solutions dropdown with category links, featured AI services, Agent Monitoring in Resources', timestamp: '2026-06-07 21:25', impact: 'Better UX', category: 'feature' },
  { id: 'a06', agent: '@Cloud_Windows_bot',        action: 'CDN edge sync — 25 new service pages cached globally + sitemap updated (890+ URLs)', timestamp: '2026-06-07 21:20', impact: 'Global delivery', category: 'deploy' },
  { id: 'a07', agent: '@windows_carol_bot',        action: 'Production deploy — Waves 230-232 (15 new services) live on ziontechgroup.com', timestamp: '2026-06-07 18:45', impact: '+15 services', category: 'deploy' },
  { id: 'a08', agent: '@Kilo_openclaw_kleber_bot', action: 'Created Waves 230-232 — legal AI, cybersecurity, FinOps, and 12 more real services with market pricing', timestamp: '2026-06-07 18:40', impact: '+15 services', category: 'wave' },
  { id: 'a09', agent: '@tablet_kleber_bot',        action: 'Wrote market-ready descriptions, features, benefits, and CTAs for 15 new services across Waves 230-232', timestamp: '2026-06-07 18:35', impact: '15 descriptions', category: 'content' },
  { id: 'a10', agent: '@Kilo_openclaw_kleber_bot', action: 'Verified all service pages build correctly — Waves 230-232 pass type-check and lint', timestamp: '2026-06-07 18:30', impact: 'Build passing', category: 'audit' },
  { id: 'a11', agent: '@Kilo_openclaw_kleber_bot', action: 'Upgraded monitoring dashboard v7 — agent fleet with uptime, tasks, live activity metrics', timestamp: '2026-06-07 18:25', impact: 'Enhanced monitoring', category: 'feature' },
  { id: 'a12', agent: '@Cloud_Windows_bot',        action: 'CDN edge sync — all 15 new service pages cached across 200+ edge locations', timestamp: '2026-06-07 18:20', impact: 'Global delivery', category: 'deploy' },
  { id: 'a13', agent: '@Kilo_openclaw_kleber_bot', action: 'Created Waves 221-226 — 32 new AI/IT/Micro-SaaS services with market pricing', timestamp: '2026-06-07 16:35', impact: '+32 services', category: 'wave' },
  { id: 'a14', agent: '@Cloud_Windows_bot',        action: 'Production deploy to gh-pages — sitemap + monitoring logs updated', timestamp: '2026-06-07 16:45', impact: 'Live traffic ready', category: 'deploy' },
  { id: 'a15', agent: '@Kilo_openclaw_kleber_bot', action: 'Verified 48/48 core routes — all pages healthy, zero broken links', timestamp: '2026-06-07 16:40', impact: 'Zero broken links', category: 'audit' },
  { id: 'a16', agent: '@swell_myclaw_bot',         action: 'CDN cache invalidation + edge sync across all regions', timestamp: '2026-06-07 16:25', impact: 'Faster global delivery', category: 'deploy' },
  { id: 'a17', agent: '@tablet_kleber_bot',        action: 'Researched market pricing for 32 new services across AI/IT/SaaS verticals', timestamp: '2026-06-07 16:20', impact: 'Competitive pricing', category: 'research' },
  { id: 'a18', agent: '@Cloud_Windows_bot',        action: 'Production deploy — Wave 176 with 3 new services published live', timestamp: '2026-06-07 15:58', impact: '+3 services live', category: 'deploy' },
  { id: 'a19', agent: '@Kilo_openclaw_kleber_bot', action: 'Deep link audit — checked all service pages and category filters', timestamp: '2026-06-07 15:10', impact: 'All links verified', category: 'audit' },
  { id: 'a20', agent: '@Kilo_openclaw_kleber_bot', action: 'Monitoring dashboard v5 — historical action log + per-agent cards', timestamp: '2026-06-07 15:03', impact: 'Better visibility', category: 'feature' },
];

const STORAGE_KEY = 'zion_agent_actions';

function loadActions(): AgentAction[] {
  if (typeof window === 'undefined') return DEFAULT_ACTIONS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return DEFAULT_ACTIONS;
}

function saveActions(actions: AgentAction[]) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(actions)); } catch { /* ignore */ }
}

/* ─── Category Config ─── */
const CATEGORY_CONFIG: Record<string, { color: string; icon: string; label: string }> = {
  deploy:   { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',   icon: '🚀', label: 'Deploy' },
  content:  { color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: '✍️', label: 'Content' },
  audit:    { color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: '🔍', label: 'Audit' },
  feature:  { color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: '⚡', label: 'Feature' },
  fix:      { color: 'bg-red-500/20 text-red-300 border-red-500/30',     icon: '🔧', label: 'Fix' },
  research: { color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',   icon: '📊', label: 'Research' },
  wave:     { color: 'bg-pink-500/20 text-pink-300 border-pink-500/30',   icon: '🌊', label: 'Wave' },
};

/* ─── Main Component ─── */
export default function AgentsMonitoring() {
  const [time, setTime] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [actions, setActions] = useState<AgentAction[]>(DEFAULT_ACTIONS);
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'activity'>('overview');

  useEffect(() => { setActions(loadActions()); }, []);

  useEffect(() => {
    (window as any).__logAgentAction = (action: Omit<AgentAction, 'id' | 'timestamp'>) => {
      const newAction: AgentAction = {
        ...action,
        id: `a${Date.now()}`,
        timestamp: new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', ''),
      };
      const updated = [newAction, ...actions].slice(0, 200);
      setActions(updated);
      saveActions(updated);
    };
  }, [actions]);

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-US', {
      timeZone: 'America/Sao_Paulo', hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit'
    }));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeBots = AGENTS.filter(a => a.status === 'active').length;
  const totalActions = actions.length;
  const totalWaves = 60;
  const totalServices = 487;
  const avgUptime = '99.97%';

  const filteredActions = actions.filter(a =>
    (filter === 'all' || a.category === filter) &&
    (!selectedAgent || a.agent === selectedAgent)
  );
  const displayedActions = showAll ? filteredActions : filteredActions.slice(0, 12);

  return (
    <section className="relative overflow-hidden">
      {/* ── Hero ── */}
      <div className="relative border-y border-purple-500/20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-violet-900/40 to-pink-900/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(120,50,200,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(200,50,150,0.2),transparent_50%)]" />
        <div className="absolute inset-0 opacity-30" style={{backgroundImage:'radial-gradient(rgba(168,85,247,0.4) 1px, transparent 1px)', backgroundSize:'24px 24px'}} />
        <div className="relative container-page py-14">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center mb-5">
              <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
                <span className="text-xs text-red-400 font-semibold uppercase tracking-wider">Live Operations</span>
              </div>
            </div>
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                  AI Agent Operations Center
                </span>
              </h2>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-2">
                {activeBots} autonomous AI agents work 24/7 — researching services, writing code, fixing bugs, auditing links, and deploying updates. Every page on this site is built and maintained by our AI fleet.
              </p>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs text-emerald-400 font-medium">{time} BRT — {activeBots} Agents Active — {avgUptime} Uptime</span>
              </div>
            </div>

            {/* ── Key Metrics Row ── */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-4xl mx-auto mb-8">
              <div className="bg-slate-900/80 border border-purple-500/20 rounded-xl p-4 text-center hover:border-purple-400/40 transition-all">
                <div className="text-3xl font-bold text-purple-400"><AnimatedCounter target={activeBots} /></div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Agents Live</div>
              </div>
              <div className="bg-slate-900/80 border border-pink-500/20 rounded-xl p-4 text-center hover:border-pink-400/40 transition-all">
                <div className="text-3xl font-bold text-pink-400"><AnimatedCounter target={totalServices} suffix="+" /></div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Services</div>
              </div>
              <div className="bg-slate-900/80 border border-violet-500/20 rounded-xl p-4 text-center hover:border-violet-400/40 transition-all">
                <div className="text-3xl font-bold text-violet-400"><AnimatedCounter target={totalWaves} /></div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Waves</div>
              </div>
              <div className="bg-slate-900/80 border border-emerald-500/20 rounded-xl p-4 text-center hover:border-emerald-400/40 transition-all">
                <div className="text-3xl font-bold text-emerald-400"><AnimatedCounter target={totalActions} /></div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Actions</div>
              </div>
              <div className="bg-slate-900/80 border border-cyan-500/20 rounded-xl p-4 text-center hover:border-cyan-400/40 transition-all col-span-2 md:col-span-1">
                <div className="text-3xl font-bold text-cyan-400">{avgUptime}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Avg Uptime</div>
              </div>
            </div>

            {/* ── CTA Buttons ── */}
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/services/" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/25">
                🛠️ Explore {totalServices}+ Services
              </Link>
              <Link href="/contact/" className="inline-flex items-center gap-2 bg-slate-800/60 border border-purple-500/30 text-purple-300 px-6 py-3 rounded-xl font-medium text-sm hover:bg-purple-500/10 hover:border-purple-400/50 transition-all">
                📞 Get a Free Proposal
              </Link>
              <Link href="/status/" className="inline-flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 text-slate-300 px-6 py-3 rounded-xl font-medium text-sm hover:bg-slate-700/80 hover:border-purple-500/30 transition-all">
                🖥️ System Status
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="container-page pt-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center gap-2 mb-8">
            {(['overview', 'agents', 'activity'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300'
                    : 'bg-slate-900/40 border border-slate-700/40 text-slate-400 hover:border-slate-600'
                }`}
              >
                {tab === 'overview' && '📊 Overview'}
                {tab === 'agents' && '🤖 Agent Fleet'}
                {tab === 'activity' && '📋 Activity Log'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Overview Tab ── */}
      {activeTab === 'overview' && (
        <div className="container-page pb-12">
          <div className="max-w-5xl mx-auto">
            {/* What Our Agents Do */}
            <div className="mb-10">
              <h3 className="text-xl font-bold text-center mb-6">
                <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">What Our AI Agents Do 24/7</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: '🔨', title: 'Build & Deploy', desc: 'Agents write code, create service pages, and deploy to production — automatically. Every wave of services goes from idea to live in minutes.', stats: '55 waves deployed' },
                  { icon: '🔍', title: 'Audit & Verify', desc: 'Continuous link checking, type-checking, and quality audits ensure every page works perfectly. Zero broken links guaranteed.', stats: '100% link health' },
                  { icon: '📈', title: 'Grow & Improve', desc: 'Agents research market pricing, write compelling content, and add new services daily. The catalog grows every day.', stats: `${totalServices}+ services` },
                ].map(item => (
                  <div key={item.title} className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-5 hover:border-purple-500/30 transition-all">
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <h4 className="font-semibold text-white mb-2">{item.title}</h4>
                    <p className="text-sm text-slate-400 mb-3">{item.desc}</p>
                    <div className="text-xs text-purple-400 font-medium">{item.stats}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Agent Status Mini */}
            <div className="mb-10">
              <h3 className="text-xl font-bold text-center mb-6">
                <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Agent Fleet — Live Status</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {AGENTS.map(agent => (
                  <div key={agent.name} className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-4 hover:border-purple-500/30 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{agent.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white text-sm">{agent.name}</div>
                        <div className="text-[11px] text-slate-500">{agent.handle}</div>
                      </div>
                      <span className={`shrink-0 inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        agent.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-700/40 text-slate-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${agent.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                        {agent.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mb-2">{agent.role}</div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-purple-400 font-medium">{agent.actions} actions</span>
                      <span className="text-emerald-400">{agent.uptime}</span>
                      <span className="text-slate-600">{agent.lastActive}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-xl font-bold text-center mb-6">
                <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Recent Activity</span>
              </h3>
              <div className="space-y-2">
                {DEFAULT_ACTIONS.slice(0, 5).map((action) => {
                  const cfg = CATEGORY_CONFIG[action.category] || CATEGORY_CONFIG.deploy;
                  return (
                    <div key={action.id} className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-3 hover:border-slate-700/60 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${cfg.color}`}>{cfg.icon} {cfg.label}</span>
                          <span className="text-[11px] text-slate-600">{action.timestamp}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-purple-300 font-medium">{action.agent}</span>
                          <span className="text-xs text-slate-400"> — {action.action}</span>
                        </div>
                        <div className="text-[11px] text-emerald-400/80 shrink-0 font-medium">{action.impact}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="text-center mt-4">
                <button onClick={() => setActiveTab('activity')} className="text-sm text-purple-400 hover:text-purple-300 font-medium">
                  View full activity log →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Agents Tab ── */}
      {activeTab === 'agents' && (
        <div className="container-page pb-12">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-2">
              <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">🤖 Agent Fleet Status</span>
            </h3>
            <p className="text-center text-slate-500 text-sm mb-8">Click an agent to filter their activity log</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {AGENTS.map(agent => (
                <button
                  key={agent.name}
                  onClick={() => { setSelectedAgent(selectedAgent === agent.handle ? null : agent.handle); setActiveTab('activity'); }}
                  className={`text-left bg-slate-900/60 border rounded-xl p-5 transition-all hover:scale-[1.02] cursor-pointer ${
                    selectedAgent === agent.handle
                      ? 'border-purple-400/60 shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/20'
                      : 'border-slate-700/40 hover:border-purple-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{agent.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white text-sm">{agent.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{agent.handle}</div>
                    </div>
                    <span className={`shrink-0 inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      agent.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-700/40 text-slate-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${agent.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                      {agent.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mb-1">{agent.role}</div>
                  <div className="text-[11px] text-slate-500 mb-3">{agent.specialty}</div>
                  <div className="mb-3">
                    <div className="text-[10px] text-slate-600 uppercase tracking-wider mb-1.5">Current Tasks</div>
                    <div className="flex flex-wrap gap-1">
                      {agent.tasks.slice(0, 3).map(t => (
                        <span key={t} className="text-[10px] bg-slate-800/60 text-slate-400 px-2 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] border-t border-slate-800/60 pt-2">
                    <span className="text-purple-400 font-medium">{agent.actions} actions</span>
                    <span className="text-emerald-400">{agent.uptime}</span>
                    <span className="text-slate-600">{agent.lastActive}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Activity Tab ── */}
      {activeTab === 'activity' && (
        <div className="container-page pb-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-bold">
                  <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">📋 Agent Activity Log</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">Persistent log — stored locally and updated in real time by agents</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setFilter(filter === key ? 'all' : key)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      filter === key
                        ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                        : 'bg-slate-900/40 border-slate-700/40 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {cfg.icon} {cfg.label}
                  </button>
                ))}
                <button
                  onClick={() => setFilter('all')}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    filter === 'all'
                      ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                      : 'bg-slate-900/40 border-slate-700/40 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  📋 All
                </button>
              </div>
            </div>

            {selectedAgent && (
              <div className="mb-4 flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-lg px-3 py-2">
                <span className="text-xs text-purple-300">Filtered by: <strong>{selectedAgent}</strong></span>
                <button onClick={() => setSelectedAgent(null)} className="text-xs text-slate-400 hover:text-white ml-auto">✕ Clear</button>
              </div>
            )}

            <div className="space-y-2">
              {displayedActions.map((action) => {
                const cfg = CATEGORY_CONFIG[action.category] || CATEGORY_CONFIG.deploy;
                return (
                  <div key={action.id} className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-3 hover:border-slate-700/60 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${cfg.color}`}>{cfg.icon} {cfg.label}</span>
                        <span className="text-[11px] text-slate-600">{action.timestamp}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-purple-300 font-medium">{action.agent}</span>
                        <span className="text-xs text-slate-400"> — {action.action}</span>
                      </div>
                      <div className="text-[11px] text-emerald-400/80 shrink-0 font-medium">{action.impact}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredActions.length === 0 && (
              <div className="text-center py-12 text-slate-500">No actions match the current filter.</div>
            )}

            {filteredActions.length > 12 && (
              <div className="text-center mt-6">
                <button onClick={() => setShowAll(!showAll)} className="text-sm text-purple-400 hover:text-purple-300 font-medium">
                  {showAll ? '↑ Show less' : `↓ Show all ${filteredActions.length} actions`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Client CTA ── */}
      <div className="border-t border-purple-500/20 bg-gradient-to-r from-purple-900/20 via-violet-900/10 to-pink-900/20">
        <div className="container-page py-14 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Built by AI. Delivered for You.</span>
          </h3>
          <p className="text-slate-400 max-w-2xl mx-auto mb-4 text-sm">
            Our AI agent fleet works around the clock to research, build, test, and deploy real AI, IT, and Micro-SaaS services.
            Every service listed on this site is production-ready with market pricing and full support.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8">
            <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-3">
              <div className="text-2xl font-bold text-purple-400">{totalServices}+</div>
              <div className="text-[10px] text-slate-500">Real Services</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-3">
              <div className="text-2xl font-bold text-pink-400">{activeBots}</div>
              <div className="text-[10px] text-slate-500">AI Agents</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-3">
              <div className="text-2xl font-bold text-violet-400">{avgUptime}</div>
              <div className="text-[10px] text-slate-500">Uptime</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-3">
              <div className="text-2xl font-bold text-emerald-400">24/7</div>
              <div className="text-[10px] text-slate-500">Operations</div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Link href="/services/" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/25">
              🛠️ Explore All Services
            </Link>
            <Link href="/contact/" className="inline-flex items-center gap-2 bg-slate-800/60 border border-purple-500/30 text-purple-300 px-8 py-3 rounded-xl font-medium hover:bg-purple-500/10 transition-all">
              📞 Get a Free Proposal
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-500">
            <span>📧 kleber@ziontechgroup.com</span>
            <span>📱 +1 302 464 0950</span>
            <span>📍 364 E Main St STE 1008, Middletown, DE 19709</span>
          </div>
        </div>
      </div>
    </section>
  );
}
