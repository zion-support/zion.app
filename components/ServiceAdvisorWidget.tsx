'use client';

import { useState, useRef, useEffect, useMemo } from 'react';

const CONTACT = {
  name: 'Kleber Garcia',
  company: 'Zion Tech Group',
  phone: '+1 302 464 0950',
  email: 'kleber@ziontechgroup.com',
  website: 'https://ziontechgroup.com',
};

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  pricing: { basic: string; pro?: string; enterprise?: string };
  features: string[];
  benefits: string[];
  popular?: boolean;
}

interface Message {
  role: 'user' | 'advisor';
  text: string;
  timestamp: number;
}

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
}

function scoreService(service: Service, query: string[]): number {
  let score = 0;
  const titleWords = tokenize(service.title);
  const descWords = tokenize(service.description);
  const catWords = tokenize(service.category);
  const featWords = service.features.flatMap(f => tokenize(f));
  const benefitWords = service.benefits.flatMap(b => tokenize(b));

  for (const q of query) {
    // Exact matches in title are worth most
    if (titleWords.some(w => w.includes(q) || q.includes(w))) score += 10;
    // Category match
    if (catWords.some(w => w.includes(q))) score += 8;
    // Description match
    if (descWords.some(w => w.includes(q) || q.includes(w))) score += 5;
    // Feature match
    if (featWords.some(w => w.includes(q))) score += 3;
    // Benefit match
    if (benefitWords.some(w => w.includes(q))) score += 2;
    // ID match
    if (service.id.includes(q)) score += 6;
  }
  
  // Boost popular services
  if (service.popular) score *= 1.3;
  
  return score;
}

