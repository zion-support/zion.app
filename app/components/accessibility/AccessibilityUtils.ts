// Accessibility utility functions

export const addFocusIndicators = () => {
  const style = document.createElement('style');
  style.textContent = `
    *:focus {
      outline: 2px solid #3b82f6 !important;
      outline-offset: 2px !important;
    }
    
    .focus-visible {
      outline: 2px solid #3b82f6 !important;
      outline-offset: 2px !important;
    }
  `;
  document.head.appendChild(style);
};

export const improveKeyboardNavigation = () => {
  // Add keyboard navigation improvements
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });
};

export const addSkipLinks = () => {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50';
  document.body.insertBefore(skipLink, document.body.firstChild);
};

export const announceToScreenReader = (_message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = _message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

export const checkColorContrast = (foreground: string, background: string): boolean => {
  // Simple contrast ratio check (simplified version)
  const getLuminance = (color: string) => {
    const rgb = color.match(/\d+/g);
    if (!rgb) return 0;
    const [r, g, b] = rgb.map(Number);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  };
  
  const fgLuminance = getLuminance(foreground);
  const bgLuminance = getLuminance(background);
  const contrast = (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05);
  
  return contrast >= 4.5; // WCAG AA standard
};