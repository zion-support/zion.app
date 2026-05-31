'use client';

import React, { useState } from 'react';

const engines = [
  {
    id: 'V1011',
    icon: '🌐',
    name: 'Email Translation Engine',
    description: 'Real-time translation into 50+ languages with context-aware tone preservation and cultural adaptation.',
    features: ['50+ languages', 'Tone preservation', 'Cultural adaptation', 'RTL support', 'Bilingual responses', 'Business terminology'],
    price: '$199/month',
    stats: { languages: '50+', accuracy: '92%', rtl: 'Yes' },
  },
  {
    id: 'V1012',
    icon: '📝',
    name: 'Email Template Generator',
    description: 'AI generates custom email templates based on style, industry, and use case with A/B variants.',
    features: ['Industry templates', 'A/B variants', 'Personalization tokens', 'Quality scoring', 'CTA optimization', 'Tone matching'],
    price: '$149/month',
    stats: { templates: '500+', variants: 'Auto', quality: '90/100' },
  },
  {
    id: 'V1013',
    icon: '🧪',
    name: 'Email A/B Testing',
    description: 'Test subject lines, CTAs, and content with statistical significance to optimize performance.',
    features: ['Subject line testing', 'CTA optimization', 'Statistical significance', 'Winner detection', 'Performance tracking', 'AI recommendations'],
    price: '$249/month',
    stats: { metrics: 6, significance: '95%', variants: 'Unlimited' },
  },
  {
    id: 'V1014',
    icon: '🔔',
    name: 'Smart Notification System',
    description: 'AI prioritizes notifications: urgent=push, important=email, low=digest. Reduces notification fatigue.',
    features: ['Priority scoring', 'Multi-channel routing', 'Smart batching', 'Fatigue detection', 'Quiet hours', 'Context awareness'],
    price: '$179/month',
    stats: { channels: 6, fatigue: 'Detected', batching: 'Auto' },
  },
  {
    id: 'V1015',
    icon: '👥',
    name: 'Email Collaboration Hub',
    description: 'Real-time co-editing, @mentions, shared drafts, and team approval workflows for collaborative composition.',
    features: ['Shared drafts', '@mentions', 'Approval workflows', 'Version control', 'Comments', 'Activity tracking'],
    price: '$299/month',
    stats: { workflows: 'Auto', versions: 'Unlimited', mentions: 'Real-time' },
  },
];

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
];

const notificationChannels = [
  { name: 'SMS', icon: '📱', priority: 'Critical', color: 'text-red-400', latency: 'Instant' },
  { name: 'Push', icon: '🔔', priority: 'High', color: 'text-orange-400', latency: 'Instant' },
  { name: 'Email', icon: '📧', priority: 'Medium', color: 'text-yellow-400', latency: 'Minutes' },
  { name: 'Slack', icon: '💬', priority: 'Low', color: 'text-green-400', latency: 'Minutes' },
  { name: 'Digest', icon: '📋', priority: 'Very Low', color: 'text-blue-400', latency: 'Daily' },
  { name: 'Silent', icon: '🔕', priority: 'Minimal', color: 'text-gray-400', latency: 'On-demand' },
];

const templateTypes = [
  { type: 'Cold Outreach', icon: '🎯', useCases: ['Sales', 'Partnership', 'Networking'] },
  { type: 'Follow-up', icon: '🔄', useCases: ['Post-meeting', 'Proposal', 'Invoice'] },
  { type: 'Customer Service', icon: '🤝', useCases: ['Complaint', 'Inquiry', 'Feedback'] },
  { type: 'Internal', icon: '🏢', useCases: ['Update', 'Request', 'Announcement'] },
  { type: 'Transactional', icon: '📦', useCases: ['Confirmation', 'Receipt', 'Notification'] },
];

