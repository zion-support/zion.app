import React from 'react';

interface LoadingStatesProps {
  className?: string;
  children?: React.ReactNode;
}

const LoadingStates: React.FC<LoadingStatesProps> = ({ className = '', children }) => {
  return (
<div className={`loadingstates-component ${className}`}>
      {children}
    </div>
  );
};

LoadingStates.displayName = 'LoadingStates';export default LoadingStates;