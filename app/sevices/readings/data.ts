'use server'
import { fetchWithAuth, fetchWithAuthAmbiental } from "@/app/lib/api"
import { baseUrl } from "@/app/lib/constant"


export async function roomLastData({ roomId }: { roomId: string | number }) {
  const res = await fetchWithAuth(`/readings/api/room/${roomId}/general/last`)
  return res
}

export async function roomLastDataAmbiental({ roomId }: { roomId: string | number }) {
  const res = await fetchWithAuthAmbiental(`/readings/api/ambiental/point/${roomId}/general/last`)
  return res
}

export async function readingsData({ roomId, indicator = 'CO2', unit = 'PPM', date_after, date_before, page, status, hour_before, hour_after, ordering }: { roomId: string | number, indicator: string, unit: string, date_after?: string, date_before?: string, page?: string, status?: string, hour_before?: string, hour_after?: string, ordering?: string }) {

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

  const res = await fetchWithAuth(`${url.pathname}${url.search}`)

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

export async function readingsPeaks({ roomId, indicator = 'CO2', unit = 'PPM', date_after, date_before, page, status }: { roomId: string | number, indicator: string, unit: string, date_after?: string, date_before?: string, page?: string, status?: string }) {

  const url = new URL(`/readings/api/room/${roomId}/indicator/metrics/high/history`, baseUrl)

  if (indicator) url.searchParams.set('indicator', indicator)
  if (unit) url.searchParams.set('unit', unit)
  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (status) url.searchParams.set('status', status)

  if (page) url.searchParams.set('page', page)

  const res = await fetchWithAuth(`${url.pathname}${url.search}`)

  return res
}

export async function readingsGraph({ roomId, indicator, unit, date_after, date_before, hour_before, hour_after }: { roomId: string | number, indicator: string, unit: string, date_after?: string, date_before?: string, hour_before: string, hour_after: string }) {

  const url = new URL(`/readings/api/room/${roomId}/indicator/graph`, baseUrl)

  if (indicator) url.searchParams.set('indicator', indicator)
  if (unit) url.searchParams.set('unit', unit)
  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (hour_before) url.searchParams.set('hour_before', hour_before)
  if (hour_after) url.searchParams.set('hour_after', hour_after)


  const res = await fetchWithAuth(`${url.pathname}${url.search}`)

  return res
}

export async function readingsGraphAmbiental({ roomId, indicator, unit, date_after, date_before, hour_before, hour_after }: { roomId: string | number, indicator: string, unit: string, date_after?: string, date_before?: string, hour_after: string, hour_before: string }) {

  const url = new URL(`/readings/api/ambiental/point/${roomId}/indicator/graph`, baseUrl)

  if (indicator) url.searchParams.set('indicator', indicator)
  if (unit) url.searchParams.set('unit', unit)
  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (hour_before) url.searchParams.set('hour_before', hour_before)
  if (hour_after) url.searchParams.set('hour_after', hour_after)

  const res = await fetchWithAuthAmbiental(`${url.pathname}${url.search}`)

  return res
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





export async function roomGeneralData({ roomId }: { roomId: string | number }) {
  const res = await fetchWithAuth(`/enterprise/api/room/${roomId}/`)
  return res
}

export async function roomGeneralDataAmbiental({ roomId }: { roomId: string | number }) {
  const res = await fetchWithAuthAmbiental(`/enterprise/api/ambiental/point/${roomId}/`)
  return res
}

export async function readinsgExcel({
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
  const url = new URL(`/readings/api/room/${room}/indicator/report`, baseUrl);

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

