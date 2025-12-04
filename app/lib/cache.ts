import { unstable_cache } from 'next/cache'

// Cache durations in seconds
export const CACHE_DURATION = {
  STATIC: 3600,
  MEDIUM: 300,
  DYNAMIC: 60,
  CRITICAL: 30,
} as const

// Cache tags for organized invalidation
export const CACHE_TAGS = {
  ENERGY: 'energy-data',
  AMBIENTAL: 'ambiental-data',
  OCUPACIONAL: 'ocupacional-data',
  ENTERPRISE: 'enterprise-data',
  FILTERS: 'filters-data',
  ALERTS: 'alerts-data',
  READINGS: 'readings-data',
  PANELS: 'panels-data',
  HEADQUARTERS: 'headquarters-data',
} as const

export function createCachedFunction<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  keyPrefix: string,
  tags: string[],
  revalidate: number = CACHE_DURATION.MEDIUM
) {
  return unstable_cache(
    fn,
    [keyPrefix],
    {
      tags,
      revalidate,
    }
  )
}

// Helper to generate cache keys based on parameters
export function generateCacheKey(prefix: string, params: Record<string, unknown>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('-')

  return `${prefix}-${sortedParams}`
}

