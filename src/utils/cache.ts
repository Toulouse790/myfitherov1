
type CacheItem<T> = {
  value: T;
  expiresAt: number;
};

export class Cache {
  private static instance: Cache;
  private cache: Map<string, CacheItem<any>> = new Map();
  
  private constructor() {}
  
  public static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }
  
  public set<T>(key: string, value: T, ttlInSeconds = 300): void {
    const expiresAt = Date.now() + ttlInSeconds * 1000;
    this.cache.set(key, { value, expiresAt });
  }
  
  public get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value as T;
  }
  
  public delete(key: string): void {
    this.cache.delete(key);
  }
  
  public clear(): void {
    this.cache.clear();
  }
}

export const appCache = Cache.getInstance();
