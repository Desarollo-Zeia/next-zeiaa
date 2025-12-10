'use server'
import { fetchWithAuth, fetchWithAuthAmbiental } from "@/app/lib/api"
import { baseUrl } from "@/app/lib/constant"
import { cacheLife, unstable_cache } from 'next/cache'
import { CACHE_DURATION, CACHE_TAGS } from "@/app/lib/cache"
import { getToken } from "@/app/lib/auth"


// const _roomLastDataCached = unstable_cache(
//   async (token: string, roomId: string | number) => {
//     const res = await fetchWithAuth(`/readings/api/room/${roomId}/general/last`, {}, token)
//     return res
//   },
//   ['ocupacional-room-last-data'],
//   {
//     tags: [CACHE_TAGS.OCUPACIONAL, CACHE_TAGS.READINGS],
//     revalidate: CACHE_DURATION.DYNAMIC, // 1 minute - last readings change frequently
//   }
// )

export async function roomLastData({ roomId, token }: { roomId: string | number, token: string }) {
  'use cache'
  cacheLife('minutes')
  const res = await fetchWithAuth(`/readings/api/room/${roomId}/general/last`, {}, token)
  return res
}

const _roomLastDataAmbientalCached = unstable_cache(
  async (token: string, roomId: string | number) => {
    const res = await fetchWithAuthAmbiental(`/readings/api/ambiental/point/${roomId}/general/last`, {}, token)
    return res
  },
  ['ambiental-room-last-data'],
  {
    tags: [CACHE_TAGS.AMBIENTAL, CACHE_TAGS.READINGS],
    revalidate: CACHE_DURATION.DYNAMIC, // 1 minute - last readings change frequently
  }
)

export async function roomLastDataAmbiental({ roomId }: { roomId: string | number }) {
  const token = await getToken()
  if (!token) throw new Error('No auth token')
  return _roomLastDataAmbientalCached(token, roomId)
}

export async function readingsData({ roomId, indicator = 'CO2', unit = 'PPM', date_after, date_before, page, status, hour_before, hour_after, ordering, token }: { roomId: string | number, indicator?: string, unit?: string, date_after?: string, date_before?: string, page?: string, status?: string, hour_before?: string, hour_after?: string, ordering?: string, token?: string }) {
  'use cache'
  cacheLife('minutes')

  const url = new URL(`/readings/api/room/${roomId}/indicator`, baseUrl)

  if (indicator) url.searchParams.set('indicator', indicator)
  if (unit) url.searchParams.set('unit', unit)
  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (page) url.searchParams.set('page', page)
  if (status) url.searchParams.set('status', status)
  if (hour_before) url.searchParams.set('hour_before', hour_before)
  if (hour_after) url.searchParams.set('hour_after', hour_after)
  if (ordering) url.searchParams.set('ordering', ordering)

  const res = await fetchWithAuth(`${url.pathname}${url.search}`, {}, token)

  return res
}



export async function readingsDataAmbiental({ roomId, indicator = 'CO2', unit = 'PPM', date_after, date_before, page, status }: { roomId: string | number, indicator: string, unit: string, date_after?: string, date_before?: string, page?: string, status?: string }) {

  const url = new URL(`/readings/api/ambiental/point/${roomId}/indicator`, baseUrl)

  if (indicator) url.searchParams.set('indicator', indicator)
  if (unit) url.searchParams.set('unit', unit)
  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (status) url.searchParams.set('status', status)
  if (page) url.searchParams.set('page', page)

  const res = await fetchWithAuthAmbiental(`${url.pathname}${url.search}`)

  return res
}

export async function readingsPeaks({ roomId, indicator = 'CO2', unit = 'PPM', date_after, date_before, page, status, token }: { roomId: string | number, indicator: string, unit: string, date_after?: string, date_before?: string, page?: string, status?: string, token?: string }) {
  'use cache'
  cacheLife('minutes')

  const url = new URL(`/readings/api/room/${roomId}/indicator/metrics/high/history?indicator=CO2&unit=PPM&page=1&date_after=2023-01-03`, baseUrl)



  if (indicator) url.searchParams.set('indicator', indicator)
  if (unit) url.searchParams.set('unit', unit)
  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (status) url.searchParams.set('status', status)
  if (page) url.searchParams.set('page', page)

  const res = await fetchWithAuth(`${url.pathname}${url.search}`, {}, token)

  return res
}

