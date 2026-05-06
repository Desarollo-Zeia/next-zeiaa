'use server'

import { fetchWithAuth, fetchWithAuthAmbiental, fetchWithAuthEnergy } from "@/app/lib/api"
import { baseUrl, baseUrlAmbiental, baseUrlEnergy } from "@/app/lib/constant"
import { getToken } from "@/app/lib/auth"
import { cacheLife, unstable_cache } from 'next/cache'
import { CACHE_DURATION, CACHE_TAGS } from "@/app/lib/cache"

interface VoltageFluctuationFilters {
  device?: string
  measurement_point?: string
  fluctuation_subtype?: string | string[]
  status?: string | string[]
  alert_status?: string | string[]
  phase_type?: string | string[]
  date_after?: string
  date_before?: string
  time_after?: string
  time_before?: string
  page?: string
  token: string
}

interface LatestByPhaseFilters {
  measurement_point?: string
  fluctuation_subtype?: string
  token: string
}

function appendRepeatableParam(url: URL, key: string, value: string | string[] | undefined) {
  if (!value) return
  if (Array.isArray(value)) {
    value.forEach((v) => url.searchParams.append(key, v))
  } else {
    url.searchParams.append(key, value)
  }
}

const _getVoltageFluctuationAlerts = unstable_cache(
  async (
    token: string,
    device?: string,
    measurement_point?: string,
    fluctuation_subtype?: string,
    status?: string,
    alert_status?: string,
    phase_type?: string,
    date_after?: string,
    date_before?: string,
    time_after?: string,
    time_before?: string,
    page?: string
  ) => {
    const url = new URL('/api/v1/alerts/energy/voltage-fluctuation/', baseUrlEnergy)

    if (device) url.searchParams.set('device', device)
    if (measurement_point) url.searchParams.set('measurement_point', measurement_point)
    if (fluctuation_subtype) {
      const parsed = JSON.parse(fluctuation_subtype) as string | string[]
      const values = Array.isArray(parsed) ? parsed : [parsed]
      values.forEach((v) => url.searchParams.append('fluctuation_subtype', v))
    }
    if (status) {
      const parsed = JSON.parse(status) as string | string[]
      const values = Array.isArray(parsed) ? parsed : [parsed]
      values.forEach((v) => url.searchParams.append('status', v))
    }
    if (alert_status) {
      const parsed = JSON.parse(alert_status) as string | string[]
      const values = Array.isArray(parsed) ? parsed : [parsed]
      values.forEach((v) => url.searchParams.append('alert_status', v))
    }
    if (phase_type) {
      const parsed = JSON.parse(phase_type) as string | string[]
      const values = Array.isArray(parsed) ? parsed : [parsed]
      values.forEach((v) => url.searchParams.append('phase_type', v))
    }
    if (date_after) url.searchParams.set('date_after', date_after)
    if (date_before) url.searchParams.set('date_before', date_before)
    if (time_after) url.searchParams.set('time_after', time_after)
    if (time_before) url.searchParams.set('time_before', time_before)
    if (page) url.searchParams.set('page', page)

    try {
      const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`, {}, token)
      return res
    } catch (error: any) {
      if (error.message?.includes('status: 404') && error.message?.includes('Página inválida')) {
        return { count: 0, next: null, previous: null, results: [] }
      }
      throw error
    }
  },
  ['voltage-fluctuation-alerts'],
  {
    tags: [CACHE_TAGS.ALERTS],
    revalidate: CACHE_DURATION.CRITICAL,
  }
)

export async function getVoltageFluctuationAlerts({
  device,
  measurement_point,
  fluctuation_subtype,
  status,
  alert_status,
  phase_type,
  date_after,
  date_before,
  time_after,
  time_before,
  page,
  token,
}: VoltageFluctuationFilters) {
  return _getVoltageFluctuationAlerts(
    token,
    device,
    measurement_point,
    fluctuation_subtype ? JSON.stringify(fluctuation_subtype) : undefined,
    status ? JSON.stringify(status) : undefined,
    alert_status ? JSON.stringify(alert_status) : undefined,
    phase_type ? JSON.stringify(phase_type) : undefined,
    date_after,
    date_before,
    time_after,
    time_before,
    page
  )
}

const _getVoltageFluctuationLatestByPhase = unstable_cache(
  async (
    token: string,
    measurement_point?: string,
    fluctuation_subtype?: string
  ) => {
    const url = new URL('/api/v1/alerts/energy/voltage-fluctuation/latest-by-phase/', baseUrlEnergy)

    if (measurement_point) url.searchParams.set('measurement_point', measurement_point)
    if (fluctuation_subtype) url.searchParams.set('fluctuation_subtype', fluctuation_subtype)

    const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`, {}, token)
    return res
  },
  ['voltage-fluctuation-latest-by-phase'],
  {
    tags: [CACHE_TAGS.ALERTS],
    revalidate: CACHE_DURATION.CRITICAL,
  }
)

