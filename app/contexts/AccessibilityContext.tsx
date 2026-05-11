import { createContext } from 'react';
import {AccessibilityContextType} from '../types/accessibility';

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export { AccessibilityContext };