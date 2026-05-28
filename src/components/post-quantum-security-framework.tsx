'use client';

export default function PostQuantumSecurityFramework() {
  return (
    <div className="p-6 bg-gradient-to-br from-white to-red-50 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-red-900">
            <span className="text-3xl mr-2">🔐</span> Post-Quantum Security Framework
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Comprehensive security suite implementing NIST post-quantum cryptography standards with automated key lifecycle management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
            Security Status
          </button>
        </div>
      </div>
      <div className="mt-6 bg-white/70 backdrop-blur rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Security Capabilities</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>NIST PQC-compliant encryption algorithms</li>
          <li>Zero-downtime automated key rotation</li>
          <li>Real-time threat detection and response</li>
          <li>Quantum-resistant authentication protocols</li>
        </ul>
      </div>
      <div className="mt-4 flex items-center gap-2 text-green-600">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium">Secured</span>
      </div>
    </div>
  );
}