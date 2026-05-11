'use client';

import React, { useEffect, memo, useState } from 'react';

interface EnhancedAccessibilityManagerProps {
  enableAutoDetection?: boolean;
  enableKeyboardShortcuts?: boolean;
  enableScreenReaderOptimization?: boolean;
  enableHighContrastMode?: boolean;
  enableFocusManagement?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const EnhancedAccessibilityManager: React.FC<EnhancedAccessibilityManagerProps> = memo(({ 
  enableAutoDetection = true, enableKeyboardShortcuts = true, enableHighContrastMode = true, children
}) => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isScreenReaderActive, _setIsScreenReaderActive] = useState(false);

  useEffect(() => {
    if (enableAutoDetection) {
      // Check for missing alt attributes
      const images = document.querySelectorAll('img');
      images.forEach((img) => {
        if (!img.alt && !img.getAttribute('aria-label')) {
          // Log missing alt attributes
        }
      });

      // Check for missing form labels
      const inputs = document.querySelectorAll('input, textarea, select');
      inputs.forEach((input) => {
        const id = input.getAttribute('id');
        const ariaLabel = input.getAttribute('aria-label');
        const ariaLabelledBy = input.getAttribute('aria-labelledby');
        
        if (!id && !ariaLabel && !ariaLabelledBy) {
          // Log missing form labels
        }
      });

      // Check for proper heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let lastLevel = 0;
      headings.forEach((heading) => {
        const level = parseInt(heading.tagName.charAt(1));
        if (level > lastLevel + 1) {
          // Log heading hierarchy issues
        }
        lastLevel = level;
      });
    }
  }, [enableAutoDetection]);

  useEffect(() => {
    if (!enableHighContrastMode) return;

    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsHighContrast(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [enableHighContrastMode]);

  useEffect(() => {
    if (!enableKeyboardShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case 'h':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            // Focus on main heading
            const mainHeading = document.querySelector('h1');
            if (mainHeading) mainHeading.focus();
          }
          break;
        case 'n':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            // Focus on next heading
            const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
            const currentIndex = headings.indexOf(document.activeElement as Element);
            if (currentIndex < headings.length - 1) {
              (headings[currentIndex + 1] as HTMLElement).focus();
            }
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardShortcuts]);

  useEffect(() => {
    if (isHighContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    if (isScreenReaderActive) {
      document.body.classList.add('screen-reader-active');
    } else {
      document.body.classList.remove('screen-reader-active');
    }
  }, [isHighContrast, isScreenReaderActive]);

  return (
    <div className="accessibility-manager">
      {children}
    </div>
  );
});

EnhancedAccessibilityManager.displayName = 'EnhancedAccessibilityManager';

export default EnhancedAccessibilityManager;