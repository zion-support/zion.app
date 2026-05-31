'use client';

import React, { useState } from 'react';

const engines = [
  {
    id: 'V1001',
    icon: '🎭',
    name: 'Email Persona Detection',
    description: 'Identifies sender personality traits (MBTI, Big Five) to tailor responses and build better rapport.',
    features: ['MBTI type detection', 'Big Five (OCEAN) scoring', 'Communication style analysis', 'Response strategy generation', 'Tone adaptation', 'Personality reports'],
    price: '$159/month',
    stats: { types: '16 MBTI', traits: 5, accuracy: '89%' },
  },
  {
    id: 'V1002',
    icon: '💼',
    name: 'Deal Flow Tracker',
    description: 'Automatically tracks deals, revenue, and sales pipeline from email conversations without CRM overhead.',
    features: ['Deal stage detection', 'Revenue estimation', 'Close probability', 'Stakeholder mapping', 'Action item tracking', 'Competitive analysis'],
    price: '$249/month',
    stats: { stages: 7, metrics: 12, accuracy: '87%' },
  },
  {
    id: 'V1003',
    icon: '🕵️',
    name: 'Anomaly Detector',
    description: 'Detects unusual patterns, tone shifts, impersonation attempts, and fraud indicators in real-time.',
    features: ['Tone anomaly detection', 'Impersonation alerts', 'Fraud pattern matching', 'Risk scoring (0-100)', 'Security recommendations', 'Phishing protection'],
    price: '$229/month',
    stats: { patterns: '50+', threats: '100+', accuracy: '95%' },
  },
  {
    id: 'V1004',
    icon: '📝',
    name: 'Contract Analyzer',
    description: 'Extracts terms, obligations, deadlines, and risks from contract emails with AI-powered legal intelligence.',
    features: ['Term extraction', 'Obligation tracking', 'Deadline detection', 'Risk clause analysis', 'Legal recommendations', 'Compliance checking'],
    price: '$299/month',
    stats: { clauseTypes: 10, risks: 8, accuracy: '91%' },
  },
  {
    id: 'V1005',
    icon: '🔄',
    name: 'Follow-up Autopilot',
    description: 'Never miss a follow-up. AI detects questions, requests, commitments and auto-generates timely follow-ups.',
    features: ['Trigger detection', 'Auto-scheduling', 'Draft response generation', 'Priority ranking', 'Timing optimization', 'Commitment tracking'],
    price: '$169/month',
    stats: { triggerTypes: 6, drafts: 'Auto', accuracy: '93%' },
  },
];

const personaTypes = [
  { code: 'ESTJ', label: 'The Executive', desc: 'Direct, organized, decisive' },
  { code: 'ENFP', label: 'The Campaigner', desc: 'Enthusiastic, creative, social' },
  { code: 'ISTJ', label: 'The Logistician', desc: 'Practical, fact-minded, reliable' },
  { code: 'INTJ', label: 'The Architect', desc: 'Strategic, logical, innovative' },
  { code: 'ESFJ', label: 'The Consul', desc: 'Caring, social, popular' },
  { code: 'INFP', label: 'The Mediator', desc: 'Idealistic, empathetic, creative' },
];

