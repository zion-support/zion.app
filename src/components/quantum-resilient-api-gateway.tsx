'use client';

export default function QuantumResilientAPIGateway() {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-emerald-800">
            <span className="text-3xl mr-2">🛡️</span> Quantum-Resilient API Gateway
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Post-quantum secure API routing with adaptive threat protection
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              // Trigger security scan
            }}
            className="px-4 py-2 bg-emerald-600 text-white rounded disabled:bg-emerald-400"
            disabled
          >
            Secure Gateway
          </button>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Key Features</h3>
        <ul className="space-y-1">
          <li>NIST PQC-compliant encryption (Kyber, Dilithium)</li>
          <li>Zero-downtime key rotation</li>
          <li>Real-time quantum threat detection</li>
          <li>Adaptive rate limiting and DDoS protection</li>
          <li>Automated compliance reporting</li>
        </ul>
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Deployment Status</h3>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-2 bg-green-500 rounded-full" />
          <span className="ml-2 text-green-600">Securing...</span>
        </div>
      </div>
    </div>
  );
}