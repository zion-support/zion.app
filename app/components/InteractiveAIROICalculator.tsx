import React from 'react';

interface InteractiveAIROICalculatorProps {
  className?: string;
  children?: React.ReactNode;
}

const InteractiveAIROICalculator: React.FC<InteractiveAIROICalculatorProps> = ({ className = '', children }) => {
  return (
    <div className={`interactiveairoicalculator-component ${className}`}>
      {children}
    </div>
  );
};

InteractiveAIROICalculator.displayName = 'InteractiveAIROICalculator';

export default InteractiveAIROICalculator;