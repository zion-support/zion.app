'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SERVICE_KEYWORDS: Record<string, { title: string; url: string; desc: string }[]> = {
  ai: [
    { title: 'Advanced AI & Enterprise Intelligence', url: '/services/advanced-ai-enterprise-intelligence-hub', desc: 'Unified AI fabric with governance, RAG, and copilots.' },
    { title: 'AI Code Review & Security Scanner', url: '/services/ai-code-review-security-scanner', desc: 'Automated code review and security scanning.' },
    { title: 'AI Document Understanding', url: '/services/ai-document-understanding-platform', desc: 'OCR + NLP extraction from documents.' },
  ],
  cloud: [
    { title: 'Multi-Cloud Architecture', url: '/services/multi-cloud-architecture-migration', desc: 'AWS, Azure, GCP design and migration.' },
    { title: 'Kubernetes Platform Engineering', url: '/services/cloud-kubernetes-platform-engineer', desc: 'Managed K8s fleet operations.' },
  ],
  security: [
    { title: 'Enterprise Cybersecurity', url: '/services/enterprise-cybersecurity-operations-center', desc: '24/7 SOC, threat detection, compliance.' },
    { title: 'Zero Trust Network', url: '/services/it-zero-trust-network-implementation', desc: 'Never trust, always verify architecture.' },
  ],
  data: [
    { title: 'AI Analytics & BI Platform', url: '/services/ai-analytics-bi-platform', desc: 'Business intelligence dashboards and reporting.' },
    { title: 'Data Quality Engineering', url: '/services/data-data-quality-engineering', desc: 'Automated data observability and quality.' },
  ],
  automation: [
    { title: 'Citizen Developer Platform', url: '/services/automation-citizen-developer-platform', desc: 'No-code workflow builder for business teams.' },
    { title: 'IT Service Management', url: '/services/itsm-it-service-management-platform', desc: 'Complete ITSM platform with ITIL processes.' },
  ],
  it: [
    { title: 'Full IT Department Outsourcing', url: '/services/full-it-department-outsourcing', desc: 'Complete IT management for your business.' },
    { title: 'Disaster Recovery as a Service', url: '/services/it-disaster-recovery-as-a-service', desc: 'Zero-downtime failover and recovery.' },
  ],
};

const GREETINGS = [
  "Hi! I'm the Zion Tech Group AI Service Advisor. 👋",
  "Tell me about your business needs — I'll match you with the perfect services.",
  "You can ask things like: 'I need AI for healthcare', 'cloud migration help', 'cybersecurity audit', etc.",
];

function matchServices(query: string): { title: string; url: string; desc: string }[] {
  const q = query.toLowerCase();
  const scores: Record<string, number> = {};

  const keywordMap: Record<string, string[]> = {
    ai: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'chatbot', 'nlp', 'automation', 'predictive', 'deep learning', 'neural', 'gpt', 'llm', 'generative', 'computer vision', 'recommendation'],
    cloud: ['cloud', 'aws', 'azure', 'gcp', 'kubernetes', 'docker', 'container', 'serverless', 'scal', 'migration', 'hosting', 'infrastructure'],
    security: ['security', 'cyber', 'firewall', 'vulnerability', 'penetration', 'compliance', 'hipaa', 'gdpr', 'encryption', 'threat', 'protect', 'audit', 'zero trust', 'soc', 'siem'],
    data: ['data', 'analytics', 'bi', 'dashboard', 'visualization', 'etl', 'pipeline', 'warehouse', 'lake', 'reporting', 'insight', 'quality', 'observability', 'cdp'],
    automation: ['automation', 'workflow', 'bot', 'rpa', 'process', 'integration', 'zapier', 'no-code', 'low-code', 'citizen'],
    it: ['it ', 'server', 'network', 'infrastructure', 'backup', 'disaster recovery', 'hardware', 'help desk', 'support', 'managed service', 'outsourcing'],
  };

  for (const [category, keywords] of Object.entries(keywordMap)) {
    let score = 0;
    for (const kw of keywords) {
      if (q.includes(kw)) score += 2;
    }
    if (score > 0) scores[category] = score;
  }

  // Get top matching categories
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const results: { title: string; url: string; desc: string }[] = [];

  for (const [cat] of sorted.slice(0, 2)) {
    if (SERVICE_KEYWORDS[cat]) {
      results.push(...SERVICE_KEYWORDS[cat].slice(0, 2));
    }
  }

  // Default: show popular services
  if (results.length === 0) {
    results.push(
      ...SERVICE_KEYWORDS.ai.slice(0, 1),
      ...SERVICE_KEYWORDS.security.slice(0, 1),
      ...SERVICE_KEYWORDS.cloud.slice(0, 1),
    );
  }

  return results.slice(0, 4);
}

function formatResponse(query: string, services: { title: string; url: string; desc: string }[]): string {
  if (services.length === 0) {
    return "I'd love to help! Could you tell me more about what you're looking for? For example:\n\n• AI and machine learning\n• Cloud migration\n• Cybersecurity\n• Data analytics\n• Process automation\n\nOr call us directly: +1 302 464 0950";
  }

  let response = `Great question! Based on your needs, here are the services I recommend:\n\n`;
  for (const s of services) {
    response += `🔹 **${s.title}**\n${s.desc}\n\n`;
  }
  response += `Would you like:\n• 📞 A free consultation call?\n• 📧 A detailed proposal via email?\n• 💬 To learn more about any of these?\n\nYou can also explore all services at ziontechgroup.com/services`;
  return response;
}

export default function AIServiceAdvisor() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: GREETINGS.join('\n\n'), timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const services = matchServices(userMsg.content);
      const response = formatResponse(userMsg.content, services);
      const assistantMsg: Message = { role: 'assistant', content: response, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full px-6 py-3 shadow-2xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-2 font-semibold"
        style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}
      >
        <span className="text-xl">🤖</span>
        <span className="hidden sm:inline">AI Service Advisor</span>
        <span className="sm:hidden">Ask AI</span>
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
      style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <div>
            <div className="font-semibold text-sm">AI Service Advisor</div>
            <div className="text-xs opacity-80">Online • Zion Tech Group</div>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white text-xl leading-none">✕</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-purple-600 text-white rounded-br-md'
                : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 shadow-sm border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 text-sm">
              <span className="inline-flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 p-3 bg-white flex-shrink-0">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your business needs..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-purple-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
        <div className="text-center mt-1.5">
          <span className="text-[10px] text-gray-400">Powered by Zion Tech Group AI • <a href="mailto:kleber@ziontechgroup.com" className="text-purple-500 hover:underline">Contact Human</a></span>
        </div>
      </div>
    </div>
  );
}
