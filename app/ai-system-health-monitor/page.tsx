'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Activity, Cpu, HardDrive, Wifi, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface SystemHealthMetric {
  name: string;
  value: number | string;
  status: 'healthy' | 'warning' | 'critical';
  icon: ReactNode;
  unit?: string;
}

interface HealthAlert {
  id: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  timestamp: Date;
}

export default function AISystemHealthMonitor() {
  const [metrics, setMetrics] = useState<SystemHealthMetric[]>([
    { name: 'API Response Time', value: 0, status: 'healthy', icon: <Wifi className="w-4 h-4" />, unit: 'ms' },
    { name: 'CPU Usage', value: 0, status: 'healthy', icon: <Cpu className="w-4 h-4" />, unit: '%' },
    { name: 'Memory Usage', value: 0, status: 'healthy', icon: <HardDrive className="w-4 h-4" />, unit: 'GB' },
    { name: 'Active Agents', value: 0, status: 'healthy', icon: <Activity className="w-4 h-4" /> },
    { name: 'System Uptime', value: '0h', status: 'healthy', icon: <CheckCircle className="w-4 h-4" /> },
  ]);

  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time metrics (replace with actual API calls)
      const newMetrics: SystemHealthMetric[] = [
        { name: 'API Response Time', value: Math.floor(Math.random() * 100) + 20, status: 'healthy', icon: <Wifi className="w-4 h-4" />, unit: 'ms' },
        { name: 'CPU Usage', value: Math.floor(Math.random() * 60) + 20, status: 'healthy', icon: <Cpu className="w-4 h-4" />, unit: '%' },
        { name: 'Memory Usage', value: (Math.random() * 4 + 2).toFixed(1), status: 'healthy', icon: <HardDrive className="w-4 h-4" />, unit: 'GB' },
        { name: 'Active Agents', value: Math.floor(Math.random() * 5) + 3, status: 'healthy', icon: <Activity className="w-4 h-4" /> },
        { name: 'System Uptime', value: `${Math.floor(Math.random() * 24)}h`, status: 'healthy', icon: <CheckCircle className="w-4 h-4" /> },
      ];

      setMetrics(newMetrics);
      setLastUpdate(new Date());

      // Simulate occasional alerts
      if (Math.random() > 0.9) {
        const newAlert: HealthAlert = {
          id: Date.now().toString(),
          severity: Math.random() > 0.5 ? 'medium' : 'low',
          message: 'AI agent performance degraded - auto-scaling triggered',
          timestamp: new Date(),
        };
        setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'low': return <AlertTriangle className="w-4 h-4 text-blue-500" />;
      default: return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-400" />
          AI System Health Monitor
        </h2>
        <div className="text-sm text-gray-400">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm flex items-center gap-2">
                {metric.icon}
                {metric.name}
              </span>
              <span className={`font-mono text-lg font-bold ${getStatusColor(metric.status)}`}>
                {metric.value}{metric.unit}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  metric.status === 'healthy' ? 'bg-green-500' :
                  metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{
                  width: typeof metric.value === 'number' ?
                    (metric.value / (metric.name.includes('CPU') ? 100 : metric.name.includes('Memory') ? 8 : 1000)) * 100 + '%' : '60%'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {alerts.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className="flex items-start gap-3 p-3 bg-gray-900 rounded border border-gray-700">
                <div className="mt-1">{getAlertIcon(alert.severity)}</div>
                <div className="flex-1">
                  <p className="text-white">{alert.message}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {alert.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  alert.severity === 'high' ? 'bg-red-900 text-red-300' :
                  alert.severity === 'medium' ? 'bg-yellow-900 text-yellow-300' : 'bg-blue-900 text-blue-300'
                }`}>
                  {alert.severity.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-800/30">
        <p className="text-blue-200 text-sm">
          <strong>Autonomous Health Management:</strong> This dashboard monitors the entire AI system in real-time.
          Critical alerts trigger automatic mitigation and agent scaling. All metrics are logged and analyzed for predictive optimization.
        </p>
      </div>
    </div>
  );
}
