'use client';

import { useState, useEffect } from 'react';

interface AutonomousLearningEngine {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'in-progress' | 'completed';
  aiInsight: string;
}

export default function AutonomousLearningEngine() {
  const [engine, setEngine] = useState<AutonomousLearningEngine | null>(null);
  const [isLearning, setIsLearning] = useState(false);

  useEffect(() => {
    const loadEngine = async () => {
      const response = await fetch('/api/autonomous-learning-engine');
      const data = await response.json();
      setEngine(data);
    };

    loadEngine();
  }, []);

  if (!engine) return null;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Autonomous Learning Engine</h2>
          <p className="text-sm text-gray-600 mt-1">Self-improving AI architecture with continuous optimization</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLearning(true)}
            className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Start Learning
          </button>
          <button
            onClick={() => setIsLearning(false)}
            className="px-3 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Pause
          </button>
        </div>
      </div>

      <div className="mt-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Current Status</h3>
          <p className="text-gray-600">{engine.status === 'active' ? 'Active' : 'Inactive'}</p>
        </div>
      </div>
    </div>
  );