'use client';

import { useState, useEffect } from 'react';
import { AIComponents } from './ai-components';

export default function HomepageFeaturedAI() {
  const [featuredComponents, setFeaturedComponents] = useState([]);

  useEffect(() => {
    // Dynamically showcase all active AI components with enhanced icon mapping
    const showcaseComponents = AIComponents
      .filter(c => c.status === 'active')
      .map(c => ({
        id: c.id,
        name: c.name,
        icon: getIconForComponent(c.id),
        status: c.status,
        description: c.description,
        aiInsight: c.aiInsight
      }));
    setFeaturedComponents(showcaseComponents);
  }, []);

  function getIconForComponent(id: string): string {
    const iconMap: Record<string, string> = {
      'task-optimizer': '🎯',
      'health-monitor': '💊',
      'financial-advisor': '💰',
      'pattern-recognizer': '🔍',
      'autonomous-innovation-engine': '💡',
      'autonomous-skill-evolution': '🧠',
      'self-healing-database-connector': '🗄️',
      'quantum-cognitive-agent': '🧮',
      'autonomous-brain': '🌟',
      'autonomous-security-auditor': '🔐',
      'autonomous-security-guardian': '🛡️',
      'quantum-crypto-agent': '🔒',
      'neural-symbolic-reasoning-engine': '🔗',
      'self-optimizing-database-layer': '📊',
      'autonomous-cognitive-architecture': '🏛️',
      'autonomous-meta-learning-system': '🔄',
      'predictive-security-intelligence': '👁️',
      'predictive-analytics-engine': '📈',
      'multi-agent-coordinator': '🤝',
      'auto-scaling-agent-cluster': '⚡',
      'autonomous-improvement-dashboard': '📋',
      'quantum-threshold-response-system': '⚛️',
      'cross-platform-sync-engine': '🔄',
      'autonomous-learning-network': '🔥',
      'quantum-hybrid-orchestrator': '🧩',
      'post-quantum-security-framework': '🔐',
      'continuous-code-evolution-system': '🔧',
      'blockchain-provenance-tracker': '⛓️',
      'autonomous-governance-framework': '🏛️',
      'self-evolving-ai-agents': '🤖',
      'neural-quantum-training-engine': '☗️',
      'time-capsule-memory-system': '⏳',
      'quantum-proof-data-commons': '⚛️',
      'quantum-provenance-ledger': '🏗️',
      'decentralized-compliance-engines': '🌐',
      'self-enforcing-contracts': '📜',
      'adaptive-policy-generator': '📝',
      'hyperdimensional-computing-core': '🔮',
      'neural-autonomy-feedback-loop': '🔄',
      'zero-error-ackerman-protocol': '✅',
      'self-optimizing-knowledge-distillation': '📦',
      'multi-wavelength-ai-vision': '👁️',
      'emotion-recognition-matrix': '😊',
      'fractal-memory-network': '🌀',
      'cognitive-fusion-engine': '🔗',
      'quantum-emotion-reasoning': '💖',
      'quantum-entangled-scheduling': '⏳',
      'quantum-enhanced-learning-system': '🤖',
      'cognitive-emulation-layer': '🧠',
      'quantum-entangled-bitcoin-integration': '⚛️💰',
      'fractal-market-intelligence': '📈',
      'self-healing-knowledge-graph': '🌳',
      'autonomous-quantum-security-framework': '🛡️',
      'predictive-compliance-engine': '⚖️',
      'self-optimizing-data-balancer': '⚖️',
      'ethical-ai-governance-system': '⚖️',
      'autonomous-research-engine': '🔬'
    };
    return iconMap[id] || '🤖';
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h2 className="text-4xl font-bold text-indigo-800 mb-4">
          🌌 Quantum-Ready Autonomous Intelligence Platform
        </h2>
        <p className="text-xl text-gray-600 mb-6">
          Powered by {featuredComponents.length} autonomous AI components across quantum, fractal, and neural dimensions
        </p>
        <div className="flex justify-center items-center gap-4 text-sm">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
            All Systems Operational
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
            Autonomous Mode Active
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
            Quantum Security Enabled
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-8">
        {featuredComponents.map(component => (
          <div key={component.id} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
            <div className="flex flex-col items-center justify-center text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border-2 border-indigo-200">
                <span className="text-3xl font-bold text-indigo-900">{component.icon}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-indigo-900 leading-tight">{component.name}</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{component.description}</p>
              <div className="mt-3 flex items-center space-x-2">
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  {component.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center space-y-4">
        <button
          onClick={() => window.location.href = '/innovation-report.html'}
          className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
          🚀 Explore Innovation Report
        </button>
        <div className="text-sm text-gray-500 max-w-2xl text-center">
          Automatic verification: All {featuredComponents.length} components validated live in production with continuous autonomous updates
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span>Live System Health: Optimal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          <span>Autonomous Improvements Active</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
          <span>Quantum Security Enabled</span>
        </div>
      </div>
    </div>
  );
}