'use client';

export default function AutonomousStrategicPlanner() {
  return (
    <div className="p-6 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">
            <span className="text-3xl mr-2">🗺️</span> Autonomous Strategic Planner
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Long-term strategic planning with scenario simulation and adaptive goal optimization
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Plan
          </button>
        </div>
      </div>
      <div className="mt-6 bg-white/70 backdrop-blur rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Strategic Features</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>Multi-horizon scenario simulation</li>
          <li>Adaptive goal optimization</li>
          <li>Risk-aware decision trees</li>
          <li>Real-time recalibration</li>
        </ul>
      </div>
      <div className="mt-4 flex items-center gap-2 text-blue-600">
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium">Planning</span>
      </div>
    </div>
  );
}