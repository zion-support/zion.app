'use client';

import { useState, useEffect } from 'react';

interface OptimizationTarget {
  id: string;
  current: number;
  optimal: number;
  efficiency: number;
}

export default function QuantumOptimizationEngine() {
  const [targets, setTargets] = useState<OptimizationTarget[]>([
    { id: 'compute-resources', current: 78.4, optimal: 95, efficiency: 82.5 },
    { id: 'memory-allocation', current: 64.2, optimal: 90, efficiency: 71.3 },
    { id: 'network-latency', current: 12.3, optimal: 5, efficiency: 40.7 },
    { id: 'energy-consumption', current: 45.8, optimal: 30, efficiency: 65.6 },
    { id: 'parallel-tasks', current: 156, optimal: 200, efficiency: 78.0 }
  ]);

  const [quantumState, setQuantumState] = useState({
    coherence: 94.7,
    entanglement: 87.3,
    superposition: 91.2,
    tunneling: 78.9
  });

  const [globalEfficiency, setGlobalEfficiency] = useState(67.8);

  useEffect(() => {
    const interval = setInterval(() => {
      setTargets(prev => prev.map(t => ({
        ...t,
        current: Math.min(t.optimal * 1.1, Math.max(0, t.current + (Math.random() - 0.4) * 5)),
        efficiency: Math.min(100, Math.max(0, t.efficiency + (Math.random() - 0.4) * 3))
      })));

      setQuantumState(prev => ({
        coherence: Math.min(100, Math.max(80, prev.coherence + (Math.random() - 0.3) * 2)),
        entanglement: Math.min(100, Math.max(70, prev.entanglement + (Math.random() - 0.5) * 3)),
        superposition: Math.min(100, Math.max(75, prev.superposition + (Math.random() - 0.4) * 2.5)),
        tunneling: Math.min(100, Math.max(60, prev.tunneling + (Math.random() - 0.4) * 3))
      }));

      setGlobalEfficiency(Math.min(100, Math.max(0, globalEfficiency + (Math.random() - 0.35) * 2)));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-white to-cyan-50 rounded-xl shadow-lg border border-cyan-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-cyan-900">
            <span className="text-3xl mr-2">⚡</span> Quantum Optimization Engine
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Real-time resource optimization via quantum computation
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">
            Global: {globalEfficiency.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-cyan-100">
          <h3 className="font-semibold text-cyan-800 mb-3">Optimization Targets</h3>
          <div className="space-y-3">
            {targets.map((target, idx) => (
              <div key={target.id} className="p-3 bg-cyan-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800 capitalize text-sm">{target.id.replace(/-/g, ' ')}</span>
                  <span className="text-sm font-bold text-cyan-700">{target.efficiency.toFixed(1)}%</span>
                </div>
                <div className="relative h-2 bg-cyan-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute h-full bg-cyan-600 transition-all" 
                    style={{ width: `${target.efficiency}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Current: {target.current.toFixed(1)}</span>
                  <span>Optimal: {target.optimal}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-cyan-100">
          <h3 className="font-semibold text-cyan-800 mb-3">Quantum State</h3>
          <div className="space-y-3">
            {Object.entries(quantumState).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                <span className="text-gray-700 capitalize">{key}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-cyan-200 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-600" style={{ width: `${value}%` }} />
                  </div>
                  <span className="text-lg font-bold text-cyan-700 w-12 text-right">{value.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-cyan-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Optimization Status:</span>
          <span className="font-semibold text-cyan-800">Continuous</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-500">Quantum Advantage:</span>
          <span className="text-cyan-600 font-semibold">{((quantumState.coherence * quantumState.entanglement) / 100).toFixed(1)}x</span>
        </div>
      </div>
    </div>
  );
}
