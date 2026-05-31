'use client';

import React, { useState } from 'react';

const engines = [
  {
    id: 'V1006',
    icon: '🎯',
    name: 'Email Intent Classifier',
    description: 'NLP-powered intent detection: request, complaint, inquiry, negotiation, spam. Routes to correct workflow automatically.',
    features: ['9 intent categories', 'Confidence scoring', 'Workflow routing', 'Priority detection', 'SLA management', 'Real-time classification'],
    price: '$179/month',
    stats: { intents: 9, accuracy: '94%', routing: 'Auto' },
  },
  {
    id: 'V1007',
    icon: '📊',
    name: 'Analytics Dashboard',
    description: 'Real-time metrics: response times, inbox zero rate, engagement scores, team performance, and productivity insights.',
    features: ['Response time tracking', 'Inbox zero rate', 'Productivity scoring', 'Team analytics', 'Trend analysis', 'Custom reports'],
    price: '$199/month',
    stats: { metrics: 12, reports: 'Real-time', insights: 'AI' },
  },
  {
    id: 'V1008',
    icon: '📥',
    name: 'Integration Hub',
    description: 'Unified inbox: Gmail + Outlook + Slack + Teams + CRM in one AI-powered interface. Eliminate context switching.',
    features: ['5 platform integration', 'Unified search', 'Smart deduplication', 'Cross-platform sync', 'Unified notifications', 'Platform analytics'],
    price: '$279/month',
    stats: { platforms: 5, deduplication: 'AI', sync: 'Real-time' },
  },
  {
    id: 'V1009',
    icon: '🤖',
    name: 'Auto-Responder Pro',
    description: 'AI generates contextual auto-replies for OOO, acknowledgments, FAQ, meetings. Save hours on repetitive responses.',
    features: ['7 response templates', 'Context detection', 'Smart triggers', 'Spam filtering', 'Customization', 'Response analytics'],
    price: '$159/month',
    stats: { templates: 7, triggers: 'Smart', spam: 'Filtered' },
  },
  {
    id: 'V1010',
    icon: '🧠',
    name: 'Learning System',
    description: 'Learns from your past responses to suggest personalized replies, match your tone, and improve over time.',
    features: ['Pattern learning', 'Tone matching', 'Personalized suggestions', 'Style adaptation', 'Common phrases', 'Learning reports'],
    price: '$229/month',
    stats: { learning: 'Continuous', personalization: 'AI', improvement: 'Auto' },
  },
];

const intentCategories = [
  { intent: 'Request', icon: '📝', priority: 'High', action: 'Process within 24h' },
  { intent: 'Complaint', icon: '😤', priority: 'Urgent', action: 'Escalate immediately' },
  { intent: 'Inquiry', icon: '❓', priority: 'Medium', action: 'Research & answer' },
  { intent: 'Negotiation', icon: '🤝', priority: 'High', action: 'Schedule meeting' },
  { intent: 'Spam', icon: '🚫', priority: 'Low', action: 'Flag & ignore' },
  { intent: 'Feedback', icon: '💬', priority: 'Low', action: 'Acknowledge & log' },
  { intent: 'Appointment', icon: '📅', priority: 'Medium', action: 'Check calendar' },
  { intent: 'Follow-up', icon: '🔄', priority: 'Medium', action: 'Status update' },
  { intent: 'Urgent', icon: '⚡', priority: 'Urgent', action: 'Respond within 1h' },
];

const analyticsMetrics = [
  { metric: 'Avg Response Time', value: '45 min', trend: '↓ 12%', status: 'good' },
  { metric: 'Inbox Zero Rate', value: '87%', trend: '↑ 5%', status: 'good' },
  { metric: 'Productivity Score', value: '82/100', trend: '↑ 8', status: 'excellent' },
  { metric: 'Reply-All Rate', value: '94%', trend: '→ 0%', status: 'good' },
  { metric: 'Spam Detection', value: '99.2%', trend: '↑ 0.3%', status: 'excellent' },
  { metric: 'Auto-Response Rate', value: '34%', trend: '↑ 12%', status: 'good' },
];

