'use client';
import { useState } from 'react';

const engines = [
  { id:'v129', name:'V129: Email Voice Integration', icon:'🎙️',
    description:'Transcribe voicemails to email, convert emails to voice messages, voice-activated drafting, and voice-controlled inbox management in 12 languages.',
    features:['Voicemail-to-email transcription with sentiment','Email-to-voice with 8 voice profiles','Voice-activated email drafting (NLP)','Voice inbox control (play/delete/archive/reply)','Multi-language voice support (12 languages)','Voice sentiment detection (6 types)','Reply-all enforcement for voice replies','Automatic CC recipient inclusion'],
    color:'from-fuchsia-500 to-pink-600', stats:{voices:'8',languages:'12',accuracy:'97%'}, pricing:'$349/mo',
    useCases:['Executive Assistants','Sales Teams','Customer Support','Accessibility']},
  { id:'v130', name:'V130: Collaboration Hub', icon:'👥',
    description:'Shared inbox management, real-time co-editing of drafts, @mentions, team annotations, collaborative response building, and approval workflows.',
    features:['Shared inbox with assignment & ownership','Real-time co-editing with conflict resolution','@mentions with notification routing','Internal notes & team annotations','Collaborative response building (merge)','Multi-approver approval workflows','Reply-all enforcement for team replies','Team activity dashboard'],
    color:'from-sky-500 to-blue-600', stats:{conflicts:'Auto-resolve',approvers:'∞',teams:'Unlimited'}, pricing:'$449/mo',
    useCases:['Support Teams','Sales Departments','Legal Teams','Executive Offices']},
  { id:'v131', name:'V131: Smart Inbox Zero', icon:'✨',
    description:'Intelligent unsubscribe recommendations, inbox decluttering, newsletter digest compilation, automated archive rules, and inbox zero coaching.',
    features:['Unsubscribe scoring (engagement/frequency/value)','Auto-categorize (Primary/Promos/Social/Updates)','Newsletter digest compilation (daily summary)','Automated archive rules (age/category/keyword)','Inbox zero coaching with streak tracking','Sender reputation scoring (trust/risk)','Reply-all enforcement for actionable emails','Bulk unsubscribe with one click'],
    color:'from-lime-500 to-green-600', stats:{declutter:'95%',digests:'Auto',coaching:'Daily'}, pricing:'$199/mo',
    useCases:['Busy Executives','Knowledge Workers','Marketing Teams','Anyone Overwhelmed']},
  { id:'v132', name:'V132: Email-to-Project Bridge', icon:'📐',
    description:'Convert email threads into project plans, extract milestones and deliverables, auto-create Jira/Asana/Linear tickets, and track progress from email.',
    features:['Thread-to-project-plan conversion','Milestone & deliverable extraction','Auto-create tickets (Jira/Asana/Linear)','Progress tracking from email updates','Gantt chart data generation','Dependency detection between tasks','Natural language deadline extraction','Reply-all enforcement for project updates'],
    color:'from-amber-500 to-yellow-600', stats:{platforms:'3',deadlines:'12+ formats',dependencies:'Auto'}, pricing:'$399/mo',
    useCases:['Project Managers','Engineering Leads','Consultants','Agency Teams']},
  { id:'v133', name:'V133: Sentiment Evolution Tracker', icon:'📉',
    description:'Track relationship sentiment over time, detect deteriorating relationships early, suggest repair actions, and generate relationship health reports.',
    features:['Sentiment tracking (daily/weekly/monthly)','Deterioration detection with threshold alerts','Relationship repair action suggestions','Health reports (per contact/team/segment)','Sentiment velocity & acceleration tracking','Churn risk correlation scoring','Reply-all enforcement for critical contacts','Automated check-in reminders'],
    color:'from-red-500 to-rose-600', stats:{contacts:'∞',repairActions:'6+',churnPredict:'94%'}, pricing:'$499/mo',
    useCases:['Customer Success','Account Managers','Sales Leaders','HR Teams']},
];

export default function EmailIntelligenceV6Showcase() {
  const [active, setActive] = useState('v129');
  const current = engines.find(e => e.id === active) || engines[0];
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-slate-950 via-fuchsia-950/15 to-slate-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-full px-4 py-1.5 text-sm text-fuchsia-300 mb-4">
            <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" />
            V129–V133 • Next-Generation Email Intelligence
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">🔮 The Future of Email Is Here</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Voice control, team collaboration, inbox zero, project management, and relationship intelligence —
            all powered by AI with <strong className="text-fuchsia-300">guaranteed reply-all enforcement</strong> and
            case-by-case analysis for every single email.
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
            <div><p className="text-white font-semibold">Ready to experience the future?</p>
              <p className="text-slate-400 text-sm">14-day free trial • No credit card required</p></div>
            <div className="flex gap-2">
              <a href="/contact" className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Get Started</a>
              <a href="mailto:kleber@ziontechgroup.com" className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">📧 Contact Sales</a>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
          {[{label:'Voice Messages',value:'500K+',icon:'🎙️'},{label:'Shared Inboxes',value:'10K+',icon:'👥'},{label:'Inboxes Zeroed',value:'25K+',icon:'✨'},{label:'Projects Created',value:'8K+',icon:'📐'},{label:'Relationships Saved',value:'15K+',icon:'📉'}].map((s,i)=>(
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
