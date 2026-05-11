export interface AccessibilityConfig {
  enableScreenReader: boolean;
  enableKeyboardNavigation: boolean;
  enableHighContrast: boolean;
  enableLargeText: boolean;
  enableVoiceCommands: boolean;
}

export interface AccessibilityFeatures {
  skipLinks: boolean;
  focusManagement: boolean;
  colorContrast: boolean;
  textScaling: boolean;
  keyboardShortcuts: boolean;
}

export interface AccessibilityTestResult {
  passed: boolean;
  score: number;
  issues: string[];
  recommendations: string[];
}

export interface AccessibilityAudit {
  timestamp: Date;
  score: number;
  results: AccessibilityTestResult[];
  overallStatus: 'pass' | 'fail' | 'warning';
}

export interface AccessibilityContextType {
  config: AccessibilityConfig;
  features: AccessibilityFeatures;
  updateConfig: (_config: Partial<AccessibilityConfig>) => void;
  runAudit: () => Promise<AccessibilityAudit>;
  isAccessible: boolean;
  score: number;
}