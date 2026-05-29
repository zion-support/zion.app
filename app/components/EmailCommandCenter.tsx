'use client';
import React, { useState, useMemo } from 'react';

interface EmailDraft {
  id: string; from: string; subject: string; intent: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  action: string; createdAt: string; status: 'pending' | 'approved' | 'sent';
}

const MOCK_DRAFTS: EmailDraft[] = [
  { id:'1', from:'john.smith@enterprise.com', subject:'RFP: AI Document Processing', intent:'Sales Inquiry', priority:'high', action:'Reply with Proposal', createdAt:'10 min ago', status:'pending' },
  { id:'2', from:'sarah.jones@startup.io', subject:'Urgent: Production API Down', intent:'Support', priority:'urgent', action:'Reply Immediately', createdAt:'25 min ago', status:'pending' },
  { id:'3', from:'mike.partner@bigtech.com', subject:'Partnership Opportunity', intent:'Partnership', priority:'high', action:'Reply with Info', createdAt:'1 hr ago', status:'approved' },
  { id:'4', from:'emily.chen@technews.com', subject:'Interview Request', intent:'Media', priority:'low', action:'Reply with Template', createdAt:'2 hrs ago', status:'sent' },
  { id:'5', from:'robert.williams@client.com', subject:'Complaint: Service', intent:'Complaint', priority:'urgent', action:'Escalate', createdAt:'3 hrs ago', status:'pending' },
];

const PRIORITY_CFG = {
  urgent: { color:'text-red-400', bg:'bg-red-500/10', border:'border-red-500/30', dot:'bg-red-400' },
  high: { color:'text-amber-400', bg:'bg-amber-500/10', border:'border-amber-500/30', dot:'bg-amber-400' },
  medium: { color:'text-blue-400', bg:'bg-blue-500/10', border:'border-blue-500/30', dot:'bg-blue-400' },
  low: { color:'text-gray-400', bg:'bg-gray-500/10', border:'border-gray-500/30', dot:'bg-gray-400' },
};

const STATUS_CFG = {
  pending: { label:'Pending Review', color:'text-amber-400', icon:'⏳' },
  approved: { label:'Approved', color:'text-emerald-400', icon:'✅' },
  sent: { label:'Sent', color:'text-blue-400', icon:'📤' },
};

export default function EmailCommandCenter() {
  const [filter, setFilter] = useState<'all'|'pending'|'urgent'>('all');
  const [expandedId, setExpandedId] = useState<string|null>(null);
  const [drafts] = useState<EmailDraft[]>(MOCK_DRAFTS);

  const stats = useMemo(() => ({
    total: 24, pending: drafts.filter(d=>d.status==='pending').length,
    urgent: drafts.filter(d=>d.priority==='urgent').length,
    sent: drafts.filter(d=>d.status==='sent').length, avgTime: '2.4 hrs',
  }), [drafts]);

  const filtered = useMemo(() => {
    if (filter==='pending') return drafts.filter(d=>d.status==='pending');
    if (filter==='urgent') return drafts.filter(d=>d.priority==='urgent');
    return drafts;
  }, [drafts, filter]);

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-4">AI Powered</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">📧 Email Command Center</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">AI-powered email intelligence — case-by-case analysis, smart drafting, reply-all detection, and priority scoring.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            {label:'Emails Today', value:stats.total, icon:'📬', color:'from-blue-500/20 to-indigo-500/10'},
            {label:'Pending', value:stats.pending, icon:'⏳', color:'from-amber-500/20 to-orange-500/10'},
            {label:'Urgent', value:stats.urgent, icon:'🚨', color:'from-red-500/20 to-rose-500/10'},
            {label:'Sent Today', value:stats.sent, icon:'📤', color:'from-emerald-500/20 to-green-500/10'},
            {label:'Avg Response', value:stats.avgTime, icon:'⚡', color:'from-purple-500/20 to-violet-500/10'},
          ].map((s,i) => (
            <div key={i} className={`bg-gradient-to-br ${s.color} border border-gray-700/50 rounded-xl p-4 text-center`}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mb-6">
          {[
            {key:'all', label:'All', count:drafts.length},
            {key:'pending', label:'Pending', count:stats.pending},
            {key:'urgent', label:'Urgent', count:stats.urgent},
          ].map(tab => (
            <button key={tab.key} onClick={()=>setFilter(tab.key as typeof filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                filter===tab.key ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}>{tab.label}<span className={`px-2 py-0.5 rounded-full text-xs ${filter===tab.key?'bg-white/20':'bg-gray-700'}`}>{tab.count}</span></button>
          ))}
        </div>
        <div className="space-y-3">
          {filtered.map(d => {
            const pc = PRIORITY_CFG[d.priority];
            const sc = STATUS_CFG[d.status] || STATUS_CFG.pending;
            return (
              <div key={d.id} className={`bg-gray-800/50 rounded-xl border transition-all ${pc.border} hover:border-gray-600`}>
                <button onClick={()=>setExpandedId(expandedId===d.id?null:d.id)} className="w-full p-4 flex items-center gap-4 text-left">
                  <div className={`w-2.5 h-2.5 rounded-full ${pc.dot} flex-shrink-0`}/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium text-sm truncate">{d.from}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${pc.bg} ${pc.color}`}>{d.priority}</span>
                    </div>
                    <p className="text-gray-400 text-sm truncate">{d.subject}</p>
                  </div>
                  <span className={`hidden md:block text-xs ${sc.color}`}>{sc.icon} {sc.label}</span>
                  <svg className={`w-5 h-5 text-gray-500 transition-transform ${expandedId===d.id?'rotate-180':''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                </button>
                {expandedId===d.id && (
                  <div className="px-4 pb-4 border-t border-gray-700/50 pt-3">
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div><span className="text-gray-500">Intent:</span><p className="text-gray-300 font-medium">{d.intent}</p></div>
                      <div><span className="text-gray-500">Action:</span><p className="text-blue-400 font-medium">{d.action}</p></div>
                      <div><span className="text-gray-500">Status:</span><p className={`${sc.color} font-medium`}>{sc.icon} {sc.label}</p></div>
                    </div>
                    <div className="mt-3 text-xs text-amber-400">📨 Reply-All detection: Yes — multiple recipients</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm mb-4">Want AI-powered email intelligence for your business?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="mailto:kleber@ziontechgroup.com" className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg border border-gray-700 text-sm">📧 kleber@ziontechgroup.com</a>
            <a href="tel:+130****0950" className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg border border-gray-700 text-sm">📞 +1 302 464 0950</a>
          </div>
        </div>
      </div>
    </section>
  );
}
