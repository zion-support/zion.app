import React from 'react';

interface CookieConsentProps {
  className?: string;
  children?: React.ReactNode;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ className = '', children }) => {
  return (
    <div className={`cookieconsent-component ${className}`}>
      {children}
    </div>
  );
};

CookieConsent.displayName = 'CookieConsent';

export default CookieConsent;