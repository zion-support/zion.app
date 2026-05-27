'use client';

import { useRef, useEffect, type ReactNode } from 'react';
import type { DropdownMenuProps } from './types';

export function DropdownMenu({ isOpen, onClose, children, className = '', style }: DropdownMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Click-outside handler
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    // Use setTimeout to avoid the click that opened the menu from also closing it
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClick);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}