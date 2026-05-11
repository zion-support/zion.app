'use client';

import React, { useEffect } from 'react';

// Performance API types
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
  processingEnd: number;
  target?: Node;
}

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
  target?: Node;
}

interface PerformanceOptimizerProps {
  children: React.ReactNode;
  enableOptimizations?: boolean;
}

const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  children, enableOptimizations = true
}) => {
  useEffect(() => {
    if (!enableOptimizations || typeof window === 'undefined') return;

    // Preload critical resources
    const criticalResources: Array<{
      href: string;
      as: string;
      type?: string;
      crossOrigin?: string;
    }> = [];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) link.type = resource.type;
      if (resource.crossOrigin) link.crossOrigin = resource.crossOrigin;
      document.head.appendChild(link);
    });

    // Optimize images with lazy loading
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach((img) => imageObserver.observe(img));
    };

    // Add performance monitoring
    const monitorPerformance = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        // Monitor Core Web Vitals
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') { /* empty */ }
            if (entry.entryType === 'first-input') {
              const firstInput = entry as PerformanceEventTiming;
              console.log('First Input Delay:', firstInput.processingStart - firstInput.startTime);
            }
            if (entry.entryType === 'layout-shift') {
              const layoutShift = entry as LayoutShift;
              console.log('Layout Shift:', layoutShift.value);
            }
          });
        });

        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
      }
    };

    // Call the functions
    optimizeImages();
    monitorPerformance();

    // Optimize images
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.decoding) {
        img.decoding = 'async';
      }
    });
    
    // Call the functions
    optimizeImages();
    monitorPerformance();

    // Call the optimization functions
    optimizeImages();
    monitorPerformance();

    // Enable service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker registration failed
      });
    }
  }, [enableOptimizations]);

  return (
    <div className="performance-optimizer">
      {children}
    </div>
  );
};

export default PerformanceOptimizer;
