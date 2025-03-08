/**
 * Simple in-memory cache for API responses
 * Note: In a serverless environment, this cache will be reset on each deployment
 * In production, consider using a more robust solution like Redis or a database
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Use a global variable to persist the cache across function calls
// This is a workaround for serverless environments
// In production, use a proper database or Redis
let globalCache: Map<string, CacheEntry<any>> | undefined;

// Initialize the global cache
function getGlobalCache(): Map<string, CacheEntry<any>> {
  if (globalCache === undefined) {
    globalCache = new Map();
  }
  return globalCache;
}

class Cache {
  private defaultTTL: number = 60 * 60 * 1000; // 1 hour in milliseconds

  /**
   * Get a value from the cache
   * @param key The cache key
   * @returns The cached value or undefined if not found or expired
   */
  get<T>(key: string): T | undefined {
    try {
      const cache = getGlobalCache();
      const entry = cache.get(key);
      
      if (!entry) {
        return undefined;
      }
      
      const now = Date.now();
      
      // Check if the entry has expired
      if (now - entry.timestamp > this.defaultTTL) {
        cache.delete(key);
        return undefined;
      }
      
      return entry.data as T;
    } catch (error) {
      console.error('Error getting from cache:', error);
      return undefined;
    }
  }

  /**
   * Set a value in the cache
   * @param key The cache key
   * @param value The value to cache
   * @param ttl Time to live in milliseconds (optional, defaults to 1 hour)
   */
  set<T>(key: string, value: T, ttl?: number): void {
    try {
      const entry: CacheEntry<T> = {
        data: value,
        timestamp: Date.now(),
      };
      
      const cache = getGlobalCache();
      cache.set(key, entry);
      
      // Set a timeout to delete the entry when it expires
      // Note: In serverless environments, this timeout may not work as expected
      // as the function instance may be destroyed before the timeout fires
      const timeout = ttl || this.defaultTTL;
      setTimeout(() => {
        try {
          const currentCache = getGlobalCache();
          currentCache.delete(key);
        } catch (error) {
          console.error('Error deleting from cache in timeout:', error);
        }
      }, timeout);
    } catch (error) {
      console.error('Error setting in cache:', error);
    }
  }

  /**
   * Delete a value from the cache
   * @param key The cache key
   */
  delete(key: string): void {
    try {
      const cache = getGlobalCache();
      cache.delete(key);
    } catch (error) {
      console.error('Error deleting from cache:', error);
    }
  }

  /**
   * Clear the entire cache
   */
  clear(): void {
    try {
      const cache = getGlobalCache();
      cache.clear();
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  /**
   * Get a value from the cache or compute it if not found
   * @param key The cache key
   * @param fn The function to compute the value if not found
   * @param ttl Time to live in milliseconds (optional)
   * @returns The cached or computed value
   */
  async getOrCompute<T>(key: string, fn: () => Promise<T>, ttl?: number): Promise<T> {
    try {
      const cachedValue = this.get<T>(key);
      
      if (cachedValue !== undefined) {
        console.log(`Cache hit for key: ${key}`);
        return cachedValue;
      }
      
      console.log(`Cache miss for key: ${key}, computing value...`);
      const computedValue = await fn();
      this.set(key, computedValue, ttl);
      
      return computedValue;
    } catch (error) {
      console.error('Error in getOrCompute:', error);
      // If there's an error with the cache, just compute the value
      return fn();
    }
  }
}

// Export a singleton instance
export const cache = new Cache(); 