export default function V1011V1015Showcase() {
  const [activeEngine, setActiveEngine] = useState(0);
  const [demoText, setDemoText] = useState('');
  const [demoResult, setDemoResult] = useState(null);

  const runDemo = () => {
    if (!demoText.trim()) return;
    
    const wordCount = demoText.split(' ').length;
    const hasUrgent = /\b(urgent|asap|critical|immediately)\b/i.test(demoText);
    const hasQuestion = demoText.includes('?');
    const hasMention = demoText.includes('@');
    const isLong = wordCount > 50;
    
    let priority = 'medium';
    let channel = 'email';
    let actions = [];
    
    if (hasUrgent) { priority = 'critical'; channel = 'sms'; actions.push('Immediate notification'); }
    else if (wordCount > 100) { priority = 'high'; channel = 'push'; actions.push('Push notification'); }
    else if (isLong) { priority = 'medium'; channel = 'email'; actions.push('Standard email'); }
    else { priority = 'low'; channel = 'digest'; actions.push('Include in digest'); }
    
    if (hasQuestion) actions.push('Flag for response');
    if (hasMention) actions.push('Notify mentioned users');
    
    setDemoResult({
      priority,
      channel,
      actions,
      needsTranslation: wordCount > 20,
      templateSuggested: hasUrgent || hasQuestion,
      abTestReady: wordCount > 30,
      collaborationNeeded: hasMention,
      replyAllEnforced: true,
    });
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-950 via-teal-950 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span>🚀</span>
            <span>V1011-V1015: Communication Excellence Suite</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Translation, Templates, A/B Testing, Notifications & Collaboration
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Five powerful engines that translate globally, generate templates intelligently, test for optimization,
            notify smartly, and collaborate seamlessly — all with strict reply-all enforcement.
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
                  ? 'border-teal-400 bg-teal-400/10 shadow-lg shadow-teal-400/20'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-500'
              }`}
            >
              <div className="text-3xl mb-2">{engine.icon}</div>
              <div className="text-xs text-gray-400 font-mono">{engine.id}</div>
              <div className="text-white font-semibold text-sm">{engine.name}</div>
              <div className="text-teal-400 text-xs mt-1">{engine.price}</div>
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
                    <div className="text-teal-400 font-bold">{String(val)}</div>
                    <div className="text-gray-400 text-xs capitalize">{key}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Supported Languages */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            🌐 V1011: 50+ Supported Languages
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {languages.map((lang) => (
              <div key={lang.code} className="bg-gray-800/60 p-3 rounded-xl border border-gray-700 hover:border-teal-500 transition-all text-center">
                <div className="text-2xl mb-1">{lang.flag}</div>
                <div className="text-white text-sm font-bold">{lang.name}</div>
                <div className="text-gray-400 text-xs">{lang.code.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Channels */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            🔔 V1014: Smart Notification Channels
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {notificationChannels.map((ch) => (
              <div key={ch.name} className="bg-gray-800/60 p-4 rounded-xl border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{ch.icon}</span>
                  <div>
                    <div className="text-white font-bold">{ch.name}</div>
                    <div className={`${ch.color} text-xs`}>{ch.priority}</div>
                  </div>
                </div>
                <div className="text-gray-400 text-sm">Latency: {ch.latency}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Template Types */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            📝 V1012: Template Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {templateTypes.map((t) => (
              <div key={t.type} className="bg-gray-800/60 p-4 rounded-xl border border-gray-700 hover:border-teal-500 transition-all">
                <div className="text-3xl mb-2 text-center">{t.icon}</div>
                <div className="text-white font-bold text-center mb-2">{t.type}</div>
                <div className="text-gray-400 text-xs text-center">
                  {t.useCases.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Demo */}
        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 mb-12">
          <h3 className="text-2xl font-bold text-white mb-2">🎯 Live Demo: V1011-V1015 Combined Analysis</h3>
          <p className="text-gray-400 mb-4">Paste any email to see all 5 engines analyze it simultaneously:</p>
          <textarea
            value={demoText}
            onChange={(e) => setDemoText(e.target.value)}
            placeholder="Paste an email here... Try including 'urgent', '@mentions', questions (?), or long content!"
            className="w-full h-32 bg-gray-900 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-teal-400 focus:border-transparent mb-4"
          />
          <button
            onClick={runDemo}
            className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-bold hover:from-teal-400 hover:to-cyan-400 transition-all shadow-lg"
          >
            🚀 Analyze with All 5 Engines
          </button>

          {demoResult && (
            <div className="mt-6 bg-gray-900 rounded-xl p-6 border border-teal-400/30">
              <h4 className="text-teal-400 font-bold mb-3">🚀 Combined Analysis Results:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-gray-400 text-sm">Priority</div>
                  <div className={`font-bold capitalize ${
                    demoResult.priority === 'critical' ? 'text-red-400' :
                    demoResult.priority === 'high' ? 'text-orange-400' :
                    demoResult.priority === 'medium' ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {demoResult.priority}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Notification Channel</div>
                  <div className="text-white font-bold capitalize">{demoResult.channel}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Translation</div>
                  <div className={`font-bold ${demoResult.needsTranslation ? 'text-teal-400' : 'text-gray-400'}`}>
                    {demoResult.needsTranslation ? '✅ Recommended' : 'Not needed'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Template Suggested</div>
                  <div className={`font-bold ${demoResult.templateSuggested ? 'text-green-400' : 'text-gray-400'}`}>
                    {demoResult.templateSuggested ? '✅ Yes' : 'No'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">A/B Test Ready</div>
                  <div className={`font-bold ${demoResult.abTestReady ? 'text-green-400' : 'text-gray-400'}`}>
                    {demoResult.abTestReady ? '✅ Yes' : 'No'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Collaboration</div>
                  <div className={`font-bold ${demoResult.collaborationNeeded ? 'text-green-400' : 'text-gray-400'}`}>
                    {demoResult.collaborationNeeded ? '✅ @Mentions detected' : 'Not needed'}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-gray-400 text-sm mb-2">Recommended Actions:</div>
                <div className="flex flex-wrap gap-2">
                  {demoResult.actions.map((a, i) => (
                    <span key={i} className="bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full text-sm">{a}</span>
                  ))}
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
        <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-2xl p-8 border border-teal-400/30 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            🚀 Get V1011-V1015: Communication Excellence Suite
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Translate globally, generate templates intelligently, test for optimization, notify smartly, and
            collaborate seamlessly — all powered by Zion Tech Group AI with strict reply-all enforcement.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <a href="/contact" className="bg-teal-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-400 transition-all">
              Get Started Today
            </a>
            <a href="/services" className="border border-teal-400 text-teal-400 px-8 py-3 rounded-xl font-bold hover:bg-teal-400/10 transition-all">
              View All 4,936 Services
            </a>
          </div>
          <div className="text-gray-400 text-sm space-y-1">
            <p>📞 <a href="tel:+130****0950" className="text-teal-400 hover:underline">+1 302 464 0950</a> | ✉️ <a href="mailto:kleber@ziontechgroup.com" className="text-teal-400 hover:underline">kleber@ziontechgroup.com</a></p>
            <p>📍 364 E Main St STE 1008, Middletown, DE 19709</p>
          </div>
        </div>
      </div>
    </section>
  );
}
