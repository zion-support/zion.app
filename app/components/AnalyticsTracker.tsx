/**
 * Live Analytics Tracker
 * Tracks visitor behavior in real-time
 * Priority: MEDIUM
 */

'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

type ScrollTrackingState = Record<number, boolean>;
type WindowWithScrollTracking = Window & { __scrollTracking?: ScrollTrackingState };

type AnalyticsEvent = {
  type: 'pageview' | 'click' | 'scroll' | 'time_on_page' | 'custom';
  category?: string;
  label?: string;
  value?: number;
  timestamp: number;
  url: string;
  referrer?: string;
  sessionId: string;
  viewport: { width: number; height: number };
  device: string;
};

const ANALYTICS_ENDPOINT = '/api/analytics';

function generateSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  const stored = sessionStorage.getItem('zion_session');
  if (stored) return stored;
  const newId = `sess-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem('zion_session', newId);
  return newId;
}

function getDeviceType(): string {
  if (typeof window === 'undefined') return 'server';
  const ua = navigator.userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry/i.test(ua)) return 'mobile';
  return 'desktop';
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const startTime = useRef(Date.now());
  const sessionId = useRef(generateSessionId());

  // Track page views
  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    const event: AnalyticsEvent = {
      type: 'pageview',
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : url,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      sessionId: sessionId.current,
      viewport: {
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0
      },
      device: getDeviceType()
    };

    // Store locally (for demo)
    try {
      const stored = JSON.parse(localStorage.getItem('zion_analytics') || '[]');
      stored.push(event);
      // Keep last 100 events
      if (stored.length > 100) stored.shift();
      localStorage.setItem('zion_analytics', JSON.stringify(stored));
    } catch {
      // Ignore local storage read/write failures for analytics buffering.
    }

    // Try to send to API
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ANALYTICS_ENDPOINT, JSON.stringify(event));
    }

    // Reset start time
    startTime.current = Date.now();
  }, [pathname, searchParams]);

  // Track scroll depth
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      // Track 25%, 50%, 75%, 100%
      const milestones = [25, 50, 75, 100];
      const w = window as WindowWithScrollTracking;
      const reached = milestones.find((m) => scrollPercent >= m && !w.__scrollTracking?.[m]);

      if (reached) {
        w.__scrollTracking = w.__scrollTracking ?? {};
        w.__scrollTracking[reached] = true;

        const event: AnalyticsEvent = {
          type: 'scroll',
          category: 'engagement',
          label: `scroll_${reached}%`,
          value: reached,
          timestamp: Date.now(),
          url: window.location.href,
          sessionId: sessionId.current,
          viewport: { width: window.innerWidth, height: window.innerHeight },
          device: getDeviceType()
        };

        try {
          const stored = JSON.parse(localStorage.getItem('zion_analytics') || '[]');
          stored.push(event);
          localStorage.setItem('zion_analytics', JSON.stringify(stored));
        } catch {
          // Ignore local storage failures; analytics should not break page usage.
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track time on page (when leaving)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeUnload = () => {
      const timeOnPage = Date.now() - startTime.current;
      
      const event: AnalyticsEvent = {
        type: 'time_on_page',
        category: 'engagement',
        label: 'time_on_page',
        value: Math.round(timeOnPage / 1000), // seconds
        timestamp: Date.now(),
        url: window.location.href,
        sessionId: sessionId.current,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        device: getDeviceType()
      };

      navigator.sendBeacon(ANALYTICS_ENDPOINT, JSON.stringify(event));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return null; // Invisible component
}

// Analytics Dashboard Hook
export function useAnalytics() {
  const getEvents = (type?: string): AnalyticsEvent[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = JSON.parse(localStorage.getItem('zion_analytics') || '[]');
      if (type) return stored.filter((e: AnalyticsEvent) => e.type === type);
      return stored;
    } catch {
      return [];
    }
  };

  const getPageViews = (): number => getEvents('pageview').length;
  
  const getAvgTimeOnPage = (): number => {
    const events = getEvents('time_on_page');
    if (events.length === 0) return 0;
    const total = events.reduce((sum: number, e: AnalyticsEvent) => sum + (e.value || 0), 0);
    return Math.round(total / events.length);
  };

  const getTopPages = (): Record<string, number> => {
    const events = getEvents('pageview');
    const pages: Record<string, number> = {};
    events.forEach((e: AnalyticsEvent) => {
      const url = new URL(e.url).pathname;
      pages[url] = (pages[url] || 0) + 1;
    });
    return pages;
  };

  return {
    getEvents,
    getPageViews,
    getAvgTimeOnPage,
    getTopPages
  };
}
