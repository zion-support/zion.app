'use client';

export default function QuantumSecurityGuardian() {
  return (
    <div className="p-6 bg-gradient-to-br from-white to-red-50 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-red-900">
            <span className="text-3xl mr-2">🛡️</span> Quantum Security Guardian
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Zero-trust architecture with post-quantum cryptography and automated threat neutralization
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
            Security Status
          </button>
        </div>
      </div>
      <div className="mt-6 bg-white/70 backdrop-blur rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Guardian Capabilities</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>Post-quantum cryptographic enforcement</li>
          <li>Real-time threat detection and mitigation</li>
          <li>Zero-trust access control</li>
          <li>Automated security patch deployment</li>
        </ul>
      </div>
      <div className="mt-4 flex items-center gap-2 text-green-600">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium">Protecting</span>
      </div>
    </div>
  );
}