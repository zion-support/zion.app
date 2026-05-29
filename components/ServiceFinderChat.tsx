'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  role: 'bot' | 'user';
  content: string;
  services?: ServiceMatch[];
}

interface ServiceMatch {
  title: string;
  href: string;
  price: string;
  icon: string;
  match: number;
  description: string;
}

const serviceKnowledge: { keywords: string[]; services: ServiceMatch[] }[] = [
  {
    keywords: ['email', 'inbox', 'reply', 'communication', 'message'],
    services: [
      { title: 'AI Email Intelligence Platform', href: '/services/ai-email-intelligence-platform', price: '$599/mo', icon: '📧', match: 95, description: 'Smart routing, quality scoring, reply-all enforcement' },
      { title: 'AI Priority Email Routing', href: '/services/ai-priority-email-routing', price: '$1,199/mo', icon: '📬', match: 90, description: 'Priority decay modeling with SLA enforcement' },
      { title: 'AI Reply-All Enforcement', href: '/services/ai-reply-all-enforcer', price: '$449/mo', icon: '📨', match: 88, description: 'Guaranteed reply-all with smart detection' },
    ]
  },
  {
    keywords: ['security', 'cyber', 'threat', 'hack', 'protect', 'firewall', 'penetration'],
    services: [
      { title: 'AI Compliance Email Guardian', href: '/services/ai-compliance-email-guardian', price: '$4,499/mo', icon: '🛡️', match: 95, description: 'GDPR/HIPAA/PCI compliance monitoring' },
      { title: 'AI Network Security Monitor', href: '/services/ai-network-security-monitor', price: '$5,999/mo', icon: '🔒', match: 92, description: 'Real-time threat detection & response' },
      { title: 'AI Penetration Testing', href: '/services/ai-pen-testing-automation', price: '$5,999/mo', icon: '🔓', match: 88, description: 'Automated vulnerability scanning' },
    ]
  },
  {
    keywords: ['sales', 'lead', 'deal', 'pipeline', 'revenue', 'crm', 'customer'],
    services: [
      { title: 'AI CRM Intelligence', href: '/services/ai-crm-intelligence', price: '$1,499/mo', icon: '🎯', match: 95, description: 'Lead scoring, deal prediction, automation' },
      { title: 'AI Sales Objection Handler', href: '/services/ai-sales-objection-handler', price: '$1,199/mo', icon: '🎯', match: 90, description: '25% higher win rates with AI suggestions' },
      { title: 'AI Customer Health Dashboard', href: '/services/ai-customer-health-dashboard', price: '$2,999/mo', icon: '💚', match: 88, description: 'Churn prediction with 85% accuracy' },
    ]
  },
  {
    keywords: ['cloud', 'aws', 'azure', 'gcp', 'infrastructure', 'server', 'kubernetes', 'k8s'],
    services: [
      { title: 'Cloud Cost Optimization', href: '/services/cloud-cost-optimization-platform', price: '$1,499/mo', icon: '☁️', match: 95, description: '35% cloud cost reduction' },
      { title: 'Cloud FinOps Platform', href: '/services/cloud-finops-platform', price: '$2,999/mo', icon: '💰', match: 92, description: 'Multi-cloud financial management' },
      { title: 'Kubernetes Autoscaling', href: '/services/kubernetes-autoscaling-intelligence', price: '$2,399/mo', icon: '⚡', match: 88, description: 'ML-based traffic prediction & scaling' },
    ]
  },
  {
    keywords: ['ai', 'machine learning', 'ml', 'neural', 'model', 'llm', 'gpt', 'artificial intelligence'],
    services: [
      { title: 'Advanced AI Enterprise Hub', href: '/services/advanced-ai-enterprise-intelligence-hub', price: '$4,999/mo', icon: '🧠', match: 95, description: 'Unified AI fabric with governance' },
      { title: 'AI Agentic Workflows', href: '/services/ai-agentic-workflows', price: '$449/mo', icon: '🤖', match: 90, description: 'Autonomous multi-step automation' },
      { title: 'AI Workflow Builder', href: '/services/ai-workflow-automation-builder', price: '$899/mo', icon: '⚡', match: 88, description: 'No-code AI workflow design' },
    ]
  },
  {
    keywords: ['data', 'analytics', 'bi', 'dashboard', 'report', 'insight', 'warehouse'],
    services: [
      { title: 'AI Data Catalog', href: '/services/ai-data-catalog-platform', price: '$4,499/mo', icon: '📚', match: 95, description: 'Automated data discovery & governance' },
      { title: 'AI Email Analytics Suite', href: '/services/ai-email-analytics-suite', price: '$1,199/mo', icon: '📊', match: 90, description: 'Response times, sentiment, performance' },
      { title: 'Real-Time Data Streaming', href: '/services/real-time-data-streaming-platform', price: '$5,999/mo', icon: '🌊', match: 88, description: 'Millions of events/sec processing' },
    ]
  },
  {
    keywords: ['meeting', 'calendar', 'schedule', 'appointment', 'zoom', 'teams'],
    services: [
      { title: 'AI Meeting Intelligence', href: '/services/ai-meeting-intelligence-platform', price: '$599/mo', icon: '🎙️', match: 95, description: 'Transcription, action items, CRM sync' },
      { title: 'AI Meeting Scheduler', href: '/services/ai-meeting-scheduler-intelligence', price: '$599/mo', icon: '📅', match: 92, description: 'Timezone-aware scheduling' },
      { title: 'Smart Appointment Scheduler', href: '/services/micro-saas-appointment-scheduler', price: '$149/mo', icon: '📅', match: 88, description: 'Multi-party coordination' },
    ]
  },
  {
    keywords: ['contract', 'legal', 'compliance', 'law', 'nda', 'agreement'],
    services: [
      { title: 'AI Contract Lifecycle Mgmt', href: '/services/ai-contract-lifecycle-management', price: '$2,999/mo', icon: '📋', match: 95, description: 'AI clause analysis & obligation tracking' },
      { title: 'AI Legal Document Review', href: '/services/ai-legal-document-review', price: '$2,999/mo', icon: '⚖️', match: 92, description: '90% review time reduction' },
      { title: 'AI Compliance Monitoring', href: '/services/ai-compliance-monitoring', price: '$8,999/mo', icon: '⚖️', match: 88, description: 'SOC 2, HIPAA, GDPR automation' },
    ]
  },
  {
    keywords: ['marketing', 'seo', 'content', 'social', 'brand', 'campaign', 'advertising'],
    services: [
      { title: 'AI Demand Generation', href: '/services/ai-demand-generation', price: '$2,999/mo', icon: '📈', match: 95, description: '3x pipeline with AI campaigns' },
      { title: 'AI Social Media Management', href: '/services/ai-social-media-management', price: '$449/mo', icon: '📱', match: 92, description: '5x content output, 40% engagement' },
      { title: 'AI Brand Monitoring', href: '/services/ai-brand-monitoring', price: '$899/mo', icon: '👁️', match: 88, description: 'Real-time mention tracking' },
    ]
  },
  {
    keywords: ['partner', 'affiliate', 'reseller', 'referral', 'channel'],
    services: [
      { title: 'Partner & Affiliate Platform', href: '/services/partner-affiliate-management-platform', price: '$2,999/mo', icon: '🤝', match: 95, description: '10x sales channel reach' },
      { title: 'AI ABM Orchestration', href: '/services/ai-abm-orchestration', price: '$5,999/mo', icon: '🎯', match: 88, description: 'Account-based marketing at scale' },
    ]
  },
  {
    keywords: ['hr', 'hiring', 'recruit', 'talent', 'employee', 'workforce', 'people'],
    services: [
      { title: 'AI Recruitment Screening', href: '/services/ai-recruitment-screening', price: '$1,499/mo', icon: '👤', match: 95, description: '80% screening time reduction' },
      { title: 'AI Workforce Planning', href: '/services/ai-workforce-planning', price: '$4,499/mo', icon: '👥', match: 92, description: 'Predictive hiring & team optimization' },
    ]
  },
  {
    keywords: ['finance', 'money', 'budget', 'cost', 'pricing', 'invoice', 'billing', 'payment'],
    services: [
      { title: 'AI Financial Forecasting', href: '/services/ai-financial-forecasting', price: '$2,999/mo', icon: '💰', match: 95, description: '95% forecast accuracy' },
      { title: 'AI Pricing Optimization', href: '/services/ai-pricing-optimization-engine', price: '$2,999/mo', icon: '💲', match: 90, description: '15% revenue increase' },
      { title: 'Smart Invoicing Platform', href: '/services/micro-saas-invoicing-platform', price: '$299/mo', icon: '🧾', match: 88, description: '80% faster invoicing' },
    ]
  },
  {
    keywords: ['support', 'help', 'ticket', 'service desk', 'customer service'],
    services: [
      { title: 'AI Technical Support Triage', href: '/services/ai-technical-support-triage', price: '$1,499/mo', icon: '🔧', match: 95, description: '65% faster first response' },
      { title: 'AI Enterprise Chatbot', href: '/services/ai-chatbot-enterprise', price: '$1,499/mo', icon: '🤖', match: 92, description: '70% inquiry automation' },
      { title: 'AI Knowledge Base Generator', href: '/services/ai-knowledge-base-generator', price: '$899/mo', icon: '📚', match: 88, description: '70% ticket deflection' },
    ]
  },
  {
    keywords: ['healthcare', 'medical', 'patient', 'hospital', 'hipaa', 'health'],
    services: [
      { title: 'AI Patient Scheduling', href: '/services/ai-patient-scheduling', price: '$1,499/mo', icon: '🏥', match: 95, description: '30% fewer no-shows' },
      { title: 'AI-AR Surgical Navigation', href: '/services/ai-ar-surgical-navigation-platform', price: '$49,999/mo', icon: '🏥', match: 88, description: '30% reduction in surgical errors' },
    ]
  },
  {
    keywords: ['manufacturing', 'factory', 'production', 'quality', 'inspection', 'iot'],
    services: [
      { title: 'AI Quality Control Vision', href: '/services/ai-quality-control-vision', price: '$8,999/mo', icon: '🔬', match: 95, description: '99.5% defect detection accuracy' },
      { title: 'AI Predictive Maintenance', href: '/services/ai-predictive-maintenance', price: '$5,999/mo', icon: '⚙️', match: 92, description: '50% downtime reduction' },
    ]
  }
];

