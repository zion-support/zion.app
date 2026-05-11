import { useCallback, useEffect, useState, useRef } from 'react';

interface UsePerformanceMonitorOptions {
  enabled?: boolean;
  threshold?: number;
  measureMemoryUsage?: boolean;
}

interface PerformanceData {
  fps: number;
  memoryUsage: number;
  loadTime: number;
  renderTime: number;
}

export const usePerformanceMonitor = (options: UsePerformanceMonitorOptions = { /* empty */ }) => {
  const [metrics, setMetrics] = useState<PerformanceData>({
    fps: 0,
    memoryUsage: 0,
    loadTime: 0,
    renderTime: 0,
  });
  const [isMonitoringFPS, setIsMonitoringFPS] = useState(false);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

const measureMemoryUsage = useCallback(() => {
    // Measure memory usage
    let memoryUsage = 0;
    if ('memory' in performance) {
      const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;
      if (memory) {
        memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
      }
    }
    return memoryUsage;
}, []);

  const measurePerformance = useCallback(() => {
    // Measure performance metrics
    const startTime = performance.now();
    const memoryUsage = measureMemoryUsage();
    
    // Try to get navigation timing if available, otherwise use performance.now()
    const loadTime = performance.timing ? 
      performance.timing.loadEventEnd - performance.timing.navigationStart : 
      performance.now();
    
    // Update metrics with performance data
    setMetrics(prev => ({
      ...prev,
      loadTime,
      memoryUsage,
      renderTime: performance.now() - startTime
    }));
  }, [measureMemoryUsage]);

  const measureFPS = useCallback(() => {
    if (!isMonitoringFPS) return;

    frameCountRef.current++;
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTimeRef.current;

    if (deltaTime >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / deltaTime);
      setMetrics(prev => ({ ...prev, fps }));
      frameCountRef.current = 0;
      lastTimeRef.current = currentTime;
    }

    requestAnimationFrame(measureFPS);
  }, [isMonitoringFPS]);

  useEffect(() => {
    if (options.enabled) {
      setIsMonitoringFPS(true);
      measureFPS();
      measurePerformance();
    }

    return () => {
      setIsMonitoringFPS(false);
    }
  }, [options.enabled, measureFPS, measurePerformance]);

  return {
    metrics,
    isMonitoringFPS,triggerPerformanceMeasurement: measurePerformance,
  }
}