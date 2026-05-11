import React from 'react';

interface SEOHeadWrapperProps {
  className?: string;
  children?: React.ReactNode;
}

const SEOHeadWrapper: React.FC<SEOHeadWrapperProps> = ({ className = '', children }) => {
  return (
    <div className={`seoheadwrapper-component ${className}`}>
      {children}
    </div>
  );
};

SEOHeadWrapper.displayName = 'SEOHeadWrapper';

export default SEOHeadWrapper;