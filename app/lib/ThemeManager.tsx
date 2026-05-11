/**
 * Smart Theme Manager
 * Auto-detects user preference and time of day
 * Priority: LOW (Quick win)
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('auto');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load saved preference
    const saved = localStorage.getItem('zion-theme') as Theme;
    if (saved) {
      setThemeState(saved);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const updateTheme = () => {
      let finalTheme: 'light' | 'dark';
      
      if (theme === 'auto') {
        // Check time of day (6AM - 6PM = light, else = dark)
        const hour = new Date().getHours();
        finalTheme = (hour >= 6 && hour < 18) ? 'light' : 'dark';
        
        // Override with system preference if available
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
          finalTheme = 'light';
        }
      } else {
        finalTheme = theme;
      }
      
      setActualTheme(finalTheme);
      document.documentElement.setAttribute('data-theme', finalTheme);
    };

    updateTheme();

    // Re-check every minute for auto theme
    const interval = setInterval(updateTheme, 60000);
    
    // Listen for system changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleChange = () => {
      if (theme === 'auto') updateTheme();
    };
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      clearInterval(interval);
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('zion-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, actualTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Theme Toggle Component
export function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('auto');
    else setTheme('light');
  };

  const icons = {
    light: '☀️',
    dark: '🌙',
    auto: '✨'
  };

  return (
    <button
      onClick={cycleTheme}
      style={{
        padding: '8px 12px',
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '8px',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}
      title={`Current: ${theme} (${actualTheme})`}
    >
      <span>{icons[theme]}</span>
      <span style={{ textTransform: 'capitalize' }}>{theme}</span>
    </button>
  );
}
