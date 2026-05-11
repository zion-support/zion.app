// Performance API type definitions

export interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
  processingEnd: number;
  cancelable: boolean;
}

export interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
  lastInputTime: number;
  sources: LayoutShiftAttribution[];
}

export interface LayoutShiftAttribution {
  node?: Node;
  previousRect: DOMRectReadOnly;
  currentRect: DOMRectReadOnly;
}

// Extend the global PerformanceEntry interface
declare global {
  interface PerformanceEntry {
    // These properties are available on specific _entry types
    processingStart?: number;
    processingEnd?: number;
    cancelable?: boolean;
    value?: number;
    hadRecentInput?: boolean;
    lastInputTime?: number;
    sources?: LayoutShiftAttribution[];
  }
}