'use server'
import { fetchWithAuthEnergy } from "@/app/lib/api"
import { baseUrlEnergy } from "@/app/lib/constant"

export async function armonics({ headquarterId, date_after, date_before, data_type, page} : { date_after?: string,  date_before?: string, panelId?: string, headquarterId?: string, data_type?:string, page?: string}) {

  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/harmonic-distortion/list`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (data_type) url.searchParams.set('data_type', data_type)
  if (page) url.searchParams.set('page', page)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`)

  return res 
}

export async function armonicsGraph({ headquarterId, date_after, date_before, data_type} : { date_after?: string,  date_before?: string, panelId?: string, headquarterId?: string, data_type?:string}) {

  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/harmonic-distortion/graph`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (data_type) url.searchParams.set('data_type', data_type)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`)

  return res 
}

export async function armonicsExcel({ headquarterId, date_after, date_before, data_type } : { headquarterId?: string, panelId?: string, date_after?: string,  date_before?: string, data_type?:string}) {
  
    const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/harmonic-distortion/report`, baseUrlEnergy)
  
    if (date_after) url.searchParams.set('date_after', date_after)
    if (date_before) url.searchParams.set('date_before', date_before)
    if (data_type) url.searchParams.set('data_type', data_type)
  
    const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`)
  
    return res
}

