import { useState, useEffect } from 'react';
import { PerformanceEventTiming } from '../types/performance';

// Declare gtag function for Google Analytics
declare global {
  function gtag(...args: unknown[]): void;
}

// LayoutShift interface removed as it's not used

export const useMonitoring = () => {
  const [state, setState] = useState(null);
  
  useEffect(() => {
    // Hook implementation
  }, []);
  
  return { state, setState };
};

export interface ErrorReport {
  message: string;
  stack?: string;
  component?: string;
  timestamp: number;
  userAgent: string;
  url: string;
}

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  memory?: {
    used: string;
    total: string;
    limit: string;
  };
}

class MonitoringService {
  private metrics: PerformanceMetrics = { /* empty */ };
  private errors: ErrorReport[] = [];
  private observer: PerformanceObserver | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeMonitoring();
    }
  }

  private initializeMonitoring(): void {
    // Monitor Web Vitals
    this.monitorWebVitals();
    // Monitor Long Tasks
    this.monitorLongTasks();
    // Monitor Resource Loading
    this.monitorResourceTiming();
    // Global Error Handler
    this.setupErrorHandling();
  }

  private monitorWebVitals(): void {
    if ('PerformanceObserver' in window) {
      try {
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
          this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime || 0;
          this.reportMetric('lcp', this.metrics.lcp);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: PerformanceEntry) => {
            const fidEntry = entry as PerformanceEventTiming;
            this.metrics.fid = fidEntry.processingStart - fidEntry.startTime;
            this.reportMetric('fid', this.metrics.fid);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift
        let clsValue = 0;
        const clsObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach((entry: PerformanceEntry) => {
            const clsEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
            if (!clsEntry.hadRecentInput) {
              clsValue += clsEntry.value || 0;
              this.metrics.cls = clsValue;
              this.reportMetric('cls', clsValue);
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // First Contentful Paint
        const fcpObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            this.metrics.fcp = entry.startTime;
            this.reportMetric('fcp', entry.startTime);
          });
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
      } catch {
        // Handle error silently
      }
    }
  }

  private monitorLongTasks(): void {
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          // Handle long tasks - entries are processed but not used in this implementation
          const entries = list.getEntries();
          entries.forEach(() => {
            // Process entry if needed
          });
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch {
        // Long task API might not be available
      }
    }
  }

  private monitorResourceTiming(): void {
    if ('PerformanceObserver' in window) {
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: PerformanceResourceTiming) => {
            if (entry.duration > 1000) {
              // Handle slow resources
            }
          });
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
      } catch {
        // Handle error silently
      }
    }
  }

  private setupErrorHandling(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.logError({
        message: event.message,
        stack: event.error?.stack,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    });
  }

  private reportMetric(name: string, value: number): void {
    // Sample rate
    if (Math.random() > 0.1) {
      return;
    }

    // Send to analytics (if configured)
    if (typeof window !== 'undefined' && typeof (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag === 'function') {
      ((window as unknown as { gtag: (...args: unknown[]) => void }).gtag)('event', name, {
        value: Math.round(name === 'cls' ? value * 1000 : value),
        event_category: 'Web Vitals',
      });
    }
  }

  public logError(error: ErrorReport): void {
    this.errors.push(error);
    // Keep only last 50 errors
    if (this.errors.length > 50) {
      this.errors = this.errors.slice(-50);
    }
    // Send to error tracking service (if configured)
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getErrors(): ErrorReport[] {
    return [...this.errors];
  }

  public clearErrors(): void {
    this.errors = [];
  }

  public measureMemory(): void {
    if ('memory' in performance) {
      const memory = (performance as Performance & { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
      if (memory) {
        this.metrics.memory = {
          used: `${Math.round(memory.usedJSHeapSize / 1048576)}MB`,
          total: `${Math.round(memory.totalJSHeapSize / 1048576)}MB`,
          limit: `${Math.round(memory.jsHeapSizeLimit / 1048576)}MB`
        };
      }
    }
  }

  public measureNavigationTiming(): void {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        // Navigation Timing logged
        const timing = {
          'DNS Lookup': `${Math.round(navigation.domainLookupEnd - navigation.domainLookupStart)}ms`,
          'TCP Connect': `${Math.round(navigation.connectEnd - navigation.connectStart)}ms`,
          'TTFB': `${Math.round(navigation.responseStart - navigation.requestStart)}ms`,
          'Download': `${Math.round(navigation.responseEnd - navigation.responseStart)}ms`,
          'DOM Interactive': `${Math.round(navigation.domInteractive - navigation.fetchStart)}ms`,
          'DOM Complete': `${Math.round(navigation.domComplete - navigation.fetchStart)}ms`,
          'Load Complete': `${Math.round(navigation.loadEventEnd - navigation.fetchStart)}ms`
        };
        console.log('Navigation timing:', timing);
      }
    }
  }
}

// Singleton instance
const monitoring = new MonitoringService();
export default monitoring;
