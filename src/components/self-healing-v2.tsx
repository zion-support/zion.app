'use client';

import React, { useState, useEffect } from 'react';

export default function SelfHealingV2() {
  const [activeIssues, setActiveIssues] = useState<Array<{ id: string; description: string; severity: string; resolved: boolean }>>([]);
  const [healingInProgress, setHealingInProgress] = useState(false);
  const [resolutionTime, setResolutionTime] = useState<null | string>(null);

  // Simulate healing progress
  useEffect(() => {
    if (!healingInProgress) return;
    const interval = setInterval(() => {
      const now = new Date();
      setResolutionTime(now.toLocaleTimeString());
      setActiveIssues(prev => {
        const remaining = prev.filter(issue => !issue.resolved);
        if (remaining.length === 0) {
          clearInterval(interval);
          setHealingInProgress(false);
        }
        return remaining;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [healingInProgress]);

  const startHealing = () => {
    if (healingInProgress) return;
    setHealingInProgress(true);
    setActiveIssues([
      { id: 'issue-001', description: 'High memory usage in background workers', severity: 'warning', resolved: false },
      { id: 'issue-002', description: 'Cache hit rate below optimal threshold', severity: 'medium', resolved: false },
    ]);
    setResolutionTime(null);
    // Auto‑resolve after a short timeout to demonstrate completion
    setTimeout(() => {
      setActiveIssues(prev => prev.map(issue => ({ ...issue, resolved: true })));
    }, 8000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-black';
      case 'medium':
        return 'bg-orange-500 text-black';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-300 text-gray-700';
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-indigo-200">
      <h2 className="text-2xl font-bold mb-4">Self‑Healing Dashboard</h2>
      <button
        onClick={startHealing}
        disabled={healingInProgress}
        className="px-4 py-2 bg-indigo-600 text-white rounded disabled:bg-indigo-400 mb-4"
      >
        {healingInProgress ? 'Healing…' : 'Start Healing'}
      </button>
      {resolutionTime && <p className="text-sm text-gray-600 mb-2">Last update: {resolutionTime}</p>}
      {activeIssues.length > 0 ? (
        <ul className="space-y-2">
          {activeIssues.map(issue => (
            <li key={issue.id} className={`p-3 rounded ${getSeverityColor(issue.severity)}`}>
              <strong>{issue.id}:</strong> {issue.description}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No active issues.</p>
      )}
    </div>
  );
}
