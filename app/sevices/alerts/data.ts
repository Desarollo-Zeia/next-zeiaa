'use server'
import { fetchWithAuth, fetchWithAuthAmbiental } from "@/app/lib/api"
import { baseUrl, baseUrlAmbiental } from "@/app/lib/constant"
import { cacheLife, unstable_cache } from 'next/cache'
import { CACHE_DURATION, CACHE_TAGS } from "@/app/lib/cache"
import { getToken } from "@/app/lib/auth"

const _alertsCached = unstable_cache(
  async (token: string, roomId: string | number, indicator: string, unit: string, page: string, date_after?: string, date_before?: string, status?: string) => {
    const url = new URL(`/alerts/api/room/${roomId}/alerts`, baseUrl)

    if (indicator) url.searchParams.set('indicator', indicator)
    if (unit) url.searchParams.set('unit', unit)
    if (date_after) url.searchParams.set('date_after', date_after)
    if (date_before) url.searchParams.set('date_before', date_before)
    if (page) url.searchParams.set('page', page)
    if (status) url.searchParams.set('status', status)

    const res = await fetchWithAuth(`${url.pathname}${url.search}`, {}, token)

    return res
  },
)

export async function alerts({ roomId, indicator, unit, date_after, date_before, page, status, token }: { roomId: string | number, indicator: string, unit: string, date_after?: string, date_before?: string, page?: string, status?: string, token?: string }) {
  'use cache'
  cacheLife('minutes')
  const url = new URL(`/alerts/api/room/${roomId}/alerts`, baseUrl)

  if (indicator) url.searchParams.set('indicator', indicator)
  if (unit) url.searchParams.set('unit', unit)
  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (page) url.searchParams.set('page', page)
  if (status) url.searchParams.set('status', status)

  const res = await fetchWithAuth(`${url.pathname}${url.search}`, {}, token)

  return res
}

const _alertsAmbientalCached = unstable_cache(
  async (token: string, roomId: string | number, indicator: string, unit: string, page: string, date_after?: string, date_before?: string, status?: string) => {
    const url = new URL(`/alerts/api/ambiental/point/${roomId}/alerts/`, baseUrlAmbiental)

    if (indicator) url.searchParams.set('indicator', indicator)
    if (unit) url.searchParams.set('unit', unit)
    if (date_after) url.searchParams.set('date_after', date_after)
    if (date_before) url.searchParams.set('date_before', date_before)
    if (page) url.searchParams.set('page', page)
    if (status) url.searchParams.set('status', status)

    const res = await fetchWithAuthAmbiental(`${url.pathname}${url.search}`, {}, token)

    return res
  },
  ['ambiental-alerts'],
  {
    tags: [CACHE_TAGS.AMBIENTAL, CACHE_TAGS.ALERTS],
    revalidate: CACHE_DURATION.CRITICAL, // 30 seconds - alerts are critical
  }
)

export async function alertsAmbiental({ roomId, indicator, unit, date_after, date_before, page, status, token }: { roomId: string | number, indicator: string, unit: string, date_after?: string, date_before?: string, page: string, status?: string, token: string }) {
  const url = new URL(`/alerts/api/ambiental/point/${roomId}/alerts/`, baseUrlAmbiental)

  if (indicator) url.searchParams.set('indicator', indicator)
  if (unit) url.searchParams.set('unit', unit)
  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (page) url.searchParams.set('page', page)
  if (status) url.searchParams.set('status', status)

  const res = await fetchWithAuthAmbiental(`${url.pathname}${url.search}`, {}, token)

  return res
}