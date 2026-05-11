/**
 * Advanced Performance Monitoring Utility
 * Provides comprehensive performance tracking and optimization
 */
export interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
  totalBlockingTime: number;
  speedIndex: number;
  memoryUsage: number;
  networkRequests: number;
  domNodes: number;
  jsHeapSize: number;
  timestamp: number;
}

export interface PerformanceAlert {
  type: 'warning' | 'error' | 'info';
  message: string;
  metric: keyof PerformanceMetrics;
  value: number;
  threshold: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private alerts: PerformanceAlert[] = [];
  private observers: PerformanceObserver[] = [];
  private isMonitoring = false;

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers(): void {
    if (typeof window === 'undefined') return;

    // Observe navigation timing
    if ('PerformanceObserver' in window) {
      try {
        const navObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'navigation') {
              this.processNavigationTiming(entry as PerformanceNavigationTiming);
            }
          });
        });
        navObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navObserver);
      } catch { /* Handle error */ }
    }
  }

  private processNavigationTiming(entry: PerformanceNavigationTiming): void {
    const metrics: Partial<PerformanceMetrics> = {
      loadTime: entry.loadEventEnd - entry.loadEventStart,
      timeToInteractive: entry.domInteractive - entry.navigationStart,
      timestamp: Date.now()
    };
    this.addMetrics(metrics as PerformanceMetrics);
  }

  private addMetrics(newMetrics: PerformanceMetrics): void {
    this.metrics.push(newMetrics);
    this.checkThresholds(newMetrics);
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  private checkThresholds(metrics: PerformanceMetrics): void {
    const thresholds = {
      loadTime: 3000,
      firstContentfulPaint: 1500,
      largestContentfulPaint: 2500,
      firstInputDelay: 100,
      cumulativeLayoutShift: 0.1,
      timeToInteractive: 3800,
      totalBlockingTime: 200,
      speedIndex: 3000
    };

    Object.entries(thresholds).forEach(([key, threshold]) => {
      const value = metrics[key as keyof PerformanceMetrics];
      if (typeof value === 'number' && value > threshold) {
        this.addAlert({
          type: value > threshold * 1.5 ? 'error' : 'warning',
          message: `${key} exceeded threshold: ${value}ms > ${threshold}ms`,
          metric: key as keyof PerformanceMetrics,
          value,
          threshold,
          timestamp: Date.now()
        });
      }
    });
  }

  private addAlert(alert: PerformanceAlert): void {
    this.alerts.push(alert);
    if (this.alerts.length > 50) {
      this.alerts = this.alerts.slice(-50);
    }
  }

  public startMonitoring(): void {
    this.isMonitoring = true;
  }

  public stopMonitoring(): void {
    this.isMonitoring = false;
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  public getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  public getAlerts(): PerformanceAlert[] {
    return [...this.alerts];
  }

  public getLatestMetrics(): PerformanceMetrics | null {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : null;
  }

  public clearMetrics(): void {
    this.metrics = [];
    this.alerts = [];
  }

  public exportReport(): string {
    const latest = this.getLatestMetrics();
    const alerts = this.getAlerts();
    return JSON.stringify({
      latest,
      alerts,
      timestamp: Date.now(),
      totalMetrics: this.metrics.length
    }, null, 2);
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Auto-start monitoring in browser environment
if (typeof window !== 'undefined') {
  performanceMonitor.startMonitoring();
}