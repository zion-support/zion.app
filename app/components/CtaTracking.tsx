'use client';

import { useEffect } from 'react';

/**
 * Global CTA tracking via event delegation.
 * Listens for clicks on elements with data-cta-event and sends GA4 events.
 * Enables conversion funnel tracking without modifying every CTA individually.
 */
export default function CtaTracking() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const ctaEl = target.closest('[data-cta-event]') as HTMLElement | null;
      if (!ctaEl) return;

      const eventName = ctaEl.getAttribute('data-cta-event');
      const eventLabel = ctaEl.getAttribute('data-cta-label') || undefined;
      if (!eventName) return;

      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', eventName, {
          event_category: 'cta',
          event_label: eventLabel,
          value: 1,
        });
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return null;
}
