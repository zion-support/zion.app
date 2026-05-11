'use client';

export default function QuantumProvenanceLedger() {
  return (
    <div className="p-6 bg-gradient-to-br from-white to-emerald-50 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-emerald-900">
            <span className="text-3xl mr-2">🏗️</span> Quantum-Provenance Ledger
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Immutable audit trails for all cryptographic operations with quantum-resistant verification
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors">
            Verify Ledger
          </button>
        </div>
      </div>
      <div className="mt-6 bg-white/70 backdrop-blur rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Security Features</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>Quantum-resistant hash chains for operation verification</li>
          <li>Blockchain-secured transaction history</li>
          <li>Real-time integrity monitoring and alerts</li>
          <li>Automated compliance reporting</li>
        </ul>
      </div>
      <div className="mt-4 flex items-center gap-2 text-green-600">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium">Verified</span>
      </div>
    </div>
  );
}