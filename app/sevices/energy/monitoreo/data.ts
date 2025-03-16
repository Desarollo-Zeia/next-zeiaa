'use server'
import { fetchWithAuthEnergy } from "@/app/lib/api"
import { baseUrlEnergy } from "@/app/lib/constant"

export async function monitoringGraph({ headquarterId, panelId, date_after, date_before, last_by} : { date_after?: string,  date_before?: string, panelId?: string, headquarterId?: string, last_by?:string}) {

  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/${panelId}/powers/graph`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (last_by) url.searchParams.set('last_by', last_by)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`)

  return res 
}


export async function monitoringLastThree({ headquarterId, panelId} : { panelId?: string, headquarterId?: string}) {

  const res = await fetchWithAuthEnergy(`/api/v1/headquarter/${headquarterId}/electrical_panel/${panelId}/powers/last-exceeded`)

  return res 
}
