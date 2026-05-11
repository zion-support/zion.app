'use client';

export default function AutonomousThreatIntelligence() {
  return (
    <div className="p-6 bg-gradient-to-br from-white to-amber-50 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-amber-900">
            <span className="text-3xl mr-2">🚨</span> Autonomous Threat Intelligence
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Self-updating threat detection system with real-time intelligence feeds and autonomous response orchestration
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors">
            View Threats
          </button>
        </div>
      </div>
      <div className="mt-6 bg-white/70 backdrop-blur rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Intelligence Capabilities</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>Real-time threat feed ingestion</li>
          <li>Automated threat landscape analysis</li>
          <li>Proactive vulnerability prediction</li>
          <li>Autonomous response planning</li>
        </ul>
      </div>
      <div className="mt-4 flex items-center gap-2 text-green-600">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium">Monitoring</span>
      </div>
    </div>
  );
}