import React from 'react';

interface NotFoundPageProps {
  className?: string;
  children?: React.ReactNode;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ className = '', children }) => {
  return (
<div className={`notfoundpage-component ${className}`}>
      {children}
    </div>
  );
};

NotFoundPage.displayName = 'NotFoundPage';

export default NotFoundPage;