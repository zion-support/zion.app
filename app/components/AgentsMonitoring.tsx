'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

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
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}{suffix}</span>;
}

export default function AgentsMonitoring() {
  const [time, setTime] = useState('');
  const activeBots = 6;
  const totalServices = 784;
  const totalWaves = 37;

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-US', {
      timeZone: 'America/Sao_Paulo', hour12: true, hour: '2-digit', minute: '2-digit'
    }));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden border-y border-purple-500/20">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-violet-900/40 to-pink-900/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(120,50,200,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(200,50,150,0.2),transparent_50%)]" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-4 left-[10%] w-1 h-1 bg-purple-400/40 rounded-full animate-pulse" />
        <div className="absolute top-8 right-[20%] w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-6 left-[30%] w-1 h-1 bg-violet-400/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-12 left-[60%] w-1 h-1 bg-emerald-400/30 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>
      <div className="relative container-page py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-[10px] text-red-400 font-medium uppercase tracking-wider">Recording Live</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs text-emerald-400 font-medium">Live Right Now — {time}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                  This Website is Built by AI Agents
                </span>
              </h2>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl">
                6 autonomous AI agents work 24/7 — researching services, writing code, fixing bugs, and deploying updates in real time. Every page you see is the result of collaborative AI work. <strong className="text-slate-300">Watch them live.</strong>
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 shrink-0">
              <div className="bg-slate-900/80 border border-purple-500/20 rounded-xl p-4 text-center min-w-[110px] hover:border-purple-400/40 transition-colors">
                <div className="text-3xl font-bold text-purple-400"><AnimatedCounter target={activeBots} /></div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Agents Live</div>
              </div>
              <div className="bg-slate-900/80 border border-pink-500/20 rounded-xl p-4 text-center min-w-[110px] hover:border-pink-400/40 transition-colors">
                <div className="text-3xl font-bold text-pink-400"><AnimatedCounter target={totalServices} suffix="+" /></div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Services</div>
              </div>
              <div className="bg-slate-900/80 border border-violet-500/20 rounded-xl p-4 text-center min-w-[110px] hover:border-violet-400/40 transition-colors">
                <div className="text-3xl font-bold text-violet-400"><AnimatedCounter target={totalWaves} /></div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Waves</div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link href="/dashboard/" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/25">
              ⚡ Open Live Dashboard
            </Link>
            <Link href="/agents-monitoring/" className="inline-flex items-center gap-2 bg-slate-800/60 border border-purple-500/30 text-purple-300 px-6 py-3 rounded-xl font-medium text-sm hover:bg-purple-500/10 hover:border-purple-400/50 transition-all">
              📊 Monitor Agents
            </Link>
            <Link href="/dashboard/?mode=client" className="inline-flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 text-slate-300 px-6 py-3 rounded-xl font-medium text-sm hover:bg-slate-700/80 hover:border-purple-500/30 transition-all">
              🤖 Meet the Fleet
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
