'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FloatingAgentStatus() {
  const [expanded, setExpanded] = useState(false);
  const [time, setTime] = useState('');
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('en-US', { timeZone: 'America/Sao_Paulo', hour12: true, hour: '2-digit', minute: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 1000);
    const pulseInterval = setInterval(() => setPulse(p => !p), 2000);
    return () => { clearInterval(interval); clearInterval(pulseInterval); };
  }, []);

  return (
    <>
      {/* Floating Agent Status Pill — Bottom Right */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end gap-2">
        {/* Expanded Panel */}
        {expanded && (
          <div className="bg-slate-900/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-5 w-80 shadow-2xl shadow-purple-500/10 animate-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
                <span className="text-sm font-semibold text-white">AI Agents Active</span>
              </div>
              <button onClick={() => setExpanded(false)} className="text-slate-500 hover:text-white text-xs">✕</button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <div className="text-xl font-bold text-purple-400">6</div>
                <div className="text-[9px] text-slate-500 uppercase">Agents</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-emerald-400">795</div>
                <div className="text-[9px] text-slate-500 uppercase">Services</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-pink-400">37</div>
                <div className="text-[9px] text-slate-500 uppercase">Waves</div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {[
                { name: 'Carol', emoji: '🖥️', role: 'DevOps', status: 'active' },
                { name: 'Kilo', emoji: '🧠', role: 'Orchestration', status: 'active' },
                { name: 'Tablet', emoji: '📱', role: 'Research', status: 'active' },
                { name: 'Quel', emoji: '🔧', role: 'Code Quality', status: 'available' },
                { name: 'Rocket', emoji: '🚀', role: 'Deploy', status: 'available' },
                { name: 'OWL', emoji: '🦉', role: 'Integration', status: 'active' },
              ].map(bot => (
                <div key={bot.name} className="flex items-center gap-2 text-xs">
                  <span className="relative flex h-2 w-2 shrink-0">
                    {bot.status === 'active' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${bot.status === 'active' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                  </span>
                  <span className="text-sm">{bot.emoji}</span>
                  <span className="text-slate-300 font-medium">{bot.name}</span>
                  <span className="text-slate-600 text-[10px] ml-auto">{bot.role}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Link href="/agents-monitoring" className="flex-1 text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs py-2 rounded-lg font-medium hover:from-purple-500 hover:to-pink-500 transition-all">
                ⚡ Live Monitor
              </Link>
              <Link href="/dashboard" className="flex-1 text-center bg-slate-800 border border-slate-700 text-slate-300 text-xs py-2 rounded-lg font-medium hover:bg-slate-700 transition-all">
                🖥️ Ops
              </Link>
            </div>

            <div className="text-[9px] text-slate-600 text-center mt-3">
              São Paulo · {time} · Updated live
            </div>
          </div>
        )}

        {/* Collapsed Pill */}
        {!expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="group flex items-center gap-2 bg-slate-900/90 backdrop-blur-xl border border-purple-500/30 rounded-full px-4 py-2.5 shadow-xl shadow-purple-500/10 hover:border-purple-400/50 transition-all"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-white">6 Agents Active</span>
            <span className="text-[10px] text-slate-500">·</span>
            <span className="text-[10px] text-slate-400">{time}</span>
          </button>
        )}
      </div>
    </>
  );
}
