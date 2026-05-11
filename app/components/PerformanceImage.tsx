import React from 'react';

interface PerformanceImageProps {
  className?: string;
  children?: React.ReactNode;
}

const PerformanceImage: React.FC<PerformanceImageProps> = ({ className = '', children }) => {
  return (
    <div className={`performanceimage-component ${className}`}>
      {children}
    </div>
  );
};

PerformanceImage.displayName = 'PerformanceImage';

export default PerformanceImage;