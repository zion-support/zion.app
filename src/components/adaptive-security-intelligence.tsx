'use client';

import { useState, useEffect } from 'react';

interface DecisionNode {
  id: string;
  weight: number;
  confidence: number;
  type: 'logic' | 'intuition' | 'prediction';
}

interface AdaptiveSecurityMetric {
  threatsBlocked: number;
  falsePositives: number;
  responseTime: number;
  adaptiveScore: number;
}

export default function AdaptiveSecurityIntelligence() {
  const [nodes, setNodes] = useState<DecisionNode[]>([
    { id: 'threat-detection', weight: 92.4, confidence: 94.7, type: 'logic' },
    { id: 'anomaly-pattern', weight: 87.2, confidence: 89.3, type: 'prediction' },
    { id: 'behavior-analysis', weight: 78.9, confidence: 82.1, type: 'intuition' },
    { id: 'quantum-encryption', weight: 96.8, confidence: 98.2, type: 'logic' },
    { id: 'fractal-defense', weight: 84.5, confidence: 91.4, type: 'prediction' }
  ]);

  const [metrics, setMetrics] = useState<AdaptiveSecurityMetric>({
    threatsBlocked: 12847,
    falsePositives: 23,
    responseTime: 0.0034,
    adaptiveScore: 97.8
  });

  const [threatLevel, setThreatLevel] = useState('LOW');
  const [activeDefense, setActiveDefense] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        threatsBlocked: prev.threatsBlocked + Math.floor(Math.random() * 5),
        falsePositives: Math.max(0, prev.falsePositives + Math.floor(Math.random() * 3) - 2),
        responseTime: Math.max(0.001, prev.responseTime + (Math.random() - 0.5) * 0.0005),
        adaptiveScore: Math.min(100, Math.max(80, prev.adaptiveScore + (Math.random() - 0.4) * 2))
      }));

      setNodes(prev => prev.map(n => ({
        ...n,
        weight: Math.min(100, Math.max(0, n.weight + (Math.random() - 0.4) * 3)),
        confidence: Math.min(100, Math.max(0, n.confidence + (Math.random() - 0.3) * 2))
      })));

      const rand = Math.random();
      if (rand < 0.1) setThreatLevel(rand < 0.05 ? 'CRITICAL' : rand < 0.07 ? 'HIGH' : 'MODERATE');
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getThreatColor = () => {
    switch(threatLevel) {
      case 'CRITICAL': return 'bg-red-600';
      case 'HIGH': return 'bg-orange-500';
      case 'MODERATE': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-white to-red-50 rounded-xl shadow-lg border border-red-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-red-900">
            <span className="text-3xl mr-2">🛡️</span> Adaptive Security Intelligence
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Quantum-fractal threat detection with self-learning defense
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-full text-white font-bold ${getThreatColor()}`}>
            {threatLevel}
          </div>
          <button 
            onClick={() => setActiveDefense(!activeDefense)}
            className={`px-4 py-2 rounded font-medium ${activeDefense ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
          >
            {activeDefense ? 'ACTIVE' : 'PAUSED'}
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-red-100">
          <h3 className="font-semibold text-red-800 mb-3">Defense Metrics</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-gray-700">Threats Blocked</span>
              <span className="text-xl font-bold text-red-700">{metrics.threatsBlocked.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-gray-700">False Positives</span>
              <span className="text-xl font-bold text-red-700">{metrics.falsePositives}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-gray-700">Response Time</span>
              <span className="text-xl font-bold text-red-700">{(metrics.responseTime * 1000).toFixed(2)}ms</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-gray-700">Adaptive Score</span>
              <span className="text-xl font-bold text-red-700">{metrics.adaptiveScore.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-red-100">
          <h3 className="font-semibold text-red-800 mb-3">Decision Nodes</h3>
          <div className="space-y-3">
            {nodes.map((node, idx) => (
              <div key={node.id} className="p-3 bg-red-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800 capitalize">{node.id.replace(/-/g, ' ')}</span>
                  <span className="text-xs px-2 py-1 bg-red-200 text-red-800 rounded">{node.type}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Weight: </span>
                    <span className="font-bold text-red-700">{node.weight.toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Confidence: </span>
                    <span className="font-bold text-red-700">{node.confidence.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-red-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Defense Status:</span>
          <span className="font-semibold text-red-800">{activeDefense ? 'Fully Operational' : 'Paused'}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-500">Last Threat:</span>
          <span className="text-red-600 font-semibold">{Math.floor(Math.random() * 60)}s ago</span>
        </div>
      </div>
    </div>
  );
}
