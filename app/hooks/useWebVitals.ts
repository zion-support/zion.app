
import { useEffect } from 'react';

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
      // Use the existing monitoring service instead of web-vitals
      // This avoids API compatibility issues

    }
  }, [onPerfEntry]);
};

export const reportWebVitals = (metric: WebVitalsMetric) => {
  if (process.env.NODE_ENV === 'development') { /* empty */ }
  
  // Send to analytics
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = (window as { gtag: (...args: unknown[]) => void }).gtag;
    gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }
};