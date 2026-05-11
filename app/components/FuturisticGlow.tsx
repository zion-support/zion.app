import React from 'react';

interface FuturisticGlowProps {
  className?: string;
  children?: React.ReactNode;
}

const FuturisticGlow: React.FC<FuturisticGlowProps> = ({ className = '', children }) => {
  return (
    <div className={`futuristicglow-component ${className}`}>
      {children}
    </div>
  );
};

FuturisticGlow.displayName = 'FuturisticGlow';

export default FuturisticGlow;