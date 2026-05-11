import React from 'react';

interface OptimizedLoadingProps {
  className?: string;
  children?: React.ReactNode;
}

const OptimizedLoading: React.FC<OptimizedLoadingProps> = ({ className = '', children }) => {
  return (
    <div className={`optimizedloading-component ${className}`}>
      {children}
    </div>
  );
};

OptimizedLoading.displayName = 'OptimizedLoading';

export default OptimizedLoading;