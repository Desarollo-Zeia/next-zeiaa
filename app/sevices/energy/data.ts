'use server'
import { fetchWithAuthEnergy } from "@/app/lib/api"
import { baseUrlEnergy } from "@/app/lib/constant"

export async function consume({ date_after, date_before } : { date_after?: string,  date_before?: string }) {

  const url = new URL(`/api/v1/enterprises/1/measurement_points/1/readings`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`)

  return res 
}