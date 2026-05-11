'use client';
import React, { useCallback, useState, useEffect } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
  enableOptimizations?: boolean;
}

const AdvancedPerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  children,
  enableOptimizations = true
}) => {
  const [isOptimized, setIsOptimized] = useState(false);
  const [optimizationMetrics, setOptimizationMetrics] = useState({
    imagesOptimized: 0,
    scriptsOptimized: 0,
    stylesOptimized: 0,
    totalOptimizations: 0
  });

  const optimizeImages = useCallback(() => {
    if (!enableOptimizations || typeof window === 'undefined') return;

    try {
      const images = document.querySelectorAll('img');
      let optimizedCount = 0;

      images.forEach((img) => {
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
          optimizedCount++;
        }
        if (!img.hasAttribute('decoding')) {
          img.setAttribute('decoding', 'async');
          optimizedCount++;
        }
      });

      setOptimizationMetrics(prev => ({
        ...prev,
        imagesOptimized: prev.imagesOptimized + optimizedCount
      }));
    } catch (error) {
      console.error('Image optimization error:', error);
    }
  }, [enableOptimizations]);

  const optimizeScripts = useCallback(() => {
    if (!enableOptimizations || typeof window === 'undefined') return;

    try {
      const scripts = document.querySelectorAll('script[src]');
      let optimizedCount = 0;

      scripts.forEach((script) => {
        if (!script.hasAttribute('defer') && !script.hasAttribute('async')) {
          script.setAttribute('defer', '');
          optimizedCount++;
        }
      });

      setOptimizationMetrics(prev => ({
        ...prev,
        scriptsOptimized: prev.scriptsOptimized + optimizedCount
      }));
    } catch (error) {
      console.error('Script optimization error:', error);
    }
  }, [enableOptimizations]);

  const optimizeStyles = useCallback(() => {
    if (!enableOptimizations || typeof window === 'undefined') return;

    try {
      const styles = document.querySelectorAll('link[rel="stylesheet"]');
      let optimizedCount = 0;

      styles.forEach((style) => {
        if (!style.hasAttribute('media')) {
          style.setAttribute('media', 'all');
          optimizedCount++;
        }
      });

      setOptimizationMetrics(prev => ({
        ...prev,
        stylesOptimized: prev.stylesOptimized + optimizedCount
      }));
    } catch (error) {
      console.error('Style optimization error:', error);
    }
  }, [enableOptimizations]);

  const runOptimizations = useCallback(() => {
    if (!enableOptimizations) return;

    optimizeImages();
    optimizeScripts();
    optimizeStyles();

    setOptimizationMetrics(prev => ({
      ...prev,
      totalOptimizations: prev.imagesOptimized + prev.scriptsOptimized + prev.stylesOptimized
    }));

    setIsOptimized(true);
  }, [enableOptimizations, optimizeImages, optimizeScripts, optimizeStyles]);

  useEffect(() => {
    if (enableOptimizations) {
      runOptimizations();
    }
  }, [runOptimizations, enableOptimizations]);

  return (
    <div className="performance-optimizer">
      {children}
      {enableOptimizations && (
        <div className="optimization-status">
          <h3>Optimization Status</h3>
          <p>Optimized: {isOptimized ? 'Yes' : 'No'}</p>
          <div className="metrics">
            <p>Images: {optimizationMetrics.imagesOptimized}</p>
            <p>Scripts: {optimizationMetrics.scriptsOptimized}</p>
            <p>Styles: {optimizationMetrics.stylesOptimized}</p>
            <p>Total: {optimizationMetrics.totalOptimizations}</p>
          </div>
        </div>
      )}
    </div>
  );
};

AdvancedPerformanceOptimizer.displayName = 'AdvancedPerformanceOptimizer';

export default AdvancedPerformanceOptimizer;