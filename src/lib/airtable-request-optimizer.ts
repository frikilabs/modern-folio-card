/**
 * Airtable Request Optimizer
 * Handles request deduplication, batching, and rate limiting
 */

import { getTable } from '@/lib/airtable';

interface RequestCache {
  [key: string]: {
    promise: Promise<any>;
    timestamp: number;
    ttl: number;
  };
}

/**
 * Simple in-memory cache for deduplicating simultaneous requests
 * Prevents multiple identical requests from hitting the API
 */
class AirtableRequestOptimizer {
  private requestCache: RequestCache = {};
  private requestTimeout: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Generate a cache key for a request
   */
  private generateCacheKey(tableName: string, operation: string, params?: any): string {
    const paramStr = params ? JSON.stringify(params) : '';
    return `${tableName}:${operation}:${paramStr}`;
  }

  /**
   * Clear a cached request after TTL
   */
  private scheduleCacheCleanup(key: string, ttl: number) {
    if (this.requestTimeout.has(key)) {
      clearTimeout(this.requestTimeout.get(key)!);
    }

    const timeout = setTimeout(() => {
      delete this.requestCache[key];
      this.requestTimeout.delete(key);
    }, ttl);

    this.requestTimeout.set(key, timeout);
  }

  /**
   * Deduplicated request - returns cached promise if request is in-flight
   */
  async executeDeduplicatedRequest<T>(
    key: string,
    requestFn: () => Promise<T>,
    ttl: number = 5000 // 5 seconds default TTL
  ): Promise<T> {
    const now = Date.now();

    // Return cached promise if still valid
    if (this.requestCache[key] && now - this.requestCache[key].timestamp < this.requestCache[key].ttl) {
      return this.requestCache[key].promise;
    }

    // Create new promise
    const promise = requestFn().catch((error) => {
      // Remove from cache on error so retry can happen
      delete this.requestCache[key];
      throw error;
    });

    // Cache the promise
    this.requestCache[key] = {
      promise,
      timestamp: now,
      ttl,
    };

    // Schedule cleanup
    this.scheduleCacheCleanup(key, ttl);

    return promise;
  }

  /**
   * Parallel batch requests - execute multiple requests in parallel
   */
  async executeBatchRequests<T>(requests: Array<() => Promise<T>>): Promise<T[]> {
    return Promise.all(requests.map((req) => req()));
  }

  /**
   * Get all records with optimized caching
   */
  async getTableRecordsOptimized(
    tableName: string,
    selectOptions?: any,
    cacheTtl: number = 5000
  ) {
    const cacheKey = this.generateCacheKey(tableName, 'getAll', selectOptions);

    return this.executeDeduplicatedRequest(
      cacheKey,
      async () => {
        const table = getTable(tableName as any);
        try {
          const records = await table.select(selectOptions || {}).all();
          return records.map((record: any) => ({
            id: record.id,
            fields: record.fields,
            createdTime: record._rawJson.createdTime,
          }));
        } catch (error) {
          console.error(`Error fetching from ${tableName}:`, error);
          throw error;
        }
      },
      cacheTtl
    );
  }

  /**
   * Clear specific cache entry
   */
  clearCache(key: string) {
    delete this.requestCache[key];
    if (this.requestTimeout.has(key)) {
      clearTimeout(this.requestTimeout.get(key)!);
      this.requestTimeout.delete(key);
    }
  }

  /**
   * Clear all cache
   */
  clearAllCache() {
    Object.keys(this.requestCache).forEach((key) => {
      this.clearCache(key);
    });
  }

  /**
   * Get cache stats (for debugging)
   */
  getCacheStats() {
    return {
      cachedRequests: Object.keys(this.requestCache).length,
      pendingTimeouts: this.requestTimeout.size,
    };
  }
}

// Export singleton instance
export const requestOptimizer = new AirtableRequestOptimizer();
