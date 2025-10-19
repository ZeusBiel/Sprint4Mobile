import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppError } from './errorHandling';

const CACHE_PREFIX = '@app_cache:';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export const cacheData = async <T>(key: string, data: T): Promise<void> => {
  const cacheItem: CacheItem<T> = {
    data,
    timestamp: Date.now(),
  };
  await AsyncStorage.setItem(
    `${CACHE_PREFIX}${key}`,
    JSON.stringify(cacheItem)
  );
};

export const getCachedData = async <T>(key: string): Promise<T | null> => {
  const cached = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
  if (!cached) return null;

  const cacheItem: CacheItem<T> = JSON.parse(cached);
  const isExpired = Date.now() - cacheItem.timestamp > CACHE_EXPIRY;

  if (isExpired) {
    await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
    return null;
  }

  return cacheItem.data;
};

export const clearCache = async (): Promise<void> => {
  const keys = await AsyncStorage.getAllKeys();
  const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
  await AsyncStorage.multiRemove(cacheKeys);
};

export const withOfflineSupport = async <T>(
  key: string,
  onlineFetch: () => Promise<T>,
  options = { forceRefresh: false }
): Promise<T> => {
  try {
    // Try to get cached data first if not forcing refresh
    if (!options.forceRefresh) {
      const cached = await getCachedData<T>(key);
      if (cached) return cached;
    }

    // Fetch fresh data
    const data = await onlineFetch();
    await cacheData(key, data);
    return data;
  } catch (error) {
    // If offline, try to get cached data regardless of force refresh
    const cached = await getCachedData<T>(key);
    if (cached) return cached;

    throw new AppError(
      'Não foi possível carregar os dados. Verifique sua conexão.',
      'OFFLINE_ERROR'
    );
  }
};