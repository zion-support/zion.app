import React from 'react';

interface StructuredDataProps {
  className?: string;
  children?: React.ReactNode;
}

const StructuredData: React.FC<StructuredDataProps> = ({ className = '', children }) => {
  return (
    <div className={`structureddata-component ${className}`}>
      {children}
    </div>
  );
};

StructuredData.displayName = 'StructuredData';

export default StructuredData;