import React from 'react';

interface ContentPreviewCardProps {
  className?: string;
  children?: React.ReactNode;
}

const ContentPreviewCard: React.FC<ContentPreviewCardProps> = ({ className = '', children }) => {
  return (
    <div className={`contentpreviewcard-component ${className}`}>
      {children}
    </div>
  );
};

ContentPreviewCard.displayName = 'ContentPreviewCard';

export default ContentPreviewCard;