import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ className = '', children }) => {
  return (
    <div className={`loadingskeleton-component ${className}`}>
      {children}
    </div>
  );
};

LoadingSkeleton.displayName = 'LoadingSkeleton';

export default LoadingSkeleton;