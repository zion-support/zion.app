import React from 'react';

export default function StickyDonateBanner() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-center bg-purple-900/90 py-2 px-4 text-center text-sm text-white">
      <span className="mr-2">Enjoying Zion Tech Group? </span>
      <a
        href={process.env.PAYPAL_URL!}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-purple-300"
      >
        Donate via PayPal
      </a>
      <span className="mx-2">|</span>
      <a
        href={process.env.KO_FI_URL!}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-purple-300"
      >
        Support on Ko‑fi
      </a>
    </div>
  );
}
