'use client';
import React from 'react';

export default function SimpleErrorBoundary({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
