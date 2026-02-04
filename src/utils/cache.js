// Cache utility for managing localStorage with expiration
const CACHE_PREFIX = 'walleta_cache_';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export const cache = {
  /**
   * Set data in cache with optional TTL
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {number} ttl - Time to live in milliseconds (default: 5 minutes)
   */
  set: (key, data, ttl = DEFAULT_TTL) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  },

  /**
   * Get data from cache if not expired
   * @param {string} key - Cache key
   * @returns {any|null} - Cached data or null if expired/not found
   */
  get: (key) => {
    try {
      const cached = localStorage.getItem(CACHE_PREFIX + key);
      if (!cached) return null;

      const { data, timestamp, ttl } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > ttl;

      if (isExpired) {
        cache.remove(key);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  /**
   * Remove specific cache entry
   * @param {string} key - Cache key
   */
  remove: (key) => {
    try {
      localStorage.removeItem(CACHE_PREFIX + key);
    } catch (error) {
      console.error('Cache remove error:', error);
    }
  },

  /**
   * Clear all cache entries
   */
  clear: () => {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(CACHE_PREFIX))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  },

  /**
   * Check if cache exists and is valid
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  has: (key) => {
    return cache.get(key) !== null;
  },
};
