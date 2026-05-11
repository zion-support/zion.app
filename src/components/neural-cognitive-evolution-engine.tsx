'use client';

import { useState, useEffect } from 'react';

interface NeuralPathway {
  id: string;
  strength: number;
  type: 'synaptic' | 'quantum' | 'fractal';
  active: boolean;
}

interface CognitiveState {
  awareness: number;
  creativity: number;
  logic: number;
  intuition: number;
}

export default function NeuralCognitiveEvolutionEngine() {
  const [pathways, setPathways] = useState<NeuralPathway[]>([
    { id: 'synaptic-alpha', strength: 87.4, type: 'synaptic', active: true },
    { id: 'synaptic-beta', strength: 72.8, type: 'synaptic', active: true },
    { id: 'quantum-entangle-1', strength: 94.2, type: 'quantum', active: true },
    { id: 'quantum-entangle-2', strength: 89.7, type: 'quantum', active: true },
    { id: 'fractal-pattern', strength: 96.5, type: 'fractal', active: true },
    { id: 'fractal-recursive', strength: 83.1, type: 'fractal', active: false }
  ]);

  const [cognition, setCognition] = useState<CognitiveState>({
    awareness: 92.4,
    creativity: 88.7,
    logic: 95.3,
    intuition: 78.9
  });

  const [evolution, setEvolution] = useState({
    cycles: 1247,
    adaptation: 0.847,
    learningRate: 0.023
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPathways(prev => prev.map(p => ({
        ...p,
        strength: Math.min(100, Math.max(0, p.strength + (Math.random() - 0.4) * 2)),
        active: p.strength > 30
      })));
      
      setCognition(prev => ({
        awareness: Math.min(100, prev.awareness + (Math.random() - 0.3) * 1.5),
        creativity: Math.min(100, prev.creativity + (Math.random() - 0.4) * 2),
        logic: Math.min(100, prev.logic + (Math.random() - 0.2) * 1),
        intuition: Math.min(100, prev.intuition + (Math.random() - 0.5) * 2.5)
      }));
      
      setEvolution(prev => ({
        cycles: prev.cycles + 1,
        adaptation: Math.min(1, prev.adaptation + Math.random() * 0.001),
        learningRate: Math.max(0.001, prev.learningRate * (0.999 + Math.random() * 0.002))
      }));
    }, 2500);
    
    return () => clearInterval(interval);
  }, []);

  const getPathwayColor = (type: string) => {
    switch(type) {
      case 'synaptic': return 'bg-blue-500';
      case 'quantum': return 'bg-purple-500';
      case 'fractal': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-white to-violet-50 rounded-xl shadow-lg border border-violet-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-violet-900">
            <span className="text-3xl mr-2">🧬</span> Neural Cognitive Evolution Engine
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Self-evolving neural pathways with quantum-fractal architecture
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
            {evolution.cycles} Cycles
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-violet-100">
          <h3 className="font-semibold text-violet-800 mb-3">Neural Pathways</h3>
          <div className="space-y-3">
            {pathways.map((pathway, idx) => (
              <div key={pathway.id} className="flex items-center justify-between p-3 bg-violet-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getPathwayColor(pathway.type)} ${pathway.active ? 'animate-pulse' : 'opacity-50'}`} />
                  <span className="font-medium text-gray-800 text-sm">{pathway.id}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-violet-700">{pathway.strength.toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">{pathway.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-violet-100">
          <h3 className="font-semibold text-violet-800 mb-3">Cognitive State</h3>
          <div className="space-y-3">
            {Object.entries(cognition).map(([key, value]) => (
              <div key={key} className="p-3 bg-violet-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 capitalize">{key}</span>
                  <span className="text-lg font-bold text-violet-700">{value.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-violet-200 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-600 transition-all" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
            <div className="p-3 bg-violet-50 rounded-lg">
              <div className="text-sm text-gray-600">Adaptation Score</div>
              <div className="text-xl font-bold text-violet-700">{(evolution.adaptation * 100).toFixed(1)}%</div>
            </div>
            <div className="p-3 bg-violet-50 rounded-lg">
              <div className="text-sm text-gray-600">Learning Rate</div>
              <div className="text-xl font-bold text-violet-700">{evolution.learningRate.toFixed(4)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-violet-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Evolution Status:</span>
          <span className="font-semibold text-violet-800">Active Learning</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-500">Next Milestone:</span>
          <span className="text-violet-600 font-semibold">1000 cycles @ 95% adaptation</span>
        </div>
      </div>
    </div>
  );
}
