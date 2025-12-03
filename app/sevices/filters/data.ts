'use server'
import { fetchWithAuth, fetchWithAuthAmbiental, fetchWithAuthEnergy } from "@/app/lib/api"
import { unstable_cache } from 'next/cache'
import { CACHE_DURATION, CACHE_TAGS } from "@/app/lib/cache"
import { getToken } from "@/app/lib/auth"

export async function getRooms(token: string) {

  const res = await fetchWithAuth('/enterprise/api/enterprise/basic/room-list/', {}, token)
  return res
}

const _getRoomsAmbientalCached = unstable_cache(
  async (token: string) => {
    return await fetchWithAuthAmbiental('/enterprise/api/ambiental/enterprise/basic/point-list/', {}, token)
  },
  ['ambiental-rooms'],
  {
    tags: [CACHE_TAGS.AMBIENTAL, CACHE_TAGS.FILTERS],
    revalidate: CACHE_DURATION.STATIC, // 1 hour - point list rarely changes
  }
)

export async function getRoomsAmbiental() {
  const token = await getToken()
  if (!token) throw new Error('No auth token')
  return _getRoomsAmbientalCached(token)
}

const _getHeadquartersOcupacionalCached = unstable_cache(
  async (token: string) => {
    return await fetchWithAuth('/enterprise/api/enterprise/basic/headquearter-list/', {}, token)
  },
  ['ocupacional-headquarters'],
  {
    tags: [CACHE_TAGS.OCUPACIONAL, CACHE_TAGS.HEADQUARTERS, CACHE_TAGS.FILTERS],
    revalidate: CACHE_DURATION.STATIC, // 1 hour - headquarters rarely change
  }
)

export async function getHeadquartersOcupacional() {
  const token = await getToken()
  if (!token) throw new Error('No auth token')
  return _getHeadquartersOcupacionalCached(token)
}

const _getHeadquartersCached = unstable_cache(
  async (token: string) => {
    return await fetchWithAuthEnergy('/api/v1/user/headquarters/', {}, token)
  },
  ['energy-headquarters-filter'],
  {
    tags: [CACHE_TAGS.ENERGY, CACHE_TAGS.HEADQUARTERS, CACHE_TAGS.FILTERS],
    revalidate: CACHE_DURATION.STATIC, // 1 hour - headquarters rarely change
  }
)

export async function getHeadquarters() {
  const token = await getToken()
  if (!token) throw new Error('No auth token')
  return _getHeadquartersCached(token)
}

const _getHeadquartersAmbientalCached = unstable_cache(
  async (token: string) => {
    return await fetchWithAuthAmbiental('/enterprise/api/ambiental/enterprise/basic/headquearter-list/', {}, token)
  },
  ['ambiental-headquarters'],
  {
    tags: [CACHE_TAGS.AMBIENTAL, CACHE_TAGS.HEADQUARTERS, CACHE_TAGS.FILTERS],
    revalidate: CACHE_DURATION.STATIC, // 1 hour - headquarters rarely change
  }
)

export async function getHeadquartersAmbiental() {
  const token = await getToken()
  if (!token) throw new Error('No auth token')
  return _getHeadquartersAmbientalCached(token)
}

const _getMeasurementPointsCached = unstable_cache(
  async (token: string, electricalpanelId: string) => {
    return await fetchWithAuthEnergy(`/api/v1/electrical-panel/${electricalpanelId}/devices/measurement-points/`, {}, token)
  },
  ['energy-measurement-points'],
  {
    tags: [CACHE_TAGS.ENERGY, CACHE_TAGS.FILTERS],
    revalidate: CACHE_DURATION.STATIC, // 1 hour - measurement points rarely change
  }
)

export async function getMeasurementPoints({ electricalpanelId }: { electricalpanelId: string }) {
  const token = await getToken()
  if (!token) throw new Error('No auth token')
  return _getMeasurementPointsCached(token, electricalpanelId)
}
