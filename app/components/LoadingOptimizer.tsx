import React from 'react';

interface LoadingOptimizerProps {
  className?: string;
  children?: React.ReactNode;
}

const LoadingOptimizer: React.FC<LoadingOptimizerProps> = ({ className = '', children }) => {
  return (
    <div className={`loadingoptimizer-component ${className}`}>
      {children}
    </div>
  );
};

LoadingOptimizer.displayName = 'LoadingOptimizer';

export default LoadingOptimizer;