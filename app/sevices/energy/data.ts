'use server'
import { fetchWithAuthEnergy } from "@/app/lib/api"
import { baseUrlEnergy } from "@/app/lib/constant"
import { START_DATE } from "@/app/utils/formatter"

export async function consume({ headquarterId, panelId, date_after = START_DATE, date_before = START_DATE, unit, page, category, point }: { date_after?: string, date_before?: string, panelId?: string, headquarterId?: string, unit?: string, page?: string, category?: string, point?: string }) {

  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/${panelId}/measurement_points/${point}/readings`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (unit) url.searchParams.set('unit', unit)
  if (page) url.searchParams.set('page', page)
  if (category) url.searchParams.set('category', category)
  if (point) url.searchParams.set('point', point)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`)

  return res
}

export async function consumeGraph({ headquarterId, panelId, date_after = START_DATE, date_before = START_DATE, indicador, unit, last_by, category, point }: { date_after?: string, date_before?: string, panelId?: string, headquarterId?: string, indicador?: string, unit?: string, last_by?: string, category?: string, point?: string }) {

  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/${panelId}/measurement_points/${point}/readings/graph`, baseUrlEnergy)



  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (indicador) url.searchParams.set('indicador', indicador)
  if (unit) url.searchParams.set('unit', unit)
  if (last_by) url.searchParams.set('last_by', last_by)
  if (category) url.searchParams.set('category', category)
  if (point) url.searchParams.set('point', point)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`)

  return res
}

export async function consumeExcel({ headquarterId, panelId, date_after = START_DATE, date_before = START_DATE, unit, point }: { headquarterId?: string, panelId?: string, date_after?: string, date_before?: string, unit?: string, point?: string }) {

  const url = new URL(
    `/api/v1/headquarter/${headquarterId}/electrical_panel/${panelId}/measurement_points/${point}/readings/report`,
    baseUrlEnergy
  );

  /// api/v1/headquarter/1/electrical_panel/1/measurement_points/1/readings/report?date_after=2025-02-10&date_before=2025-02-28
  if (date_after) url.searchParams.set('date_after', date_after);
  if (date_before) url.searchParams.set('date_before', date_before);
  if (unit) url.searchParams.set('unit', unit);

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`)


  return await res

}