const CACHE_DURATION = 60 * 1000; // 1 minute

const cache = new Map();

export const getCachedData = (key) => {
  const cached = cache.get(key);
  if (!cached) return null;
  
  const { data, timestamp } = cached;
  const now = Date.now();
  
  // Check if cache is still valid
  if (now - timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  return data;
};

export const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

export const clearCache = () => {
  cache.clear();
};
