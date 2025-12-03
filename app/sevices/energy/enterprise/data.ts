'use server'
import { fetchWithAuthEnergy } from "@/app/lib/api"
import { unstable_cache } from 'next/cache'
import { CACHE_DURATION, CACHE_TAGS } from "@/app/lib/cache"
import { getToken } from "@/app/lib/auth"

const _getHeadquartersCached = unstable_cache(
  async (token: string) => {
    return await fetchWithAuthEnergy(`/api/v1/user/headquarters/`, {}, token)
  },
  ['energy-headquarters'],
  {
    tags: [CACHE_TAGS.ENERGY, CACHE_TAGS.HEADQUARTERS, CACHE_TAGS.ENTERPRISE],
    revalidate: CACHE_DURATION.STATIC, // 1 hour - headquarters rarely change
  }
)

export async function getHeadquarters(token: string) {
  return await fetchWithAuthEnergy(`/api/v1/user/headquarters/`, {}, token)
}

const _getEnergyMeasurementPointPanelsCached = unstable_cache(
  async (token: string, headquarterId: string) => {
    return await fetchWithAuthEnergy(`/api/v1/headquarter/${headquarterId}/measurement-points/`, {}, token)
  },
  ['energy-measurement-point-panels'],
  {
    tags: [CACHE_TAGS.ENERGY, CACHE_TAGS.PANELS, CACHE_TAGS.ENTERPRISE],
    revalidate: CACHE_DURATION.STATIC, // 1 hour - panels configuration rarely changes
  }
)

export async function getEnergyMeasurementPointPanels({ headquarterId, token }: { headquarterId: string, token: string }) {
  return await fetchWithAuthEnergy(`/api/v1/headquarter/${headquarterId}/measurement-points/`, {}, token)

}

const _getEnergyCompanyDetailsCached = unstable_cache(
  async (token: string) => {
    return await fetchWithAuthEnergy(`/api/v1/enterprises/1/`, {}, token)
  },
  ['energy-company-details'],
  {
    tags: [CACHE_TAGS.ENERGY, CACHE_TAGS.ENTERPRISE],
    revalidate: CACHE_DURATION.STATIC, // 1 hour - company details are static
  }
)

export async function getEnergyCompanyDetails() {
  const token = await getToken()
  if (!token) throw new Error('No auth token')
  return _getEnergyCompanyDetailsCached(token)
}

