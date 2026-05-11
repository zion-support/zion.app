'use client';


import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Lazy load performance and monitoring components
const PerformanceMonitor = dynamic(() => import('./PerformanceMonitor'), {
  ssr: false,
  loading: () => null
});


const PerformanceOptimizer = dynamic(() => import('./PerformanceOptimizer'), {
  ssr: false,
  loading: () => null
});

const ServiceWorkerRegistration = dynamic(() => import('./ServiceWorkerRegistration'), {
  ssr: false,
  loading: () => null
});

const PerformanceMonitoring = dynamic(() => import('./PerformanceMonitoring'), {
  ssr: false,
  loading: () => null
});

const SEOOptimization = dynamic(() => import('./SEOOptimization'), {
  ssr: false,
  loading: () => null
});

// const SecurityEnhancement = dynamic(() => import('./SecurityEnhancement'), {
//   ssr: false,
//   loading: () => null
// });

const AdvancedPerformanceEnhancer = dynamic(() => import('./AdvancedPerformanceEnhancer'), {
  ssr: false,
  loading: () => null
});

// const EnhancedAccessibilityManager = dynamic(() => import('./EnhancedAccessibilityManager'), {
//   ssr: false,
//   loading: () => null
// });

const PerformanceOptimizations = dynamic(() => import('./PerformanceOptimizations'), {
  ssr: false,
  loading: () => null
});

interface ClientComponentsProps {
  children: React.ReactNode;
}

const ClientComponents: React.FC<ClientComponentsProps> = ({ children }) => {
  return (
    <AdvancedPerformanceEnhancer enableMonitoring={true} enableOptimizations={true}>
      {/* <EnhancedAccessibilityManager enableAutoDetection={true} enableKeyboardShortcuts={true}> */}
        <PerformanceOptimizer>
          {children}
          <Suspense fallback={null}>
            <PerformanceMonitor />
            <ServiceWorkerRegistration />
            <PerformanceMonitoring />
            <SEOOptimization />
            {/* <SecurityEnhancement /> */}
            <PerformanceOptimizations />
          </Suspense>
        </PerformanceOptimizer>
      {/* </EnhancedAccessibilityManager> */}
    </AdvancedPerformanceEnhancer>
  );
};

export default ClientComponents;