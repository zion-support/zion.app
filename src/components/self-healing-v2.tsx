'use client';

import { useState, useEffect } from 'react';

interface Issue {
  id: string;
  description: string;
  severity: 'critical' | 'warning' | 'medium' | 'low';
  resolved: boolean;
}

export default function SelfHealingV2() {
  const [activeIssues, setActiveIssues] = useState<Issue[]>([]);
  const [healingInProgress, setHealingInProgress] = useState(false);
  const [resolutionTime, setResolutionTime] = useState<string | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'warning': return 'bg-yellow-500 text-black';
      case 'medium': return 'bg-orange-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-300 text-gray-700';
    }
  };

  const startHealing = () => {
    if (healingInProgress) return;
    setHealingInProgress(true);
    setActiveIssues([
      { id: 'issue-001', description: 'High memory usage in background workers', severity: 'warning', resolved: false },
      { id: 'issue-002', description: 'Cache hit rate below optimal threshold', severity: 'medium', resolved: false }
    ]);
    setResolutionTime(null);
    setTimeout(() => {
      setHealingInProgress(false);
      setActiveIssues(prev => prev.map(issue => ({ ...issue, resolved: true })));
    }, 8000);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-indigo-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-indigo-800">
            <span>🛡️</span> Self-Healing System v2.0
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Autonomous detection and resolution of system anomalies
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={startHealing}
            disabled={healingInProgress || activeIssues.some(i => !i.resolved)}
            className={`px-4 py-2 rounded bg-indigo-600 text-white transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${
              healingInProgress ? 'opacity-70' : ''
            }`}
          >
            {healingInProgress ? 'Healing...' : 'Initiate Auto-Recovery'}
          </button>
        </div>
      </div>

      {healingInProgress && (
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-2 bg-indigo-200 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: '40%' }} />
            </div>
            <span className="text-sm text-gray-600">Healing Progress</span>
          </div>
        </div>
      )}

      {activeIssues.length > 0 && (
        <div className="mt-6 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">
            🚨 Active Issues Requiring Resolution
          </h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            {activeIssues.map(issue => (
              <li key={issue.id} className="flex items-start gap-2">
                <div className={`w-2 h-2 rounded-full mt-1 ${getSeverityColor(issue.severity)}`} />
                <div className="ml-2 text-sm text-gray-800">
                  {issue.description}
                  <span className="text-xs text-gray-500 ml-2">
                    ({issue.severity} severity)
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {resolutionTime && (
        <div className="mt-4 p-2 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-medium text-green-700">
            ✅ Self-Healing Complete at {resolutionTime}
          </h3>
        </div>
      )}

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-600 mb-2">Self-Healing Architecture</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Autonomous anomaly detection across all services</li>
          <li>• Context-aware remediation strategies</li>
          <li>• Automatic resource reallocation</li>
          <li>• Prevention of issue recurrence through pattern learning</li>
        </ul>
      </div>
    </div>
  );
}