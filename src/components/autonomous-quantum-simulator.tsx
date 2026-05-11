'use client';

import { useState } from 'react';

export default function AutonomousQuantumSimulator() {
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<string[]>([]);

  const startSimulation = () => {
    if (simulationRunning) return;
    
    setSimulationRunning(true);
    setProgress(0);
    setResults([]);
    
    // Simulate quantum computations
    const intervals = setInterval(() => {
      setProgress(prev => prev + 10);
      if (progress < 100) {
        setResults(prevResults => [...prevResults, `Quantum state ${prev + 1} calculated`);
      } else {
        clearInterval(intervals);
        setSimulationRunning(false);
      }
    }, 800);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-indigo-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-indigo-800">
            <span>🔮</span> Quantum Simulation Engine
          </h2>
        </div>
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={startSimulation}
            disabled={simulationRunning}
            className={`px-4 py-2 rounded bg-indigo-600 text-white transition-colors hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed`}
          >
            {simulationRunning ? 'Running...' : 'Start Simulation'}
          </button>
        </div>
      </div>

      {simulationRunning ? (
        <div className="mt-4">
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-gray-500">Progress:</span>
            <span className="text-sm font-medium text-indigo-600">{progress}%</span>
          </div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-indigo-500 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {results.slice(0, 3).map((result, index) => (
              <div key={index} className="flex items-center gap-1">
                <span className="text-mono text-xs mr-1">{index + 1}.</span>
                <span className="text-gray-700">{result}</div>
              </div>
            ))}
            {results.length > 3 && <span className="text-xs text-gray-500 mt-1">...</span>}
          </div>
        </div>
      ) : (
        <div className="mt-4 text-sm text-gray-600">
          Quantum simulations enable testing of new algorithms in a controlled environment
        </div>
      )}

      <div className="mt-6 bg-indigo-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-indigo-800">Why It Matters</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>Test new quantum algorithms without impacting production</li>
          <li>Validate algorithmic improvements before deployment</li>
          <li>Reduce risk of production surprises</li>
          <li>Enable rapid iteration on quantum-enhanced features</li>
        </ul>
      </div>
    </div>
  );
}