export async function getVoltageFluctuationLatestByPhase({
  measurement_point,
  fluctuation_subtype,
  token,
}: LatestByPhaseFilters) {
  return _getVoltageFluctuationLatestByPhase(token, measurement_point, fluctuation_subtype)
}

const _getVoltageFluctuationAlertDetail = unstable_cache(
  async (token: string, alert_id: string) => {
    const url = new URL(`/api/v1/alerts/energy/voltage-fluctuation/${alert_id}/detail/`, baseUrlEnergy)

    const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`, {}, token)
    return res
  },
  ['voltage-fluctuation-alert-detail'],
  {
    tags: [CACHE_TAGS.ALERTS],
    revalidate: CACHE_DURATION.CRITICAL,
  }
)

export async function getVoltageFluctuationAlertDetail({
  alert_id,
  token,
}: {
  alert_id: string | number
  token: string
}) {
  return _getVoltageFluctuationAlertDetail(token, String(alert_id))
}

// Excel exports - no cache because Blobs cannot be serialized
export async function getVoltageFluctuationAlertsExcel({
  device,
  measurement_point,
  fluctuation_subtype,
  status,
  alert_status,
  phase_type,
  date_after,
  date_before,
  time_after,
  time_before,
}: Omit<VoltageFluctuationFilters, 'page' | 'token'>) {
  const token = await getToken()
  if (!token) throw new Error('No auth token')

  const url = new URL('/api/v1/alerts/energy/voltage-fluctuation/report/', baseUrlEnergy)

  if (device) url.searchParams.set('device', device)
  if (measurement_point) url.searchParams.set('measurement_point', measurement_point)
  if (fluctuation_subtype) {
    const values = Array.isArray(fluctuation_subtype) ? fluctuation_subtype : [fluctuation_subtype]
    values.forEach((v) => url.searchParams.append('fluctuation_subtype', v))
  }
  if (status) {
    const values = Array.isArray(status) ? status : [status]
    values.forEach((v) => url.searchParams.append('status', v))
  }
  if (alert_status) {
    const values = Array.isArray(alert_status) ? alert_status : [alert_status]
    values.forEach((v) => url.searchParams.append('alert_status', v))
  }
  if (phase_type) {
    const values = Array.isArray(phase_type) ? phase_type : [phase_type]
    values.forEach((v) => url.searchParams.append('phase_type', v))
  }
  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (time_after) url.searchParams.set('time_after', time_after)
  if (time_before) url.searchParams.set('time_before', time_before)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`, {}, token)
  return res
}

export async function getVoltageFluctuationLatestByPhaseExcel({
  measurement_point,
  fluctuation_subtype,
}: Omit<LatestByPhaseFilters, 'token'>) {
  const token = await getToken()
  if (!token) throw new Error('No auth token')

  const url = new URL('/api/v1/alerts/energy/voltage-fluctuation/latest-by-phase/report/', baseUrlEnergy)

  if (measurement_point) url.searchParams.set('measurement_point', measurement_point)
  if (fluctuation_subtype) url.searchParams.set('fluctuation_subtype', fluctuation_subtype)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`, {}, token)
  return res
}

// Legacy alerts functions for ocupacional and ambiental modules
import { fetchWithAuth, fetchWithAuthAmbiental } from "@/app/lib/api"
import { baseUrl, baseUrlAmbiental } from "@/app/lib/constant"

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
  'use cache'
  cacheLife('minutes')
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