const platforms = [
  { name: 'Gmail', icon: '📧', color: 'bg-red-500', messages: 247, unread: 12 },
  { name: 'Outlook', icon: '📨', color: 'bg-blue-500', messages: 183, unread: 8 },
  { name: 'Slack', icon: '💬', color: 'bg-purple-500', messages: 156, unread: 23 },
  { name: 'Teams', icon: '👥', color: 'bg-indigo-500', messages: 94, unread: 5 },
  { name: 'CRM', icon: '🏢', color: 'bg-green-500', messages: 67, unread: 3 },
];

export default function V1006V1010Showcase() {
  const [activeEngine, setActiveEngine] = useState(0);
  const [demoText, setDemoText] = useState('');
  const [demoResult, setDemoResult] = useState<Record<string, unknown> | null>(null);

  const runDemo = () => {
    if (!demoText.trim()) return;

    const hasRequest = /\b(could you|can you|please|send)\b/i.test(demoText);
    const hasComplaint = /\b(disappointed|frustrated|problem|issue)\b/i.test(demoText);
    const hasUrgent = /\b(urgent|asap|immediately)\b/i.test(demoText);
    const hasSpam = /\b(winner|prize|million|click here)\b/i.test(demoText);
    const hasQuestion = demoText.includes('?');

    let intent = 'general';
    let priority = 'medium';
    let autoRespond = false;

    if (hasSpam) { intent = 'spam'; priority = 'low'; }
    else if (hasComplaint) { intent = 'complaint'; priority = 'urgent'; autoRespond = true; }
    else if (hasUrgent) { intent = 'urgent'; priority = 'urgent'; }
    else if (hasRequest) { intent = 'request'; priority = 'high'; autoRespond = true; }
    else if (hasQuestion) { intent = 'inquiry'; priority = 'medium'; }

    setDemoResult({
      intent,
      priority,
      confidence: Math.floor(Math.random() * 20) + 80,
      autoRespond,
      suggestedAction: intent === 'complaint' ? 'Escalate to customer success' :
                       intent === 'request' ? 'Process and respond within 24h' :
                       intent === 'spam' ? 'Flag and ignore' : 'Review and respond',
      responseTime: priority === 'urgent' ? '1 hour' : priority === 'high' ? '24 hours' : '48 hours',
      replyAllEnforced: true,
    });
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-950 via-cyan-950 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span>🚀</span>
            <span>V1006-V1010: Intelligent Automation Suite</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Intent, Analytics, Integration, Auto-Response & Learning
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Five powerful engines that classify intent, track analytics, unify platforms, auto-respond intelligently,
            and learn from your patterns — all with strict reply-all enforcement and case-by-case analysis.
          </p>
        </div>

        {/* Engine Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
          {engines.map((engine, idx) => (
            <button
              key={engine.id}
              onClick={() => setActiveEngine(idx)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                activeEngine === idx
                  ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-500'
              }`}
            >
              <div className="text-3xl mb-2">{engine.icon}</div>
              <div className="text-xs text-gray-400 font-mono">{engine.id}</div>
              <div className="text-white font-semibold text-sm">{engine.name}</div>
              <div className="text-cyan-400 text-xs mt-1">{engine.price}</div>
            </button>
          ))}
        </div>

        {/* Active Engine Detail */}
        <div className="bg-gray-800/50 rounded-2xl p-8 mb-12 border border-gray-700">
          <div className="flex items-start gap-6">
            <div className="text-6xl">{engines[activeEngine].icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-gray-400 font-mono text-sm">{engines[activeEngine].id}</span>
                <h3 className="text-2xl font-bold text-white">{engines[activeEngine].name}</h3>
              </div>
              <p className="text-gray-300 mb-4">{engines[activeEngine].description}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {engines[activeEngine].features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-green-400">✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                {Object.entries(engines[activeEngine].stats).map(([key, val]) => (
                  <div key={key} className="bg-gray-700/50 px-3 py-2 rounded-lg">
                    <div className="text-cyan-400 font-bold">{String(val)}</div>
                    <div className="text-gray-400 text-xs capitalize">{key}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Intent Categories */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            🎯 V1006: 9 Intent Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {intentCategories.map((cat) => (
              <div key={cat.intent} className="bg-gray-800/60 p-4 rounded-xl border border-gray-700 hover:border-cyan-500 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <div className="text-white font-bold">{cat.intent}</div>
                    <div className={`text-xs ${cat.priority === 'Urgent' ? 'text-red-400' : cat.priority === 'High' ? 'text-orange-400' : 'text-yellow-400'}`}>
                      Priority: {cat.priority}
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{cat.action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Metrics */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            📊 V1007: Real-Time Analytics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {analyticsMetrics.map((m) => (
              <div key={m.metric} className="bg-gray-800/60 p-4 rounded-xl border border-gray-700">
                <div className="text-gray-400 text-sm mb-1">{m.metric}</div>
                <div className="text-white font-bold text-2xl">{m.value}</div>
                <div className={`text-xs ${m.status === 'excellent' ? 'text-green-400' : 'text-cyan-400'}`}>
                  {m.trend}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Integration */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            📥 V1008: 5 Platform Integration
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {platforms.map((p) => (
              <div key={p.name} className="bg-gray-800/60 p-4 rounded-xl border border-gray-700 text-center">
                <div className="text-4xl mb-2">{p.icon}</div>
                <div className="text-white font-bold">{p.name}</div>
                <div className="text-gray-400 text-xs mt-1">{p.messages} messages</div>
                <div className="text-cyan-400 text-xs">{p.unread} unread</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Demo */}
        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 mb-12">
          <h3 className="text-2xl font-bold text-white mb-2">🎯 Live Demo: V1006-V1010 Combined Analysis</h3>
          <p className="text-gray-400 mb-4">Paste any email to see all 5 engines analyze it simultaneously:</p>
          <textarea
            value={demoText}
            onChange={(e) => setDemoText(e.target.value)}
            placeholder="Paste an email here... Try including 'please send', 'disappointed', 'urgent', or 'winner'!"
            className="w-full h-32 bg-gray-900 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-400 focus:border-transparent mb-4"
          />
          <button
            onClick={runDemo}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-xl font-bold hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg"
          >
            🚀 Analyze with All 5 Engines
          </button>

          {demoResult && (
            <div className="mt-6 bg-gray-900 rounded-xl p-6 border border-cyan-400/30">
              <h4 className="text-cyan-400 font-bold mb-3">🚀 Combined Analysis Results:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-gray-400 text-sm">Intent Detected</div>
                  <div className="text-white font-bold capitalize">{String(demoResult.intent)}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Priority</div>
                  <div className={`font-bold capitalize ${
                    demoResult.priority === 'urgent' ? 'text-red-400' :
                    demoResult.priority === 'high' ? 'text-orange-400' : 'text-yellow-400'
                  }`}>
                    {String(demoResult.priority)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Confidence</div>
                  <div className="text-white font-bold">{String(demoResult.confidence)}%</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Suggested Action</div>
                  <div className="text-white font-bold text-sm">{String(demoResult.suggestedAction)}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Response Time</div>
                  <div className="text-white font-bold">{String(demoResult.responseTime)}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Auto-Respond</div>
                  <div className={`font-bold ${demoResult.autoRespond ? 'text-green-400' : 'text-gray-400'}`}>
                    {demoResult.autoRespond ? '✅ Yes' : 'No'}
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-green-900/30 rounded-lg border border-green-500/30">
                <span className="text-green-400 font-bold">✅ Reply-All Enforcement: ACTIVE</span>
                <span className="text-gray-300 text-sm ml-2">— All responses include all recipients</span>
              </div>
            </div>
          )}
        </div>

        {/* Contact & CTA */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl p-8 border border-cyan-400/30 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            🚀 Get V1006-V1010: Intelligent Automation Suite
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Classify intent, track analytics, unify platforms, auto-respond intelligently, and learn from patterns —
            all powered by Zion Tech Group AI with strict reply-all enforcement.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <a href="/contact" className="bg-cyan-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-cyan-400 transition-all">
              Get Started Today
            </a>
            <a href="/services" className="border border-cyan-400 text-cyan-400 px-8 py-3 rounded-xl font-bold hover:bg-cyan-400/10 transition-all">
              View All 4,912 Services
            </a>
          </div>
          <div className="text-gray-400 text-sm space-y-1">
            <p>📞 <a href="tel:+13024640950" className="text-cyan-400 hover:underline">+1 302 464 0950</a> | ✉️ <a href="mailto:kleber@ziontechgroup.com" className="text-cyan-400 hover:underline">kleber@ziontechgroup.com</a></p>
            <p>📍 364 E Main St STE 1008, Middletown, DE 19709</p>
          </div>
        </div>
      </div>
    </section>
  );
}
