'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      className="fixed bottom-20 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-purple-500/40 bg-slate-900/90 text-purple-300 shadow-lg shadow-purple-900/30 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-purple-400/70 hover:text-white hover:shadow-purple-700/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 sm:bottom-24 max-md:bottom-[7.5rem]"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
