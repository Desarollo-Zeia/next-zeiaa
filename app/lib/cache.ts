import { unstable_cache, revalidateTag } from 'next/cache'

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

// Helper function to create cached functions with consistent naming
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

// Cache invalidation functions
export async function invalidateEnergyCache() {
  'use server'
  revalidateTag(CACHE_TAGS.ENERGY)
}

export async function invalidateAmbientalCache() {
  'use server'
  revalidateTag(CACHE_TAGS.AMBIENTAL)
}

export async function invalidateOcupacionalCache() {
  'use server'
  revalidateTag(CACHE_TAGS.OCUPACIONAL)
}

export async function invalidateEnterpriseCache() {
  'use server'
  revalidateTag(CACHE_TAGS.ENTERPRISE)
}

export async function invalidateFiltersCache() {
  'use server'
  revalidateTag(CACHE_TAGS.FILTERS)
}

export async function invalidateAllCache() {
  'use server'
  await Promise.all([
    invalidateEnergyCache(),
    invalidateAmbientalCache(),
    invalidateOcupacionalCache(),
    invalidateEnterpriseCache(),
    invalidateFiltersCache(),
  ])
}

// Specific invalidation functions for granular control
export async function invalidateReadingsCache() {
  'use server'
  revalidateTag(CACHE_TAGS.READINGS)
}

export async function invalidateAlertsCache() {
  'use server'
  revalidateTag(CACHE_TAGS.ALERTS)
}

export async function invalidatePanelsCache() {
  'use server'
  revalidateTag(CACHE_TAGS.PANELS)
}

export async function invalidateHeadquartersCache() {
  'use server'
  revalidateTag(CACHE_TAGS.HEADQUARTERS)
}