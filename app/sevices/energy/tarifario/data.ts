'use server'
import { fetchWithAuthEnergy } from "@/app/lib/api"
import { baseUrlEnergy } from "@/app/lib/constant"

export async function consumptionCalculator({ headquarterId, panelId, date_after, date_before, } : { date_after?: string,  date_before?: string, panelId?: string, headquarterId?: string}) {

  const url = new URL(`/api/v1/headquarter/${headquarterId}}/electrical_panel/${panelId}/rate-consumption`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`)

  return res 
}

export async function consumptionInvoice({ headquarterId, panelId } : { date_after?: string,  date_before?: string, panelId?: string, headquarterId?: string}) {

  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/${panelId}/rate-consumption/cycle`, baseUrlEnergy)

  const res = await fetchWithAuthEnergy(`${url.pathname}`)

  return res 
}

export async function consumptionTable({ headquarterId, panelId } : { date_after?: string,  date_before?: string, panelId?: string, headquarterId?: string}) {

  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/${panelId}/rate-consumption/resume`, baseUrlEnergy)

  const res = await fetchWithAuthEnergy(`${url.pathname}`)

  return res 
}

export async function consumptionGraph({ headquarterId, panelId, group_by, date_after, date_before,  } : { date_after?: string,  date_before?: string, panelId?: string, headquarterId?: string, group_by?: string}) {

  
  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/${panelId}/rate-consumption/historical`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (group_by) url.searchParams.set('group_by', group_by)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`)

  return res 
}

