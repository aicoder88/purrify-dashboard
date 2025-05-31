/**
 * Comprehensive caching strategies for performance optimization
 */

// Cache configuration
interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of items
  strategy: 'lru' | 'fifo' | 'lfu'; // Cache eviction strategy
}

interface CacheItem<T> {
  value: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

/**
 * Generic in-memory cache with configurable eviction strategies
 */
export class MemoryCache<T> {
  private cache = new Map<string, CacheItem<T>>();
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      ttl: 5 * 60 * 1000, // 5 minutes default
      maxSize: 100,
      strategy: 'lru',
      ...config,
    };
  }

  set(key: string, value: T): void {
    const now = Date.now();
    
    // Remove expired items before adding new one
    this.cleanup();
    
    // If at max capacity, evict based on strategy
    if (this.cache.size >= this.config.maxSize) {
      this.evict();
    }

    this.cache.set(key, {
      value,
      timestamp: now,
      accessCount: 0,
      lastAccessed: now,
    });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if expired
    if (this.isExpired(item)) {
      this.cache.delete(key);
      return null;
    }

    // Update access statistics
    item.accessCount++;
    item.lastAccessed = Date.now();

    return item.value;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    return item !== undefined && !this.isExpired(item);
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    this.cleanup();
    return this.cache.size;
  }

  private isExpired(item: CacheItem<T>): boolean {
    return Date.now() - item.timestamp > this.config.ttl;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.config.ttl) {
        this.cache.delete(key);
      }
    }
  }

  private evict(): void {
    if (this.cache.size === 0) return;

    let keyToEvict: string;

    switch (this.config.strategy) {
      case 'lru': // Least Recently Used
        keyToEvict = this.findLRU();
        break;
      case 'lfu': // Least Frequently Used
        keyToEvict = this.findLFU();
        break;
      case 'fifo': // First In, First Out
      default:
        const firstKey = this.cache.keys().next().value;
        keyToEvict = firstKey || '';
        break;
    }

    this.cache.delete(keyToEvict);
  }

  private findLRU(): string {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccessed < oldestTime) {
        oldestTime = item.lastAccessed;
        oldestKey = key;
      }
    }

    return oldestKey;
  }

  private findLFU(): string {
    let leastUsedKey = '';
    let leastCount = Infinity;

    for (const [key, item] of this.cache.entries()) {
      if (item.accessCount < leastCount) {
        leastCount = item.accessCount;
        leastUsedKey = key;
      }
    }

    return leastUsedKey;
  }
}

/**
 * Browser storage cache with automatic serialization
 */
export class StorageCache<T> {
  private storage: Storage;
  private prefix: string;
  private ttl: number;

  constructor(
    storage: Storage = localStorage,
    prefix: string = 'purrify_cache_',
    ttl: number = 24 * 60 * 60 * 1000 // 24 hours
  ) {
    this.storage = storage;
    this.prefix = prefix;
    this.ttl = ttl;
  }

  set(key: string, value: T): void {
    try {
      const item = {
        value,
        timestamp: Date.now(),
      };
      this.storage.setItem(this.prefix + key, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to set cache item:', error);
    }
  }

  get(key: string): T | null {
    try {
      const item = this.storage.getItem(this.prefix + key);
      if (!item) return null;

      const parsed = JSON.parse(item);
      
      // Check if expired
      if (Date.now() - parsed.timestamp > this.ttl) {
        this.delete(key);
        return null;
      }

      return parsed.value;
    } catch (error) {
      console.warn('Failed to get cache item:', error);
      return null;
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.storage.removeItem(this.prefix + key);
  }

  clear(): void {
    const keys = Object.keys(this.storage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        this.storage.removeItem(key);
      }
    });
  }

  cleanup(): void {
    const keys = Object.keys(this.storage);
    const now = Date.now();

    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        try {
          const item = JSON.parse(this.storage.getItem(key) || '');
          if (now - item.timestamp > this.ttl) {
            this.storage.removeItem(key);
          }
        } catch (error) {
          // Remove corrupted items
          this.storage.removeItem(key);
        }
      }
    });
  }
}

/**
 * Query cache for API responses with React Query integration
 */
