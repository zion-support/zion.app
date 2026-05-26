// Careers
'use client';
import Link from 'next/link';

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/about/" className="text-purple-400 hover:text-purple-300 text-sm mb-6 inline-block">← About</Link>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Careers at Zion Tech Group</h1>
        <p className="text-slate-400 text-lg mb-8">Build the future of AI & enterprise software. Remote-first, competitive equity, open-source contributions welcome.</p>
        <div className="space-y-4">
          {[['Senior AI Engineer','Remote / Hybrid','ML pipeline work, RAG, agents'],
            ['DevOps / Platform Engineer','Remote','Infra as code, CI/CD, observability'],
            ['Solution Architect','Remote / Travel','Enterprise AI deployments, customer success'],
          ].map(([role,loc,desc],i)=>(
            <div key={i} className="bg-slate-900/80 border border-slate-700 rounded-xl p-6 flex justify-between items-center hover:border-purple-500/60 transition">
              <div>
                <h3 className="font-semibold text-lg">{role}</h3>
                <p className="text-purple-400 text-sm">{loc}</p>
                <p className="text-slate-400 text-sm">{desc}</p>
              </div>
              <Link href="/contact/" className="btn-secondary whitespace-nowrap ml-4">Apply</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
