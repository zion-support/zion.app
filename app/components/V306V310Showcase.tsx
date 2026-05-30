'use client';

import React, { useState } from 'react';

const engines = [
  {
    version: 'V306',
    name: 'Predictive Prioritizer',
    icon: '🔮',
    description: 'ML model predicts which emails will become urgent based on sender behavior, thread velocity, and business context. Prevents missed deadlines with proactive escalation.',
    features: ['ML Urgency Prediction', 'Thread Velocity Analysis', 'Proactive Escalation', 'Deadline Detection', 'Sender Authority Weighting'],
    metrics: { accuracy: '92%', prediction: '4h ahead', deadlines_prevented: '95%' }
  },
  {
    version: 'V307',
    name: 'Goal Alignment Engine',
    icon: '🎯',
    description: 'Maps every email to OKR/KPI goals, tracks time spent per goal, and suggests delegation for off-goal emails to maximize strategic focus.',
    features: ['OKR/KPI Mapping', 'Time-per-Goal Tracking', 'Delegation Suggestions', 'Strategic Focus Scoring', 'Weekly Reports'],
    metrics: { alignment: '80%', time_saved: '50%', focus: 'Strategic' }
  },
  {
    version: 'V308',
    name: 'Conversation Summarizer Pro',
    icon: '🔄',
    description: 'Generates executive summaries of long email threads with decision points, action items, timeline visualization, and thread health assessment.',
    features: ['Executive Summaries', 'Decision Extraction', 'Action Item Tracking', 'Timeline Visualization', 'Thread Health Score'],
    metrics: { time_saved: '30min/thread', decisions: 'Auto-extracted', health: 'Scored' }
  },
  {
    version: 'V309',
    name: 'Cultural Intelligence',
    icon: '🌍',
    description: 'Detects cultural context of sender/recipient and adjusts tone, formality, greetings, and scheduling for 10+ cultures worldwide.',
    features: ['10+ Culture Profiles', 'Tone Adaptation', 'Formality Matching', 'Scheduling Intelligence', 'Sensitivity Alerts'],
    metrics: { cultures: '10+', sensitivity: 'Real-time', adaptation: 'Automatic' }
  },
  {
    version: 'V310',
    name: 'Revenue Attribution',
    icon: '📈',
    description: 'Tracks how email conversations contribute to revenue, maps touchpoints to deals, calculates email ROI, and predicts conversion probability.',
    features: ['Deal Stage Detection', 'Revenue Signals', 'Email ROI Calculator', 'Conversion Prediction', 'Team Attribution'],
    metrics: { roi: 'Calculated', prediction: 'ML-powered', attribution: 'Per-team' }
  }
];

export default function V306V310Showcase() {
  const [activeEngine, setActiveEngine] = useState(0);

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-emerald-900 via-slate-900 to-blue-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            🔮 Email Intelligence V41 — Engines V306-V310
          </h2>
          <p className="text-xl text-emerald-200 max-w-3xl mx-auto">
            Predictive prioritization, goal alignment, conversation summarization, cultural intelligence, 
            and revenue attribution. <strong>107 engines. 1,506 services. Zero manual email management.</strong>
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 bg-emerald-600/30 rounded-full text-emerald-200 text-sm">107 Total Engines</span>
            <span className="px-4 py-2 bg-blue-600/30 rounded-full text-blue-200 text-sm">1,506 Services</span>
            <span className="px-4 py-2 bg-purple-600/30 rounded-full text-purple-200 text-sm">Reply-All Enforced</span>
            <span className="px-4 py-2 bg-orange-600/30 rounded-full text-orange-200 text-sm">Case-by-Case Analysis</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {engines.map((engine, idx) => (
            <button
              key={engine.version}
              onClick={() => setActiveEngine(idx)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeEngine === idx
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              {engine.icon} {engine.version}
            </button>
          ))}
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{engines[activeEngine].icon}</span>
                <div>
                  <h3 className="text-2xl font-bold text-white">{engines[activeEngine].name}</h3>
                  <span className="text-emerald-400 text-sm">{engines[activeEngine].version}</span>
                </div>
              </div>
              <p className="text-slate-300 mb-6">{engines[activeEngine].description}</p>
              
              <h4 className="text-white font-semibold mb-3">Key Features:</h4>
              <ul className="space-y-2">
                {engines[activeEngine].features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-slate-300">
                    <span className="text-emerald-400">✓</span> {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Performance Metrics:</h4>
              <div className="space-y-4">
                {Object.entries(engines[activeEngine].metrics).map(([key, value]) => (
                  <div key={key} className="bg-slate-700/50 rounded-lg p-4">
                    <div className="text-slate-400 text-sm capitalize">{key.replace(/_/g, ' ')}</div>
                    <div className="text-2xl font-bold text-emerald-400">{value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-900/30 rounded-lg border border-green-700/50">
                <div className="flex items-center gap-2 text-green-400 font-semibold mb-2">
                  <span>✅</span> Reply-All Enforced
                </div>
                <p className="text-slate-300 text-sm">
                  All responses automatically include all original recipients (To + CC) to ensure 
                  transparent communication and proper case-by-case handling.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center bg-gradient-to-r from-emerald-600/20 to-blue-600/20 rounded-2xl p-8 border border-emerald-500/30">
          <h3 className="text-2xl font-bold text-white mb-4">Transform Your Email Intelligence Today</h3>
          <p className="text-slate-300 mb-6">Contact Zion Tech Group for a personalized demo of our V306-V310 engines.</p>
          <div className="flex flex-wrap justify-center gap-6 text-slate-300">
            <a href="tel:+130****0950" className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
              📱 +1 302 464 0950
            </a>
            <a href="mailto:kleber@ziontechgroup.com" className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
              ✉️ kleber@ziontechgroup.com
            </a>
            <span className="flex items-center gap-2">
              📍 364 E Main St STE 1008, Middletown DE 19709
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
