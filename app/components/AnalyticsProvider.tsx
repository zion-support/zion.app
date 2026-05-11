import React from 'react';

interface AnalyticsProviderProps {
  className?: string;
  children?: React.ReactNode;
}

const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ className = '', children }) => {
  return (
    <div className={`analyticsprovider-component ${className}`}>
      {children}
    </div>
  );
};

AnalyticsProvider.displayName = 'AnalyticsProvider';

export default AnalyticsProvider;