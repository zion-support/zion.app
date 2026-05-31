'use client';

import { useState } from 'react';

const engines = [
  {
    id: 'v851',
    name: 'V851: Digital Twin & Simulation',
    icon: '🏭',
    description: 'Real-time system modeling, predictive maintenance, scenario testing, and IoT integration',
    features: [
      '7 digital twin activity detection patterns',
      'Predictive maintenance with failure forecasting',
      '156+ simulation scenarios tested',
      '1,247 IoT sensors monitored',
      '27% efficiency improvement potential',
      'Anomaly detection with root cause analysis'
    ],
    price: '$8,500/mo',
    color: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'v852',
    name: 'V852: Blockchain & Smart Contract Intelligence',
    icon: '🔗',
    description: 'Smart contract auditing, gas optimization, security vulnerability detection, and DeFi analysis',
    features: [
      '7 blockchain activity detection patterns',
      'Smart contract vulnerability scanning (critical/high/medium/low)',
      '35% gas cost reduction optimization',
      'DeFi protocol risk assessment',
      'Multi-chain support (Ethereum, Polygon, BSC, Solana)',
      'NFT and cross-chain bridge monitoring'
    ],
    price: '$12,000/mo',
    color: 'from-amber-600 to-orange-700'
  },
  {
    id: 'v853',
    name: 'V853: Quantum Computing Readiness',
    icon: '⚛️',
    description: 'Algorithm identification, quantum advantage analysis, and post-quantum cryptography migration',
    features: [
      '6 quantum computing activity detection patterns',
      '1000x speedup potential for optimization problems',
      'Post-quantum cryptography migration planning',
      '127 systems at risk assessment',
      'Multi-platform hardware evaluation',
      'Hybrid classical-quantum workflow design'
    ],
    price: '$15,000/mo',
    color: 'from-purple-600 to-violet-700'
  },
  {
    id: 'v854',
    name: 'V854: AI Ethics & Bias Detection',
    icon: '⚖️',
    description: 'Fairness auditing, bias mitigation, transparency reporting, and regulatory compliance',
    features: [
      '6 AI ethics activity detection patterns',
      'Multi-dimension bias detection (gender, race, age, socioeconomic)',
      'EU AI Act compliance gap analysis',
      'NIST AI RMF maturity assessment',
      'Model transparency documentation',
      'Stakeholder impact assessment'
    ],
    price: '$9,000/mo',
    color: 'from-green-600 to-emerald-700'
  },
  {
    id: 'v855',
    name: 'V855: Autonomous Agent Orchestration',
    icon: '🤖',
    description: 'Multi-agent coordination, task delegation, conflict resolution, and human oversight',
    features: [
      '6 orchestration activity detection patterns',
      '47 active agents coordinated',
      '94% task completion rate',
      'Automated conflict resolution (83% auto-resolved)',
      'Human-in-the-loop approval workflows',
      'Performance monitoring and retraining'
    ],
    price: '$10,000/mo',
    color: 'from-cyan-600 to-teal-700'
  }
];

export default function V851V855Showcase() {
  const [activeEngine, setActiveEngine] = useState(0);
  const engine = engines[activeEngine];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-medium mb-4">
            V851-V855 • Emerging Technologies Suite
          </span>
          <h2 className="text-4xl font-bold text-white mb-4">
            Next-Generation AI Intelligence
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From digital twins and blockchain to quantum computing, AI ethics, and autonomous agent
            orchestration — our emerging technologies suite prepares your enterprise for the future
            with cutting-edge AI capabilities and strict reply-all enforcement.
          </p>
        </div>

        {/* Engine Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {engines.map((eng, idx) => (
            <button
              key={eng.id}
              onClick={() => setActiveEngine(idx)}
              className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                idx === activeEngine
                  ? `bg-gradient-to-r ${eng.color} text-white shadow-lg`
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{eng.icon}</span>
              {eng.name.split(':')[0]}
            </button>
          ))}
        </div>

        {/* Active Engine Detail */}
        <div className={`bg-gradient-to-r ${engine.color} rounded-2xl p-1 mb-8`}>
          <div className="bg-gray-900 rounded-xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  <span className="mr-2">{engine.icon}</span>
                  {engine.name}
                </h3>
                <p className="text-gray-300 mb-4">{engine.description}</p>
                <div className="inline-block px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">
                  {engine.price}
                </div>
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-300 text-sm font-medium">
                    ✅ Reply-All Enforcement: All multi-recipient communications include all parties
                  </p>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Key Capabilities</h4>
                <ul className="space-y-2">
                  {engine.features.map((feat, i) => (
                    <li key={i} className="flex items-start text-gray-300">
                      <span className="text-green-400 mr-2 mt-1">▸</span>
                      <span className="text-sm">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Suite Overview Cards */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          {engines.map((eng, idx) => (
            <div
              key={eng.id}
              onClick={() => setActiveEngine(idx)}
              className={`bg-gray-800/50 rounded-lg p-4 cursor-pointer transition-all hover:bg-gray-800 border ${
                idx === activeEngine ? 'border-indigo-500' : 'border-gray-700'
              }`}
            >
              <div className="text-2xl mb-2">{eng.icon}</div>
              <h4 className="text-white font-medium text-sm mb-1">{eng.name.split(':')[1]?.trim()}</h4>
              <p className="text-gray-400 text-xs">{eng.price}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-indigo-400">5</div>
            <div className="text-gray-400 text-sm">New AI Engines</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-400">855</div>
            <div className="text-gray-400 text-sm">Total Engines</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">4027</div>
            <div className="text-gray-400 text-sm">Services</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-amber-400">100%</div>
            <div className="text-gray-400 text-sm">Reply-All Enforced</div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl p-6 border border-indigo-500/30">
          <h3 className="text-xl font-bold text-white mb-2">Future-Proof Your Enterprise with AI</h3>
          <p className="text-gray-300 mb-4">
            Schedule a demo of our Emerging Technologies Suite today
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-300">
            <span>📞 +1 302 464 0950</span>
            <span>✉️ kleber@ziontechgroup.com</span>
            <span>📍 364 E Main St STE 1008, Middletown DE 19709</span>
          </div>
        </div>
      </div>
    </section>
  );
}
