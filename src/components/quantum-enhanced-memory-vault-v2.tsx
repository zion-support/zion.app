'use client';

import { useState, useEffect } from 'react';

interface MemoryVaultStats {
  totalMemories: number;
  compressionRatio: number;
  accessSpeed: number; // ms
  quantumCoherence: number; // %
  stability: string;
}

export default function QuantumEnhancedMemoryVaultV2() {
  const [stats, setStats] = useState<MemoryVaultStats>({
    totalMemories: 2847392,
    compressionRatio: 99.8,
    accessSpeed: 0.3,
    quantumCoherence: 94.2,
    stability: 'optimal'
  });

  const [memoryTypes, setMemoryTypes] = useState<Array<{
    name: string;
    count: number;
    growth: string;
  }>>([
    { name: 'Episodic', count: 892410, growth: '+12.4%' },
    { name: 'Semantic', count: 756320, growth: '+8.7%' },
    { name: 'Procedural', count: 423180, growth: '+15.2%' },
    { name: 'Working', count: 318940, growth: '+5.1%' },
    { name: 'Quantum Entangled', count: 256542, growth: '+23.8%' }
  ]);

  useEffect(() => {
    // Simulate real-time memory vault metrics
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalMemories: prev.totalMemories + Math.floor(Math.random() * 150) + 50,
        compressionRatio: Math.min(99.9, prev.compressionRatio + (Math.random() - 0.5) * 0.05),
        accessSpeed: Math.max(0.1, prev.accessSpeed + (Math.random() - 0.5) * 0.1),
        quantumCoherence: Math.max(80, Math.min(99, prev.quantumCoherence + (Math.random() - 0.5) * 2)),
        stability: prev.quantumCoherence > 90 ? 'optimal' : prev.quantumCoherence > 80 ? 'stable' : 'degrading'
      }));
      
      setMemoryTypes(prev => prev.map(type => ({
        ...type,
        count: type.count + Math.floor(Math.random() * (type.name === 'Quantum Entangled' ? 50 : 30)) + 10,
        growth: `+${(Math.random() * 5).toFixed(1)}%`
      })));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const getGrowthColor = (growth: string) => {
    const value = parseFloat(growth.replace('+', ''));
    return value > 15 ? 'text-green-600' : value > 8 ? 'text-emerald-500' : 'text-yellow-500';
  };

  return (
    <div className="p-6 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg border border-blue-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">
            <span className="text-3xl mr-2">🧠</span> Quantum-Enhanced Memory Vault v2
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Ultra-dense fractal storage with quantum coherence preservation
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Optimize Storage
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-blue-100">
          <h3 className="font-semibold text-blue-800 mb-3">Vault Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">Total Memories</div>
                <div className="text-xl font-bold text-blue-700">{stats.totalMemories.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-800">💾</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">Compression Ratio</div>
                <div className="text-xl font-bold text-blue-700">{stats.compressionRatio}%</div>
              </div>
              <div className="text-right">
                <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-800">📦</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">Access Speed</div>
                <div className="text-xl font-bold text-blue-700">{stats.accessSpeed}ms</div>
              </div>
              <div className="text-right">
                <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-800">⚡</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">Quantum Coherence</div>
                <div className="text-xl font-bold text-blue-700">{stats.quantumCoherence}%</div>
              </div>
              <div className="text-right">
                <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-800">🔬</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">Stability</div>
                <div className={`text-lg font-medium ${stats.stability === 'optimal' ? 'text-green-600' : stats.stability === 'stable' ? 'text-yellow-500' : 'text-red-500'}`}>
                  {stats.stability}
                </div>
              </div>
              <div className="text-right">
                <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-800">🛡️</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-blue-100">
          <h3 className="font-semibold text-blue-800 mb-3">Memory Distribution</h3>
          <div className="space-y-3">
            {memoryTypes.map((type, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-medium text-gray-800">{type.name}</span>
                </div>
                <div className="text-right text-sm">
                  <div className="text-gray-900">{type.count.toLocaleString()}</div>
                  <div className={getGrowthColor(type.growth)} className="font-medium">{type.growth}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-blue-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Storage Efficiency:</span>
          <span className="font-semibold text-blue-800">
            {(100 - stats.compressionRatio).toFixed(1)}% redundancy eliminated
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-500">Quantum Entanglement Rate:</span>
          <span className="text-blue-600 font-semibold">
            {((memoryTypes.find(t => t.name === 'Quantum Entangled')?.count || 0) / stats.totalMemories * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}
