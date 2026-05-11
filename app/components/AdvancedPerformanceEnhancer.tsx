'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';

// Type definitions for performance APIs
// interface PerformanceEventTiming extends PerformanceEntry {
//   processingStart: number;
//   processingEnd: number;
//   target: EventTarget | null;
// }

// interface LayoutShift extends PerformanceEntry {
//   value: number;
//   hadRecentInput: boolean;
//   lastInputTime: number;
//   sources: LayoutShiftAttribution[];
// }

// interface LayoutShiftAttribution {
//   node?: Node;
//   previousRect: DOMRectReadOnly;
//   currentRect: DOMRectReadOnly;
// }

interface PerformanceMetrics {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  fcp: number | null;
  ttfb: number | null;
  memoryUsage: number | null;
  connectionSpeed: string | null;
}

interface AdvancedPerformanceEnhancerProps {
  children: React.ReactNode;
  enableMonitoring?: boolean;
  enableOptimizations?: boolean;
}

export const AdvancedPerformanceEnhancer: React.FC<AdvancedPerformanceEnhancerProps> = ({
  children, enableMonitoring = true, enableOptimizations = true }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    memoryUsage: null,
    connectionSpeed: null
  });
  // const [isOptimized, setIsOptimized] = useState(false);

  const measurePerformance = useCallback(() => {
    if (!enableMonitoring || typeof window === 'undefined') return;

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
            memoryUsage: memory.usedJSHeapSize / 1024 / 1024
          }));
        }
      }

      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          setMetrics(prev => ({
            ...prev,
            connectionSpeed: connection.effectiveType || 'unknown'
          }));
        }
      }
    } catch { /* Handle error */ }
  }, [enableMonitoring]);

  useEffect(() => {
    if (enableMonitoring) {
      const cleanup = measurePerformance();
      return cleanup;
    }
  }, [measurePerformance, enableMonitoring]);

  const optimizePerformance = useCallback(() => {
    if (!enableOptimizations || typeof window === 'undefined') return;

    try {
      // Preload critical resources
      const criticalResources: string[] = [];

      criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.endsWith('.woff2') ? 'font' : 'image';
        if (resource.endsWith('.woff2')) {
          link.crossOrigin = 'anonymous';
        }
        document.head.appendChild(link);
      });

      // Optimize images
      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => {
        const src = img.getAttribute('data-src');
        if (src) {
          img.setAttribute('src', src);
          img.removeAttribute('data-src');
        }
      });

      // Lazy load non-critical resources
      const lazyElements = document.querySelectorAll('[data-lazy]');
      const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const src = element.getAttribute('data-lazy');
            if (src && element.tagName === 'IMG') {
              (element as HTMLImageElement).src = src;
              element.removeAttribute('data-lazy');
            }
            lazyObserver.unobserve(element);
          }
        });
      });
      
      // Observe all lazy elements
      lazyElements.forEach(element => lazyObserver.observe(element));
    } catch { /* Handle error */ }
  }, [enableOptimizations]);

  useEffect(() => {
    if (enableOptimizations) {
      optimizePerformance();
    }
  }, [measurePerformance, enableMonitoring]);

  // Log performance metrics for debugging
  useEffect(() => {
    if (enableMonitoring && Object.values(metrics).some(value => value !== null)) { /* empty */ }
  }, [metrics, enableMonitoring]);

  return (
    <div className="performance-enhancer">
      {children}
      {enableMonitoring && (
        <div className="performance-metrics" style={{ display: 'none' }}>
          {JSON.stringify(metrics)}
        </div>
      )}
    </div>
  );
};

AdvancedPerformanceEnhancer.displayName = 'AdvancedPerformanceEnhancer';

export default AdvancedPerformanceEnhancer;