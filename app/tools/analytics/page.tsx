// app/tools/analytics/page.tsx
'use client';
import { useMemo } from 'react';

import { getToolVisits } from '@/data/tools_tracker';

const TOOL_META: Record<string, {emoji:string;name:string;href:string}> = {
  'ai-service-router':   {emoji:'🤖',name:'AI Service Router',   href:'/tools/ai-service-router'},
  'roi-calculator':      {emoji:'📈',name:'ROI Calculator',      href:'/tools/roi-calculator'},
  'service-comparison':  {emoji:'⚖️', name:'Service Comparison',  href:'/tools/service-comparison'},
  'service-recommender': {emoji:'🎯',name:'Service Recommender', href:'/tools/service-recommender'},
  'port-scanner':        {emoji:'🔓',name:'Port Scanner',        href:'/tools/port-scanner'},
  'ssl-checker':         {emoji:'🔒',name:'SSL Checker',         href:'/tools/ssl-checker'},
};

function fmt(n:number):string{
  if(n>=1e6) return (n/1e6).toFixed(1)+'M';
  if(n>=1e3) return (n/1e3).toFixed(1)+'K';
  return n.toLocaleString();
}

export default function Analytics(){
  const { byTool, total } = useMemo(()=>{
    const data = getToolVisits();
    const byTool:Record<string,number>={};
    let total=0;
    for(const [k,v] of Object.entries(data)){byTool[k]=v;total+=v;}
    return {byTool,total};
  },[]);

  const ranking = Object.entries(byTool)
    .map(([slug,count])=>({slug,count,...(TOOL_META[slug]||{emoji:'🔧',name:slug,href:'#'})}))
    .sort((a,b)=>b.count-a.count);
  const maxCount = ranking[0]?.count||1;

  return(
    <main className="min-h-screen bg-slate-950 py-20 px-4">
      <div className="container-page max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Free Tools — Usage Analytics</h1>
          <p className="section-subheading">Client-side page view counter. No tracking, no cookies, no external calls. Data lives in your browser only.</p>
        </div>
        <div className="flex justify-center gap-4 mb-12">
          <div className="bg-purple-900/40 border border-purple-500/30 rounded-xl px-6 py-4 text-center">
            <div className="text-3xl text-purple-300 font-bold">{fmt(total)}</div>
            <div className="text-slate-400 text-xs mt-1">Total Visits (your browser)</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl px-6 py-4 text-center">
            <div className="text-3xl text-white font-bold">{ranking.length}</div>
            <div className="text-slate-400 text-xs mt-1">Tools Tracked</div>
          </div>
        </div>
        {ranking.length===0
          ?<p className="text-slate-500 text-center py-8">No visits recorded yet — visit any free tool to seed data.</p>
          :<div className="space-y-3">
            {ranking.map(({slug,count,emoji,name,href})=>{
              const pct=maxCount>0?(count/maxCount)*100:0;
              return(
                <a key={slug} href={href}
                  className="block bg-slate-900/40 border border-slate-700/50 rounded-xl px-5 py-4 hover:border-purple-500/30 transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{emoji}</span>
                    <span className="text-purple-300 font-semibold">{fmt(count)} visits</span>
                  </div>
                  <div className="text-white font-medium mb-1">{name}</div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{width:`${pct}%`}}/>
                  </div>
                  <div className="text-slate-600 text-xs mt-1">/tools/{slug}/</div>
                </a>
              );
            })}
          </div>}
        <p className="text-slate-600 text-xs mt-8 text-center">
          Data is stored in localStorage on this device only. Clear your browser storage to reset.
        </p>
      </div>
    </main>
  );
}
