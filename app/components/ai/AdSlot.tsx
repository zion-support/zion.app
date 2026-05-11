'use client';

import { useState, useEffect } from 'react';

interface AdSlotProps {
  placement?: 'top' | 'bottom' | 'inline';
  className?: string;
}

export default function AdSlot({ placement = 'inline', className = '' }: AdSlotProps) {
  const [ads, setAds] = useState<string[]>([
    'https://example.com/ad1',
    'https://example.com/ad2',
    'https://example.com/ad3'
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % ads.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`ad-slot ${placement} ${className} text-center`}
      style={{
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        margin: '1rem 0'
      }}
    >
      <a
        href={ads[currentIndex]}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: '#007bff',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}
      >
        {`Sponsored Content ${currentIndex + 1}`}
      </a>
    </div>
  );
}