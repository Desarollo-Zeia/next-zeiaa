'use server'
import { fetchWithAuthEnergy } from "@/app/lib/api"
import { baseUrlEnergy } from "@/app/lib/constant"

export async function dashboardTable({ headquarterId, date_after, date_before, unit, page, category, point }: { date_after?: string, date_before?: string, panelId?: string, headquarterId?: string, unit?: string, page?: string, category?: string, point?: string }) {

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

export async function porcentageGraph({ headquarterId, this_week, this_month, date_after, date_before }: { headquarterId: string, this_week?: string, this_month?: string, date_after?: string, date_before?: string }) {

  const url = new URL(`/api/v1/headquarter/${headquarterId}/consumption-distribution/`, baseUrlEnergy)

  if (this_week) url.searchParams.set('this_week', this_week)
  if (this_month) url.searchParams.set('this_month', this_month)
  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`)

  return res
}

export async function consumeGraph({ headquarterId, panelId, date_after, date_before, indicador, unit, last_by, category, point, weekday }: { date_after?: string, date_before?: string, panelId?: string, headquarterId?: string, indicador?: string, unit?: string, last_by?: string, category?: string, point?: string, weekday: string }) {

  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/${panelId}/measurement_points/${point}/readings/graph?this_month=true`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (indicador) url.searchParams.set('indicador', indicador)
  if (unit) url.searchParams.set('unit', unit)
  if (last_by) url.searchParams.set('last_by', last_by)
  if (category) url.searchParams.set('category', category)
  if (point) url.searchParams.set('point', point)
  if (weekday) url.searchParams.set('weekday', weekday)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`)

  return res
}

export async function dashboardTableAlerts({ headquarterId, date_after, date_before, unit, page, category, point }: { date_after?: string, date_before?: string, panelId?: string, headquarterId?: string, unit?: string, page?: string, category?: string, point?: string }) {

  const url = new URL(`/api/v1/headquarter/${headquarterId}/measurement-point/${point}/historical-alerts`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (unit) url.searchParams.set('unit', unit)
  if (page) url.searchParams.set('page', page)
  if (category) url.searchParams.set('category', category)
  if (point) url.searchParams.set('point', point)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`)

  return res
}

export async function lastAlertToday() {
  const res = await fetchWithAuthEnergy(`/api/v1/enterprises/last-alert/`)

  return res
}

