'use server'

import { 
  invalidateEnergyCache,
  invalidateAmbientalCache,
  invalidateOcupacionalCache,
  invalidateEnterpriseCache,
  invalidateFiltersCache,
  invalidateReadingsCache,
  invalidateAlertsCache,
  invalidatePanelsCache,
  invalidateHeadquartersCache,
  invalidateAllCache
} from '@/app/lib/cache'

// Invalidation actions for UI components to call

export async function invalidateEnergyData() {
  await invalidateEnergyCache()
  return { success: true, message: 'Energy cache invalidated' }
}

export async function invalidateAmbientalData() {
  await invalidateAmbientalCache()
  return { success: true, message: 'Ambiental cache invalidated' }
}

export async function invalidateOcupacionalData() {
  await invalidateOcupacionalCache()
  return { success: true, message: 'Ocupacional cache invalidated' }
}

export async function invalidateEnterpriseData() {
  await invalidateEnterpriseCache()
  return { success: true, message: 'Enterprise cache invalidated' }
}

export async function invalidateFiltersData() {
  await invalidateFiltersCache()
  return { success: true, message: 'Filters cache invalidated' }
}

export async function invalidateReadingsData() {
  await invalidateReadingsCache()
  return { success: true, message: 'Readings cache invalidated' }
}

export async function invalidateAlertsData() {
  await invalidateAlertsCache()
  return { success: true, message: 'Alerts cache invalidated' }
}

export async function invalidatePanelsData() {
  await invalidatePanelsCache()
  return { success: true, message: 'Panels cache invalidated' }
}

export async function invalidateHeadquartersData() {
  await invalidateHeadquartersCache()
  return { success: true, message: 'Headquarters cache invalidated' }
}

export async function invalidateAllData() {
  await invalidateAllCache()
  return { success: true, message: 'All cache invalidated' }
}

// Combined invalidation actions for common scenarios

export async function invalidateReadingsAndAlerts() {
  await Promise.all([
    invalidateReadingsCache(),
    invalidateAlertsCache()
  ])
  return { success: true, message: 'Readings and alerts cache invalidated' }
}

export async function invalidateStaticData() {
  await Promise.all([
    invalidateEnterpriseCache(),
    invalidateHeadquartersCache(),
    invalidatePanelsCache(),
    invalidateFiltersCache()
  ])
  return { success: true, message: 'Static data cache invalidated' }
}

export async function invalidateDynamicData() {
  await Promise.all([
    invalidateReadingsCache(),
    invalidateAlertsCache()
  ])
  return { success: true, message: 'Dynamic data cache invalidated' }
}

// Module-specific combined actions

export async function refreshEnergyModule() {
  await invalidateEnergyCache()
  return { success: true, message: 'Energy module refreshed' }
}

export async function refreshAmbientalModule() {
  await invalidateAmbientalCache()
  return { success: true, message: 'Ambiental module refreshed' }
}

export async function refreshOcupacionalModule() {
  await invalidateOcupacionalCache()
  return { success: true, message: 'Ocupacional module refreshed' }
}