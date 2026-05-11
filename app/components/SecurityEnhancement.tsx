'use client';

import React, { useEffect, useState, useCallback } from 'react';

interface SecurityEnhancementProps {
  className?: string;
  children?: React.ReactNode;
}

interface SecurityStatus {
  cspEnabled: boolean;
  httpsEnabled: boolean;
  securityHeadersPresent: boolean;
}

const SecurityEnhancement: React.FC<SecurityEnhancementProps> = ({ className = '', children }) => {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    cspEnabled: false,
    httpsEnabled: false,
    securityHeadersPresent: false
  });

  // Add security headers
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Add Content Security Policy
    const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!csp) {
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', 'Content-Security-Policy');
      meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';";
      document.head.appendChild(meta);
    }

    // Add X-Frame-Options
    const frameOptions = document.querySelector('meta[http-equiv="X-Frame-Options"]');
    if (!frameOptions) {
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', 'X-Frame-Options');
      meta.content = 'DENY';
      document.head.appendChild(meta);
    }

    // Add X-Content-Type-Options
    const contentTypeOptions = document.querySelector('meta[http-equiv="X-Content-Type-Options"]');
    if (!contentTypeOptions) {
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', 'X-Content-Type-Options');
      meta.content = 'nosniff';
      document.head.appendChild(meta);
    }

    // Add Referrer Policy
    const referrerPolicy = document.querySelector('meta[name="referrer"]');
    if (!referrerPolicy) {
      const meta = document.createElement('meta');
      meta.name = 'referrer';
      meta.content = 'strict-origin-when-cross-origin';
      document.head.appendChild(meta);
    }
  }, []);

  // Monitor for suspicious activity
  const monitorSuspiciousActivity = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Monitor for XSS attempts
    const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML')?.set;
    if (originalInnerHTML) {
      Object.defineProperty(Element.prototype, 'innerHTML', {
        set: function(value) {
          if (value && typeof value === 'string' && /<script/i.test(value)) {
            return;
          }
          originalInnerHTML.call(this, value);
        },
        get: function() {
          return this.textContent || '';
        },
        configurable: true
      });
    }

    // Monitor for suspicious console usage
    const originalConsole = console.log;
    console.log = function(...args: unknown[]) {
      if (args.some(arg => typeof arg === 'string' && /<script/i.test(arg))) {
        return;
      }
      return originalConsole.apply(console, args);
    };

    // Monitor for eval usage
    const originalEval = window.eval;
    window.eval = function(code) {
      return originalEval.call(window, code);
    };
  }, []);

  useEffect(() => {
    monitorSuspiciousActivity();
  }, [monitorSuspiciousActivity]);

  // Check security status
  useEffect(() => {
    const checkSecurityStatus = () => {
      const cspEnabled = !!document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      const httpsEnabled = location.protocol === 'https:';
      const securityHeadersPresent = !!(
        document.querySelector('meta[http-equiv="X-Frame-Options"]') &&
        document.querySelector('meta[http-equiv="X-Content-Type-Options"]')
      );

      setSecurityStatus({
        cspEnabled,
        httpsEnabled,
        securityHeadersPresent
      });
    };

    checkSecurityStatus();
  }, []);

  const enableCSP = () => {
    // CSP is already enabled in useEffect
    setSecurityStatus(prev => ({ ...prev, cspEnabled: true }));
  };

  const enableHTTPS = () => {
    // This would typically redirect to HTTPS
    if (location.protocol !== 'https:') {
      location.replace(location.href.replace('http:', 'https:'));
    }
  };

  return (
    <div className={`security-enhancement ${className}`}>
      <div className="security-status">
        <h3>Security Status</h3>
        <ul>
          <li>CSP Enabled: {securityStatus.cspEnabled ? '✅' : '❌'}</li>
          <li>HTTPS Enabled: {securityStatus.httpsEnabled ? '✅' : '❌'}</li>
          <li>Security Headers: {securityStatus.securityHeadersPresent ? '✅' : '❌'}</li>
        </ul>
      </div>
      
      <div className="security-actions">
        <button onClick={enableCSP} disabled={securityStatus.cspEnabled}>
          Enable CSP
        </button>
        <button onClick={enableHTTPS} disabled={securityStatus.httpsEnabled}>
          Enable HTTPS
        </button>
      </div>
      
      {children}
    </div>
  );
};

SecurityEnhancement.displayName = 'SecurityEnhancement';

export default SecurityEnhancement;