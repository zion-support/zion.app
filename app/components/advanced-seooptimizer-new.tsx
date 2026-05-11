import React from 'react';

interface AdvancedSEOOptimizer_newProps {
  className?: string;
  children?: React.ReactNode;
}

const AdvancedSEOOptimizer_new: React.FC<AdvancedSEOOptimizer_newProps> = ({ className = '', children }) => {
  return (
    <div className={`advancedseooptimizer_new-component ${className}`}>
      {children}
    </div>
  );
};

AdvancedSEOOptimizer_new.displayName = 'AdvancedSEOOptimizer_new';

export default AdvancedSEOOptimizer_new;