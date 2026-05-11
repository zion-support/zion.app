import React from 'react';

interface ErrorHandlerProps {
  className?: string;
  children?: React.ReactNode;
}

const ErrorHandler: React.FC<ErrorHandlerProps> = ({ className = '', children }) => {
  return (
<div className={`errorhandler-component ${className}`}>
      {children}
    </div>
  );
};

ErrorHandler.displayName = 'ErrorHandler';export default ErrorHandler;