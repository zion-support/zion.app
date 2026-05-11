

import React, { memo } from 'react';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';

const PerformanceDashboard: React.FC = memo(() => {
  const { metrics, getPerformanceScore } = usePerformanceMetrics();
  const score = getPerformanceScore();

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (typeof window === 'undefined') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="text-lg font-semibold mb-3">Performance Metrics</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Overall Score</span>
          <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreBgColor(score)} ${getScoreColor(score)}`}>
            {score}/100
          </span>
        </div>
        
        {metrics.fcp && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">FCP</span>
            <span className="text-sm font-mono">{metrics.fcp.toFixed(0)}ms</span>
          </div>
        )}
        
        {metrics.lcp && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">LCP</span>
            <span className="text-sm font-mono">{metrics.lcp.toFixed(0)}ms</span>
          </div>
        )}
        
        {metrics.fid && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">FID</span>
            <span className="text-sm font-mono">{metrics.fid.toFixed(0)}ms</span>
          </div>
        )}
        
        {metrics.cls && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">CLS</span>
            <span className="text-sm font-mono">{metrics.cls.toFixed(3)}</span>
          </div>
        )}
        
        {metrics.ttfb && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">TTFB</span>
            <span className="text-sm font-mono">{metrics.ttfb.toFixed(0)}ms</span>
          </div>
        )}
      </div>
    </div>
  );
});

PerformanceDashboard.displayName = 'PerformanceDashboard';

export default PerformanceDashboard;