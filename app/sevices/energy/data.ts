'use server'
import { fetchWithAuthEnergy } from "@/app/lib/api"
import { baseUrlEnergy } from "@/app/lib/constant"

export async function consume({ headquarterId = '1', panelId = '1', date_after, date_before } : { date_after?: string,  date_before?: string, panelId?: string, headquarterId?: string }) {

  const url = new URL(`/api/v1/enterprises/${headquarterId}/measurement_points/${panelId}/readings`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`)

  return res 
}