function findTopServices(services: Service[], query: string, limit: number = 5): Service[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return services.filter(s => s.popular).slice(0, limit);
  
  return services
    .map(s => ({ service: s, score: scoreService(s, tokens) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(x => x.service);
}

function generateProposal(services: Service[]): string {
  if (services.length === 0) return '';
  
  let totalMin = 0;
  let totalMax = 0;
  
  const lines = services.map(s => {
    const basic = parseInt(s.pricing.basic) || 0;
    const enterprise = parseInt(s.pricing.enterprise || s.pricing.basic) || basic;
    totalMin += basic;
    totalMax += enterprise;
    return `• ${s.title}: $${basic.toLocaleString()}/mo (Basic) – $${enterprise.toLocaleString()}/mo (Enterprise)`;
  });
  
  return `📋 **Custom Proposal**\n\n${lines.join('\n')}\n\n💰 **Estimated Total**: $${totalMin.toLocaleString()} – $${totalMax.toLocaleString()}/mo\n\n📞 Contact: ${CONTACT.phone}\n✉ ${CONTACT.email}\n🌐 ${CONTACT.website}`;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

interface ServiceAdvisorProps {
  services: Service[];
  isOpen: boolean;
  onToggle: () => void;
}

export default function ServiceAdvisorWidget({ services, isOpen, onToggle }: ServiceAdvisorProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const popularServices = useMemo(() => 
    services.filter(s => s.popular).slice(0, 8), [services]
  );

  const categories = useMemo(() => {
    const cats: Record<string, number> = {};
    services.forEach(s => { cats[s.category] = (cats[s.category] || 0) + 1; });
    return Object.entries(cats).sort((a, b) => b[1] - a[1]);
  }, [services]);

  useEffect(() => {
    if (isOpen && !hasOpened) {
      setHasOpened(true);
      const greeting = getGreeting();
      addMessage('advisor', `${greeting}! 👋 I'm the **Zion AI Service Advisor**.\n\nI have access to **${services.length}+ services** across ${categories.length} categories:\n\n${categories.map(([cat, count]) => `• **${cat}**: ${count} services`).join('\n')}\n\nTell me what you need — "AI chatbot", "security audit", "cloud migration", "CRM", anything — and I'll match you with the best services and prices!`);
    }
    if (isOpen) inputRef.current?.focus();
  }, [isOpen, hasOpened, services, categories]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (role: 'user' | 'advisor', text: string) => {
    setMessages(prev => [...prev, { role, text, timestamp: Date.now() }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput('');
    addMessage('user', text);
    setIsTyping(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      const topServices = findTopServices(services, text, 5);

      // Greeting
      if (/^(hi|hello|hey|good|ola|holá|bonjour)/i.test(lower)) {
        addMessage('advisor', `Hello! 👋 How can I help you today?\n\nI can help you find services, compare pricing, or build a custom proposal. Just describe your needs — e.g.:\n\n• "I need AI for customer support"\n• "Security compliance for healthcare"\n• "Cloud migration from AWS"\n• "CRM for 50 person team"`);
        setIsTyping(false);
        return;
      }

      // Contact info
      if (/phone|call|contact|email|address|location/i.test(lower)) {
        addMessage('advisor', `📞 **Phone**: ${CONTACT.phone}\n✉ **Email**: ${CONTACT.email}\n📍 **Address**: 364 E Main St STE 1008, Middletown, DE 19709\n🌐 **Website**: ${CONTACT.website}\n\n${CONTACT.name} is available 24/7 to discuss your project!`);
        setIsTyping(false);
        return;
      }

      // Pricing questions
      if (/price|cost|budget|how much|pricing/i.test(lower)) {
        if (topServices.length > 0) {
          const lines = topServices.slice(0, 3).map(s => `• **${s.title}**: From $${parseInt(s.pricing.basic).toLocaleString()}/mo`);
          addMessage('advisor', `Here are pricing options based on your needs:\n\n${lines.join('\n')}\n\nWould you like me to generate a detailed proposal with these? Just say **"proposal"**.`);
        } else {
          addMessage('advisor', `Our services range from **$99/mo** for micro-SaaS tools to **$99,999/mo** for enterprise AI solutions.\n\nTell me more about what you need and I'll give you exact pricing.`);
        }
        setIsTyping(false);
        return;
      }

      // Proposal request
      if (/proposal|quote|estimate|recommend/i.test(lower)) {
        if (topServices.length > 0) {
          addMessage('advisor', generateProposal(topServices.slice(0, 3)));
        } else {
          addMessage('advisor', `I'd love to create a proposal! Tell me a bit more about your:\n\n1. **Industry** (healthcare, finance, retail, etc.)\n2. **Team size**\n3. **Budget range**\n4. **Timeline**\n\nThen I'll match you with the perfect services.`);
        }
        setIsTyping(false);
        return;
      }

      // Category browsing
      for (const [cat, count] of categories) {
        if (lower.includes(cat.replace(/[-_]/g, ' ')) || lower.includes(cat)) {
          const catServices = services.filter(s => s.category === cat && s.popular).slice(0, 5);
          const lines = catServices.map(s => `• **${s.title}**: $${parseInt(s.pricing.basic).toLocaleString()}/mo`);
          addMessage('advisor', `**${cat.charAt(0).toUpperCase() + cat.slice(1)}** (${count} services):\n\n${lines.join('\n')}\n\nWould you like more details on any of these?`);
          setIsTyping(false);
          return;
        }
      }

      // Service matching
      if (topServices.length > 0) {
        const proposal = generateProposal(topServices.slice(0, 3));
        addMessage('advisor`, `Based on your needs, I recommend:\n\n${topServices.slice(0, 3).map((s, i) => `**${i+1}. ${s.title}**\n   From $${parseInt(s.pricing.basic).toLocaleString()}/mo | ${s.description.slice(0, 80)}...`).join('\n\n')}\n\n${proposal}\n\nWould you like to schedule a call? 📞 ${CONTACT.phone}`);
      } else {
        addMessage('advisor`, `I couldn't find an exact match for "${text}". Here are some popular services you might like:\n\n${popularServices.slice(0, 4).map(s => `• **${s.title}**: $${parseInt(s.pricing.basic).toLocaleString()}/mo`).join('\n')}\n\nTry being more specific, like "AI chatbot" or "security audit"!`);
      }
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => onToggle()}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-full px-6 py-4 shadow-2xl shadow-purple-600/40 flex items-center gap-3 transition-all duration-300 hover:scale-105 animate-bounce"
      >
        <span className="text-2xl">🤖</span>
        <span className="font-semibold">AI Service Advisor</span>
        <span className="text-xs bg-green-500 rounded-full w-3 h-3 animate-pulse" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[600px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-purple-900/30 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <div className="font-semibold text-white text-sm">Zion AI Service Advisor</div>
            <div className="text-xs text-purple-200">{services.length}+ services available</div>
          </div>
        </div>
        <button onClick={onToggle} className="text-white/70 hover:text-white text-xl font-bold">×</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[380px]">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-purple-600 text-white rounded-br-sm'
                : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700'
            }`}>
              {m.text.split('\n').map((line, j) => (
                <span key={j}>
                  {line.split('**').map((part, k) => 
                    k % 2 === 1 ? <strong key={k} className="text-white font-semibold">{part}</strong> : part
                  )}
                  {j < m.text.split('\n').length - 1 && <br />}
                </span>
              ))}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-2xl px-4 py-3 border border-slate-700">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}} />
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}} />
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick actions */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto shrink-0 border-t border-slate-800">
        {['Proposal', 'Pricing', 'Security AI', 'Cloud migration', 'Contact'].map(q => (
          <button
            key={q}
            onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 50); }}
            className="shrink-0 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-xs text-slate-300 hover:text-purple-300 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-700 shrink-0">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Describe your needs..."
            className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2.5 transition-colors"
          >
            ↑
          </button>
        </div>
        <div className="text-[10px] text-slate-600 mt-1.5 text-center">
          Powered by Zion Tech Group · {CONTACT.phone}
        </div>
      </form>
    </div>
  );
}
