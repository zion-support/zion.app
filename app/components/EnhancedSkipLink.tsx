'use client';

import React from 'react';

interface EnhancedSkipLinkProps {
  className?: string;
  children?: React.ReactNode;
}

const EnhancedSkipLink: React.FC<EnhancedSkipLinkProps> = ({ className = '', children }) => {
  return (
    <nav className={`enhancedskiplink-component ${className}`} aria-label="Skip links">
      {children || (
        <>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <a href="#site-navigation" className="skip-link">
            Skip to navigation
          </a>
          <a href="#site-footer" className="skip-link">
            Skip to footer
          </a>
        </>
      )}
    </nav>
  );
};

EnhancedSkipLink.displayName = 'EnhancedSkipLink';

export default EnhancedSkipLink;
