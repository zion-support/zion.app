'use client';

import { useState } from 'react';

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'optimal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  aiRecommendation?: string;
}

export default function AIHealthMonitor() {
  const [metrics, setMetrics] = useState<HealthMetric[]>([
    {
      id: '1',
      name: 'CPU Usage',
      value: 65,
      unit: '%',
      status: 'warning',
      trend: 'stable',
      aiRecommendation: 'Consider adding auto-scaling for high-traffic periods'
    },
    {
      id: '2',
      name: 'Memory Usage',
      value: 42,
      unit: '%',
      status: 'optimal',
      trend: 'down',
      aiRecommendation: 'Memory usage decreasing - good performance'
    },
    {
      id: '3',
      name: 'Response Time',
      value: 215,
      unit: 'ms',
      status: 'warning',
      trend: 'up',
      aiRecommendation: 'Optimize API endpoints to reduce latency below 200ms'
    },
    {
      id: '4',
      name: 'Error Rate',
      value: 0.2,
      unit: '%',
      status: 'optimal',
      trend: 'stable',
      aiRecommendation: 'Error rate within acceptable limits'
    },
    {
      id: '5',
      name: 'Uptime',
      value: 99.8,
      unit: '%',
      status: 'optimal',
      trend: 'stable',
      aiRecommendation: 'Excellent uptime - maintain current infrastructure'
    },
    {
      id: '6',
      name: 'Database Connections',
      value: 85,
      unit: '%',
      status: 'critical',
      trend: 'up',
      aiRecommendation: 'Database connections approaching limit - consider connection pooling'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '📊';
      default: return '📊';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'optimal': return '✅';
      case 'warning': return '⚠️';
      case 'critical': return '🚨';
      default: return '🔶';
    }
  };

  const getOverallHealth = () => {
    const critical = metrics.filter(m => m.status === 'critical').length;
    const warning = metrics.filter(m => m.status === 'warning').length;
    const optimal = metrics.filter(m => m.status === 'optimal').length;

    if (critical > 0) return { level: 'critical', color: 'bg-red-500 text-white', text: 'Critical Issues' };
    if (warning > 2) return { level: 'warning', color: 'bg-yellow-500 text-white', text: 'Warning' };
    if (optimal >= metrics.length * 0.7) return { level: 'optimal', color: 'bg-green-500 text-white', text: 'Optimal' };
    return { level: 'review', color: 'bg-blue-500 text-white', text: 'Review Needed' };
  };

  const overallHealth = getOverallHealth();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium';
      case 'warning': return 'bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium';
      case 'critical': return 'bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium';
      default: return 'bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-medium';
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">AI Health Monitor</h2>
          <p className="text-sm text-gray-600 mt-1">Real-time system health and performance insights</p>
        </div>
        <div className="text-right">
          <div className={`inline-flex items-center rounded-full px-3 py-1 ${overallHealth.color}`}>
            {getStatusEmoji(overallHealth.level)}
            <span className="ml-2 font-semibold">
              {overallHealth.text}
            </span>
          </div>
        </div>
      </div>

      {/* Overall Health Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-200">
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">{metrics.length}</div>
            <div className="text-sm text-gray-600">Total Metrics</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">{metrics.filter(m => m.status === 'optimal').length}</div>
            <div className="text-sm text-gray-600">Optimal</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-600">{metrics.filter(m => m.status === 'warning').length}</div>
            <div className="text-sm text-gray-600">Warning</div>
          </div>
        </div>
      </div>

      {/* Health Metrics */}
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.id} className="border rounded-lg p-4 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{metric.name}</h3>
                <div className="text-xl font-bold {getPerformanceColor(metric.value, metric.target)}">
                  {metric.value}{metric.unit}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={getStatusBadge(metric.status)}>
                  {metric.status.toUpperCase()}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  {getTrendIcon(metric.trend)}
                </span>
              </div>
            </div>

            {/* Performance Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
              <div
                className={`h-3 rounded-full transition-all ${
                  metric.status === 'optimal' ? 'bg-green-500' :
                  metric.status === 'warning' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${metric.value}%` }}
              />
            </div>

            {/* AI Recommendation */}
            {metric.aiRecommendation && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">🤖</span>
                  <div>
                    <div className="text-xs font-semibold text-blue-900 mb-1">AI Recommendation</div>
                    <p className="text-sm text-blue-800">{metric.aiRecommendation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Critical Issues Alert */}
      {metrics.some(m => m.status === 'critical') && (
        <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="font-semibold text-red-900 mb-2">🚨 Critical Issues Detected</h3>
          <ul className="text-sm text-red-800 space-y-1">
            {metrics.filter(m => m.status === 'critical').map((metric) => (
              <li key={metric.id}>
                {metric.name}: {metric.value}{metric.unit} - {metric.aiRecommendation}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* AI Intelligence Note */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <h3 className="font-semibold text-purple-900 mb-1">🤖 AI Intelligence</h3>
        <p className="text-sm text-purple-800">
          AI continuously monitors system health, predicts potential issues before they occur, and provides actionable recommendations for optimal performance.
        </p>
      </div>
    </div>
  );
}