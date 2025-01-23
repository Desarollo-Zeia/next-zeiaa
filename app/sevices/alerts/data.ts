'use server'
import { fetchWithAuth, fetchWithAuthAmbiental } from "@/app/lib/api"
import { baseUrl } from "@/app/lib/constant"

export async function alerts({ roomId, indicator, unit, date_after, date_before, page } : { roomId : string | number, indicator: string, unit: string, date_after?: string,  date_before?: string, page: string}) {

  const url = new URL(`/alerts/api/room/${roomId}/alerts`, baseUrl)

  if (indicator) url.searchParams.set('indicator', indicator)
  if (unit) url.searchParams.set('unit', unit)
  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (page) url.searchParams.set('page', page)

  const res = await fetchWithAuth(`${url.pathname}${url.search}`)

  return res 
}

export async function alertsAmbiental({ roomId, indicator, unit, date_after, date_before, page } : { roomId : string | number, indicator: string, unit: string, date_after?: string,  date_before?: string, page: string}) {

  const url = new URL(`/alerts/api/ambiental/point/${roomId}/alerts/`, baseUrl)

  if (indicator) url.searchParams.set('indicator', indicator)
  if (unit) url.searchParams.set('unit', unit)
  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (page) url.searchParams.set('page', page)

  const res = await fetchWithAuthAmbiental(`${url.pathname}${url.search}`)

  return res 
}