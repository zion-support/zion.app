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
    { name: 'Auto-heal Success', value: 96.8, status: 'healthy', trend: 'stable' },
    { name: 'Predictive Scaling', value: 89.4, status: 'healthy', trend: 'improving' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prevMetrics => 
        prevMetrics.map(metric => {
          let newValue = metric.value + (Math.random() - 0.5) * 3;
          newValue = Math.max(0, Math.min(100, newValue));
          
          let newStatus = metric.status;
          if (newValue >= 95) newStatus = 'healthy';
          else if (newValue >= 80) newStatus = 'warning';
          else newStatus = 'critical';
          
          return {
            ...metric,
            value: newValue,
            status: newStatus,
            trend: Math.random() > 0.6 ? 'improving' : Math.random() > 0.3 ? 'stable' : 'degrading'
          };
        })
      );
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    if (status === 'healthy') return 'bg-green-500';
    if (status === 'warning') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusTextColor = (status: string) => {
    if (status === 'healthy') return 'text-green-600';
    if (status === 'warning') return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'improving') return '↑↑';
    if (trend === 'stable') return '→→';
    return '↓↓';
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'improving') return 'text-green-600';
    if (trend === 'stable') return 'text-gray-500';
    return 'text-red-600';
  };

  return (
    <div className="p-6 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg border border-blue-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">
            <span className="text-3xl mr-2">🔄</span> Self-Evolving PM2
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Autonomous process management with quantum-enhanced self-optimization
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Evolve System
          </button>
        </div>
      </div>
      
      <div className="mt-6 bg-white/80 backdrop-blur rounded-xl p-5 border border-blue-100">
        <h3 className="font-semibold text-blue-800 mb-4">Evolution Metrics</h3>
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className={`w-4 h-4 rounded-full mr-3 ${getStatusColor(metric.status)} animate-pulse`} />
                  <div>
                    <span className="font-medium text-blue-800">{metric.name}</span>
                    <span className={`ml-2 text-xs ${getStatusTextColor(metric.status)}`}>
                      [{metric.status.toUpperCase()}]
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className={`${getStatusColor(metric.status)} h-3 rounded-full`} 
                       style={{ width: `${metric.value}%` }}></div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="font-bold text-blue-900">{metric.value}%</div>
                <div className={`text-xs ${getTrendColor(metric.trend)}`}>
                  {getTrendIcon(metric.trend)}
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
            {metrics.every(m => m.status === 'healthy') ? 'Optimal Evolution' : 
             metrics.some(m => m.status === 'critical') ? 'Critical Intervention' : 'Adaptive Tuning'}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-500">Auto-heal Active:</span>
          <span className="text-blue-600 font-medium">✅ Quantum-Enabled</span>
        </div>
      </div>
    </div>
  );
}