export class QueryCache {
  private cache = new MemoryCache<any>({
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 50,
    strategy: 'lru',
  });

  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: { ttl?: number; forceRefresh?: boolean } = {}
  ): Promise<T> {
    const { forceRefresh = false } = options;

    // Return cached value if available and not forcing refresh
    if (!forceRefresh && this.cache.has(key)) {
      return this.cache.get(key);
    }

    // Fetch new data
    try {
      const data = await fetcher();
      this.cache.set(key, data);
      return data;
    } catch (error) {
      // Return stale data if available during error
      const staleData = this.cache.get(key);
      if (staleData) {
        console.warn('Returning stale data due to fetch error:', error);
        return staleData;
      }
      throw error;
    }
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    // Invalidate keys matching pattern
    const regex = new RegExp(pattern);
    const keysToDelete: string[] = [];

    // Note: MemoryCache doesn't expose keys(), so we'll need to track them
    // This is a simplified implementation
    this.cache.clear(); // For now, clear all
  }

  prefetch<T>(key: string, fetcher: () => Promise<T>): void {
    // Prefetch data in background
    if (!this.cache.has(key)) {
      fetcher()
        .then(data => this.cache.set(key, data))
        .catch(error => console.warn('Prefetch failed:', error));
    }
  }
}

/**
 * Image cache with lazy loading support
 */
export class ImageCache {
  private cache = new Map<string, HTMLImageElement>();
  private loading = new Set<string>();

  async load(src: string): Promise<HTMLImageElement> {
    // Return cached image if available
    if (this.cache.has(src)) {
      return this.cache.get(src)!;
    }

    // Return existing promise if already loading
    if (this.loading.has(src)) {
      return new Promise((resolve, reject) => {
        const checkLoaded = () => {
          if (this.cache.has(src)) {
            resolve(this.cache.get(src)!);
          } else if (!this.loading.has(src)) {
            reject(new Error('Image loading failed'));
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
      });
    }

    // Start loading
    this.loading.add(src);

    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.cache.set(src, img);
        this.loading.delete(src);
        resolve(img);
      };

      img.onerror = () => {
        this.loading.delete(src);
        reject(new Error(`Failed to load image: ${src}`));
      };

      img.src = src;
    });
  }

  preload(sources: string[]): void {
    sources.forEach(src => {
      if (!this.cache.has(src) && !this.loading.has(src)) {
        this.load(src).catch(() => {
          // Ignore preload errors
        });
      }
    });
  }

  clear(): void {
    this.cache.clear();
    this.loading.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Global cache instances
export const memoryCache = new MemoryCache();
export const storageCache = new StorageCache();
export const queryCache = new QueryCache();
export const imageCache = new ImageCache();

/**
 * Cache decorator for functions
 */
export function cached<T extends (...args: any[]) => any>(
  fn: T,
  options: {
    ttl?: number;
    keyGenerator?: (...args: Parameters<T>) => string;
    cache?: MemoryCache<ReturnType<T>>;
  } = {}
): T {
  const {
    ttl = 5 * 60 * 1000,
    keyGenerator = (...args) => JSON.stringify(args),
    cache = new MemoryCache({ ttl }),
  } = options;

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyGenerator(...args);
    
    if (cache.has(key)) {
      const cached = cache.get(key);
      if (cached !== null) {
        return cached;
      }
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Async cache decorator
 */
export function cachedAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    ttl?: number;
    keyGenerator?: (...args: Parameters<T>) => string;
    cache?: MemoryCache<Awaited<ReturnType<T>>>;
  } = {}
): T {
  const {
    ttl = 5 * 60 * 1000,
    keyGenerator = (...args) => JSON.stringify(args),
    cache = new MemoryCache({ ttl }),
  } = options;

  return (async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    const key = keyGenerator(...args);
    
    if (cache.has(key)) {
      const cached = cache.get(key);
      if (cached !== null) {
        return cached;
      }
    }

    const result = await fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Initialize cache cleanup intervals
 */
export function initCacheCleanup(): void {
  // Cleanup storage cache every hour
  setInterval(() => {
    storageCache.cleanup();
  }, 60 * 60 * 1000);

  // Clear image cache when memory is low
  if (typeof window !== 'undefined' && 'memory' in performance) {
    setInterval(() => {
      const memory = (performance as any).memory;
      const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      
      if (usageRatio > 0.8) {
        imageCache.clear();
        console.log('Cleared image cache due to high memory usage');
      }
    }, 30 * 1000);
  }
}