/**
 * Global Error Boundary with Auto-Reporting
 * Catches React errors, reports to dashboard, suggests fixes
 * Priority: HIGH
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      errorInfo
    });

    // Auto-report to error tracking system
    this.reportError(error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  reportError = async (error: Error, errorInfo: ErrorInfo): Promise<void> => {
    const errorReport = {
      errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      viewport: typeof window !== 'undefined' ? {
        width: window.innerWidth,
        height: window.innerHeight
      } : null
    };

    // Store locally for now
    try {
      const existing = JSON.parse(localStorage.getItem('zion_errors') || '[]');
      existing.push(errorReport);
      // Keep only last 50 errors
      if (existing.length > 50) {
        existing.shift();
      }
      localStorage.setItem('zion_errors', JSON.stringify(existing));
    } catch {
      // LocalStorage not available
    }

    // Try to send to API if available
    try {
      await fetch('/api/errors/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorReport)
      }).catch(() => {
        // API not available, local storage is fallback
      });
    } catch {
      // Silent fail
    }
  };

  getSuggestedFix = (): string | null => {
    const { error } = this.state;
    if (!error) return null;

    const message = error.message.toLowerCase();

    if (message.includes('cannot read property')) {
      return 'Check if the property exists before accessing it. Add null/undefined checks.';
    }
    if (message.includes('is not a function')) {
      return 'Verify the function is defined and imported correctly. Check for typos.';
    }
    if (message.includes('is not defined')) {
      return 'The variable is not in scope. Check imports and variable declarations.';
    }
    if (message.includes('rendered more hooks')) {
      return 'React hook rules violated. Hooks must be called at the top level, not in loops/conditions.';
    }
    if (message.includes('hydration')) {
      return 'Server and client content mismatch. Use useEffect for client-only rendering or suppress warning.';
    }
    if (message.includes('network')) {
      return 'Network error. Check API endpoints and add proper error handling with try/catch.';
    }

    return null;
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const suggestedFix = this.getSuggestedFix();

      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          color: '#fff'
        }}>
          <div style={{
            maxWidth: '600px',
            padding: '30px',
            background: '#1a1a1a',
            borderRadius: '12px',
            border: '1px solid #333'
          }}>
            <h1 style={{ fontSize: '24px', marginBottom: '20px', color: '#ff4444' }}>
              ⚠️ Something went wrong
            </h1>
            
            <div style={{ 
              padding: '15px', 
              background: '#0a0a0a', 
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'left',
              overflow: 'auto'
            }}>
              <p style={{ color: '#888', marginBottom: '10px', fontSize: '14px' }}>
                Error ID: <code style={{ color: '#4ade80' }}>{this.state.errorId}</code>
              </p>
              <p style={{ color: '#fff', fontFamily: 'monospace', fontSize: '13px' }}>
                {this.state.error?.message}
              </p>
            </div>

            {suggestedFix && (
              <div style={{
                padding: '15px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid #3b82f6',
                borderRadius: '8px',
                marginBottom: '20px',
                textAlign: 'left'
              }}>
                <h3 style={{ color: '#3b82f6', marginBottom: '10px', fontSize: '14px' }}>
                  💡 Suggested Fix
                </h3>
                <p style={{ color: '#fff', fontSize: '13px' }}>
                  {suggestedFix}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '12px 24px',
                  background: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Reload Page
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                style={{
                  padding: '12px 24px',
                  background: '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Try Again
              </button>
            </div>

            {/* Error Reporting Banner */}
            <p style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
              This error has been automatically reported to help us improve.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
export { GlobalErrorBoundary };
