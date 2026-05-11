'use client';

import { useState, useEffect } from 'react';

type DependencyStatus = {
  outdated: number;
  total: number;
  lastChecked: string;
};

export default function DependencyBadge() {
  const [deps, setDeps] = useState<DependencyStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated dependency check - in production this would call an API
    setDeps({
      outdated: 0,
      total: 247,
      lastChecked: new Date().toISOString(),
    });
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <span className="text-xs text-slate-500">Checking dependencies...</span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      {deps?.total} deps up to date
    </span>
  );
}
