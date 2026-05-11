/**
 * Advanced Error Handling Utility
 * Provides comprehensive error tracking and recovery
 */

export interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  errorBoundary?: string;
  timestamp: number;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'javascript' | 'network' | 'resource' | 'promise' | 'react' | 'unknown';
}

export interface ErrorReport {
  errors: ErrorInfo[];
  totalErrors: number;
  criticalErrors: number;
  lastError?: ErrorInfo;
  errorRate: number;
  timestamp: number;
}

class ErrorHandler {
  private errors: ErrorInfo[] = [];
  private maxErrors = 100;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (typeof window === 'undefined') return;

    // Global error handler
    window.addEventListener('error', (event) => {
      this.handleError({
        message: event.message,
        stack: event.error?.stack,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        severity: this.determineSeverity(event.error),
        category: 'javascript'
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        severity: this.determineSeverity(event.reason),
        category: 'promise'
      });
    });

    this.isInitialized = true;
  }

  private determineSeverity(error: unknown): 'low' | 'medium' | 'high' | 'critical' {
    if (!error) return 'low';
    const message = error.message?.toLowerCase() || '';
    if (message.includes('chunk') || message.includes('loading') || message.includes('network')) {
      return 'critical';
    }
    if (message.includes('syntax') || message.includes('reference') || message.includes('type')) {
      return 'high';
    }
    if (message.includes('warning') || message.includes('deprecated')) {
      return 'medium';
    }
    return 'low';
  }

  private handleError(errorInfo: ErrorInfo): void {
    this.errors.push(errorInfo);
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }
    this.reportError(errorInfo);
  }

  private reportError(errorInfo: ErrorInfo): void {
    // Implement error reporting logic here
    if (errorInfo.severity === 'critical') { /* empty */ }
  }

  public logError(
    error: Error | string,
    componentStack?: string,
    errorBoundary?: string,
    additionalInfo?: Partial<ErrorInfo>
  ): void {
    const errorInfo: ErrorInfo = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      componentStack,
      errorBoundary,
      timestamp: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      severity: 'medium',
      category: 'react',
      ...additionalInfo
    };
    this.handleError(errorInfo);
  }

  public getErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  public getErrorReport(): ErrorReport {
    const criticalErrors = this.errors.filter(e => e.severity === 'critical').length;
    const lastError = this.errors.length > 0 ? this.errors[this.errors.length - 1] : undefined;
    return {
      errors: [...this.errors],
      totalErrors: this.errors.length,
      criticalErrors,
      lastError,
      errorRate: this.calculateErrorRate(),
      timestamp: Date.now()
    };
  }

  private calculateErrorRate(): number {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const recentErrors = this.errors.filter(e => e.timestamp > oneHourAgo);
    return recentErrors.length / 60;
  }

  public clearErrors(): void {
    this.errors = [];
  }

  public exportErrors(): string {
    return JSON.stringify(this.getErrorReport(), null, 2);
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();