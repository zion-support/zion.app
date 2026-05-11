'use client';

import React, { memo, useEffect } from 'react';

interface AnalyticsProps {
  gaId?: string;
  gtmId?: string;
  enabled?: boolean;
}

// Extend Window interface for analytics
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const Analytics: React.FC<AnalyticsProps> = memo(({ 
  gaId = process.env.NEXT_PUBLIC_GA_ID,
  gtmId = process.env.NEXT_PUBLIC_GTM_ID,
  enabled = process.env.NODE_ENV === 'production'
}) => {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Google Analytics
    if (gaId) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(..._args: unknown[]) {
        window.dataLayer?.push(_args);
      }
      gtag('js', new Date());
      gtag('config', gaId, {
        page_title: document.title,
        page_location: window.location.href,
      });

      window.gtag = gtag;
    }

    // Google Tag Manager
    if (gtmId) {
      const script = document.createElement('script');
      script.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm._start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
      `;
      document.head.appendChild(script);

      const noscript = document.createElement('noscript');
      noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
      document.body.insertBefore(noscript, document.body.firstChild);
    }
  }, [gaId, gtmId, enabled]);

  return null;
});

Analytics.displayName = 'Analytics';

export default Analytics;