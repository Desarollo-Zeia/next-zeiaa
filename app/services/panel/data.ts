'use server'
import { fetchWithAuthEnergy } from "@/app/lib/api"
import { baseUrlEnergy } from "@/app/lib/constant"
import { cacheLife, unstable_cache } from 'next/cache'
import { CACHE_DURATION, CACHE_TAGS } from "@/app/lib/cache"
import { getToken } from "@/app/lib/auth"

const _dashboardTableCached = unstable_cache(
  async (token: string, headquarterId: string, date_after?: string, date_before?: string, unit?: string, page?: string, category?: string, point?: string) => {
    const url = new URL(`/api/v1/headquarter/${headquarterId}/devices/measurement-points/list/`, baseUrlEnergy)

    if (date_after) url.searchParams.set('date_after', date_after)
    if (date_before) url.searchParams.set('date_before', date_before)
    if (unit) url.searchParams.set('unit', unit)
    if (page) url.searchParams.set('page', page)
    if (category) url.searchParams.set('category', category)
    if (point) url.searchParams.set('point', point)

    const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`, {}, token)

    return res
  },
  ['energy-dashboard-table'],
  {
    tags: [CACHE_TAGS.ENERGY, CACHE_TAGS.PANELS],
    revalidate: CACHE_DURATION.DYNAMIC, // 1 minute - panel data changes frequently
  }
)

export async function dashboardTable({ headquarterId, panelId, date_after, date_before, unit, category, point, token }: { date_after?: string, date_before?: string, panelId?: string, headquarterId?: string, unit?: string, category?: string, point?: string, token: string }) {
  'use cache'
  cacheLife('minutes')
  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/${panelId}/devices/measurement-points/list/`, baseUrlEnergy)

  // Traer todos los registros sin paginación
  url.searchParams.set('page_size', '1000')
  
  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (unit) url.searchParams.set('unit', unit)
  if (category) url.searchParams.set('category', category)
  if (point) url.searchParams.set('point', point)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`, {}, token)

  return res
}

const _porcentageGraphCached = unstable_cache(
  async (token: string, headquarterId: string, this_week?: string, this_month?: string, date_after?: string, date_before?: string) => {
    const url = new URL(`/api/v1/headquarter/${headquarterId}/consumption-distribution/`, baseUrlEnergy)

    if (this_week) url.searchParams.set('this_week', this_week)
    if (this_month) url.searchParams.set('this_month', this_month)
    if (date_after) url.searchParams.set('date_after', date_after)
    if (date_before) url.searchParams.set('date_before', date_before)

    const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`, {}, token)

    return res
  },
  ['energy-percentage-graph'],
  {
    tags: [CACHE_TAGS.ENERGY],
    revalidate: CACHE_DURATION.MEDIUM, // 5 minutes - percentage graphs can be cached longer
  }
)

export async function porcentageGraph({ headquarterId, panelId, this_week, this_month, date_after, date_before, token }: { headquarterId: string, panelId: string, this_week?: string, this_month?: string, date_after?: string, date_before?: string, token: string }) {
  'use cache'
  cacheLife('minutes')
  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/${panelId}/consumption-distribution/`, baseUrlEnergy)

  if (this_week) url.searchParams.set('this_week', this_week)
  if (this_month) url.searchParams.set('this_month', this_month)
  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`, {}, token)

  return res
}

const _consumeGraphCached = unstable_cache(
  async (token: string, headquarterId: string, panelId: string, point: string, weekday: string, date_after?: string, date_before?: string, indicador?: string, unit?: string, last_by?: string, category?: string) => {
    const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/${panelId}/consumption-distribution/?this_month=true`, baseUrlEnergy)

    if (date_after) url.searchParams.set('date_after', date_after)
    if (date_before) url.searchParams.set('date_before', date_before)
    if (indicador) url.searchParams.set('indicador', indicador)
    if (unit) url.searchParams.set('unit', unit)
    if (last_by) url.searchParams.set('last_by', last_by)
    if (category) url.searchParams.set('category', category)
    if (point) url.searchParams.set('point', point)
    if (weekday) url.searchParams.set('weekday', weekday)

    const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`, {}, token)

    return res
  },
  ['energy-panel-consume-graph'],
  {
    tags: [CACHE_TAGS.ENERGY, CACHE_TAGS.READINGS],
    revalidate: CACHE_DURATION.MEDIUM, // 5 minutes - consume graphs can be cached
  }
)

export async function consumeGraph({ headquarterId, panelId, date_after, date_before, indicador, unit, last_by, category, point, weekday, token }: { date_after?: string, date_before?: string, panelId?: string, headquarterId?: string, indicador?: string, unit?: string, last_by?: string, category?: string, point?: string, weekday: string, token: string }) {
  'use cache'
  cacheLife('minutes')
  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/${panelId}/measurement_points/${point}/readings/graph?this_month=true`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (indicador) url.searchParams.set('indicador', indicador)
  if (unit) url.searchParams.set('unit', unit)
  if (last_by) url.searchParams.set('last_by', last_by)
  if (category) url.searchParams.set('category', category)
  if (point) url.searchParams.set('point', point)
  if (weekday) url.searchParams.set('weekday', weekday)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`, {}, token)

  return res
}

const _dashboardTableAlertsCached = unstable_cache(
  async (token: string, headquarterId: string, point: string, date_after?: string, date_before?: string, unit?: string, page?: string, category?: string) => {
    const url = new URL(`/api/v1/headquarter/${headquarterId}/measurement-point/${point}/historical-alerts`, baseUrlEnergy)

    if (date_after) url.searchParams.set('date_after', date_after)
    if (date_before) url.searchParams.set('date_before', date_before)
    if (unit) url.searchParams.set('unit', unit)
    if (page) url.searchParams.set('page', page)
    if (category) url.searchParams.set('category', category)
    if (point) url.searchParams.set('point', point)

    const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`, {}, token)

    return res
  },
  ['energy-dashboard-alerts'],
  {
    tags: [CACHE_TAGS.ENERGY, CACHE_TAGS.ALERTS],
    revalidate: CACHE_DURATION.CRITICAL, // 30 seconds - alerts need fresh data
  }
)

export async function dashboardTableAlerts({ headquarterId, date_after, date_before, unit, page, category, point, token }: { date_after?: string, date_before?: string, panelId?: string, headquarterId?: string, unit?: string, page?: string, category?: string, point?: string, token?: string }) {
  const url = new URL(`/api/v1/headquarter/${headquarterId}/measurement-point/${point}/historical-alerts`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (unit) url.searchParams.set('unit', unit)
  if (page) url.searchParams.set('page', page)
  if (category) url.searchParams.set('category', category)
  if (point) url.searchParams.set('point', point)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`, {}, token)

  return res
}

const _lastAlertTodayCached = unstable_cache(
  async (token: string) => {
    const res = await fetchWithAuthEnergy(`/api/v1/enterprises/last-alert/`, {}, token)

    return res
  },
  ['energy-last-alert-today'],
  {
    tags: [CACHE_TAGS.ENERGY, CACHE_TAGS.ALERTS],
    revalidate: CACHE_DURATION.CRITICAL, // 30 seconds - last alert is critical info
  }
)

export async function lastAlertToday(token: string) {
  const res = await fetchWithAuthEnergy(`/api/v1/enterprises/last-alert/`, {}, token)
  return res
}

