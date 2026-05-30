// app/proposals/page.tsx — AI Proposal Generator Dashboard
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Proposal {
  filename: string;
  sender: string;
  date: string;
  content: string;
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Proposal | null>(null);

  useEffect(() => {
    // In production this would be an API call
    // For now, show a placeholder with instructions
    setLoading(false);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="container-page py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">📋 AI Proposal Generator</h1>
            <p className="text-slate-400">Auto-generated proposals from email inquiries</p>
          </div>
          <div className="flex gap-3">
            <Link href="/email-dashboard/" className="btn-secondary">📊 Analytics</Link>
            <Link href="/" className="btn-secondary">← Home</Link>
          </div>
        </div>

        <div className="glass-card mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Email Received', desc: 'Someone emails kleber@ziontechgroup.com asking about services', icon: '📧' },
              { step: '2', title: 'AI Matches Services', desc: 'Our AI analyzes the inquiry and matches relevant services from 700+ options', icon: '🧠' },
              { step: '3', title: 'Proposal Generated', desc: 'A personalized proposal is drafted and saved here for review', icon: '📋' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-purple-400 font-bold mb-1">Step {s.step}</div>
                <div className="text-white font-semibold mb-1">{s.title}</div>
                <div className="text-slate-400 text-sm">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <h2 className="text-lg font-semibold text-white mb-4">Proposals</h2>
          {proposals.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-slate-400 mb-2">No proposals generated yet</p>
              <p className="text-slate-500 text-sm">
                Proposals are auto-generated when service inquiries arrive at kleber@ziontechgroup.com
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {proposals.map((p) => (
                <div key={p.filename} className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 cursor-pointer"
                  onClick={() => setSelected(p)}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-semibold">{p.sender}</div>
                      <div className="text-slate-400 text-sm">{p.date}</div>
                    </div>
                    <span className="text-purple-400 text-sm">View →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selected && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelected(null)}>
            <div className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 border border-slate-700"
              onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Proposal for {selected.sender}</h3>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white text-xl">✕</button>
              </div>
              <div className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
                {selected.content}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
