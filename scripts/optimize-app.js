#!/usr/bin/env node

/**
 * App Optimization Script
 * Automatically optimizes the application for better performance
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
// import { fileURLToPath } from 'url';

// const filename = fileURLToPath(import.meta.url);
// const dirname = path.dirname(filename);

class AppOptimizer {
  constructor() {
    this.optimizations = [];
    this.errors = [];
  }

  async run() {
    console.log('🚀 Starting App Optimization...\n');

    try {
      await this.optimizeImages();
      await this.optimizeComponents();
      await this.optimizeBundle();
      await this.addPerformanceHooks();
      await this.optimizeCSS();
      await this.generateOptimizationReport();
      
      console.log('\n✅ App optimization completed!');
      console.log(`📊 Applied ${this.optimizations.length} optimizations`);
      if (this.errors.length > 0) {
        console.log(`⚠️  ${this.errors.length} errors encountered`);
      }
    } catch (error) {
      console.error('❌ App optimization failed:', error.message);
      process.exit(1);
    }
  }

  async optimizeImages() {
    console.log('🖼️  Optimizing images...');
    
    try {
      // Check if sharp is installed
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      if (!packageJson.dependencies.sharp && !packageJson.devDependencies.sharp) {
        console.log('   Installing sharp for image optimization...');
        execSync('npm install sharp', { stdio: 'inherit' });
        this.optimizations.push('Installed sharp for image optimization');
      }

      // Create image optimization utility
      const imageUtilsPath = path.join(process.cwd(), 'app/utils/image-optimization.ts');
      if (!fs.existsSync(imageUtilsPath)) {
        const imageUtils = `import { ImageLoader } from 'next/image';

export const imageLoader: ImageLoader = ({ src, width, quality }) => {
  const params = new URLSearchParams();
  params.set('w', width.toString());
  if (quality) {
    params.set('q', quality.toString());
  }
  return \`\${src}?\${params.toString()}\`;
};

export const imageOptimizationConfig = {
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  formats: ['image/webp', 'image/avif'],
  minimumCacheTTL: 60,
  dangerouslyAllowSVG: true,
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
};`;
        
        fs.writeFileSync(imageUtilsPath, imageUtils);
        this.optimizations.push('Created image optimization utilities');
      }

      console.log('   ✅ Image optimization configured');
    } catch (error) {
      this.errors.push(`Image optimization failed: ${error.message}`);
    }
  }

  async optimizeComponents() {
    console.log('⚛️  Optimizing React components...');
    
    try {
      // Create optimized component wrapper
      const optimizedWrapperPath = path.join(process.cwd(), 'app/components/OptimizedWrapper.tsx');
      if (!fs.existsSync(optimizedWrapperPath)) {
        const optimizedWrapper = `'use client';

import React, { memo, Suspense, lazy } from 'react';

interface OptimizedWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  lazy?: boolean;
}

const OptimizedWrapper: React.FC<OptimizedWrapperProps> = memo(({ 
  children, 
  fallback = <div>Loading...</div>,
  lazy: isLazy = false 
}) => {
  if (isLazy) {
    return (
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    );
  }

  return <>{children}</>;
});

OptimizedWrapper.displayName = 'OptimizedWrapper';

export default OptimizedWrapper;`;
        
        fs.writeFileSync(optimizedWrapperPath, optimizedWrapper);
        this.optimizations.push('Created OptimizedWrapper component');
      }

      // Create performance hook
      const performanceHookPath = path.join(process.cwd(), 'app/hooks/usePerformance.ts');
      if (!fs.existsSync(performanceHookPath)) {
        const performanceHook = `import { useEffect, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
}

export const usePerformance = (componentName: string) => {
  const renderStart = useRef<number>(0);
  const renderCount = useRef<number>(0);

  useEffect(() => {
    renderStart.current = performance.now();
    renderCount.current += 1;

    return () => {
      const renderTime = performance.now() - renderStart.current;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(\`\${componentName} render #\${renderCount.current}: \${renderTime.toFixed(2)}ms\`);
      }

      // Report slow renders
      if (renderTime > 16) { // 60fps threshold
        console.warn(\`Slow render detected in \${componentName}: \${renderTime.toFixed(2)}ms\`);
      }
    };
  });

  const measureAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await asyncFn();
      const duration = performance.now() - start;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(\`\${operationName} completed in \${duration.toFixed(2)}ms\`);
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(\`\${operationName} failed after \${duration.toFixed(2)}ms:\`, error);
      throw error;
    }
  }, []);

  return { measureAsync };
};`;
        
        fs.writeFileSync(performanceHookPath, performanceHook);
        this.optimizations.push('Created usePerformance hook');
      }

      console.log('   ✅ Component optimization completed');
    } catch (error) {
      this.errors.push(`Component optimization failed: ${error.message}`);
    }
  }

  async optimizeBundle() {
    console.log('📦 Optimizing bundle...');
    
    try {
      // Create Next.js config optimizations
      const nextConfigPath = path.join(process.cwd(), 'next.config.js');
      let nextConfig = '';
      
      if (fs.existsSync(nextConfigPath)) {
        nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
      }

      // Add performance optimizations to Next.js config
      const optimizations = `
// Performance optimizations
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'FID', 'TTFB'],
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Headers for better caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);`;

      if (!nextConfig.includes('experimental')) {
        fs.writeFileSync(nextConfigPath, optimizations);
        this.optimizations.push('Added performance optimizations to Next.js config');
      }

      console.log('   ✅ Bundle optimization completed');
    } catch (error) {
      this.errors.push(`Bundle optimization failed: ${error.message}`);
    }
  }

  async addPerformanceHooks() {
    console.log('🎣 Adding performance hooks...');
    
    try {
      // Create performance monitoring hook
      const monitoringHookPath = path.join(process.cwd(), 'app/hooks/useWebVitals.ts');
      if (!fs.existsSync(monitoringHookPath)) {
        const monitoringHook = `import { useEffect } from 'react';

interface WebVitalsMetric {
  name: string;
  value: number;
  delta: number;
  id: string;
  navigationType: string;
}

export const useWebVitals = (onPerfEntry?: (metric: WebVitalsMetric) => void) => {
  useEffect(() => {
    if (onPerfEntry && typeof window !== 'undefined') {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);
      });
    }
  }, [onPerfEntry]);
};

export const reportWebVitals = (metric: WebVitalsMetric) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric);
  }
  
  // Send to analytics
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }
};`;
        
        fs.writeFileSync(monitoringHookPath, monitoringHook);
        this.optimizations.push('Created useWebVitals hook');
      }

      console.log('   ✅ Performance hooks added');
    } catch (error) {
      this.errors.push(`Performance hooks failed: ${error.message}`);
    }
  }

  async optimizeCSS() {
    console.log('🎨 Optimizing CSS...');
    
    try {
      // Create CSS optimization utilities
      const cssUtilsPath = path.join(process.cwd(), 'app/utils/css-optimization.ts');
      if (!fs.existsSync(cssUtilsPath)) {
        const cssUtils = `// CSS optimization utilities

export const criticalCSS = \`
  /* Critical CSS for above-the-fold content */
  .min-h-screen { min-height: 100vh; }
  .bg-slate-900 { background-color: rgb(15 23 42); }
  .text-white { color: rgb(255 255 255); }
  .flex { display: flex; }
  .items-center { align-items: center; }
  .justify-center { justify-content: center; }
  .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
