

import React, { memo } from 'react';

interface AccessibilityControlsProps {
  className?: string;
  children?: React.ReactNode;
  isHighContrast?: boolean;
  fontSize?: string;
  reducedMotion?: boolean;
  onHighContrastChange?: (_value: boolean) => void;
  onFontSizeChange?: (_value: string) => void;
  onReducedMotionChange?: (_value: boolean) => void;
}

const AccessibilityControls: React.FC<AccessibilityControlsProps> = memo(({
  isHighContrast,
  fontSize,
  reducedMotion,
  onHighContrastChange,
  onFontSizeChange,
  onReducedMotionChange,
  className = ''
}) => {
  return (
    <div className={`accessibility-controls ${className}`}>
      <div className="flex flex-wrap gap-4 p-4 bg-gray-800 rounded-lg">
        <label className="flex items-center space-x-2 text-white">
          <input
            type="checkbox"
            checked={isHighContrast}
            onChange={(e) => onHighContrastChange?.(e.target.checked)}
            className="rounded"
          />
          <span>High Contrast</span>
        </label>
        
        <label className="flex items-center space-x-2 text-white">
          <span>Font Size:</span>
          <select
            value={fontSize}
            onChange={(e) => onFontSizeChange?.(e.target.value)}
            className="bg-gray-700 text-white rounded px-2 py-1"
          >
            <option value="small">Small</option>
            <option value="normal">Normal</option>
            <option value="large">Large</option>
            <option value="xl">Extra Large</option>
          </select>
        </label>
        
        <label className="flex items-center space-x-2 text-white">
          <input
            type="checkbox"
            checked={reducedMotion}
            onChange={(e) => onReducedMotionChange?.(e.target.checked)}
            className="rounded"
          />
          <span>Reduce Motion</span>
        </label>
      </div>
    </div>
  );
});

AccessibilityControls.displayName = 'AccessibilityControls';

export default AccessibilityControls;