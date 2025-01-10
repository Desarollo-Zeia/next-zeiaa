import { fetchWithAuth } from "@/app/lib/api"
import { baseUrl } from "@/app/lib/constant"

export async function roomLastData({ roomId } : { roomId : string | number } ) {
  const res = await fetchWithAuth(`/readings/api/room/${roomId}/general/last`)
  return res 
}

export async function readingsData({ roomId, indicator = 'CO2', unit = 'PPM' } : { roomId : string | number, indicator: string, unit: string } ) {

  const url = new URL(`/readings/api/room/${roomId}/indicator`, baseUrl)

  if (indicator) url.searchParams.set('indicator', indicator)
  if (unit) url.searchParams.set('unit', unit)

  const res = await fetchWithAuth(`${url.pathname}${url.search}`)

  return res 
}

export async function roomGeneralData({ roomId } : { roomId : string | number } ) {
  const res = await fetchWithAuth(`/enterprise/api/room/${roomId}/`)
  return res 
}


