// app/crm-leads/page.tsx — AI CRM Lead Pipeline Dashboard
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Lead {
  id: string;
  source: string;
  email: string;
  subject: string;
  intent: string;
  urgency: string;
  sentiment: string;
  matched_services: string[];
  matched_count: number;
  created_at: string;
  status: string;
  pipeline_stage: string;
}

const STAGE_COLORS: Record<string, string> = {
  inquiry: 'bg-blue-500/20 text-blue-300',
  qualified: 'bg-purple-500/20 text-purple-300',
  proposal: 'bg-amber-500/20 text-amber-300',
  negotiation: 'bg-orange-500/20 text-orange-300',
  closed_won: 'bg-green-500/20 text-green-300',
  closed_lost: 'bg-red-500/20 text-red-300',
};

const URGENCY_COLORS: Record<string, string> = {
  critical: 'text-red-400', high: 'text-orange-400', medium: 'text-yellow-400', low: 'text-slate-400',
};

export default function CrmLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/data/crm_leads.json')
      .then(r => r.ok ? r.json() : Promise.reject('No data'))
      .then(d => { setLeads(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter || l.pipeline_stage === filter);
  const stages = ['inquiry', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];
  const stageCounts = stages.reduce((acc, s) => ({ ...acc, [s]: leads.filter(l => l.pipeline_stage === s).length }), {} as Record<string, number>);

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="container-page py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">📋 AI CRM Lead Pipeline</h1>
            <p className="text-slate-400">Auto-generated leads from email inquiries • {leads.length} total</p>
          </div>
          <div className="flex gap-3">
            <Link href="/email-dashboard/" className="btn-secondary">📊 Analytics</Link>
            <Link href="/proposals/" className="btn-secondary">📝 Proposals</Link>
            <Link href="/" className="btn-secondary">← Home</Link>
          </div>
        </div>

        {/* Pipeline Stages */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {stages.map(stage => (
            <div key={stage} className={`rounded-xl p-3 text-center ${STAGE_COLORS[stage] || 'bg-slate-800 text-slate-300'} border border-slate-700/50`}>
              <div className="text-2xl font-bold">{stageCounts[stage] || 0}</div>
              <div className="text-xs uppercase tracking-wider mt-1">{stage.replace('_', ' ')}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'new', 'inquiry', 'qualified', 'proposal'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm ${filter === f ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Leads Table */}
        {loading ? (
          <div className="text-center py-12 text-slate-400">⏳ Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="glass-card text-center py-12">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-slate-400 mb-2">No leads yet</p>
            <p className="text-slate-500 text-sm">Leads are auto-created when service inquiries arrive at kleber@ziontechgroup.com</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.slice().reverse().map(lead => (
              <div key={lead.id} className="glass-card hover:border-purple-500/30 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-white font-semibold text-sm truncate">{lead.email}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STAGE_COLORS[lead.pipeline_stage] || 'bg-slate-700'}`}>
                        {lead.pipeline_stage}
                      </span>
                      <span className={`text-xs ${URGENCY_COLORS[lead.urgency] || 'text-slate-400'}`}>
                        {lead.urgency}
                      </span>
                    </div>
                    <div className="text-slate-400 text-xs truncate mb-2">{lead.subject}</div>
                    <div className="flex flex-wrap gap-1">
                      {lead.matched_services.slice(0, 3).map((s, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">{s}</span>
                      ))}
                      {lead.matched_count > 3 && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">+{lead.matched_count - 3} more</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-slate-500">{new Date(lead.created_at).toLocaleDateString()}</div>
                    <div className="text-xs text-slate-400 capitalize mt-1">{lead.intent}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <div className="glass-card text-center py-8 mt-8">
          <h2 className="text-xl font-bold text-white mb-2">Supercharge Your Lead Generation</h2>
          <p className="text-slate-400 mb-4">Our AI automatically captures and qualifies leads from every email inquiry</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:kleber@ziontechgroup.com" className="btn-primary">✉ Contact Us</a>
            <a href="tel:+13024640950" className="btn-secondary">☎ +1 302 464 0950</a>
            <Link href="/configurator/" className="btn-secondary">⚡ Get Proposal</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
