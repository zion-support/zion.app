'use client';

import { useEffect, useState } from 'react';
import CookieConsent from 'react-cookie-consent';

export default function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      cookieName="zionCookieConsent"
      style={{ background: '#2B373B', color: '#fff', fontSize: '14px', padding: '12px 20px' }}
      buttonStyle={{ background: '#4CAF50', color: '#fff', fontSize: '14px', borderRadius: '4px', padding: '8px 16px' }}
      declineButtonStyle={{ background: '#f44336', color: '#fff', fontSize: '14px', borderRadius: '4px', padding: '8px 16px' }}
      expires={150}
    >
      We use cookies to enhance your experience. By continuing, you agree to our use of cookies.{' '}
      <a href="/privacy" style={{ color: '#4CAF50', textDecoration: 'underline' }}>
        Learn more
      </a>
    </CookieConsent>
  );
}
