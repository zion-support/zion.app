declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      NEXT_PUBLIC_ANALYTICS_ID?: string;
      NEXT_PUBLIC_GA_ID?: string;
      NEXT_PUBLIC_GTM_ID?: string;
    }
  }

  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }

  // Performance API types
  interface PerformanceEventTiming extends PerformanceEntry {
    processingStart: number;
    processingEnd: number;
    target: Node | null;
  }

  interface PerformanceObserver {
    observe(options?: PerformanceObserverInit): void;
    disconnect(): void;
    takeRecords(): PerformanceEntry[];
  }

  interface PerformanceObserverInit {
    entryTypes: string[];
    type?: string;
    buffered?: boolean;
  }

  var PerformanceObserver: {
    new (callback: PerformanceObserverCallback): PerformanceObserver;
    supportedEntryTypes: string[];
  };

  type PerformanceObserverCallback = (list: PerformanceObserverEntryList, observer: PerformanceObserver) => void;

  interface PerformanceObserverEntryList {
    getEntries(): PerformanceEntry[];
    getEntriesByType(type: string): PerformanceEntry[];
    getEntriesByName(name: string, type?: string): PerformanceEntry[];
  }
}

export { /* empty */ };