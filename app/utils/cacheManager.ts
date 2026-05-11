'use client';

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items
  storage?: 'memory' | 'localStorage' | 'sessionStorage';
}

export interface CacheItem<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

export class CacheManager<T> {
  private cache: Map<string, CacheItem<T>> = new Map();
  private options: Required<CacheOptions>;

  constructor(options: CacheOptions = { /* empty */ }) {
    this.options = {
      ttl: options.ttl || 5 * 60 * 1000, // 5 minutes default
      maxSize: options.maxSize || 100,
      storage: options.storage || 'memory'
    };
    if (this.options.storage !== 'memory' && typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  public set(key: string, value: T, ttl?: number): void {
    const item: CacheItem<T> = {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.options.ttl
    };

    // Remove oldest items if cache is full
    if (this.cache.size >= this.options.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, item);
    if (this.options.storage !== 'memory' && typeof window !== 'undefined') {
      this.saveToStorage();
    }
  }

  public get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) {
      return null;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  public has(key: string): boolean {
    return this.get(key) !== null;
  }

  public delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (this.options.storage !== 'memory' && typeof window !== 'undefined') {
      this.saveToStorage();
    }
    return deleted;
  }

  public clear(): void {
    this.cache.clear();
    if (this.options.storage !== 'memory' && typeof window !== 'undefined') {
      this.saveToStorage();
    }
  }

  public size(): number {
    return this.cache.size;
  }

  public keys(): string[] {
    return Array.from(this.cache.keys());
  }

  public cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  private loadFromStorage(): void {
    try {
      const storage = this.options.storage === 'localStorage'
        ? localStorage
        : sessionStorage;
      const data = storage.getItem('cache_' + this.constructor.name);
      if (data) {
        const parsed = JSON.parse(data);
        this.cache = new Map(parsed);
      }
    } catch { /* empty */ }
  }

  private saveToStorage(): void {
    try {
      const storage = this.options.storage === 'localStorage'
        ? localStorage
        : sessionStorage;
      const data = JSON.stringify(Array.from(this.cache.entries()));
      storage.setItem('cache_' + this.constructor.name, data);
    } catch { /* empty */ }
  }
}

// Create default cache instances
export const memoryCache = new CacheManager<unknown>({ storage: 'memory' });
export const localStorageCache = new CacheManager<unknown>({ storage: 'localStorage' });
export const sessionStorageCache = new CacheManager<unknown>({ storage: 'sessionStorage' });

// Utility functions
export const cache = {
  set: (key: string, value: unknown, ttl?: number) => memoryCache.set(key, value, ttl),
  get: (key: string) => memoryCache.get(key),
  has: (key: string) => memoryCache.has(key),
  delete: (key: string) => memoryCache.delete(key),
  clear: () => memoryCache.clear(),
  size: () => memoryCache.size(),
  keys: () => memoryCache.keys(),
  cleanup: () => memoryCache.cleanup()
};