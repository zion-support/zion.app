import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for conditionally joining CSS class strings
 * Combines clsx for conditional classes and tailwind-merge for intelligent merging
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Legacy classNames function for backward compatibility
 */
export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Utility for creating responsive class strings
 */
export function responsive(classes: {
  base?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
}): string {
  const responsiveClasses = Object.entries(classes)
    .map(([breakpoint, className]) => {
      if (!className) return '';
      return breakpoint === 'base' ? className : `${breakpoint}:${className}`;
    })
    .filter(Boolean);
  
  return cn(...responsiveClasses);
}

/**
 * Utility for creating conditional classes with better TypeScript support
 */
export function conditionalClasses(
  baseClasses: string,
  conditionalClasses: Record<string, boolean | undefined | null>
): string {
  const conditional = Object.entries(conditionalClasses)
    .filter(([, condition]) => condition)
    .map(([className]) => className);
  
  return cn(baseClasses, ...conditional);
}