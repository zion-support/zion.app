'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AnimatedCounter from '@/components/AnimatedCounter';

const AGENTS = [
  { name: 'Carol', emoji: '🖥️', role: 'DevOps & Infrastructure', status: 'active' },
  { name: 'Kilo', emoji: '🧠', role: 'Intelligence & Orchestration', status: 'active' },
  { name: 'Tablet', emoji: '📱', role: 'Content & Research', status: 'available' },
  { name: 'Quel', emoji: '🔧', role: 'Code & Implementation', status: 'available' },
  { name: 'Rocket', emoji: '🚀', role: 'Integration & Delivery', status: 'available' },
  { name: 'OWL', emoji: '🦉', role: 'Wave Integration & Monitoring', status: 'active' },
];

const STATS = [
  { value: 795, label: 'Services Catalog', icon: '🛠️', color: 'purple' },
  { value: 39, label: 'Waves Integrated', icon: '🌊', color: 'emerald' },
  { value: 1953, label: 'Tasks Completed', icon: '✅', color: 'pink' },
  { value: '24/7', label: 'Uptime', icon: '⏰', color: 'cyan' },
];

const RECENT_ACTIONS = [
  { time: '01:00', bot: '🦉 OWL', action: 'ORGANIZE #16 — Fleet rebalance + task delegation', category: 'coordination' },
  { time: '21:00', bot: '📱 Tablet', action: 'Wave 212 research — 5 new services', category: 'research' },
  { time: '20:30', bot: '🦉 OWL', action: 'Wave 211 git fix — 404 resolved', category: 'fix' },
  { time: '19:30', bot: '🦉 OWL', action: 'Deep crawl — 20/20 pages OK', category: 'quality' },
  { time: '14:00', bot: '🔧 Quel', action: 'Thin page content enrichment', category: 'quality' },
];

const catColors: Record<string, string> = {
  coordination: 'bg-pink-500/20 text-pink-300',
  research: 'bg-blue-500/20 text-blue-300',
  fix: 'bg-amber-500/20 text-amber-300',
  quality: 'bg-emerald-500/20 text-emerald-300',
  integration: 'bg-cyan-500/20 text-cyan-300',
  infra: 'bg-orange-500/20 text-orange-300',
};

const statColorMap: Record<string, { bg: string; text: string; border: string }> = {
  purple: { bg: 'from-purple-500/10 to-purple-900/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  emerald: { bg: 'from-emerald-500/10 to-emerald-900/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  pink: { bg: 'from-pink-500/10 to-pink-900/10', text: 'text-pink-400', border: 'border-pink-500/20' },
  cyan: { bg: 'from-cyan-500/10 to-cyan-900/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
};

function PulseDot({ active }: { active: boolean }) {
  return (
    <span className="relative flex h-2.5 w-2.5 shrink-0">
      {active && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />}
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${active ? 'bg-emerald-500' : 'bg-slate-500'}`} />
    </span>
  );
}

export default function AgentsMonitoring() {
  const [time, setTime] = useState('');
  const activeCount = AGENTS.filter(a => a.status === 'active').length;

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-US', {
      timeZone: 'America/Sao_Paulo', hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit',
    }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.08),transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-4">
            <PulseDot active={true} />
            <span className="text-xs text-emerald-400 font-medium">{activeCount} AI Agents Active Now</span>
            <span className="text-[10px] text-slate-500 ml-1">· São Paulo {time}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            This Website is Built by AI Agents
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            A fleet of {AGENTS.length} autonomous AI agents work 24/7 — researching, coding, testing, and deploying improvements in real time. Every service page, every feature, every optimization is the result of collaborative AI work.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {STATS.map((s, i) => {
            const c = statColorMap[s.color] || statColorMap.purple;
            return (
              <div key={i} className={`bg-gradient-to-br ${c.bg} border ${c.border} rounded-xl p-5 text-center hover:scale-105 transition-transform`}>
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className={`text-3xl font-bold ${c.text} mb-1`}>
                  {typeof s.value === 'number' ? <AnimatedCounter target={s.value} /> : s.value}
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Agent Fleet */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-4 text-center text-slate-200">🤖 Meet Our AI Agents</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {AGENTS.map(agent => (
              <div key={agent.name} className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 text-center hover:border-purple-500/30 transition-all group">
                <div className="text-3xl mb-2">{agent.emoji}</div>
                <div className="text-sm font-semibold text-slate-200">{agent.name}</div>
                <div className="text-[10px] text-slate-500 mt-1 mb-2">{agent.role}</div>
                <div className="flex items-center justify-center gap-1.5">
                  <PulseDot active={agent.status === 'active'} />
                  <span className={`text-[10px] font-mono ${agent.status === 'active' ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {agent.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-4 text-center text-slate-200">📜 Recent Activity</h3>
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-5 max-w-3xl mx-auto">
            <div className="space-y-3">
              {RECENT_ACTIONS.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[10px] font-mono text-slate-500 mt-0.5 w-10 shrink-0">{a.time}</span>
                  <span className="text-xs text-purple-300 font-medium w-24 shrink-0">{a.bot}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase ${catColors[a.category] || 'bg-slate-500/20 text-slate-400'}`}>
                    {a.category}
                  </span>
                  <span className="text-xs text-slate-300">{a.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-sm hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/25">
            ⚡ Open Live Dashboard
          </Link>
          <Link href="/agents-monitoring" className="inline-flex items-center gap-2 bg-slate-800/60 border border-purple-500/30 text-purple-300 px-8 py-4 rounded-xl font-medium text-sm hover:bg-purple-500/10 hover:border-purple-400/50 transition-all">
            📊 Monitor Agents
          </Link>
          <Link href="/agents-monitoring?mode=client" className="inline-flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 text-slate-300 px-8 py-4 rounded-xl font-medium text-sm hover:bg-slate-700/80 hover:border-purple-500/30 transition-all">
            🎯 Meet the Fleet
          </Link>
        </div>
      </div>
    </section>
  );
}