const _readingsGraphCached = unstable_cache(
  async (token: string, roomId: string | number, indicator: string, unit: string, date_after?: string, date_before?: string, hour_before?: string, hour_after?: string) => {
    const url = new URL(`/readings/api/room/${roomId}/indicator/graph`, baseUrl)

    if (indicator) url.searchParams.set('indicator', indicator)
    if (unit) url.searchParams.set('unit', unit)
    if (date_after) url.searchParams.set('date_after', date_after)
    if (date_before) url.searchParams.set('date_before', date_before)
    if (hour_before) url.searchParams.set('hour_before', hour_before)
    if (hour_after) url.searchParams.set('hour_after', hour_after)

    const res = await fetchWithAuth(`${url.pathname}${url.search}`, {}, token)

    return res
  },
  ['ocupacional-readings-graph'],
  {
    tags: [CACHE_TAGS.OCUPACIONAL, CACHE_TAGS.READINGS],
    revalidate: CACHE_DURATION.MEDIUM, // 5 minutes - graphs can be cached longer
  }
)

export async function readingsReal({ roomId, indicator, unit, date_after, date_before, hour_before, hour_after, token }: { roomId: string | number, indicator: string, unit: string, date_after?: string, date_before?: string, hour_before?: string, hour_after?: string, token?: string }) {
  const url = new URL(`/readings/api/room/${roomId}/indicator/graph`, baseUrl)

  if (indicator) url.searchParams.set('indicator', indicator)
  if (unit) url.searchParams.set('unit', unit)
  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  // if (hour_before) url.searchParams.set('hour_before', hour_before)
  // if (hour_after) url.searchParams.set('hour_after', hour_after)

  // POR QUE DE LA NADA

  const res = await fetchWithAuth(`${url.pathname}${url.search}`, {}, token)

  return res
}

export async function readingsGraph({ indicator, unit, date_after, date_before, hour_before, hour_after, token }: { roomId?: string | number, indicator: string, unit: string, date_after?: string, date_before?: string, hour_before?: string, hour_after?: string, token?: string }) {

  'use cache'
  cacheLife('minutes')
  const url = new URL(`/readings/api/rooms/indicators/graphs`, baseUrl)

  if (indicator) url.searchParams.set('indicator', indicator)
  if (unit) url.searchParams.set('unit', unit)
  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)

  const res = await fetchWithAuth(`${url.pathname}${url.search}`, {}, token)

  return res
}


const _readingsGraphAmbientalCached = unstable_cache(
  async (token: string, roomId: string | number, indicator: string, unit: string, date_after?: string, date_before?: string, hour_after?: string, hour_before?: string) => {
    const url = new URL(`/readings/api/ambiental/point/${roomId}/indicator/graph`, baseUrl)

    if (indicator) url.searchParams.set('indicator', indicator)
    if (unit) url.searchParams.set('unit', unit)
    if (date_after) url.searchParams.set('date_after', date_after)
    if (date_before) url.searchParams.set('date_before', date_before)
    if (hour_before) url.searchParams.set('hour_before', hour_before)
    if (hour_after) url.searchParams.set('hour_after', hour_after)

    const res = await fetchWithAuthAmbiental(`${url.pathname}${url.search}`, {}, token)

    return res
  },
  ['ambiental-readings-graph'],
  {
    tags: [CACHE_TAGS.AMBIENTAL, CACHE_TAGS.READINGS],
    revalidate: CACHE_DURATION.MEDIUM, // 5 minutes - graphs can be cached longer
  }
)

