'use client';

import { useState, useEffect } from 'react';

interface ChaosMetric {
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

export default function ChaoticInfinityOrchestrator() {
  const [metrics, setMetrics] = useState<ChaosMetric[]>([
    { name: 'Workflow Entropy', value: 78.5, trend: 'stable', color: 'text-indigo-600' },
    { name: 'Agent Concurrency', value: 92.3, trend: 'up', color: 'text-emerald-600' },
    { name: 'Task Distribution', value: 85.1, trend: 'stable', color: 'text-amber-600' },
    { name: 'Resource Efficiency', value: 88.7, trend: 'up', color: 'text-rose-600' },
    { name: 'Prediction Accuracy', value: 91.2, trend: 'up', color: 'text-violet-600' },
    { name: 'System Resilience', value: 87.9, trend: 'stable', color: 'text-cyan-600' }
  ]);

  useEffect(() => {
    // Simulate real-time chaotic system updates
    const interval = setInterval(() => {
      setMetrics(prevMetrics => 
        prevMetrics.map(metric => ({
          ...metric,
          value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 4)),
          trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.25 ? 'down' : 'stable'
        }))
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            <span className="text-3xl mr-2">♾️</span> Chaotic Infinity Orchestrator
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Dynamic workflow weighting with quantum-entangled task distribution
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors">
            Optimize Flow
          </button>
        </div>
      </div>
      
      <div className="mt-6 bg-white/80 backdrop-blur rounded-xl p-5 border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Orchestration Dynamics</h3>
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <span className="w-3 h-3 rounded-full mr-2" 
                        className={`${metric.color} animate-pulse`} />
                  <span className="font-medium text-gray-700">{metric.name}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className={`bg-${metric.color.split('-')[0]}-600 h-2.5 rounded-full`} 
                       style={{ width: `${metric.value}%` }}></div>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="font-bold text-gray-900">{metric.value}%</div>
                <div className={`text-xs ${metric.color} font-medium`}>
                  {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-5 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">System State:</span>
          <span className="font-semibold text-gray-800">
            {metrics.every(m => m.value > 75) ? 'Optimal Flow' : 
             metrics.every(m => m.value > 50) ? 'Stable Operation' : 'Adaptive Tuning'}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-500">Last Update:</span>
          <span className="text-gray-400">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}