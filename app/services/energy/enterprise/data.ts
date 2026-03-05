'use server'
import { fetchWithAuthEnergy } from "@/app/lib/api"
import { cacheLife, unstable_cache } from 'next/cache'
import { cache } from 'react'

const getHeadquartersRequestCached = cache(async (token: string) => {
  'use cache'
  cacheLife('minutes')
  return await fetchWithAuthEnergy('/api/v1/user/headquarters/', {}, token)
})

const getEnergyMeasurementPointPanelsRequestCached = cache(async (token: string, headquarterId: string) => {
  'use cache'
  cacheLife('minutes')
  return await fetchWithAuthEnergy(`/api/v1/headquarter/${headquarterId}/measurement-points/`, {}, token)
})


export async function getHeadquarters(token: string) {
  return await getHeadquartersRequestCached(token)
}

export async function getEnergyMeasurementPointPanels({ headquarterId, token }: { headquarterId: string, token: string }) {
  return await getEnergyMeasurementPointPanelsRequestCached(token, headquarterId)

}