/**
 * Performance Optimizer
 * Comprehensive performance monitoring and optimization utilities
 */
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
  isOptimized: boolean;
  recommendations: string[];
}

export interface OptimizationOptions {
  enableImageOptimization?: boolean;
  enableLazyLoading?: boolean;
  enablePreloading?: boolean;
  enableCaching?: boolean;
  enableCompression?: boolean;
}

export class PerformanceOptimizer {
  private metrics: PerformanceMetrics = {
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    bundleSize: 0,
    isOptimized: false,
    recommendations: [],
  };

  private options: OptimizationOptions = {
    enableImageOptimization: true,
    enableLazyLoading: true,
    enablePreloading: true,
    enableCaching: true,
    enableCompression: true,
  };

  constructor(options?: OptimizationOptions) {
    if (options) {
      this.options = { ...this.options, ...options };
    }
    this.initializePerformanceMonitoring();
  }

  /**
   * Initialize performance monitoring
   */
  private initializePerformanceMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Monitor page load time
    window.addEventListener('load', () => {
      this.updateLoadTime();
      this.updateMemoryUsage();
      this.generateRecommendations();
    });

    // Monitor performance entries
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.processPerformanceEntry(entry);
        }
      });

      observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
    }
  }

  /**
   * Update load time metrics
   */
  public updateLoadTime(): void {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      }
    }
  }

  /**
   * Update memory usage metrics
   */
  public updateMemoryUsage(): void {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as { memory?: { usedJSHeapSize: number } }).memory;
      if (memory) {
        this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
      }
    }
  }

  /**
   * Process performance entry
   */
  private processPerformanceEntry(entry: PerformanceEntry): void {
    if (entry.entryType === 'paint') {
      if (entry.name === 'first-contentful-paint') {
        this.metrics.renderTime = entry.startTime;
      }
    }
  }

  /**
   * Optimize images
   */
  public optimizeImages(): void {
    if (typeof window === 'undefined' || !this.options.enableImageOptimization) return;

    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.loading) {
        img.loading = 'lazy';
      }
      if (!img.decoding) {
        img.decoding = 'async';
      }
    });
  }

  /**
   * Preload critical resources
   */
  public preloadCriticalResources(): void {
    if (typeof window === 'undefined' || !this.options.enablePreloading) return;

    const criticalResources: string[] = [];

    criticalResources.forEach((resource) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.css') ? 'style' : 'font';
      document.head.appendChild(link);
    });
  }

  /**
   * Enable caching
   */
  public enableCaching(): void {
    if (typeof window === 'undefined' || !this.options.enableCaching) return;

    // Set cache headers for static resources
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Cache-Control';
    meta.content = 'public, max-age=31536000';
    document.head.appendChild(meta);
  }

  /**
   * Generate optimization recommendations
   */
  public generateRecommendations(): void {
    const recommendations: string[] = [];

    if (this.metrics.loadTime > 3000) {
      recommendations.push('Consider optimizing page load time. Current: ' + Math.round(this.metrics.loadTime) + 'ms');
    }

    if (this.metrics.memoryUsage > 100) {
      recommendations.push('High memory usage detected. Consider optimizing JavaScript bundles.');
    }

    if (this.metrics.renderTime > 1000) {
      recommendations.push('Consider optimizing render time. Current: ' + Math.round(this.metrics.renderTime) + 'ms');
    }

    this.metrics.recommendations = recommendations;
  }

  /**
   * Apply all optimizations
   */
  public optimize(): void {
    this.optimizeImages();
    this.preloadCriticalResources();
    this.enableCaching();
    this.generateRecommendations();
    this.metrics.isOptimized = true;
  }

  /**
   * Get current metrics
   */
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get recommendations
   */
  public getRecommendations(): string[] {
    return [...this.metrics.recommendations];
  }
}

// Create singleton instance
export const _performanceOptimizer = new PerformanceOptimizer();
export default _performanceOptimizer;
