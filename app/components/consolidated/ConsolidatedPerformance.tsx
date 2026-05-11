'use client';

import React, { useCallback, useState, useEffect, memo } from 'react';

// Performance API types
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
  processingEnd: number;
  cancelable: boolean;
  target?: Node;
}

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
  lastInputTime: number;
  sources: LayoutShiftAttribution[];
  target?: Node;
}

interface ConsolidatedPerformanceProps {
  className?: string;
}

interface LayoutShiftAttribution {
  node?: Node;
  previousRect: DOMRectReadOnly;
  currentRect: DOMRectReadOnly;
}

const ConsolidatedPerformance: React.FC<ConsolidatedPerformanceProps> = memo(({
  className = ''
}) => {
  const [metrics, setMetrics] = useState({
    fcp: null as number | null,
    lcp: null as number | null,
    fid: null as number | null,
    cls: null as number | null,
    ttfb: null as number | null
  });

  const measurePerformance = useCallback(() => {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
          setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
        } else if (entry.entryType === 'largest-contentful-paint') {
          setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
        } else if (entry.entryType === 'first-input') {
          const fidEntry = entry as PerformanceEventTiming;
          setMetrics(prev => ({ ...prev, fid: fidEntry.processingStart - fidEntry.startTime }));
        } else if (entry.entryType === 'layout-shift') {
          const clsEntry = entry as LayoutShift;
          if (!clsEntry.hadRecentInput) {
            setMetrics(prev => ({ ...prev, cls: (prev.cls || 0) + clsEntry.value }));
          }
        } else if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          setMetrics(prev => ({ ...prev, ttfb: navEntry.responseStart - navEntry.requestStart }));
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift', 'navigation'] });
    } catch { /* Handle error */ }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Implement lazy loading for images
  const implementLazyLoading = useCallback(() => {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              observer.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }, []);

  // Optimize scroll performance
  const optimizeScrollPerformance = useCallback(() => {
    let ticking = false;
    
    const updateScrollPosition = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Update scroll position
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', updateScrollPosition, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', updateScrollPosition);
    };
  }, []);

  // Add resource hints
  const addResourceHints = useCallback(() => {
    const hints = [
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//cdnjs.cloudflare.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
    ];

    hints.forEach(hint => {
      const link = document.createElement('link');
      Object.assign(link, hint);
      document.head.appendChild(link);
    });
  }, []);

  // Monitor Core Web Vitals
  const monitorCoreWebVitals = useCallback(() => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
          }
          if (entry.entryType === 'first-input') {
            const fidEntry = entry as PerformanceEventTiming;
            const fid = fidEntry.processingStart - fidEntry.startTime;
            setMetrics(prev => ({ ...prev, fid }));
          }
          if (entry.entryType === 'layout-shift') {
            const clsEntry = entry as LayoutShift;
            setMetrics(prev => ({ ...prev, cls: clsEntry.value }));
          }
          if (entry.entryType === 'paint') {
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
            }
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift', 'paint'] });
      } catch { /* Handle error */ }
    }
  }, []);

  // Monitor TTFB
  const monitorTTFB = useCallback(() => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            setMetrics(prev => ({ ...prev, ttfb: navEntry.responseStart - navEntry.requestStart }));
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['navigation'] });
      } catch { /* Handle error */ }
    }
  }, []);

  useEffect(() => {
    const cleanup = measurePerformance();
    return cleanup;
  }, [measurePerformance]);

  useEffect(() => {
    implementLazyLoading();
    addResourceHints();
    monitorCoreWebVitals();
    monitorTTFB();
    const scrollCleanup = optimizeScrollPerformance();
    return scrollCleanup;
  }, [implementLazyLoading, addResourceHints, monitorCoreWebVitals, monitorTTFB, optimizeScrollPerformance]);

  // Log metrics for debugging (remove in production)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') { /* empty */ }
  }, [metrics]);

  return (
    <div className={`consolidated-performance ${className}`}>
      <h3>Performance Metrics</h3>
      <div className="metrics-grid">
        <div className="metric">
          <span>FCP: {metrics.fcp?.toFixed(2)}ms</span>
        </div>
        <div className="metric">
          <span>LCP: {metrics.lcp?.toFixed(2)}ms</span>
        </div>
        <div className="metric">
          <span>FID: {metrics.fid?.toFixed(2)}ms</span>
        </div>
        <div className="metric">
          <span>CLS: {metrics.cls?.toFixed(4)}</span>
        </div>
        <div className="metric">
          <span>TTFB: {metrics.ttfb?.toFixed(2)}ms</span>
        </div>
      </div>
    </div>
  );
});

ConsolidatedPerformance.displayName = 'ConsolidatedPerformance';

export default ConsolidatedPerformance;