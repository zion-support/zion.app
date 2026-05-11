import React from 'react';

export const performance = {
  measure: (name: string, fn: () => void) => {
    const start = Date.now();
    fn();
    const end = Date.now();
    console.log(`${name} took ${end - start}ms`);
  }
};

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics = new Map<string, number>();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTiming(label: string): void {
    if (typeof window !== "undefined" && "performance" in window) {
      performance.mark(`${label}-start`);
    }
  }

  endTiming(label: string): number {
    if (typeof window !== "undefined" && "performance" in window) {
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);
      const measure = performance.getEntriesByName(label)[0];
      const duration = measure ? measure.duration : 0;
      this.metrics.set(label, duration);
      return duration;
    }
    return 0;
  }

  getMetric(label: string): number | undefined {
    return this.metrics.get(label);
  }

  getAllMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  clearMetrics(): void {
    this.metrics.clear();
  }

  // Web Vitals monitoring
  measureWebVitals(): void {
    if (typeof window === "undefined") return;

    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.set("LCP", lastEntry.startTime);
    }).observe({ entryTypes: ["largest-contentful-paint"] });

    // First Input Delay
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        // Use processingStart if available, otherwise calculate from startTime
        const processingStart = (entry as { processingStart?: number }).processingStart || entry.startTime;
        this.metrics.set("FID", processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ["first-input"] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (!(entry as { hadRecentInput?: boolean }).hadRecentInput) {
          clsValue += (entry as { value?: number }).value || 0;
        }
      });
      this.metrics.set("CLS", clsValue);
    }).observe({ entryTypes: ["layout-shift"] });
  }
}

// Hook for React components
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance();
  return {
    startTiming: monitor.startTiming.bind(monitor),
    endTiming: monitor.endTiming.bind(monitor),
    getMetric: monitor.getMetric.bind(monitor),
    getAllMetrics: monitor.getAllMetrics.bind(monitor)
  };
}

// Utility function to measure component render time
export function measureComponentRender(componentName: string) {
  return function <T extends React.ComponentType<unknown>>(PageComponent: T): T {
    return ((props: unknown) => {
      const monitor = PerformanceMonitor.getInstance();
      React.useEffect(() => {
        monitor.startTiming(`${componentName}-render`);
        return () => {
          monitor.endTiming(`${componentName}-render`);
        };
      });
      return React.createElement(PageComponent, props);
    }) as T;
  };
}