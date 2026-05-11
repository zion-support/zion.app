// Application Configuration
/**
 * Application Configuration;
 * Centralized configuration management for the Zion Tech Group application;
 */

export interface AppConfig {
  app: {
    name: string;
    version: string;
    environment: 'development' | 'production' | 'test';
  };
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
  };
  features: {
    analytics: boolean;
    monitoring: boolean;
    errorTracking: boolean;
    performanceOptimization: boolean;
  };
  performance: {
    enableLazyLoading: boolean;
    imageLazyLoadThreshold: number;
    componentLazyLoadThreshold: number;
    cacheMaxAge: number;
  };
  security: {
    enableCSP: boolean;
    enableHSTS: boolean;
    enableXSSProtection: boolean;
  };
}

const config: AppConfig = {
  app: {
    name: 'Zion Tech Group',
    version: '1.0.0',
    environment: (typeof process !== "undefined" ? process.env['NODE_ENV'] : 'development') as 'development' | 'production' | 'test' || 'development',
  },
  api: {
    baseUrl: (typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_URL : undefined) || 'https://api.zion.app',
    timeout: 30000,
    retryAttempts: 3,
  },
  features: {
    analytics: (typeof process !== "undefined" ? process.env['NODE_ENV'] : 'development') === 'production',
    monitoring: true,
    errorTracking: true,
    performanceOptimization: true,
  },
  performance: {
    enableLazyLoading: true,
    imageLazyLoadThreshold: 0.5,
    componentLazyLoadThreshold: 0.25,
    cacheMaxAge: 3600000, // 1 hour in milliseconds;
  },
  security: {
    enableCSP: true,
    enableHSTS: true,
    enableXSSProtection: true,
  },
};

/**
 * Get configuration value by key path
 * @example getConfig('app.name') => 'Zion Tech Group'
 */
export function getConfig<T = unknown>(keyPath: string): T {
  const keys = keyPath.split('.');
  let value: unknown = config;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      throw new Error(`Configuration key "${keyPath}" not found`);
    }
  }

  return value as T;
}

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof config.features): boolean {
  return config.features[feature];
}

/**
 * Get current environment
 */
export function getEnvironment(): string {
  return config.app.environment;
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return config.app.environment === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return config.app.environment === 'development';
}

export default config;