'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * Sticky CTA bar visible on mobile after scrolling past the hero.
 * Keeps "Start Project" accessible without cluttering the header.
 */
export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling ~400px (past hero on mobile)
      setVisible(window.scrollY > 400 && window.innerWidth < 768);
    };

    handleScroll(); // Initial check
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 flex justify-center border-t border-purple-500/20 bg-slate-900/95 px-4 py-3 backdrop-blur-md md:hidden"
      role="banner"
      aria-label="Quick action"
    >
      <a
        href="/contact?topic=project&source=sticky-mobile"
        data-cta-event="cta_primary"
        data-cta-label="sticky_mobile"
        className="flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 transition hover:from-purple-500 hover:to-pink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
      >
        Start a Project
        <ArrowRight className="h-4 w-4" aria-hidden />
      </a>
    </div>
  );
}
