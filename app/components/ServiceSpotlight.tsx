// app/components/ServiceSpotlight.tsx — Featured services carousel
'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export interface FeaturedService {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  href: string;
  popular?: boolean;
  stage?: string;
}

const INTERVAL_MS = 6000;

export default function ServiceSpotlight({ services }: { services: FeaturedService[] }) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<'left'|'right'>('right');
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setDir('right'); setIdx(i => (i+1) % services.length);
  }, [services.length]);
  const prev = useCallback(() => {
    setDir('left'); setIdx(i => (i-1+services.length) % services.length);
  }, [services.length]);

  useEffect(() => {
    if (paused || services.length <= 1) return;
    const id = setInterval(next, INTERVAL_MS);
    return () => clearInterval(id);
  }, [next, paused, services.length]);

  // Keep idx in bounds when the services array changes (e.g. filter, prop update)
  useEffect(() => {
    if (services.length && idx >= services.length) {
      setIdx(services.length - 1);
    }
  }, [services.length]);

  if (!services.length) return null;
  const current = services[idx];

  const catColors: Record<string,string> = {
    ai: 'from-purple-600/40 to-indigo-600/40 border-purple-500/30',
    it: 'from-blue-600/40 to-cyan-600/40 border-blue-500/30',
    cloud: 'from-sky-600/40 to-blue-600/40 border-sky-500/30',
    security: 'from-orange-600/40 to-amber-600/40 border-orange-500/30',
    data: 'from-emerald-600/40 to-teal-600/40 border-emerald-500/30',
    automation: 'from-rose-600/40 to-pink-600/40 border-rose-500/30',
  };
  const catLabel: Record<string,string> = { ai:'AI', it:'IT', cloud:'Cloud', security:'Security', data:'Data', automation:'Automation' };
  const stageMeta: Record<string,{emoji:string; cls:string}> = {
    beta:    { emoji:'🧪', cls:'bg-purple-500/25 text-purple-200 border-purple-500/40' },
    planned: { emoji:'🚧', cls:'bg-amber-500/25 text-amber-200 border-amber-500/40' },
  };
  const gradient = catColors[current.category] || catColors.ai;

  return (
    <div className="relative group" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}>
      <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center
        rounded-full bg-slate-800/80 text-slate-200 hover:bg-slate-700 border border-slate-600
        opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Previous">‹</button>
      <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center
        rounded-full bg-slate-800/80 text-slate-200 hover:bg-slate-700 border border-slate-600
        opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Next">›</button>
      <div className={`transition-all duration-500 ease-in-out ${dir==='right'?'animate-slide-in-right':'animate-slide-in-left'}`}>
        <Link href={current.href} className="block">
          <div className={`relative rounded-2xl border bg-gradient-to-br ${gradient} p-6 md:p-8
            hover:border-slate-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/30
            overflow-hidden aspect-[16/9] md:aspect-[21/9]`}>
            <span className="absolute top-4 left-4 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider
              rounded-full bg-slate-900/70 text-slate-200 border border-slate-600/50 backdrop-blur-sm">
              {catLabel[current.category] || current.category}
            </span>
            {current.popular && (<span className="absolute top-4 right-16 text-yellow-400 text-lg" title="Popular">★</span>)}
    {current.stage && current.stage !== 'published' && stageMeta[current.stage] && (
      <span className={`absolute top-4 right-6 px-2 py-0.5 text-[10px] font-bold rounded-full border backdrop-blur-sm ${stageMeta[current.stage].cls}`} title={current.stage}>
        {stageMeta[current.stage].emoji} {current.stage}
      </span>
    )}
            <div className="flex flex-col h-full justify-end relative z-10">
              <div className="text-5xl mb-3">{current.icon}</div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{current.title}</h3>
              <p className="text-sm md:text-base text-slate-300 line-clamp-2">{current.description}</p>
              <span className="mt-3 text-sm text-sky-300 hover:text-sky-200 inline-flex items-center gap-1">Learn more <span>›</span></span>
            </div>
          </div>
        </Link>
      </div>
      <div className="flex justify-center gap-2 mt-3">
        {services.map((_, i) => (
          <button key={i} onClick={()=>{setDir(i>idx?'right':'left'); setIdx(i);}}
            className={`h-1.5 rounded-full transition-all duration-300 ${i===idx?'bg-sky-400 w-6':'bg-slate-600 w-1.5 hover:bg-slate-500'}`}
            aria-label={`Slide ${i+1}`} />
        ))}
      </div>
    </div>
  );
}
