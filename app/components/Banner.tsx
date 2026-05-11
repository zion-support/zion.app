'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import DarkModeToggle from './ui/DarkModeToggle';

type WhatsNewItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  tag: string;
};

interface BannerProps {
  items: WhatsNewItem[];
}

export default function Banner({ items }: BannerProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [items]);

  const item = items[index];

  return (
    <section className="bg-gradient-to-r from-blue-900 via-purple-900 to-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/assets/banner-bg.png')] bg-cover bg-center opacity-20"></div>
      <div className="relative py-16 px-6 md:py-20 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-between justify-between w-full mb-4">
          <div className="flex flex-col items-start gap-4">
            <span className="bg-blue-500/20 px-3 py-1 rounded text-sm font-medium">{item.tag}</span>
            <h1 className="text-3xl font-bold md:text-4xl leading-tight">{item.title}</h1>
            <p className="text-lg md:text-xl max-w-md">{item.description}</p>
            <a href={item.href} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg transition-colors font-medium">
              Explore Now
              <span className="ml-2">→</span>
            </a>
          </div>
          <div className="self-end">
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </section>
  );
}
