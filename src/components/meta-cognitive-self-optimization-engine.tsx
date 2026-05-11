'use client';

import { useState, useEffect } from 'react';

interface OptimizationMetric {
  name: string;
  current: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  improvement: string;
}

export default function MetaCognitiveSelfOptimizationEngine() {
  const [optimizationScore, setOptimizationScore] = useState(94.7);
  const [metrics, setMetrics] = useState<OptimizationMetric[]>([
    { name: 'Code Quality', current: 96.2, target: 98, trend: 'up', improvement: '+2.4%' },
    { name: 'System Autonomy', current: 89.4, target: 95, trend: 'up', improvement: '+5.1%' },
    { name: 'Resource Efficiency', current: 92.1, target: 94, trend: 'stable', improvement: '+0.8%' },
    { name: 'Innovation Rate', current: 87.6, target: 92, trend: 'up', improvement: '+3.9%' },
    { name: 'Deployment Velocity', current: 94.8, target: 96, trend: 'up', improvement: '+1.3%' }
  ]);

  const [selfModifications, setSelfModifications] = useState(42);
  const [autonomousCycles, setAutonomousCycles] = useState(1087);

  useEffect(() => {
    const interval = setInterval(() => {
      setOptimizationScore(prev => Math.min(99.9, prev + (Math.random() - 0.5) * 2));
      
      setMetrics(prev => prev.map(metric => {
        const newCurrent = Math.min(100, metric.current + (Math.random() - 0.5) * 3);
        const trend: 'up' | 'down' | 'stable' = metric.current > newCurrent ? 'down' : metric.current < newCurrent ? 'up' : 'stable';
        return {
          ...metric,
          current: newCurrent,
          trend,
          improvement: `${(newCurrent - metric.current).toFixed(1)}%`
        };
      }));
      
      setSelfModifications(prev => prev + Math.floor(Math.random() * 3));
      setAutonomousCycles(prev => prev + 1);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch(trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg border border-purple-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-purple-900">
            <span className="text-3xl mr-2">🔮</span> Meta-Cognitive Self-Optimization Engine
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            System-wide intelligence amplification with autonomous evolution
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
            Trigger Optimization Cycle
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white/80 backdrop-blur rounded-xl p-5 border border-purple-100">
          <h3 className="font-semibold text-purple-800 mb-3">Optimization Metrics</h3>
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((metric, idx) => (
              <div key={idx} className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">{metric.name}</span>
                  <span className={`text-lg ${getTrendColor(metric.trend)}`}>{getTrendIcon(metric.trend)}</span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purple-700">{metric.current.toFixed(1)}%</div>
                    <div className="text-xs text-gray-500">Target: {metric.target}%</div>
                  </div>
                  <div className={`text-sm font-medium ${metric.trend === 'down' ? 'text-red-500' : 'text-green-600'}`}>
                    {metric.improvement}
                  </div>
                </div>
                <div className="mt-2 h-2 bg-purple-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-600 transition-all duration-1000"
                    style={{ width: `${metric.current}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-purple-100">
          <h3 className="font-semibold text-purple-800 mb-3">Engine Stats</h3>
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <div className="text-3xl font-bold text-purple-700">{optimizationScore.toFixed(1)}%</div>
              <div className="text-sm text-gray-600 mt-1">Optimization Score</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600">Self-Modifications</div>
              <div className="text-xl font-bold text-purple-700">{selfModifications.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600">Autonomous Cycles</div>
              <div className="text-xl font-bold text-purple-700">{autonomousCycles.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600">Cognitive Level</div>
              <div className="text-lg font-bold text-purple-700">Meta-Cognitive</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-purple-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Self-Evolution Status:</span>
          <span className="font-semibold text-purple-800">Continuous Optimization</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-500">Autonomous Decision Authority:</span>
          <span className="text-purple-600 font-semibold">Full</span>
        </div>
      </div>
    </div>
  );
}
