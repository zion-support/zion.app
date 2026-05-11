import React from 'react';

interface ResponsiveContainerProps {
  className?: string;
  children?: React.ReactNode;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ className = '', children }) => {
  return (
<div className={`responsive-container ${className}`}>
      {children || <h2>ResponsiveContainer</h2>}
    </div>
  );
};

ResponsiveContainer.displayName = 'ResponsiveContainer';

export default ResponsiveContainer;