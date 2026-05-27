'use client';

import { useState, useEffect } from 'react';

interface CDNRegion {
  name: string;
  latency: number;
  status: 'online' | 'degraded' | 'offline';
  throughput: number;
}

export default function EntanglementEnabledCDN() {
  const [regions, setRegions] = useState<CDNRegion[]>([
    { name: 'US-East', latency: 12.3, status: 'online', throughput: 9450 },
    { name: 'EU-West', latency: 18.7, status: 'online', throughput: 8320 },
    { name: 'Asia-Pacific', latency: 28.4, status: 'degraded', throughput: 6540 },
    { name: 'South America', latency: 35.2, status: 'online', throughput: 5120 },
    { name: 'Africa', latency: 42.8, status: 'offline', throughput: 0 }
  ]);

  const [globalStats, setGlobalStats] = useState({
    totalObjects: 1247539,
    hitRatio: 98.7,
    encryptionLevel: 'Quantum-Safe AES-256 + QKD',
    replicationFactor: 3.2
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRegions(prev => prev.map(region => ({
        ...region,
        latency: region.status === 'offline' ? 0 : Math.max(1, region.latency + (Math.random() - 0.5) * 4),
        throughput: region.status === 'offline' ? 0 : Math.max(0, region.throughput + Math.floor((Math.random() - 0.5) * 400))
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'online': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-white to-emerald-50 rounded-xl shadow-lg border border-emerald-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-emerald-900">
            <span className="text-3xl mr-2">🌐</span> Entanglement-Enabled CDN
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Quantum-secured content distribution with latency-aware routing
          </p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors">
          Sync Quantum State
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-emerald-100">
          <h3 className="font-semibold text-emerald-800 mb-3">Global Distribution</h3>
          <div className="space-y-3">
            {regions.map((region, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(region.status)} animate-pulse`} />
                  <span className="font-medium text-gray-800">{region.name}</span>
                </div>
                <div className="text-right text-sm">
                  <div className="text-gray-900">{region.latency.toFixed(1)}ms</div>
                  <div className="text-gray-500">{region.throughput.toFixed(0)} Mbps</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-emerald-100">
          <h3 className="font-semibold text-emerald-800 mb-3">Quantum Metrics</h3>
          <div className="space-y-3">
            <div className="p-3 bg-emerald-50 rounded-lg">
              <div className="text-sm text-gray-600">Total Objects</div>
              <div className="text-xl font-bold text-emerald-700">{globalStats.totalObjects.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <div className="text-sm text-gray-600">Cache Hit Ratio</div>
              <div className="text-xl font-bold text-emerald-700">{globalStats.hitRatio}%</div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <div className="text-sm text-gray-600">Encryption</div>
              <div className="text-sm font-bold text-emerald-700">{globalStats.encryptionLevel}</div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <div className="text-sm text-gray-600">Replication Factor</div>
              <div className="text-xl font-bold text-emerald-700">{globalStats.replicationFactor}x</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-emerald-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Quantum Sync Status:</span>
          <span className="font-semibold text-emerald-800">
            {regions.filter(r => r.status === 'online').length}/{regions.length} Nodes Coherent
          </span>
        </div>
      </div>
    </div>
  );
}