export async function readingsGraphAmbiental({ roomId, indicator, unit, date_after, date_before, hour_before, hour_after }: { roomId: string | number, indicator: string, unit: string, date_after?: string, date_before?: string, hour_after: string, hour_before: string }) {
  const token = await getToken()
  if (!token) throw new Error('No auth token')
  return _readingsGraphAmbientalCached(token, roomId, indicator, unit, date_after, date_before, hour_after, hour_before)
}



export async function readingsCovid({ roomId, indicator, unit, date_after, date_before, page }: { roomId?: string | number, indicator: string, unit: string, date_after?: string, date_before?: string, page: string }) {

  const url = new URL(`/readings/api/room/${roomId}/covid/metrics/new-history/`, baseUrl)

  if (indicator) url.searchParams.set('indicator', indicator)
  if (unit) url.searchParams.set('unit', unit)
  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (page) url.searchParams.set('page', page)


  const res = await fetchWithAuth(`${url.pathname}${url.search}`)

  return res
}

export async function readingsCovidBaselines({ roomId, date_after, date_before }: { roomId?: string | number, date_after?: string, date_before?: string }) {

  const url = new URL(`/readings/api/room/${roomId}/covid/baselines/`, baseUrl)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)

  const res = await fetchWithAuth(`${url.pathname}${url.search}`)

  return res
}

export async function readingsCovidDetail({ date, page, roomId, hour_before, hour_after, risk }: { date?: string, page?: string, roomId?: string | number, hour_before?: string, hour_after?: string, risk?: string }) {

  const url = new URL(`/readings/api/room/${roomId}/covid/metrics/new-detail/`, baseUrl)

  if (date) url.searchParams.set('date', date)
  if (page) url.searchParams.set('page', page)
  if (hour_before) url.searchParams.set('hour_before', hour_before)
  if (hour_after) url.searchParams.set('hour_after', hour_after)
  if (risk) url.searchParams.set('risk', risk)


  const res = await fetchWithAuth(`${url.pathname}${url.search}`)

  return res
}

export async function riskReached({ roomId, date }: { roomId?: string | number, date?: string }) {

  const url = new URL(`/readings/api/room/${roomId}/covid/metrics/new-detail/risks/`, baseUrl)

  if (date) url.searchParams.set('date', date)

  const res = await fetchWithAuth(`${url.pathname}${url.search}`)

  return res
}


export async function roomGeneralData({ roomId, token }: { roomId: string | number, token?: string }) {
  'use cache'
  cacheLife('minutes')
  const res = await fetchWithAuth(`/enterprise/api/room/${roomId}/`, {}, token)
  return res
}

export async function roomGeneralDataAmbiental({ roomId }: { roomId: string | number }) {
  const res = await fetchWithAuthAmbiental(`/enterprise/api/ambiental/point/${roomId}/`)
  return res
}

export async function readinsgExcel({
  // room,
  indicator = 'CO2',
  unit = 'PPM',
  date_after,
  date_before,
}: {
  room: string | number;
  indicator: string;
  unit: string;
  date_after?: string;
  date_before?: string;
}) {
  const url = new URL(`/readings/api/headquarter/49/room/indicator/report/all-rooms?frequency=hourly`, baseUrl);

  if (indicator) url.searchParams.set('indicator', indicator);
  if (unit) url.searchParams.set('unit', unit);
  if (date_after) url.searchParams.set('date_after', date_after);
  if (date_before) url.searchParams.set('date_before', date_before);

  const res = await fetchWithAuth(`${url.pathname}${url.search}`)

  return res
}

export async function readinsgExcelAmbiental({
  room,
  indicator = 'CO2',
  unit = 'PPM',
  date_after,
  date_before,
}: {
  room: string | number;
  indicator: string;
  unit: string;
  date_after?: string;
  date_before?: string;
}) {
  const url = new URL(`/readings/api/ambiental/point/${room}/indicator/report`, baseUrl);

  if (indicator) url.searchParams.set('indicator', indicator);
  if (unit) url.searchParams.set('unit', unit);
  if (date_after) url.searchParams.set('date_after', date_after);
  if (date_before) url.searchParams.set('date_before', date_before);

  const res = await fetchWithAuthAmbiental(`${url.pathname}${url.search}`)

  return res
}

