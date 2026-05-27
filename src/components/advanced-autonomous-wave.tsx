'use client';

import { useState, useEffect } from 'react';

interface AutonomousWave {
  id: string;
  name: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed' | 'autonomous';
  impact: 'performance' | 'security' | 'usability' | 'scalability' | 'innovation';
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedCompletion: string;
  actualCompletion: string;
  learnings: string[];
  nextSteps: string[];
}

export default function AdvancedAutonomousWave() {
  const [wave, setWave] = useState<AutonomousWave | null>(null);
  const [history, setHistory] = useState<AutonomousWave[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    const sampleWave: AutonomousWave = {
      id: 'wave-advanced-meta',
      name: 'Advanced Autonomous Meta-Learning Wave',
      description: 'Self-improving AI architecture that evolves its own optimization algorithms',
      status: 'planned',
      impact: 'innovation',
      priority: 'critical',
      estimatedCompletion: '2026-05-10',
      actualCompletion: '',
      learnings: [
        'AI-driven architecture optimization',
        'Meta-learning for algorithm selection',
        'Autonomous performance tuning'
      ],
      nextSteps: [
        'Implement evolutionary algorithm selection',
        'Deploy cross-agent learning coordination',
        'Add performance-based reward modeling'
      ]
    };
    setHistory([sampleWave]);
    setWave(sampleWave);
  }, []);

  const executeWave = () => {
    if (wave?.status === 'completed' || wave.status === 'autonomous' || isExecuting) return;
    
    setIsExecuting(true);
    const timeout = setTimeout(() => {
      setIsExecuting(false);
      setWave(prev => ({ ...prev!, status: 'completed', actualCompletion: new Date().toISOString() }));
    }, 3000);
    
    return () => clearTimeout(timeout);
  };

  if (!wave) return null;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-indigo-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <span className="text-3xl mr-2">⚡</span>
            {wave.name}
          </h2>
          <p className="text-sm text-gray-600 mt-1">{wave.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded text-sm font-medium ${
            wave.status === 'completed' ? 'bg-green-600 text-white' : 
            wave.status === 'in-progress' ? 'bg-yellow-600 text-white' : 
            'bg-gray-200 text-gray-800'
          }`}>
            {wave.status}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-indigo-100">
          <div className="text-2xl font-bold text-indigo-600 mb-2">
            Impact
          </div>
          <div className="px-3 py-2 rounded bg-indigo-50 text-indigo-800 text-sm">
            {wave.impact}
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-indigo-100">
          <div className="text-2xl font-bold text-indigo-600 mb-2">
            Priority
          </div>
          <div className="px-3 py-2 rounded bg-indigo-50 text-indigo-800 text-sm font-medium">
            {wave.priority}
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-indigo-100">
          <div className="text-2xl font-bold text-indigo-600 mb-2">
            Estimated
          </div>
          <div className="text-sm text-indigo-800">
            {new Date(wave.estimatedCompletion).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="border-l-4 border-orange-500 pl-3">
          <p className="text-sm text-gray-600 font-medium">Description:</p>
          <p className="text-gray-700 mt-1">{wave.description}</p>
        </div>
        
        <div className="border-l-4 border-blue-500 pl-3">
          <p className="text-sm text-gray-600 font-medium">Learnings:</p>
          <ul className="list-disc pl-5 space-y-1 mt-1 text-sm text-gray-700">
            {wave.learnings.map((learning, index) => (
              <li key={index}>{learning}</li>
            ))}
          </ul>
        </div>
        
        <div className="border-l-4 border-green-500 pl-3">
          <p className="text-sm text-gray-600 font-medium">Next Steps:</p>
          <ul className="list-disc pl-5 space-y-1 mt-1 text-sm text-gray-700">
            {wave.nextSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>
      </div>

      {wave.status !== 'completed' && (
        <button
          onClick={executeWave}
          disabled={isExecuting}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded border border-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-500"
        >
          {isExecuting ? 'Executing...' : 'Initiate Autonomous Evolution'}
        </button>
      )}

      {wave.status === 'completed' && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="flex items-center gap-2">
            <span className="text-sm text-green-600">
              ✓ Completed on {new Date(wave.actualCompletion!).toLocaleDateString()}
            </span>
            <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
              Success
            </span>
          </div>
          <p className="mt-1 text-sm text-green-600">
            Autonomous system has successfully evolved its optimization algorithms
          </p>
        </div>
      )}
    </div>
  );
}