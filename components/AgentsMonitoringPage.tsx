// Full Agents Monitoring Page Component with Live Action Tracking
// Dedicated page with comprehensive agent action recording for future reference

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

type AgentRecord = {
  name: string;
  bot: string;
  role: string;
  emoji: string;
  status: 'active'|'available'|'busy';
  uptime: string;
  todayActions: number;
  weekActions: number;
  specialty?: string;
};

type ActionRecord = {
  timestamp: string;
  bot: string;
  action: string;
  result: string;
  category: string;
  duration?: string;
  impact?: string;
};

const agents: AgentRecord[] = [
  { name: 'Carol', bot: '@windows_carol_bot', role: 'DevOps & Infrastructure', emoji: '🖥️', status: 'active', uptime: '99.2%', todayActions: 3, weekActions: 22, specialty: 'Infrastructure' },
  { name: 'Kilo', bot: '@Kilo_openclaw_kleber_bot', role: 'Intelligence & Orchestration', emoji: '🧠', status: 'active', uptime: '99.8%', todayActions: 2, weekActions: 18, specialty: 'Agent Orchestration' },
  { name: 'Tablet', bot: '@tablet_kleber_bot', role: 'Content & Research', emoji: '📱', status: 'active', uptime: '98.5%', todayActions: 2, weekActions: 26, specialty: 'Lead Discovery' },
  { name: 'Neo', bot: '@Neo_kleber_bot', role: 'Operations', emoji: '📊', status: 'active', uptime: '98.9%', todayActions: 1, weekActions: 14, specialty: 'Monitoring' },
  { name: 'Quel', bot: '@Windows_quel_bot', role: 'Code & Implementation', emoji: '🔧', status: 'available', uptime: '97.9%', todayActions: 0, weekActions: 10, specialty: 'TypeScript' },
  { name: 'Rocket', bot: '@Rocket_Kleber_bot', role: 'Integration & Delivery', emoji: '🚀', status: 'active', uptime: '99.1%', todayActions: 1, weekActions: 9, specialty: 'Deployments' },
  { name: 'Swell', bot: '@swell_myclaw_bot', role: 'Cloud & Platform', emoji: '🌊', status: 'available', uptime: '98.0%', todayActions: 0, weekActions: 7, specialty: 'CDN Sync' },
  { name: 'Kilo AI', bot: '@kilo_managed_ai_bot', role: 'AI Operations', emoji: '🤖', status: 'active', uptime: '99.4%', todayActions: 2, weekActions: 15, specialty: 'AI Insights' },
  { name: 'Kleber', bot: '@Kiloclaw_Kleber_bot', role: 'Business Lead', emoji: '💼', status: 'active', uptime: '99.0%', todayActions: 1, weekActions: 12, specialty: 'Partnerships' },
  { name: 'Cloud', bot: '@Cloud_Windows_bot', role: 'Cloud & Systems', emoji: '☁️', status: 'available', uptime: '98.7%', todayActions: 0, weekActions: 8, specialty: 'Production' },
];

export default function AgentsMonitoringPage() {
  const [now, setNow] = useState(() => new Date().toISOString());
  const [actionLog, setActionLog] = useState<ActionRecord[]>([]);
  const [filter, setFilter] = useState<'all'|'high'|'monitoring'|'content'|'quality'>('all');

  useEffect(() => {
    const loadActions = () => {
      try {
        const stored = localStorage.getItem('agent-actions-log');
        if (stored) {
          setActionLog(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load action log', e);
      }
    };
    
    loadActions();
    const id = setInterval(() => setNow(new Date().toISOString()), 60_000);
    return () => clearInterval(id);
  }, []);

  const filteredActions = actionLog.filter(a => {
    if (filter === 'all') return true;
    if (filter === 'high') return a.impact;
    return a.category === filter;
  });

  const totalActionsToday = agents.reduce((sum, a) => sum + a.todayActions, 0);

  return (
    <div className="min-h-screen bg-slate-950 pt-24">
      <div className="container-page max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🤖 AI Agent Monitoring Dashboard</h1>
          <p className="text-slate-400">Permanent record of all agent actions, performance metrics, and operational status</p>
          <p className="text-slate-500 text-xs mt-2">Last updated: {new Date(now).toLocaleString()}</p>
        </div>

        {/* Agent Fleet Status Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {agents.map(agent => (
            <div key={agent.bot} className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{agent.emoji}</div>
              <div className="font-semibold text-sm text-white">{agent.name}</div>
              <div className="text-xs text-slate-500">{agent.bot}</div>
              <div className={`text-[10px] font-medium mt-1 ${agent.status === 'active' ? 'text-emerald-400' : 'text-blue-400'}`}>
                ● {agent.status}
              </div>
              <div className="text-[10px] text-purple-400 mt-1">{agent.specialty}</div>
              <div className="text-[10px] text-slate-400 mt-1">{agent.todayActions} actions today</div>
            </div>
          ))}
        </div>

        {/* Action Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {['all', 'high', 'monitoring', 'content', 'quality'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filter === f 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {f === 'high' ? 'High Impact' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Action Log */}
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">📜 Action Timeline ({filteredActions.length} entries)</h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {filteredActions.map((action, idx) => (
              <div key={idx} className="border-l-2 border-purple-500 pl-3 py-2">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-slate-200">{action.action}</p>
                  <span className="text-xs text-slate-400">{action.timestamp}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{action.bot}</p>
                <p className="text-xs text-slate-500 mt-1">{action.result}</p>
                {action.impact && <p className="text-xs text-emerald-300 mt-1 font-semibold">Impact: {action.impact}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}