function findServices(query: string): ServiceMatch[] {
  const q = query.toLowerCase();
  let allMatches: ServiceMatch[] = [];
  
  for (const entry of serviceKnowledge) {
    for (const keyword of entry.keywords) {
      if (q.includes(keyword)) {
        allMatches = [...allMatches, ...entry.services];
        break;
      }
    }
  }
  
  // Deduplicate by title
  const seen = new Set<string>();
  const unique = allMatches.filter(s => {
    if (seen.has(s.title)) return false;
    seen.add(s.title);
    return true;
  });
  
  return unique.slice(0, 6);
}

export default function ServiceFinderChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: "👋 Hi! I'm Zion AI Assistant. Tell me what you need and I'll find the perfect service for you from our 1,168+ solutions!\n\nTry asking about: email, security, AI, cloud, sales, marketing, HR, finance, support, and more." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    setTimeout(() => {
      const matches = findServices(userMsg);
      
      let botContent: string;
      if (matches.length > 0) {
        botContent = `Great question! I found ${matches.length} services that match your needs. Here are my top recommendations:`;
      } else {
        botContent = "I'd love to help! Could you tell me more about what you're looking for? Try keywords like: email, security, AI, cloud, sales, marketing, HR, finance, support, healthcare, or manufacturing. You can also call us at +1 302 464 0950 for personalized assistance!";
      }
      
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: botContent,
        services: matches.length > 0 ? matches : undefined
      }]);
      setIsTyping(false);
    }, 800);
  };

  const quickQuestions = ['Email automation', 'Security', 'AI solutions', 'Cloud optimization', 'Sales tools'];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform"
        aria-label="Open AI Service Finder"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">🤖</div>
            <div>
              <h3 className="text-white font-bold">Zion AI Service Finder</h3>
              <p className="text-white/70 text-xs">1,168+ services • Instant recommendations</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'} rounded-2xl px-4 py-3`}>
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                  {msg.services && (
                    <div className="mt-3 space-y-2">
                      {msg.services.map((service, j) => (
                        <a key={j} href={service.href} className="block bg-slate-700/50 hover:bg-slate-700 rounded-xl p-3 transition-colors border border-slate-600/50">
                          <div className="flex items-start gap-2">
                            <span className="text-xl">{service.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-white truncate">{service.title}</h4>
                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">{service.match}%</span>
                              </div>
                              <p className="text-xs text-slate-400 mt-1">{service.description}</p>
                              <p className="text-xs text-blue-400 font-semibold mt-1">{service.price}</p>
                            </div>
                          </div>
                        </a>
                      ))}
                      <a href="/services" className="block text-center text-xs text-purple-400 hover:text-purple-300 mt-2 py-2">
                        View all 1,168+ services →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {quickQuestions.map((q, i) => (
                <button key={i} onClick={() => { setInput(q); setTimeout(() => { setInput(q); handleSend(); }, 100); }}
                  className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full hover:bg-slate-700 transition-colors border border-slate-700">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="What do you need help with?"
                className="flex-1 bg-slate-800 text-white px-4 py-2.5 rounded-xl border border-slate-700 focus:border-purple-500 focus:outline-none text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-purple-600 text-white px-4 py-2.5 rounded-xl hover:bg-purple-700 disabled:bg-slate-700 disabled:text-slate-500 transition-colors font-semibold text-sm"
              >
                Send
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              📞 Need human help? <a href="tel:+13024640950" className="text-purple-400">+1 302 464 0950</a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
