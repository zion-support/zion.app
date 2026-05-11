const fs = require('fs');
const path = require('path');

// Files that need to be fixed
const filesToFix = [
  '/workspace/app/components/SecurityEnhancement.tsx',
  '/workspace/app/components/ServiceWorkerRegistration.tsx',
  '/workspace/app/components/consolidated/ConsolidatedPerformance.tsx'
];

// Template for SecurityEnhancement
const securityEnhancementTemplate = `'use client';

import React, { useEffect, memo, useCallback } from 'react';

interface SecurityEnhancementProps {
  className?: string;
}

const SecurityEnhancement: React.FC<SecurityEnhancementProps> = memo(({
  className = ''
}) => {
  const [securityStatus, setSecurityStatus] = useState({
    cspEnabled: false,
    hstsEnabled: false,
    xssProtection: false,
    clickjackingProtection: false
  });

  const checkSecurityHeaders = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Check Content Security Policy
    const cspEnabled = document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null;
    
    // Check HSTS
    const hstsEnabled = document.querySelector('meta[http-equiv="Strict-Transport-Security"]') !== null;
    
    // Check XSS Protection
    const xssProtection = document.querySelector('meta[http-equiv="X-XSS-Protection"]') !== null;
    
    // Check Clickjacking Protection
    const clickjackingProtection = document.querySelector('meta[name="X-Frame-Options"]') !== null;

    setSecurityStatus({
      cspEnabled,
      hstsEnabled,
      xssProtection,
      clickjackingProtection
    });
  }, []);

  const applySecurityEnhancements = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      // Disable eval and Function constructor
      const originalEval = window.eval;
      window.eval = () => {
        throw new Error('eval is disabled for security');
      };

      // Disable Function constructor
      const originalFunction = window.Function;
      window.Function = () => {
        throw new Error('Function constructor is disabled for security');
      };

      // Add security headers via meta tags
      const securityHeaders = [
        { name: 'Content-Security-Policy', content: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" },
        { name: 'X-Content-Type-Options', content: 'nosniff' },
        { name: 'X-Frame-Options', content: 'DENY' },
        { name: 'X-XSS-Protection', content: '1; mode=block' }
      ];

      securityHeaders.forEach(header => {
        if (!document.querySelector(\`meta[http-equiv="\${header.name}"]\`)) {
          const meta = document.createElement('meta');
          meta.setAttribute('http-equiv', header.name);
          meta.setAttribute('content', header.content);
          document.head.appendChild(meta);
        }
      });

      // console.log('Security enhancements applied');
    } catch (error) {
      // console.warn('Security enhancement error:', error);
    }
  }, []);

  useEffect(() => {
    checkSecurityHeaders();
    applySecurityEnhancements();
  }, [checkSecurityHeaders, applySecurityEnhancements]);

  return (
    <div className={\`security-enhancement \${className}\`}>
      <div className="security-status">
        <h3>Security Status</h3>
        <div className="security-item">
          <span>CSP Enabled: {securityStatus.cspEnabled ? 'Yes' : 'No'}</span>
        </div>
        <div className="security-item">
          <span>HSTS Enabled: {securityStatus.hstsEnabled ? 'Yes' : 'No'}</span>
        </div>
        <div className="security-item">
          <span>XSS Protection: {securityStatus.xssProtection ? 'Yes' : 'No'}</span>
        </div>
        <div className="security-item">
          <span>Clickjacking Protection: {securityStatus.clickjackingProtection ? 'Yes' : 'No'}</span>
        </div>
      </div>
    </div>
  );
});

SecurityEnhancement.displayName = 'SecurityEnhancement';

export default SecurityEnhancement;
`;

// Template for ServiceWorkerRegistration
const serviceWorkerRegistrationTemplate = `'use client';

import React, { memo, useEffect } from 'react';

const ServiceWorkerRegistration: React.FC = memo(() => {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          // console.log('Service Worker registered successfully:', registration);
        })
        .catch((error) => {
          // console.warn('Service Worker registration failed:', error);
        });
    }
  }, []);

  return null;
});

ServiceWorkerRegistration.displayName = 'ServiceWorkerRegistration';

export default ServiceWorkerRegistration;
`;

// Template for ConsolidatedPerformance
const consolidatedPerformanceTemplate = `'use client';

import React, { useEffect, memo, useCallback } from 'react';

interface ConsolidatedPerformanceProps {
  className?: string;
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
          const fidEntry = entry as any;
          setMetrics(prev => ({ ...prev, fid: fidEntry.processingStart - fidEntry.startTime }));
        } else if (entry.entryType === 'layout-shift') {
          const clsEntry = entry as any;
          if (!clsEntry.hadRecentInput) {
            setMetrics(prev => ({ ...prev, cls: (prev.cls || 0) + clsEntry.value }));
          }
        } else if (entry.entryType === 'navigation') {
          const navEntry = entry as any;
          setMetrics(prev => ({ ...prev, ttfb: navEntry.responseStart - navEntry.requestStart }));
        }
      }
    });

    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift', 'navigation'] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const cleanup = measurePerformance();
    return cleanup;
  }, [measurePerformance]);

  return (
    <div className={\`consolidated-performance \${className}\`}>
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
`;

// Fix files
function fixFiles() {
  const templates = {
    '/workspace/app/components/SecurityEnhancement.tsx': securityEnhancementTemplate,
    '/workspace/app/components/ServiceWorkerRegistration.tsx': serviceWorkerRegistrationTemplate,
    '/workspace/app/components/consolidated/ConsolidatedPerformance.tsx': consolidatedPerformanceTemplate
  };

  let fixedCount = 0;
  
  Object.entries(templates).forEach(([filePath, template]) => {
    try {
      fs.writeFileSync(filePath, template, 'utf8');
      console.log(`Fixed: ${filePath}`);
      fixedCount++;
    } catch (error) {
      console.error(`Error fixing ${filePath}:`, error.message);
    }
  });

  console.log(`\nFixed ${fixedCount} out of ${Object.keys(templates).length} files`);
}

fixFiles();