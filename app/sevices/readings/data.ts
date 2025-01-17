'use server'
import { fetchWithAuth } from "@/app/lib/api"
import { baseUrl } from "@/app/lib/constant"

export async function roomLastData({ roomId } : { roomId : string | number } ) {
  const res = await fetchWithAuth(`/readings/api/room/${roomId}/general/last`)
  return res 
}

export async function readingsData({ roomId, indicator = 'CO2', unit = 'PPM', date_after, date_before, page  } : { roomId : string | number, indicator: string, unit: string, date_after?: string,  date_before?: string, page?: string} ) {

  const url = new URL(`/readings/api/room/${roomId}/indicator`, baseUrl)

  if (indicator) url.searchParams.set('indicator', indicator)
  if (unit) url.searchParams.set('unit', unit)
  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (page) url.searchParams.set('page', page)

  const res = await fetchWithAuth(`${url.pathname}${url.search}`)

  return res 
}

export async function readingsPeaks({ roomId, indicator = 'CO2', unit = 'PPM', date_after, date_before, page  } : { roomId : string | number, indicator: string, unit: string, date_after?: string,  date_before?: string, page?: string}) {

  const url = new URL(`/readings/api/room/${roomId}/indicator/metrics/high/history`, baseUrl)

  if (indicator) url.searchParams.set('indicator', indicator)
  if (unit) url.searchParams.set('unit', unit)
  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (page) url.searchParams.set('page', page)

    const res = await fetchWithAuth(`${url.pathname}${url.search}`)

    return res 
}

export async function readingsGraph({ roomId, indicator, unit, date_after, date_before  } : { roomId : string | number, indicator: string, unit: string, date_after?: string,  date_before?: string}) {

  const url = new URL(`/readings/api/room/${roomId}/indicator/graph`, baseUrl)

  if (indicator) url.searchParams.set('indicator', indicator)
  if (unit) url.searchParams.set('unit', unit)
  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)

  const res = await fetchWithAuth(`${url.pathname}${url.search}`)

  return res 
}

export async function readingsCovid({ roomId, indicator, unit, date_after, date_before, page } : { roomId : string | number, indicator: string, unit: string, date_after?: string,  date_before?: string, page: string}) {

  const url = new URL(`/readings/api/room/${roomId}/covid/metrics/new-history/`, baseUrl)

  if (indicator) url.searchParams.set('indicator', indicator)
  if (unit) url.searchParams.set('unit', unit)
  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (page) url.searchParams.set('page', page)


  const res = await fetchWithAuth(`${url.pathname}${url.search}`)

  return res 
}

export async function readingsCovidBaselines({ roomId, date_after, date_before } : { roomId : string | number, date_after?: string,  date_before?: string}) {

  const url = new URL(`/readings/api/room/${roomId}/covid/baselines/`, baseUrl)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)

  const res = await fetchWithAuth(`${url.pathname}${url.search}`)

  return res 
}




export async function roomGeneralData({ roomId } : { roomId : string | number } ) {
  const res = await fetchWithAuth(`/enterprise/api/room/${roomId}/`)
  return res 
}

export async function readinsgExcel({
  roomId,
  indicator = 'CO2',
  unit = 'PPM',
  date_after,
  date_before,
}: {
  roomId: string | number;
  indicator: string;
  unit: string;
  date_after?: string;
  date_before?: string;
}) {
  const url = new URL(`/readings/api/room/${roomId}/indicator/report`, baseUrl);

  // Agregar parámetros a la URL
  if (indicator) url.searchParams.set('indicator', indicator);
  if (unit) url.searchParams.set('unit', unit);
  if (date_after) url.searchParams.set('date_after', date_after);
  if (date_before) url.searchParams.set('date_before', date_before);

  // console.log(`${url.pathname}${url.search}`)
  const res = await fetchWithAuth(`${url.pathname}${url.search}`)
  

  return res
}

