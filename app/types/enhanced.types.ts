import React from 'react';

// Enhanced type definitions for better type safety
export interface PerformanceMetrics {
  loadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
  timeToInteractive: number
  firstMeaningfulPaint: number
}
export interface ErrorContext {
  url?: string
  userAgent?: string
  timestamp?: string
  userId?: string
  sessionId?: string
  component?: string
  action?: string
  stack?: string
}
export interface ErrorReport {
  id: string
  _message: string
  stack?: string
  context: ErrorContext
  severity: ErrorSeverity
  resolved: boolean
  createdAt: string
  updatedAt?: string
}
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical'
export interface Service {
  id: string
  title: string
  description: string
  shortDescription: string
  icon: string
  features: string[];
  pricing: {
    basic: number
    pro: number
    enterprise: number
  }
  benefits: string[];
  useCases: string[];
  marketPrice: string
  contactInfo: {
    phone: string
    email: string
    website: string
  }
  link: string
  category: 'ai' | 'it' | '5g' | 'blockchain' | 'iot'
  tags: string[]}
export interface AppUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'user' | 'guest'
  preferences?: UserPreferences
  createdAt: string
  lastLogin?: string
}
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: string
  notifications: boolean
  analytics: boolean
}
export interface ContactFormData {
  name: string
  email: string
  company: string
  _message: string
  service: string
  phone?: string
  budget?: string
  timeline?: string
}
export interface AnalyticsEvent {
  name: string
  timestamp: number
  properties?: Record<string, string | number | boolean | null>
  userId?: string
  sessionId?: string
}
export interface SEOData {
  title: string
  description: string
  keywords: string[];
  canonical?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  twitterCard?: 'summary' | 'summary_large_image'
  structuredData?: Record<string, unknown>
}
export interface NavigationItem {
  name: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  submenu?: NavigationItem[];
  external?: boolean
}
export interface PerformanceConfig {
  enableLazyLoading: boolean
  enablePreloading: boolean
  enableCodeSplitting: boolean
  enableImageOptimization: boolean
  enableBundleAnalysis: boolean
  enableServiceWorker: boolean
}
export interface AccessibilityConfig {
  enableKeyboardNavigation: boolean
  enableScreenReader: boolean
  enableHighContrast: boolean
  enableReducedMotion: boolean
  enableFocusIndicators: boolean
}
// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]}
// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  _error?: string
  _message?: string
  timestamp: string
}
export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
// Form validation types
export interface ValidationError {
  field: string
  _message: string
  code: string
}
export interface FormState<T = Record<string, unknown>> {
  values: T
  errors: ValidationError[];
  touched: Record<keyof T, boolean>
  isSubmitting: boolean
  isValid: boolean
}
// Component props types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
  id?: string
  'data-testid'?: string
}
export interface LoadingProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'white'
  text?: string
}
export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}
export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search'
  placeholder?: string
  value?: string
  onChange?: (_value: string) => void
  onBlur?: () => void
  onFocus?: () => void
  disabled?: boolean
  required?: boolean
  _error?: string
  label?: string
}