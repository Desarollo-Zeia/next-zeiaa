'use server'
import { fetchWithAuthEnergy } from "@/app/lib/api"
import { baseUrlEnergy } from "@/app/lib/constant"
import { START_DATE } from "@/app/utils/formatter"
import { unstable_cache } from 'next/cache'
import { CACHE_DURATION, CACHE_TAGS, generateCacheKey } from "@/app/lib/cache"
import { getToken } from "@/app/lib/auth"

const _consumeCached = unstable_cache(
  async (token: string, headquarterId: string, panelId: string, point: string, date_after?: string, date_before?: string, unit?: string, page?: string, category?: string) => {
    const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/${panelId}/measurement_points/${point}/readings`, baseUrlEnergy)

    if (date_after) url.searchParams.set('date_after', date_after)
    if (date_before) url.searchParams.set('date_before', date_before)
    if (unit) url.searchParams.set('unit', unit)
    if (page) url.searchParams.set('page', page)
    if (category) url.searchParams.set('category', category)
    if (point) url.searchParams.set('point', point)

    const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`, {}, token)

    return res
  },
  ['energy-consume'],
  {
    tags: [CACHE_TAGS.ENERGY, CACHE_TAGS.READINGS],
    revalidate: CACHE_DURATION.DYNAMIC, // 1 minute - readings change frequently
  }
)

export async function consume({ headquarterId, panelId, date_after = START_DATE, date_before = START_DATE, unit, page, category, point }: { date_after?: string, date_before?: string, panelId?: string, headquarterId?: string, unit?: string, page?: string, category?: string, point?: string }) {
  const token = await getToken()
  if (!token) throw new Error('No auth token')
  return _consumeCached(token, headquarterId!, panelId!, point!, date_after, date_before, unit, page, category)
}

const _consumeGraphCached = unstable_cache(
  async (token: string, headquarterId: string, panelId: string, point: string, date_after?: string, date_before?: string, indicador?: string, unit?: string, last_by?: string, category?: string) => {
    const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/${panelId}/measurement_points/${point}/readings/graph`, baseUrlEnergy)

    if (date_after) url.searchParams.set('date_after', date_after)
    if (date_before) url.searchParams.set('date_before', date_before)
    if (indicador) url.searchParams.set('indicador', indicador)
    if (unit) url.searchParams.set('unit', unit)
    if (last_by) url.searchParams.set('last_by', last_by)
    if (category) url.searchParams.set('category', category)
    if (point) url.searchParams.set('point', point)

    const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`, {}, token)

    return res
  },
  ['energy-consume-graph'],
  {
    tags: [CACHE_TAGS.ENERGY, CACHE_TAGS.READINGS],
    revalidate: CACHE_DURATION.MEDIUM, // 5 minutes - graphs can be cached longer
  }
)

export async function consumeGraph({ headquarterId, panelId, date_after = START_DATE, date_before = START_DATE, indicador, unit, last_by, category, point }: { date_after?: string, date_before?: string, panelId?: string, headquarterId?: string, indicador?: string, unit?: string, last_by?: string, category?: string, point?: string }) {
  const token = await getToken()
  if (!token) throw new Error('No auth token')
  return _consumeGraphCached(token, headquarterId!, panelId!, point!, date_after, date_before, indicador, unit, last_by, category)
}

const _consumeExcelCached = unstable_cache(
  async (token: string, headquarterId: string, panelId: string, point: string, date_after?: string, date_before?: string, unit?: string) => {
    const url = new URL(
      `/api/v1/headquarter/${headquarterId}/electrical_panel/${panelId}/measurement_points/${point}/readings/report`,
      baseUrlEnergy
    );

    if (date_after) url.searchParams.set('date_after', date_after);
    if (date_before) url.searchParams.set('date_before', date_before);
    if (unit) url.searchParams.set('unit', unit);

    const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`, {}, token)

    return await res
  },
  ['energy-consume-excel'],
  {
    tags: [CACHE_TAGS.ENERGY, CACHE_TAGS.READINGS],
    revalidate: CACHE_DURATION.MEDIUM, // 5 minutes - Excel reports can be cached
  }
)

export async function consumeExcel({ headquarterId, panelId, date_after = START_DATE, date_before = START_DATE, unit, point }: { headquarterId?: string, panelId?: string, date_after?: string, date_before?: string, unit?: string, point?: string }) {
  const token = await getToken()
  if (!token) throw new Error('No auth token')
  return _consumeExcelCached(token, headquarterId!, panelId!, point!, date_after, date_before, unit)
}