// Performance monitoring type definitions

declare global {
  interface PerformanceEventTiming extends PerformanceEntry {
    processingStart: number;
    processingEnd: number;
    cancelable: boolean;
    target?: EventTarget;
  }

  interface LayoutShift extends PerformanceEntry {
    value: number;
    hadRecentInput: boolean;
    lastInputTime: number;
    sources: LayoutShiftAttribution[];
  }

  interface LayoutShiftAttribution {
    node?: Node;
    previousRect: DOMRectReadOnly;
    currentRect: DOMRectReadOnly;
  }

  interface MemoryInfo {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  }

  interface Performance {
    memory?: MemoryInfo;
  }
}

export { /* empty */ };