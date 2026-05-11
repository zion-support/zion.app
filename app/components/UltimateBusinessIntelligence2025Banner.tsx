import React from 'react';

interface UltimateBusinessIntelligence2025BannerProps {
  className?: string;
  children?: React.ReactNode;
}

const UltimateBusinessIntelligence2025Banner: React.FC<UltimateBusinessIntelligence2025BannerProps> = ({ className = '', children }) => {
  return (
    <div className={`ultimatebusinessintelligence2025banner-component ${className}`}>
      {children}
    </div>
  );
};

UltimateBusinessIntelligence2025Banner.displayName = 'UltimateBusinessIntelligence2025Banner';

export default UltimateBusinessIntelligence2025Banner;