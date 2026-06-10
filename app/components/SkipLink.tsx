'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SkipLink() {
  return (
    <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-lg">
      Skip to main content
    </a>
  );
}