import { Injectable } from "@angular/core";
import { add, Duration } from "date-fns";

export interface CacheItem<T> {
  name: string;
  expiresAt: Date;
  data: T;
}

const CACHE_PREFIX = "cache/";
const DEFAULT_CACHE_DURATION_HOURS = 2;

/**
 * Notes: I have also thought about adding an http interceptor instead, that caches the
 * responses. But I felt like having control over the cache manually is much more flexible.
 * I.e. if there are some side-effects we aren not flexible enough using an interceptor.
 */
@Injectable({ providedIn: "root" })
export class CachingService {
  /**
   * Gets an item from cache (localStorage)
   * @param name of the cached item
   * @returns undefined if the cached item does not exist or is expired
   */
  public getItem<T>(name: string): CacheItem<T> | undefined {
    const now = new Date();
    try {
      const cachedItem = JSON.parse(
        localStorage.getItem(`${CACHE_PREFIX}${name}`)
      ) as CacheItem<T>;
      if (!cachedItem) return undefined;

      if (new Date(cachedItem.expiresAt) < now) {
        console.info(
          `Cached item ${name} expired at ${cachedItem.expiresAt}. Fetching new data...`
        );
        localStorage.removeItem(name);
        return undefined;
      }

      return cachedItem;
    } catch (err: unknown) {
      console.error(`Error reading cached item ${name}`, err);
      return undefined;
    }
  }

  /**
   * Writes an item to cache (localStorage)
   * @param name of the cached item
   * @param data of the cached item
   * @param cacheDuration of how long the item should remain cached
   */
  public saveItem<T>(
    name: string,
    data: T,
    cacheDuration: Duration = { hours: DEFAULT_CACHE_DURATION_HOURS }
  ) {
    const now = new Date();
    const cacheItem = {
      name,
      data,
      expiresAt: add(now, cacheDuration),
    };
    localStorage.setItem(`${CACHE_PREFIX}${name}`, JSON.stringify(cacheItem));
  }
}
