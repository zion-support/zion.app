

import React, { memo, Suspense } from 'react';

interface OptimizedWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  lazy?: boolean;
}

const OptimizedWrapper: React.FC<OptimizedWrapperProps> = memo(({ 
  children, 
  fallback = <div>Loading...</div>,
  lazy: isLazy = false 
}) => {
  if (isLazy) {
    return (
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    );
  }

  return <>{children}</>;
});

OptimizedWrapper.displayName = 'OptimizedWrapper';

export default OptimizedWrapper;