'use client';

import { useCallback, useEffect, useState } from 'react';

interface ReadingProgressBarProps {
  /** CSS selector for the scroll container (default: document) */
  target?: string;
  /** Bar color class (default: purple gradient) */
  className?: string;
}

/**
 * Thin progress bar at the top of the viewport showing scroll progress.
 * Improves UX on long pages by giving users a sense of position.
 */
export default function ReadingProgressBar({ target, className }: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0);

  const updateProgress = useCallback(() => {
    const el = target ? document.querySelector(target) : document.documentElement;
    if (!el) return;

    const scrollTop = el === document.documentElement ? window.scrollY : (el as Element).scrollTop;
    const scrollHeight =
      el === document.documentElement
        ? document.documentElement.scrollHeight - window.innerHeight
        : (el as Element).scrollHeight - (el as HTMLElement).clientHeight;

    if (scrollHeight <= 0) {
      setProgress(100);
      return;
    }

    const p = Math.min(100, (scrollTop / scrollHeight) * 100);
    setProgress(p);
  }, [target]);

  useEffect(() => {
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [updateProgress]);

  if (progress < 1) return null;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page reading progress"
      className={`fixed left-0 top-0 z-[60] h-0.5 transition-[width] duration-150 ease-out ${
        className ?? 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500'
      }`}
      style={{ width: `${progress}%` }}
    />
  );
}
