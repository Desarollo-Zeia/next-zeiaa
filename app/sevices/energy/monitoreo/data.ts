'use server'
import { fetchWithAuthEnergy } from "@/app/lib/api"
import { baseUrlEnergy } from "@/app/lib/constant"

export async function monitoringGraph({ headquarterId, date_after, date_before, group_by} : { date_after?: string,  date_before?: string, panelId?: string, headquarterId?: string, group_by?:string}) {

  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/powers/graph`, baseUrlEnergy)
  
  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (group_by) url.searchParams.set('group_by', group_by)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`)

  return res 
}


export async function monitoringLastThree({ headquarterId} : { panelId?: string, headquarterId?: string}) {

  const res = await fetchWithAuthEnergy(`/api/v1/headquarter/${headquarterId}/electrical_panel/powers/last-exceeded`)
  return res 

}


export async function exceeded({ headquarterId, date_after, date_before, page} : { date_after?: string,  date_before?: string, panelId?: string, headquarterId?: string, page?: string}) {

  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/powers/all-exceeded`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (page) url.searchParams.set('page', page)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`)

  return res 
}

export async function exceededExcel({ headquarterId} : { headquarterId?: string, panelId?: string }) {
  
    const res = await fetchWithAuthEnergy(`/api/v1/headquarter/${headquarterId}/electrical_panel/powers/report-exceeded`)
  
    return res
}


