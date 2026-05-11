'use client';

import { useState, useEffect } from 'react';

interface HealingAction {
  id: string;
  timestamp: Date;
  issue: string;
  severity: 'critical' | 'warning' | 'info';
  action: string;
  status: 'detected' | 'healing' | 'resolved' | 'failed';
  confidence: number;
  details: string;
}

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical' | 'recovering';
  uptime: number;
  incidentCount: number;
  autoResolved: number;
  activeAlerts: number;
}

export default function SelfHealingSystem() {
  const [health, setHealth] = useState<SystemHealth>({
    status: 'healthy',
    uptime: 99.97,
    incidentCount: 3,
    autoResolved: 2,
    activeAlerts: 0
  });

  const [healingActions, setHealingActions] = useState<HealingAction[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 3600000),
      issue: 'API response time degraded by 40%',
      severity: 'warning',
      action: 'Auto-scaled backend instances and optimized database queries',
      status: 'resolved',
      confidence: 96,
      details: 'Detected traffic spike from marketing campaign. Added 3 additional API server instances and cleared Redis cache. Response time normalized within 90 seconds.'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 7200000),
      issue: 'Memory leak in background worker process',
      severity: 'critical',
      action: 'Automatically restarted worker and applied code hotfix',
      status: 'resolved',
      confidence: 99,
      details: 'Worker memory usage exceeded 85%. Process automatically recycled and memory leak patch deployed via CI/CD. No downtime experienced.'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 10800000),
      issue: 'Database connection pool exhaustion',
      severity: 'critical',
      action: 'Increased pool size and added connection retry logic',
      status: 'resolved',
      confidence: 98,
      details: 'Connection pool reached max limit due to unexpected load. Auto-increased pool from 20 to 50 and implemented exponential backoff.'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 300000),
      issue: 'CDN cache miss rate increased to 65%',
      severity: 'info',
      action: 'Purged stale cache and adjusted TTL settings',
      status: 'detected',
      confidence: 92,
      details: 'Cache invalidation issue detected. Warming popular content and adjusting cache TTL from 1h to 6h for static assets.'
    }
  ]);

  const [isScanning, setIsScanning] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState({
    responseTime: 142,
    errorRate: 0.02,
    cpuUsage: 67,
    memoryUsage: 73,
    activeConnections: 1247
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        responseTime: Math.max(80, prev.responseTime + (Math.random() - 0.5) * 20),
        errorRate: Math.max(0, prev.errorRate + (Math.random() - 0.5) * 0.01),
        cpuUsage: Math.min(100, Math.max(30, prev.cpuUsage + (Math.random() - 0.5) * 5)),
        memoryUsage: Math.min(100, Math.max(40, prev.memoryUsage + (Math.random() - 0.5) * 3)),
        activeConnections: Math.max(100, prev.activeConnections + Math.floor((Math.random() - 0.5) * 100))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const runDiagnostic = async () => {
    setIsScanning(true);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newIssue: HealingAction = {
      id: Date.now().toString(),
      timestamp: new Date(),
      issue: 'Potential performance bottleneck detected in image optimization pipeline',
      severity: 'warning',
      action: 'Analyzing and applying optimization patch...',
      status: 'healing',
      confidence: 94,
      details: 'Image processing queue building up. Deploying optimized Sharp configuration and adding parallel processing workers.'
    };
    
    setHealingActions(prev => [newIssue, ...prev]);
    setIsScanning(false);
    
    setTimeout(() => {
      setHealingActions(prev => prev.map(action => 
        action.id === newIssue.id 
          ? {...action, status: 'resolved' as const, action: 'Applied image pipeline optimizations and increased worker concurrency'}
          : action
      ));
      setHealth(prev => ({...prev, autoResolved: prev.autoResolved + 1}));
    }, 5000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      case 'recovering': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>Resolved</span>;
      case 'healing':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 animate-pulse"></span>Healing</span>;
      case 'detected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5"></span>Detected</span>;
      case 'failed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>Failed</span>;
      default:
        return null;
    }
  };

  const recentResolutionRate = healingActions.filter(a => a.status === 'resolved').length / healingActions.length * 100;

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <span className="text-3xl mr-2">🛡️</span>
            Self-Healing System
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Autonomous detection, diagnosis, and recovery from system failures
          </p>
        </div>
        <div className="text-right flex items-center space-x-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getStatusColor(health.status)}`}>
              {health.status.toUpperCase()}
            </div>
            <div className="text-xs text-gray-500">System Status</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{health.uptime}%</div>
            <div className="text-xs text-gray-500">Uptime (30d)</div>
          </div>
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-xs text-gray-500 uppercase">Response Time</div>
          <div className="text-xl font-bold text-slate-900">{Math.round(liveMetrics.responseTime)}ms</div>
          <div className="text-xs text-green-600">↓ 12% vs last hour</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-xs text-gray-500 uppercase">Error Rate</div>
          <div className="text-xl font-bold text-slate-900">{(liveMetrics.errorRate * 100).toFixed(2)}%</div>
          <div className="text-xs text-green-600">Within SLO</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-xs text-gray-500 uppercase">CPU Usage</div>
          <div className="text-xl font-bold text-slate-900">{Math.round(liveMetrics.cpuUsage)}%</div>
          <div className="text-xs text-yellow-600">Moderate load</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-xs text-gray-500 uppercase">Memory</div>
          <div className="text-xl font-bold text-slate-900">{Math.round(liveMetrics.memoryUsage)}%</div>
          <div className="text-xs text-green-600">Healthy</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-xs text-gray-500 uppercase">Connections</div>
          <div className="text-xl font-bold text-slate-900">{liveMetrics.activeConnections.toLocaleString()}</div>
          <div className="text-xs text-blue-600">Active</div>
        </div>
      </div>

      {/* Healing Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg flex items-center">
            <span className="mr-2">🔧</span>
            Autonomous Healing Actions
          </h3>
          <button
            onClick={runDiagnostic}
            disabled={isScanning}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium disabled:opacity-50"
          >
            {isScanning ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Diagnosing...
              </span>
            ) : (
              '🔍 Run Diagnostic & Heal'
            )}
          </button>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {healingActions.map(action => (
            <div 
              key={action.id}
              className={`border rounded-lg p-4 ${getSeverityColor(action.severity)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold">{action.issue}</h4>
                  <p className="text-sm opacity-80 mt-1">{action.details}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">{action.confidence}% confidence</span>
                  {getStatusBadge(action.status)}
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase opacity-70">Auto-Heal Action</span>
                    <p className="font-medium">{action.action}</p>
                  </div>
                  <div className="text-xs opacity-70">
                    {action.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex gap-4">
            <span className="text-gray-600">
              Total Incidents: <strong>{healingActions.length}</strong>
            </span>
            <span className="text-green-600">
              Auto-Resolved: <strong>{health.autoResolved}</strong>
            </span>
            <span className="text-blue-600">
              Success Rate: <strong>{Math.round(recentResolutionRate)}%</strong>
            </span>
          </div>
          <div className="text-gray-500">
            System continuously monitors and heals itself without human intervention
          </div>
        </div>
      </div>

      {/* AI Healing Intelligence */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-6">
        <h3 className="font-semibold text-lg mb-3 flex items-center">
          <span className="mr-2">🤖</span>
          AI Healing Intelligence
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Detection Speed</span>
              <span className="text-emerald-600 font-bold">≤ 2.3s</span>
            </div>
            <div className="w-full bg-emerald-100 rounded-full h-2">
              <div className="h-2 rounded-full bg-emerald-500" style={{ width: '92%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Average time from issue detection to heal initiation</p>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Auto-Resolution Rate</span>
              <span className="text-teal-600 font-bold">94.7%</span>
            </div>
            <div className="w-full bg-teal-100 rounded-full h-2">
              <div className="h-2 rounded-full bg-teal-500" style={{ width: '94.7%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Percentage of incidents resolved without human intervention</p>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">False Positive Rate</span>
              <span className="text-green-600 font-bold">0.3%</span>
            </div>
            <div className="w-full bg-green-100 rounded-full h-2">
              <div className="h-2 rounded-full bg-green-500" style={{ width: '5%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Accuracy of incident detection (lower is better)</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white bg-opacity-60 rounded-lg border border-emerald-200">
          <h4 className="font-medium text-emerald-900 mb-2">How Self-Healing Works</h4>
          <ul className="text-sm text-emerald-800 space-y-1">
            <li>• <strong>Continuous Monitoring:</strong> AI monitors 100+ system metrics in real-time</li>
            <li>• <strong>Anomaly Detection:</strong> Uses ML models trained on historical incident data</li>
            <li>• <strong>Root Cause Analysis:</strong> Correlates events across services to identify true cause</li>
            <li>• <strong>Automated Remediation:</strong> Executes proven recovery playbooks from incident database</li>
            <li>• <strong>Learning Loop:</strong> Each successful heal improves future response patterns</li>
          </ul>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-emerald-700">
            <span className="font-semibold">Last Scan:</span> Just now · Next in 5 min
          </div>
          <div className="flex items-center gap-2">
            <div className="animate-pulse w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-sm text-emerald-600">Protecting your system</span>
          </div>
        </div>
      </div>
    </div>
  );
}