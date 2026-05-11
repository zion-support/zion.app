import React from 'react';

interface FuturisticCardProps {
  className?: string;
  children?: React.ReactNode;
}

const FuturisticCard: React.FC<FuturisticCardProps> = ({ className = '', children }) => {
  return (
    <div className={`futuristiccard-component ${className}`}>
      {children}
    </div>
  );
};

FuturisticCard.displayName = 'FuturisticCard';

export default FuturisticCard;