'use server'
import { fetchWithAuthEnergy } from "@/app/lib/api"
import { baseUrlEnergy } from "@/app/lib/constant"

export async function consume({ headquarterId = '1', panelId = '1', date_after, date_before, unit} : { date_after?: string,  date_before?: string, panelId?: string, headquarterId?: string, unit?: string}) {

  const url = new URL(`/api/v1/enterprises/${headquarterId}/measurement_points/${panelId}/readings`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (unit) url.searchParams.set('unit', unit)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`)

  return res 
}

export async function consumeGraph({ headquarterId = '1', panelId = '1', date_after, date_before, unit = 'V', indicador = 'Uab'} : { date_after?: string,  date_before?: string, panelId?: string, headquarterId?: string, unit?: string, indicador: string}) {

  const url = new URL(`/api/v1/enterprises/${headquarterId}/measurement_points/${panelId}/readings/graph`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (unit) url.searchParams.set('unit', unit)
  if (indicador) url.searchParams.set('indicador', indicador)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`)

  return res 
}