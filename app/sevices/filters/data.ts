'use server'
import { fetchWithAuth, fetchWithAuthAmbiental, fetchWithAuthEnergy } from "@/app/lib/api"
import { cacheLife } from 'next/cache'

export async function getRooms(token?: string) {
  'use cache'
  cacheLife('minutes')

  const res = await fetchWithAuth('/enterprise/api/enterprise/basic/room-list/', {}, token)
  return res
}

export async function getRoomsAmbiental({ token }: { token: string }) {
  'use cache'
  cacheLife('minutes')
  return await fetchWithAuthAmbiental('/enterprise/api/ambiental/enterprise/basic/point-list/', {}, token)

}

export async function getHeadquartersOcupacional({ token }: { token: string }) {
  'use cache'
  cacheLife('minutes')
  return await fetchWithAuth('/enterprise/api/enterprise/basic/headquearter-list/', {}, token)
}

export async function getHeadquarters(token: string) {
  'use cache'
  cacheLife('minutes')
  return await fetchWithAuthEnergy('/api/v1/user/headquarters/', {}, token)
}

export async function getHeadquartersAmbiental({ token }: { token: string }) {
  'use cache'
  cacheLife('minutes')
  return await fetchWithAuthAmbiental('/enterprise/api/ambiental/enterprise/basic/headquearter-list/', {}, token)

}

export async function getMeasurementPoints({ electricalpanelId, token }: { electricalpanelId: string, token: string }) {
  'use cache'
  cacheLife('minutes')
  return await fetchWithAuthEnergy(`/api/v1/electrical-panel/${electricalpanelId}/devices/measurement-points/`, {}, token)

}
