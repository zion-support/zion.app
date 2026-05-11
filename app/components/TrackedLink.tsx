import React from 'react';
import Link from 'next/link';

interface TrackedLinkProps {
  href: string;
  utmParams?: Record<string,string>;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

export default function TrackedLink({ href, utmParams, children, className = '', target, rel }: TrackedLinkProps) {
  const url = new URL(href, typeof window !== 'undefined' ? window.location.origin : 'https://zion.app');
  Object.entries(utmParams || {}).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return (
    <a href={url.toString()} className={className} target={target} rel={rel} shallow={false}>
      {children}
    </a>
  );
}
