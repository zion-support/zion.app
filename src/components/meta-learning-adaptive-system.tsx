'use client';

import { useState, useEffect } from 'react';

interface LearningPattern {
  id: string;
  success: number;
  iterations: number;
  adaptation: number;
}

interface MetaLearningMetric {
  metaAccuracy: number;
  crossDomain: number;
  convergenceRate: number;
  generalizationScore: number;
}

export default function MetaLearningAdaptiveSystem() {
  const [patterns, setPatterns] = useState<LearningPattern[]>([
    { id: 'pattern-recognition', success: 94.2, iterations: 2457, adaptation: 0.892 },
    { id: 'causal-inference', success: 87.8, iterations: 1823, adaptation: 0.756 },
    { id: 'hypothesis-generation', success: 79.4, iterations: 945, adaptation: 0.623 },
    { id: 'abstraction-learning', success: 91.3, iterations: 1567, adaptation: 0.834 }
  ]);

  const [metrics, setMetrics] = useState<MetaLearningMetric>({
    metaAccuracy: 89.7,
    crossDomain: 82.4,
    convergenceRate: 94.1,
    generalizationScore: 87.6
  });

  const [active, setActive] = useState(true);
  const [trainingCycles, setTrainingCycles] = useState(12847);

  useEffect(() => {
    const interval = setInterval(() => {
      setPatterns(prev => prev.map(p => ({
        ...p,
        success: Math.min(100, Math.max(50, p.success + (Math.random() - 0.4) * 3)),
        iterations: p.iterations + Math.floor(Math.random() * 10),
        adaptation: Math.min(1, Math.max(0, p.adaptation + (Math.random() - 0.4) * 0.05))
      })));

      setMetrics(prev => ({
        metaAccuracy: Math.min(100, Math.max(70, prev.metaAccuracy + (Math.random() - 0.35) * 2)),
        crossDomain: Math.min(100, Math.max(60, prev.crossDomain + (Math.random() - 0.45) * 2.5)),
        convergenceRate: Math.min(100, Math.max(80, prev.convergenceRate + (Math.random() - 0.2) * 1.5)),
        generalizationScore: Math.min(100, Math.max(65, prev.generalizationScore + (Math.random() - 0.4) * 2))
      }));

      setTrainingCycles(prev => prev + Math.floor(Math.random() * 50));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-white to-amber-50 rounded-xl shadow-lg border border-amber-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-amber-900">
            <span className="text-3xl mr-2">🧩</span> Meta-Learning Adaptive System
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            AI that learns how to learn across domains
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
            {trainingCycles.toLocaleString()} Cycles
          </span>
          <button 
            onClick={() => setActive(!active)}
            className={`px-4 py-2 rounded font-medium ${active ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
          >
            {active ? 'TRAINING' : 'PAUSED'}
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-amber-100">
          <h3 className="font-semibold text-amber-800 mb-3">Learning Patterns</h3>
          <div className="space-y-3">
            {patterns.map((pattern, idx) => (
              <div key={pattern.id} className="p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800 capitalize text-sm">{pattern.id.replace(/-/g, ' ')}</span>
                  <span className="text-lg font-bold text-amber-700">{pattern.success.toFixed(1)}%</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <span>Iterations: {pattern.iterations}</span>
                  <span>Adaptation: {(pattern.adaptation * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-amber-100">
          <h3 className="font-semibold text-amber-800 mb-3">Meta-Learning Metrics</h3>
          <div className="space-y-3">
            {Object.entries(metrics).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <span className="text-gray-700 capitalize text-sm">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-amber-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-600" style={{ width: `${value}%` }} />
                  </div>
                  <span className="text-lg font-bold text-amber-700 w-12 text-right">{value.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-amber-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">System Status:</span>
          <span className="font-semibold text-amber-800">{active ? 'Learning & Adapting' : 'Paused'}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-500">Cross-Domain Score:</span>
          <span className="text-amber-600 font-semibold">{metrics.crossDomain.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}
