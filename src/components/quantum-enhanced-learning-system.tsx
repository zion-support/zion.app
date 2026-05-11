'use client';

export default function QuantumEnhancedLearningSystem() {
  return (
    <div className="p-6 bg-gradient-to-br from-white to-cyan-50 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-cyan-900">
            <span className="text-3xl mr-2">🤖</span> Quantum-Enhanced Learning System
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            AI agents that learn from quantum computing principles to optimize decision-making
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors">
            Learn Quantum
          </button>
       
        </div>
      </div>
      <div className="mt-6 bg-white/70 backdrop-blur rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Learning Features</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>Quantum-enhanced neural networks</li>
          <li>Cross-domain knowledge fusion</li>
          <li>Self-improving learning algorithms</li>
          <li>Quantum error correction for AI stability</li>
        </ul>
      </div>
      <div className="mt-4 flex items-center gap-2 text-gray-600">
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium">Learning</span>
      </div>
    </div>
  );
}