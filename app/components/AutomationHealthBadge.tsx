'use client';

import { useState, useEffect } from 'react';

type AutomationHealth = {
  generatedAt?: string;
  severity?: string;
  emaOpenIncidents?: number;
  sloScore?: number;
};

export default function AutomationHealthBadge() {
  const [health, setHealth] = useState<AutomationHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHealth() {
      try {
        const res = await fetch('/api/automation-health');
        if (res.ok) {
          const data = await res.json();
          setHealth(data);
        }
      } catch {
        // Fall back to default
      } finally {
        setLoading(false);
      }
    }
    fetchHealth();
  }, []);

  if (loading) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-600">
        <span className="w-2 h-2 mr-2 bg-slate-400 rounded-full animate-pulse"></span>
        Checking...
      </span>
    );
  }

  const severity = health?.severity || 'nominal';
  const score = health?.sloScore || 100;
  
  const colorMap: Record<string, string> = {
    nominal: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    critical: 'bg-red-100 text-red-800',
  };
  
  const dotMap: Record<string, string> = {
    nominal: 'bg-green-500',
    warning: 'bg-yellow-500',
    critical: 'bg-red-500',
  };

  const colors = colorMap[severity] || colorMap.nominal;
  const dot = dotMap[severity] || dotMap.nominal;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors}`}>
      <span className={`w-2 h-2 mr-2 ${dot} rounded-full`}></span>
      Auto-Health: {score}% ({severity})
    </span>
  );
}
