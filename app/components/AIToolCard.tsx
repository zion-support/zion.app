import React from 'react';

interface AIToolCardProps {
  className?: string;
  children?: React.ReactNode;
}

const AIToolCard: React.FC<AIToolCardProps> = ({ className = '', children }) => {
  return (
    <div className={`aitoolcard-component ${className}`}>
      {children}
    </div>
  );
};

AIToolCard.displayName = 'AIToolCard';

export default AIToolCard;