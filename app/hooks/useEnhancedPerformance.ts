'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  loadTime: number;
  memoryUsage: number;
  renderCount: number;
}

interface UseEnhancedPerformanceOptions {
  trackPerformance?: boolean;
  trackMemory?: boolean;
  trackRenders?: boolean;
}

export function useEnhancedPerformance(options: UseEnhancedPerformanceOptions = {}) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    loadTime: 0,
    memoryUsage: 0,
    renderCount: 0
  });

  const renderStartRef = useRef<number>(0);
  const mountTimeRef = useRef<number>(0);
  const renderCountRef = useRef<number>(0);

  // Handle render completion
  const handleRender = useCallback(() => {
    const renderTime = performance.now() - renderStartRef.current;
    setMetrics(prev => ({ ...prev, renderTime }));
  }, []);

  // Track component load time
  useEffect(() => {
    if (options.trackPerformance) {
      mountTimeRef.current = performance.now();
      renderCountRef.current += 1;
      
      // Measure load time
      const measureLoadTime = () => {
        const loadTime = performance.now() - mountTimeRef.current;
        setMetrics(prev => ({ ...prev, loadTime }));
      };

      // Measure memory usage
      const measureMemoryUsage = () => {
        if ('memory' in performance) {
          const memory = (performance as { memory?: { usedJSHeapSize: number } }).memory;
          if (memory) {
            const memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
            setMetrics(prev => ({ ...prev, memoryUsage }));
          }
        }
      };

      // Track renders
      const trackRenders = () => {
        renderCountRef.current += 1;
        setMetrics(prev => ({ ...prev, renderCount: renderCountRef.current }));
      };

      // Set up performance monitoring
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure') {
            measureLoadTime();
            measureMemoryUsage();
            trackRenders();
          }
        }
      });

      observer.observe({ entryTypes: ['measure'] });

      // Cleanup
      return () => {
        observer.disconnect();
      };
    }
  }, [options.trackPerformance]);

  // Track render start
  const trackRenderStart = useCallback(() => {
    if (options.trackRenders) {
      renderStartRef.current = performance.now();
    }
  }, [options.trackRenders]);

  // Track render end
  const trackRenderEnd = useCallback(() => {
    if (options.trackRenders) {
      handleRender();
    }
  }, [options.trackRenders, handleRender]);

  return {
    metrics,
    trackRenderStart,
    trackRenderEnd
  };
}
