'use client';

export default function AutonomousInsightDistillation() {
  return (
    <div className="p-6 bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-purple-900">
            <span className="text-3xl mr-2">💡</span> Autonomous Insight Distillation
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Automatically extracts valuable insights from complex data streams
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
            Distill Insight
          </button>
        </div>
      </div>
      <div className="mt-6 bg-white/70 backdrop-blur rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Distillation Features</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>Real-time insight extraction from multi-source data</li>
          <li>Pattern recognition with semantic depth</li>
          <li>Automated insight-to-action conversion</li>
          <li>Cross-domain insight synthesis</li>
        </ul>
      </div>
      <div className="mt-4 flex items-center gap-2 text-purple-600">
        <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium">Extracting</span>
      </div>
    </div>
  );
}