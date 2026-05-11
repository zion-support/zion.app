import React from 'react';

const baseSkipLinkClass =
  'sr-only focus:not-sr-only focus:fixed focus:left-4 focus:z-[1000] focus:rounded-md focus:bg-slate-950 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:ring-2 focus:ring-purple-400';

const SkipLink: React.FC = () => {
  return (
    <>
      <a href="#main-content" className={`${baseSkipLinkClass} focus:top-4`}>
        Skip to main content
      </a>
      <a href="#site-navigation" className={`${baseSkipLinkClass} focus:top-16`}>
        Skip to navigation
      </a>
      <a href="#site-footer" className={`${baseSkipLinkClass} focus:top-28`}>
        Skip to footer
      </a>
    </>
  );
};

export default SkipLink;
