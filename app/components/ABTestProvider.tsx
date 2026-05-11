'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ABTestContextType {
  variant: (experimentId: string) => string;
  track: (experimentId: string, conversion: string) => void;
}

const ABTestContext = createContext<ABTestContextType | null>(null);

const STORAGE_KEY = 'zion_ab_tests';

function getStoredTests(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function ABTestProvider({ children }: { children: ReactNode }) {
  const [tests, setTests] = useState<Record<string, string>>({});

  useEffect(() => {
    setTests(getStoredTests());
  }, []);

  const variant = (experimentId: string): string => {
    if (tests[experimentId]) return tests[experimentId];
    
    // Assign variant (50% control, 25% a, 25% b)
    const rand = Math.random();
    const newVariant = rand < 0.5 ? 'control' : rand < 0.75 ? 'a' : 'b';
    
    const updated = { ...tests, [experimentId]: newVariant };
    setTests(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    return newVariant;
  };

  const track = (experimentId: string, conversion: string) => {
    console.log(`[AB Test] ${experimentId} -> ${conversion}: ${variant(experimentId)}`);
    // Send to analytics
    if (typeof window !== 'undefined') {
      const w = window as Window & { gtag?: (...args: unknown[]) => void };
      w.gtag?.('event', 'ab_test_conversion', {
        experiment_id: experimentId,
        variant: tests[experimentId] || 'control',
        conversion,
      });
    }
  };

  return (
    <ABTestContext.Provider value={{ variant, track }}>
      {children}
    </ABTestContext.Provider>
  );
}

export function useABTest() {
  const context = useContext(ABTestContext);
  if (!context) throw new Error('useABTest must be used within ABTestProvider');
  return context;
}
