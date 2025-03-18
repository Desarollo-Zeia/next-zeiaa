'use server'
import { fetchWithAuthEnergy } from "@/app/lib/api"
import { baseUrlEnergy } from "@/app/lib/constant"

export async function current({ headquarterId, panelId, date_after, date_before, status} : { date_after?: string,  date_before?: string, panelId?: string, headquarterId?: string, status?: string}) {

  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/${panelId}}/current-imbalanced`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (status) url.searchParams.set('status', status)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`)

  return res 
}

export async function currentGraph({ headquarterId, panelId, date_after, date_before, status} : { date_after?: string,  date_before?: string, panelId?: string, headquarterId?: string, status?: string}) {

    const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/${panelId}/current-imbalanced/graph`, baseUrlEnergy)
  
    if (date_after) url.searchParams.set('date_after', date_after)
    if (date_before) url.searchParams.set('date_before', date_before)
    if (status) url.searchParams.set('status', status)
  
    const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`)
  
    return res 
  }

  export async function voltage({ headquarterId, panelId, date_after, date_before, status} : { date_after?: string,  date_before?: string, panelId?: string, headquarterId?: string, status?: string}) {

    const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/${panelId}/voltage-imbalanced`, baseUrlEnergy)
  
    if (date_after) url.searchParams.set('date_after', date_after)
    if (date_before) url.searchParams.set('date_before', date_before)
    if (status) url.searchParams.set('status', status)
  
    const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`)
  
    return res 
  }


  export async function voltageGraph({ headquarterId, panelId, date_after, date_before, status} : { date_after?: string,  date_before?: string, panelId?: string, headquarterId?: string, status?: string}) {

    const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/${panelId}/voltage-imbalanced/graph`, baseUrlEnergy)
  
    if (date_after) url.searchParams.set('date_after', date_after)
    if (date_before) url.searchParams.set('date_before', date_before)
    if (status) url.searchParams.set('status', status)
  
    const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`)
  
    return res 
  }