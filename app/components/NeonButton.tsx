import React from 'react';

interface NeonButtonProps {
  className?: string;
  children?: React.ReactNode;
}

const NeonButton: React.FC<NeonButtonProps> = ({ className = '', children }) => {
  return (
<div className={`neonbutton-component ${className}`}>
      {children}
    </div>
  );
};

NeonButton.displayName = 'NeonButton';export default NeonButton;