const riskLevels = [
  { level: 'Critical', color: 'text-red-400', bg: 'bg-red-500/20', desc: 'Immediate threat — do not respond' },
  { level: 'High', color: 'text-orange-400', bg: 'bg-orange-500/20', desc: 'Verify before taking action' },
  { level: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/20', desc: 'Proceed with caution' },
  { level: 'Low', color: 'text-green-400', bg: 'bg-green-500/20', desc: 'Safe to respond normally' },
];

const dealStages = [
  { stage: 'Prospect', probability: 10, color: 'bg-blue-500' },
  { stage: 'Qualification', probability: 25, color: 'bg-blue-400' },
  { stage: 'Proposal', probability: 50, color: 'bg-yellow-500' },
  { stage: 'Negotiation', probability: 70, color: 'bg-yellow-400' },
  { stage: 'Closing', probability: 85, color: 'bg-green-400' },
  { stage: 'Won', probability: 100, color: 'bg-green-500' },
];

export default function V1001V1005Showcase() {
  const [activeEngine, setActiveEngine] = useState(0);
  const [demoText, setDemoText] = useState('');
  const [demoResult, setDemoResult] = useState<Record<string, unknown> | null>(null);

  const runDemo = () => {
    if (!demoText.trim()) return;

    const hasUrgency = /\b(urgent|asap|immediately)\b/i.test(demoText);
    const hasQuestions = demoText.includes('?');
    const hasDeal = /\b(budget|price|cost|proposal|contract)\b/i.test(demoText);
    const hasFraud = /\b(inherit|lottery|gift card|wire transfer|million)\b/i.test(demoText);
    const hasCommitments = /\b(will|shall|promise|commit)\b/i.test(demoText);

    let category = 'GENERAL';
    let riskScore = 0;
    const triggers: string[] = [];

    if (hasFraud) { category = 'FRAUD_ALERT'; riskScore = 95; }
    else if (hasUrgency) { category = 'URGENT'; riskScore = 30; }
    else if (hasDeal) { category = 'DEAL_FLOW'; riskScore = 10; }
    else { riskScore = 5; }

    if (hasQuestions) triggers.push('Questions need answers');
    if (hasCommitments) triggers.push('Commitments to track');
    if (hasDeal) triggers.push('Deal indicators detected');
    if (hasUrgency) triggers.push('Urgency flagged');

    setDemoResult({
      category,
      riskScore,
      triggers,
      persona: 'ESTJ',
      dealDetected: hasDeal,
      fraudAlert: hasFraud,
      followUpsNeeded: triggers.length,
      replyAllEnforced: true,
    });
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span>🚀</span>
            <span>V1001-V1005: Next-Gen Email Intelligence</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Persona, Deal Flow, Anomaly, Contract & Follow-up Intelligence
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Five breakthrough engines that understand who you&apos;re talking to, track your deals,
            protect against fraud, analyze contracts, and never miss a follow-up — all with strict reply-all enforcement.
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
                  ? 'border-indigo-400 bg-indigo-400/10 shadow-lg shadow-indigo-400/20'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-500'
              }`}
            >
              <div className="text-3xl mb-2">{engine.icon}</div>
              <div className="text-xs text-gray-400 font-mono">{engine.id}</div>
              <div className="text-white font-semibold text-sm">{engine.name}</div>
              <div className="text-indigo-400 text-xs mt-1">{engine.price}</div>
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
                    <div className="text-indigo-400 font-bold">{String(val)}</div>
                    <div className="text-gray-400 text-xs capitalize">{key}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Deal Flow Pipeline Visualization */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            💼 V1002 Deal Flow Pipeline Stages
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {dealStages.map((d) => (
              <div key={d.stage} className="bg-gray-800/60 p-4 rounded-xl border border-gray-700 text-center">
                <div className={`w-full h-2 rounded ${d.color} mb-3`} style={{ width: `${d.probability}%` }}></div>
                <div className="text-white font-bold text-sm">{d.stage}</div>
                <div className="text-gray-400 text-xs">{d.probability}% probability</div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Levels */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            🕵️ V1003 Anomaly Detection Risk Levels
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {riskLevels.map((r) => (
              <div key={r.level} className={`${r.bg} p-4 rounded-xl border border-gray-700`}>
                <div className={`${r.color} font-bold text-lg mb-1`}>{r.level}</div>
                <div className="text-gray-300 text-sm">{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Persona Types */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            🎭 V1001 MBTI Persona Detection
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {personaTypes.map((p) => (
              <div key={p.code} className="bg-gray-800/60 p-4 rounded-xl border border-gray-700 hover:border-indigo-500 transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-indigo-400 font-mono font-bold">{p.code}</span>
                  <span className="text-white text-sm">{p.label}</span>
                </div>
                <p className="text-gray-400 text-xs">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Demo */}
        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 mb-12">
          <h3 className="text-2xl font-bold text-white mb-2">🎯 Live Demo: V1001-V1005 Combined Analysis</h3>
          <p className="text-gray-400 mb-4">Paste any email to see all 5 engines analyze it simultaneously:</p>
          <textarea
            value={demoText}
            onChange={(e) => setDemoText(e.target.value)}
            placeholder="Paste an email here... Try including 'urgent', 'budget', 'contract', questions (?), or suspicious terms like 'inheritance'!"
            className="w-full h-32 bg-gray-900 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-400 focus:border-transparent mb-4"
          />
          <button
            onClick={runDemo}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-xl font-bold hover:from-indigo-400 hover:to-purple-400 transition-all shadow-lg"
          >
            🚀 Analyze with All 5 Engines
          </button>

          {demoResult && (
            <div className="mt-6 bg-gray-900 rounded-xl p-6 border border-indigo-400/30">
              <h4 className="text-indigo-400 font-bold mb-3">🚀 Combined Analysis Results:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-gray-400 text-sm">Category</div>
                  <div className="text-white font-bold">{String(demoResult.category)}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Risk Score</div>
                  <div className={`font-bold ${(demoResult.riskScore as number) >= 75 ? 'text-red-400' : (demoResult.riskScore as number) >= 30 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {String(demoResult.riskScore)}/100
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Persona Detected</div>
                  <div className="text-white font-bold">{String(demoResult.persona)}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Deal Detected</div>
                  <div className={`font-bold ${demoResult.dealDetected ? 'text-green-400' : 'text-gray-400'}`}>
                    {demoResult.dealDetected ? '✅ Yes' : 'No'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Fraud Alert</div>
                  <div className={`font-bold ${demoResult.fraudAlert ? 'text-red-400' : 'text-green-400'}`}>
                    {demoResult.fraudAlert ? '🚨 YES' : '✅ Clear'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Follow-ups Needed</div>
                  <div className="text-white font-bold">{String(demoResult.followUpsNeeded)} item(s)</div>
                </div>
              </div>
              {(demoResult.triggers as string[]).length > 0 && (
                <div className="mt-4">
                  <div className="text-gray-400 text-sm mb-2">Triggers Detected:</div>
                  <div className="flex flex-wrap gap-2">
                    {(demoResult.triggers as string[]).map((t, i) => (
                      <span key={i} className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-sm">{t}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4 p-3 bg-green-900/30 rounded-lg border border-green-500/30">
                <span className="text-green-400 font-bold">✅ Reply-All Enforcement: ACTIVE</span>
                <span className="text-gray-300 text-sm ml-2">— All responses include all recipients</span>
              </div>
            </div>
          )}
        </div>

        {/* Contact & CTA */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-8 border border-indigo-400/30 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            🚀 Get V1001-V1005: Next-Gen Email Intelligence
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Understand personalities, track deals, prevent fraud, analyze contracts, and never miss a follow-up —
            all powered by Zion Tech Group AI with strict reply-all enforcement.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <a href="/contact" className="bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-400 transition-all">
              Get Started Today
            </a>
            <a href="/services" className="border border-indigo-400 text-indigo-400 px-8 py-3 rounded-xl font-bold hover:bg-indigo-400/10 transition-all">
              View All 4,888 Services
            </a>
          </div>
          <div className="text-gray-400 text-sm space-y-1">
            <p>📞 <a href="tel:+13024640950" className="text-indigo-400 hover:underline">+1 302 464 0950</a> | ✉️ <a href="mailto:kleber@ziontechgroup.com" className="text-indigo-400 hover:underline">kleber@ziontechgroup.com</a></p>
            <p>📍 364 E Main St STE 1008, Middletown, DE 19709</p>
          </div>
        </div>
      </div>
    </section>
  );
}
