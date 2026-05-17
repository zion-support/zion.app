'use client';

import { ReactNode, useEffect, useState } from 'react';

export default function AccessibilityEnhancer({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && (
        <a
          href="#main-content"
          className="skip-link"
          aria-label="Skip to main content"
        >
          Skip to main content
        </a>
      )}
      {children}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Keyboard navigation helpers
            document.addEventListener('keydown', function(e) {
              if (e.key === 'Tab') document.body.classList.add('keyboard-nav');
            });
            document.addEventListener('mousedown', function() {
              document.body.classList.remove('keyboard-nav');
            });
          `,
        }}
      />
    </>
  );
}
