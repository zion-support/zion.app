'use client';

import { useState, useEffect } from 'react';

interface PM2Metric {
  name: string;
  value: number;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'improving' | 'stable' | 'degrading';
}

export default function SelfEvolvingPM2() {
  const [metrics, setMetrics] = useState<PM2Metric[]>([
    { name: 'Process Stability', value: 98.7, status: 'healthy', trend: 'improving' },
    { name: 'Memory Efficiency', value: 92.3, status: 'healthy', trend: 'stable' },
    { name: 'CPU Utilization', value: 76.5, status: 'healthy', trend: 'improving' },
    { name: 'Restart Frequency', value: 2.1, status: 'healthy', trend: 'improving' },
    { name: 'Auto‑heal Success', value: 96.8, status: 'healthy', trend: 'stable' },
    { name: 'Predictive Scaling', value: 89.4, status: 'healthy', trend: 'improving' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev =>
        prev.map(m => {
          const val = Math.max(0, Math.min(100, m.value + (Math.random() - 0.5) * 3));
          const newStatus = val >= 95 ? 'healthy' : val >= 80 ? 'warning' : 'critical';
          return {
            ...m,
            value: val,
            status: newStatus,
            trend: Math.random() > 0.6 ? 'improving' : Math.random() > 0.3 ? 'stable' : 'degrading',
          };
        })
      );
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg border border-blue-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">🔄 Self‑Evolving PM2</h2>
          <p className="text-sm text-gray-600 mt-1">Autonomous process management with quantum‑enhanced self‑optimization</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Evolve System
          </button>
        </div>
      </div>
      <div className="mt-6 bg-white/80 backdrop-blur rounded-xl p-5 border border-blue-100">
        <h3 className="font-semibold text-blue-800 mb-4">Evolution Metrics</h3>
        <div className="space-y-4">
          {metrics.map((m, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div
                    className={`w-4 h-4 rounded-full mr-3 animate-pulse ${
                      m.status === 'healthy' ? 'bg-green-500' : m.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  />
                  <div>
                    <span className="font-medium text-blue-800">{m.name}</span>
                    <span className={`ml-2 text-xs ${
                      m.status === 'healthy' ? 'text-green-600' : m.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                    }`}>{`[${m.status.toUpperCase()}]`}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      m.status === 'healthy' ? 'bg-green-500' : m.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${m.value}%` }}
                  />
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="font-bold text-blue-900">{m.value}%</div>
                <div className={`text-xs ${
                  m.trend === 'improving' ? 'text-green-600' : m.trend === 'stable' ? 'text-gray-500' : 'text-red-600'
                }`}>
                  {m.trend === 'improving' ? '↑↑' : m.trend === 'stable' ? '→→' : '↓↓'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 pt-4 border-t border-blue-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">System Health:</span>
          <span className="font-semibold text-blue-800">
            {metrics.every(m => m.status === 'healthy') ? 'Optimal Evolution' : metrics.some(m => m.status === 'critical') ? 'Critical Intervention' : 'Adaptive Tuning'}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-500">Auto‑heal Active:</span>
          <span className="text-blue-600 font-medium">✅ Quantum‑Enabled</span>
        </div>
      </div>
    </div>
  );
}
