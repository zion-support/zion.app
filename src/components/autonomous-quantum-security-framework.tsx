'use client';

export default function AutonomousQuantumSecurityFramework() {
  return (
    <div className="p-6 bg-gradient-to-br from-white to-red-50 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-red-900">
            <span className="text-3xl mr-2">🛡️</span> Autonomous Quantum Security Framework
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Self-healing security protocols with quantum-resistant threat detection and autonomous response
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
            Secure System
          </button>
        </div>
      </div>
      <div className="mt-6 bg-white/70 backdrop-blur rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Security Features</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>Quantum-resistant threat detection in real-time</li>
          <li>Self-healing security protocols</li>
          <li>Autonomous vulnerability patching</li>
          <li>Cross-chain security monitoring</li>
        </ul>
      </div>
      <div className="mt-4 flex items-center gap-2 text-red-600">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium">Securing</span>
      </div>
    </div>
  );
}