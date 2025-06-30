'use server'
import { fetchWithAuthEnergy } from "@/app/lib/api"
import { baseUrlEnergy } from "@/app/lib/constant"

export async function dashboardTable({ headquarterId, date_after, date_before, unit, page, category, point} : { date_after?: string,  date_before?: string, panelId?: string, headquarterId?: string, unit?: string, page?:string, category?:string, point?: string}) {

  const url = new URL(`/api/v1/headquarter/${headquarterId}/devices/measurement-points/list/`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (unit) url.searchParams.set('unit', unit)
  if (page) url.searchParams.set('page', page)
  if (category) url.searchParams.set('category', category)
  if (point) url.searchParams.set('point', point)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`)

  return res 
}