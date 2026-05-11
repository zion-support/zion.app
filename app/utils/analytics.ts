'use client';
import React from 'react';

// Analytics utilities for tracking user interactions and performance
interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp?: number;
  custom_parameters?: Record<string, unknown>;
}

class Analytics {
  private static instance: Analytics;
  private events: AnalyticsEvent[] = [];

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  // Track custom events
  track(event: AnalyticsEvent): void {
    this.events.push({
      ...event,
      timestamp: Date.now()
    });

    // In production, you would send this to your analytics service
    if (process.env.NODE_ENV === "production") {
      this.sendToAnalytics(event);
    } else { /* empty */ }
  }

  // Track page views
  trackPageView(page: string, title?: string): void {
    this.track({
      category: "Page",
      action: "View",
      label: page,
      custom_parameters: {
        page_title: title || document.title,
        page_url: window.location.href
      }
    });
  }

  // Track user interactions
  trackClick(element: string, location?: string): void {
    this.track({
      category: "User Interaction",
      action: "Click",
      label: element,
      custom_parameters: {
        location
      }
    });
  }

  // Track form submissions
  trackFormSubmission(formName: string, success: boolean): void {
    this.track({
      category: "Form",
      action: success ? "Submit Success" : "Submit Error",
      label: formName
    });
  }

  // Track performance metrics
  trackPerformance(metric: string, value: number, unit: string = "ms"): void {
    this.track({
      category: "Performance",
      action: "Metric",
      label: metric,
      value,
      custom_parameters: {
        unit
      }
    });
  }

  // Track errors
  trackError(error: Error, context?: string): void {
    this.track({
      category: "Error",
      action: "Occurred",
      label: error.message,
      custom_parameters: {
        error_name: error.name,
        error_stack: error.stack,
        context
      }
    });
  }

  // Get all events
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  // Clear events
  clearEvents(): void {
    this.events = [];
  }

  // Send to analytics service (implement based on your analytics provider)
  private sendToAnalytics(event: AnalyticsEvent): void {
    // Example implementation for Google Analytics
    if (typeof window !== "undefined" && (window as unknown as { gtag: (..._args: unknown[]) => void }).gtag) {
      (window as unknown as { gtag: (..._args: unknown[]) => void }).gtag("event", event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters
      });
    }
  }
}

export const analytics = Analytics.getInstance();

// React hooks for easy integration
export function useAnalytics() {
  return {
    track: analytics.track.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackClick: analytics.trackClick.bind(analytics),
    trackFormSubmission: analytics.trackFormSubmission.bind(analytics),
    trackPerformance: analytics.trackPerformance.bind(analytics),
    trackError: analytics.trackError.bind(analytics)
  };
}

// Higher-order component for automatic page view tracking
export function withAnalytics<T extends React.ComponentType<unknown>>(PageComponent: T): T {
  return ((props: unknown) => {
    const {trackPageView} = useAnalytics();
    React.useEffect(() => {
      trackPageView(window.location.pathname, document.title);
    }, [trackPageView]);
    return React.createElement(PageComponent, props);
  }) as T;
}