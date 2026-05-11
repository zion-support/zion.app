'use client';
import { useCallback } from 'react';

// Performance monitoring utilities
export const usePerformanceMonitor = () => {
  const measurePerformance = useCallback((name: string, fn: () => void) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const start = performance.now();
      fn();
      const end = performance.now();
      console.log(`${name} took ${end - start}ms`);
    } else {
      fn();
    }
  }, []);

  const measureAsyncPerformance = useCallback(async (name: string, fn: () => Promise<void>) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const start = performance.now();
      await fn();
      const end = performance.now();
      console.log(`${name} took ${end - start}ms`);
    } else {
      await fn();
    }
  }, []);

  return { measurePerformance, measureAsyncPerformance };
};

// Memoization utilities - these are not React hooks, just utility functions
export const createStableCallback = <T extends (...args: unknown[]) => unknown>(callback: T): T => {
  return callback;
};

export const createStableMemo = <T>(factory: () => T): T => {
  return factory();
};

// Simple performance utilities
export const measurePerformance = (name: string, fn: () => void) => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name} took ${end - start}ms`);
  } else {
    fn();
  }
};

export const measureAsyncPerformance = async (name: string, fn: () => Promise<void>) => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    console.log(`${name} took ${end - start}ms`);
  } else {
    await fn();
  }
};