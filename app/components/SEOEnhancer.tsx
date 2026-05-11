import React from 'react';

interface SEOEnhancerProps {
  className?: string;
  children?: React.ReactNode;
}

const SEOEnhancer: React.FC<SEOEnhancerProps> = ({ className = '', children }) => {
  return (
    <div className={`seoenhancer-component ${className}`}>
      {children || <h2>SEOEnhancer</h2>}
    </div>
  );
}

export default SEOEnhancer;