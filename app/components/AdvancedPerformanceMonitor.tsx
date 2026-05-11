'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState, useEffect } from 'react';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
  memory: number | null;
}

interface PerformanceMonitorProps {
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  enableRealTimeMonitoring?: boolean;
}

const AdvancedPerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  onMetricsUpdate,
  enableRealTimeMonitoring = true
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    memory: null
  });

  const measurePerformance = useCallback(() => {
    if (!enableRealTimeMonitoring || typeof window === 'undefined') return;

    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
          } else if (entry.entryType === 'first-input') {
            setMetrics(prev => ({ ...prev, fid: (entry as any).processingStart - entry.startTime }));
          } else if (entry.entryType === 'layout-shift') {
            if (!(entry as any).hadRecentInput) {
              setMetrics(prev => ({ ...prev, cls: (prev.cls || 0) + (entry as any).value }));
            }
          } else if (entry.name === 'first-contentful-paint') {
            setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
          } else if (entry.entryType === 'navigation') {
            const navEntry = entry as any;
            setMetrics(prev => ({ ...prev, ttfb: navEntry.responseStart - navEntry.requestStart }));
          }
        });
      });

      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift', 'paint', 'navigation'] });

      if ('memory' in performance) {
        const memory = (performance as any).memory;
        if (memory) {
          setMetrics(prev => ({
            ...prev,
            memory: memory.usedJSHeapSize / 1024 / 1024
          }));
        }
      }

      return () => observer.disconnect();
    } catch (error) {
      console.error('Performance monitoring error:', error);
    }
  }, [enableRealTimeMonitoring]);

  useEffect(() => {
    if (enableRealTimeMonitoring) {
      const cleanup = measurePerformance();
      return cleanup;
    }
  }, [measurePerformance, enableRealTimeMonitoring]);

  useEffect(() => {
    if (onMetricsUpdate) {
      onMetricsUpdate(metrics);
    }
  }, [metrics, onMetricsUpdate]);

  return (
    <div className="performance-monitor">
      <div className="metrics-display">
        <h3>Performance Metrics</h3>
        <ul>
          <li>FCP: {metrics.fcp ? `${metrics.fcp.toFixed(2)}ms` : 'N/A'}</li>
          <li>LCP: {metrics.lcp ? `${metrics.lcp.toFixed(2)}ms` : 'N/A'}</li>
          <li>FID: {metrics.fid ? `${metrics.fid.toFixed(2)}ms` : 'N/A'}</li>
          <li>CLS: {metrics.cls ? metrics.cls.toFixed(4) : 'N/A'}</li>
          <li>TTFB: {metrics.ttfb ? `${metrics.ttfb.toFixed(2)}ms` : 'N/A'}</li>
          <li>Memory: {metrics.memory ? `${metrics.memory.toFixed(2)}MB` : 'N/A'}</li>
        </ul>
      </div>
    </div>
  );
};

AdvancedPerformanceMonitor.displayName = 'AdvancedPerformanceMonitor';

export default AdvancedPerformanceMonitor;