import React from 'react';

interface LazyWrapperProps {
  className?: string;
  children?: React.ReactNode;
}

const LazyWrapper: React.FC<LazyWrapperProps> = ({ className = '', children }) => {
  return (
    <div className={`lazywrapper-component ${className}`}>
      {children}
    </div>
  );
};

LazyWrapper.displayName = 'LazyWrapper';

export default LazyWrapper;