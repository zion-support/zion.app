'use client';

import React, { useCallback, useEffect, memo } from 'react';

interface ConsolidatedAccessibilityProps {
  className?: string;
}

const ConsolidatedAccessibility: React.FC<ConsolidatedAccessibilityProps> = memo(({ className = '' }) => {
  const addSkipLinks = useCallback(() => {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = 'position: absolute; top: -40px; left: 6px; z-index: 1000; background: #000; color: #fff; padding: 8px; text-decoration: none;';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }, []);

  const addFocusManagement = useCallback(() => {
    const trapFocus = (element: HTMLElement) => {
      const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      });
    };

    document.querySelectorAll('[role="dialog"]').forEach(modal => {
      trapFocus(modal as HTMLElement);
    });
  }, []);

  const enhanceARIA = useCallback(() => {
    document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(button => {
      if (!button.textContent?.trim()) {
        button.setAttribute('aria-label', 'Button');
      }
    });

    document.querySelectorAll('img:not([alt])').forEach(img => {
      img.setAttribute('alt', '');
    });

    document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])').forEach(input => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (!label) {
        input.setAttribute('aria-label', 'Input field');
      }
    });
  }, []);

  useEffect(() => {
    addSkipLinks();
    addFocusManagement();
    enhanceARIA();
  }, [addSkipLinks, addFocusManagement, enhanceARIA]);

  return (
    <div className={`consolidated-accessibility ${className}`}>
      {/* Accessibility enhancements */}
    </div>
  );
});

ConsolidatedAccessibility.displayName = 'ConsolidatedAccessibility';

export default ConsolidatedAccessibility;
