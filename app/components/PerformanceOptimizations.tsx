'use client';

import React, { useCallback, useEffect, memo } from 'react';

interface PerformanceOptimizationsProps {
  enableImageOptimization?: boolean;
  enablePreloading?: boolean;
  enableResourceHints?: boolean;
}

const PerformanceOptimizations: React.FC<PerformanceOptimizationsProps> = memo(({
  enableImageOptimization = true, enablePreloading = true, enableResourceHints = true
}) => {
  const __optimizeImages = useCallback(() => {
    if (!enableImageOptimization || typeof window === 'undefined') return;

    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.loading) {
        img.loading = 'lazy';
      }
      if (!img.decoding) {
        img.decoding = 'async';
      }
      if (img.getBoundingClientRect().top <= window.innerHeight && !img.hasAttribute('fetchpriority')) {
        img.setAttribute('fetchpriority', 'high');
      }
    });
  }, [enableImageOptimization]);

  const preloadCriticalResources = useCallback(() => {
    if (!enablePreloading || typeof window === 'undefined') return;

    const _criticalResources: Array<{
      href: string;
      as: string;
      type?: string;
      crossOrigin?: string;
    }> = [];

    _criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) link.type = resource.type;
      if (resource.crossOrigin) link.crossOrigin = resource.crossOrigin;
      document.head.appendChild(link);
    });
  }, [enablePreloading]);

  const addResourceHints = useCallback(() => {
    if (!enableResourceHints || typeof window === 'undefined') return;

    const _hints = [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'dns-prefetch', href: 'https://www.google-analytics.com' }
    ];

    _hints.forEach(hint => {
      const _link = document.createElement('link');
      _link.rel = hint.rel;
      _link.href = hint.href;
      if (hint.crossOrigin) _link.crossOrigin = hint.crossOrigin;
      document.head.appendChild(_link);
    });
  }, [enableResourceHints]);

  // Optimize scroll performance
  const optimizeScrollPerformance = useCallback(() => {
    if (typeof window === 'undefined') return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Throttled scroll handling
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Optimize resize performance
  const optimizeResizePerformance = useCallback(() => {
    if (typeof window === 'undefined') return;

    let ticking = false;
    const handleResize = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Throttled resize handling
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Intersection Observer for lazy loading
  const setupIntersectionObserver = useCallback(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          
          // Load images when they come into view
          if (element.tagName === 'IMG') {
            const img = element as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              observer.unobserve(element);
            }
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });

    // Observe all images with data-src
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach((img) => observer.observe(img));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    __optimizeImages();
    preloadCriticalResources();
    addResourceHints();
    const scrollCleanup = optimizeScrollPerformance();
    const resizeCleanup = optimizeResizePerformance();
    const observerCleanup = setupIntersectionObserver();

    return () => {
      scrollCleanup?.();
      resizeCleanup?.();
      observerCleanup?.();
    };
  }, [__optimizeImages, preloadCriticalResources, addResourceHints, optimizeScrollPerformance, optimizeResizePerformance, setupIntersectionObserver]);

  return null;
});

PerformanceOptimizations.displayName = 'PerformanceOptimizations';

export default PerformanceOptimizations;