\`;

export const preloadCriticalStyles = () => {
  if (typeof window !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    style.setAttribute('data-critical', 'true');
    document.head.insertBefore(style, document.head.firstChild);
  }
};

export const loadNonCriticalCSS = () => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/styles.css';
    link.media = 'print';
    link.onload = () => {
      link.media = 'all';
    };
    document.head.appendChild(link);
  }
};`;
        
        fs.writeFileSync(cssUtilsPath, cssUtils);
        this.optimizations.push('Created CSS optimization utilities');
      }

      console.log('   ✅ CSS optimization completed');
    } catch (error) {
      this.errors.push(`CSS optimization failed: ${error.message}`);
    }
  }

  async generateOptimizationReport() {
    const report = {
      timestamp: new Date().toISOString(),
      optimizations: this.optimizations,
      errors: this.errors,
      summary: {
        totalOptimizations: this.optimizations.length,
        totalErrors: this.errors.length,
        success: this.errors.length === 0
      }
    };

    const reportPath = path.join(process.cwd(), 'optimization-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('   📊 Optimization report saved to: optimization-report.json');
  }
}

// Run the optimizer
if (import.meta.url === `file://${process.argv[1]}`) {
  const optimizer = new AppOptimizer();
  optimizer.run().catch(console.error);
}

export default AppOptimizer;