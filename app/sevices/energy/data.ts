'use server'
import { fetchWithAuthEnergy } from "@/app/lib/api"
import { baseUrlEnergy } from "@/app/lib/constant"

export async function consume({ headquarterId, panelId, date_after, date_before, unit, page} : { date_after?: string,  date_before?: string, panelId?: string, headquarterId?: string, unit?: string, page?:string}) {

  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/${panelId}/measurement_points/1/readings`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (unit) url.searchParams.set('unit', unit)
  if (page) url.searchParams.set('page', page)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`)

  return res 
}

export async function consumeGraph({ headquarterId, panelId, date_after, date_before, indicador, unit, last_by} : { date_after?: string,  date_before?: string, panelId?: string, headquarterId?: string, indicador?: string, unit?: string, last_by?:string}) {

  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/${panelId}/measurement_points/1/readings/graph`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (indicador) url.searchParams.set('indicador', indicador)
  if (unit) url.searchParams.set('unit', unit)
  if (last_by) url.searchParams.set('last_by', last_by)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`)

  return res 
}