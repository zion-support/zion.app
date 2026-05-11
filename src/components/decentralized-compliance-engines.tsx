'use client';

export default function DecentralizedComplianceEngines() {
  return (
    <div className="p-6 bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-indigo-900">
            <span className="text-3xl mr-2">🌐</span> Decentralized Compliance Engines
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Distributed policy validation across global nodes with automated regulatory compliance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
            Validate Compliance
          </button>
        </div>
      </div>
      <div className="mt-6 bg-white/70 backdrop-blur rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Capabilities</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>Real-time policy validation across distributed nodes</li>
          <li>Automated compliance reporting with blockchain audit</li>
          <li>Multi-jurisdiction regulatory mapping</li>
          <li>Self-updating compliance rules engine</li>
        </ul>
      </div>
      <div className="mt-4 flex items-center gap-2 text-green-600">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium">Validating</span>
      </div>
    </div>
  );
}