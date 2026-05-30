'use client';
import { useState } from 'react';

const engines = [
  { id:'v134', name:'V134: Signature Intelligence', icon:'✍️',
    description:'Dynamic smart email signatures that adapt per recipient with case studies, social proof, A/B testing, and brand consistency enforcement.',
    features:['Dynamic signatures per recipient industry/role','Relevant case study insertion','Calendar link & social proof embedding','Signature link click tracking & analytics','A/B testing with statistical analysis','Brand consistency enforcement (logo, colors, fonts)','Multi-template support (formal/casual/creative)','Reply-all enforcement for team signatures'],
    color:'from-emerald-500 to-teal-600', stats:{templates:'5+',departments:'∞',compliance:'100%'}, pricing:'$249/mo',
    useCases:['Sales Teams','Marketing','Executive Comms','Brand Management']},
  { id:'v135', name:'V135: Calendar Intelligence', icon:'📅',
    description:'Auto-detect scheduling intent, propose optimal meeting times, generate agendas, send calendar invites, and manage buffers automatically.',
    features:['Auto-detect scheduling intent (8 types)','Optimal time proposals across timezones','Agenda generation from email context','ICS calendar invite generation','Recurring meeting pattern detection','Duration optimization based on agenda','Buffer time management between meetings','Reply-all enforcement for scheduling emails'],
    color:'from-blue-500 to-indigo-600', stats:{intentTypes:'8',timezone:'Global',ICS:'RFC 5545'}, pricing:'$299/mo',
    useCases:['Executive Assistants','Sales Teams','Recruiters','Project Managers']},
  { id:'v136', name:'V136: Knowledge Graph', icon:'🕸️',
    description:'Build a living knowledge graph from emails: expertise mapping, organizational network analysis, topic trends, and collaboration patterns.',
    features:['Living knowledge graph from all emails','Expertise mapping (who knows what)','Organizational network analysis','Topic trend detection over time','Collaboration pattern discovery','Knowledge gap identification','Relationship strength scoring','Graph query interface'],
    color:'from-purple-500 to-violet-600', stats:{nodes:'∞',metrics:'7',queries:'5+'}, pricing:'$499/mo',
    useCases:['Knowledge Management','HR & Org Design','R&D Teams','Consulting']},
  { id:'v137', name:'V137: Compliance Auto-Filer', icon:'🗄️',
    description:'Auto-classify emails into regulatory retention categories (FINRA, HIPAA, GDPR, SOX, PCI-DSS) with legal holds and audit readiness.',
    features:['5 regulatory frameworks (FINRA/HIPAA/GDPR/SOX/PCI)','Content-based auto-classification','Legal hold management (apply/remove/bulk)','Chain-of-custody logging','Retention schedule enforcement','Auto-purge of expired records','Compliance reports per framework','Reply-all enforcement for compliance emails'],
    color:'from-amber-500 to-orange-600', stats:{frameworks:'5',retention:'Auto',audit:'Ready'}, pricing:'$599/mo',
    useCases:['Legal & Compliance','Finance','Healthcare','Government']},
  { id:'v138', name:'V138: Content Repurposer', icon:'🔄',
    description:'Transform email conversations into blog posts, social media content, FAQ entries, case studies, and training materials with brand voice.',
    features:['Blog post generation (SEO-optimized)','Social media content (LinkedIn/X/Instagram)','FAQ entry extraction','Case study creation (problem-solution-result)','Training material generation','Brand voice consistency checking','PII redaction before publishing','Multi-format export (MD/HTML/JSON)'],
    color:'from-pink-500 to-rose-600', stats:{formats:'8',PII:'9 categories',voice:'Scored'}, pricing:'$349/mo',
    useCases:['Content Marketing','Documentation','Training','Customer Success']},
];

export default function EmailIntelligenceV7Showcase() {
  const [active, setActive] = useState('v134');
  const current = engines.find(e => e.id === active) || engines[0];
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-slate-950 via-emerald-950/15 to-slate-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-sm text-emerald-300 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            V134–V138 • Signature · Calendar · Knowledge · Compliance · Content
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">🚀 30 Engines. One Platform. Zero Limits.</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Smart signatures, calendar automation, knowledge graphs, compliance filing, and content repurposing —
            all with <strong className="text-emerald-300">guaranteed reply-all enforcement</strong> and
            case-by-case AI analysis.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {engines.map(eng => (
            <button key={eng.id} onClick={() => setActive(eng.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${active===eng.id?`bg-gradient-to-r ${eng.color} text-white shadow-lg scale-105`:'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white'}`}>
              {eng.icon} {eng.name.split(':')[0]}
            </button>
          ))}
        </div>
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/80 backdrop-blur p-6 md:p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className={`text-4xl p-3 rounded-xl bg-gradient-to-br ${current.color} bg-opacity-20`}>{current.icon}</div>
            <div><h3 className="text-2xl font-bold text-white">{current.name}</h3>
              <p className="text-slate-400 mt-1">{current.description}</p></div>
          </div>
          <div className="flex flex-wrap gap-4 mb-6">
            {Object.entries(current.stats).map(([k,v])=>(
              <div key={k} className="bg-slate-800/60 rounded-lg px-4 py-2 text-center">
                <div className="text-lg font-bold text-white">{v}</div>
                <div className="text-xs text-slate-400 capitalize">{k.replace(/([A-Z])/g,' $1')}</div>
              </div>))}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg px-4 py-2 text-center">
              <div className="text-lg font-bold text-green-400">{current.pricing}</div>
              <div className="text-xs text-green-300">Starting at</div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3 mb-6">
            {current.features.map((f,i)=>(
              <div key={i} className="flex items-start gap-2 bg-slate-800/40 rounded-lg p-3">
                <span className="text-green-400 mt-0.5">✓</span>
                <span className="text-slate-300 text-sm">{f}</span>
              </div>))}
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {current.useCases.map((uc,i)=>(
              <span key={i} className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-full">{uc}</span>))}
          </div>
          <div className="flex flex-wrap gap-3 items-center justify-between bg-slate-800/40 rounded-xl p-4">
            <div><p className="text-white font-semibold">Ready to unlock the full power of email AI?</p>
              <p className="text-slate-400 text-sm">14-day free trial • No credit card required</p></div>
            <div className="flex gap-2">
              <a href="/contact" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Get Started</a>
              <a href="mailto:kleber@ziontechgroup.com" className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">📧 Contact Sales</a>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
          {[{label:'Signatures Generated',value:'2M+',icon:'✍️'},{label:'Meetings Scheduled',value:'500K+',icon:'📅'},{label:'Knowledge Nodes',value:'10M+',icon:'🕸️'},{label:'Emails Filed',value:'5M+',icon:'🗄️'},{label:'Content Pieces',value:'1M+',icon:'🔄'}].map((s,i)=>(
            <div key={i} className="bg-slate-800/40 rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-slate-400 text-xs">{s.label}</div>
            </div>))}
        </div>
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>📱 +1 302 464 0950 • 📧 kleber@ziontechgroup.com • 📍 364 E Main St STE 1008, Middletown DE 19709</p>
        </div>
      </div>
    </section>
  );
}
