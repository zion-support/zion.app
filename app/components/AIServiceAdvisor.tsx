'use client';
import { useState, useRef, useEffect } from 'react';
interface Message { role: 'user'|'assistant'; content: string; timestamp?: Date; }
const GREETINGS = ["Hi! I'm the Zion Tech Group AI Service Advisor. 👋","Tell me about your business needs — I'll match you with perfect services.","Try: 'I need AI for healthcare', 'cloud migration help', 'cybersecurity audit', etc"];
function matchServices(q: string) {
  const text = q.toLowerCase();
  const cats: string[] = [];
  if (/\b(ai|artificial intelligence|machine learning|ml|chatbot|nlp|predictive|deep learning|neural|gpt|llm|generative|computer vision|recommendation)\b/.test(text)) cats.push('ai');
  if (/\b(cloud|aws|azure|gcp|kubernetes|docker|container|serverless|scal|migration|hosting|infrastructure)\b/.test(text)) cats.push('cloud');
  if (/\b(security|cyber|firewall|vulnerability|penetration|compliance|hipaa|gdpr|encryption|threat|protect|audit|zero trust|soc|siem)\b/.test(text)) cats.push('security');
  if (/\b(data|analytics|bi|dashboard|visualization|etl|pipeline|warehouse|lake|reporting|insight|quality|observability|cdp)\b/.test(text)) cats.push('data');
  if (/\b(automation|workflow|bot|rpa|process|integration|no.?code|low.?code|citizen)\b/.test(text)) cats.push('automation');
  if (/\b(it |server|network|database|backup|disaster recovery|hardware|help desk|managed service|outsourcing)\b/.test(text)) cats.push('it');
  if (cats.length === 0) cats.push('ai','security','cloud');
  const SVC: Record,string[]> = {ai:['🧠 Advanced AI & Enterprise Intelligence','📄 AI Document Understanding','🎙️ AI Voice Agent','🛡️ AI Content Moderation'],it:['🖥️ Full IT Department Outsourcing','🔄 Disaster Recovery as a Service','🌐 Hybrid Cloud Network','🔍 SIEM & Security Operations'],cloud:['☁️ Multi-Cloud Architecture','☸️ Kubernetes Platform Engineering','🏠 Data Lakehouse Architecture'],security:['🔒 Enterprise Cybersecurity SOC','🎯 Attack Surface Management','🛡️ Red Team Operations','🔐 SaaS Security Posture'],data:['📊 Analytics & BI Platform','✅ Data Quality Engineering','👤 Customer Data Platform','📦 Feature Store Platform'],automation:['🧩 Citizen Developer Platform','🔄 Intelligent Document Workflow','⚡ Workflow Automation','🤖 Bot Development'],};
  const res: string[] = [];
  for (const c of cats.slice(0,2)) { if (SVC[c]) res.push(...SVC[c].slice(0,2)); }
  return [...new Set(res)].slice(0,4);
}
export default function AIServiceAdvisor() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Message[]>([{role:'assistant',content:GREETINGS.join('\n\n')}]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({behavior:'smooth'}); }, [msgs]);
  const send = () => {
    if (!input.trim()) return;
    const u: Message = {role:'user',content:input.trim()};
    setMsgs(p=>[...p,u]); setInput(''); setTyping(true);
    setTimeout(() => {
      const svcs = matchServices(u.content);
      let r = svcs.length ? `Great question! Based on your needs:\n\n${svcs.map(s=>`${s}`).join('\n')}\n\nWould you like:\n• 📞 Free consultation?\n• 📧 Detailed proposal?\n• 💬 Learn more?\n\nCall: +1 302 464 0950` : "I'd love to help! Tell me more about what you need:\n\n• AI / Machine Learning\n• Cloud migration\n• Cybersecurity\n• Data analytics\n• Automation\n• IT services\n\nOr call: +1 302 464 0950";
      setMsgs(p=>[...p,{role:'assistant',content:r}]); setTyping(false);
    }, 600+Math.random()*600);
  };
  const onKey = (e:React.KeyboardEvent) => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();} };
  if (!open) return (
    <button onClick={()=>setOpen(true)} style={{position:'fixed',bottom:24,right:24,zIndex:9999}} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full px-5 py-3 shadow-2xl hover:scale-105 transition-all flex items-center gap-2 font-semibold text-sm">
      <span className="text-lg">🤖</span><span className="hidden sm:inline">AI Service Advisor</span>
    </button>
  );
  return (
    <div style={{position:'fixed',bottom:24,right:24,zIndex:9999}} className="w-[360px] max-w-[calc(100vw-2rem)] h-[480px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2"><span className="text-lg">🤖</span><div><div className="font-semibold text-sm">AI Service Advisor</div><div className="text-[10px] opacity-80">Online • Zion Tech Group</div></div></div>
        <button onClick={()=>setOpen(false)} className="text-white/80 hover:text-white text-lg">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-gray-50">
        {msgs.map((m,i)=>(
          <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed whitespace-pre-wrap ${m.role==='user'?'bg-purple-600 text-white rounded-br-sm':'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'}`}>{m.content}</div>
          </div>
        ))}
        {typing && <div className="flex justify-start"><div className="bg-white shadow-sm border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-2.5 text-[13px]"><span className="inline-flex gap-1"><span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span><span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'.15s'}}></span><span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'.3s'}}></span></span></div></div>}
        <div ref={endRef}/>
      </div>
      <div className="border-t border-gray-100 p-2.5 bg-white flex-shrink-0">
        <div className="flex gap-2">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={onKey} placeholder="Describe your business needs..." className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-400" />
          <button onClick={send} disabled={!input.trim()} className="bg-purple-600 text-white rounded-xl px-3.5 py-2 text-sm font-medium hover:bg-purple-700 disabled:opacity-40">Send</button>
        </div>
        <div className="text-center mt-1"><span className="text-[9px] text-gray-400">Powered by Zion Tech Group AI • <a href="mailto:kleber@ziontechgroup.com" className="text-purple-500 hover:underline">Contact Human</a></span></div>
      </div>
    </div>
  );
}
