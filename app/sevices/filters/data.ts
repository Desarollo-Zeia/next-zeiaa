import { fetchWithAuth, fetchWithAuthAmbiental, fetchWithAuthEnergy } from "@/app/lib/api"

export async function getRooms() {
  return await fetchWithAuth('/enterprise/api/enterprise/basic/room-list/')
}

export async function getRoomsAmbiental() {
  return await fetchWithAuthAmbiental('/enterprise/api/ambiental/enterprise/basic/point-list/')
}


export async function getHeadquarters() {
  return await fetchWithAuth('/enterprise/api/enterprise/basic/headquearter-list/')
}

export async function getHeadquartersAmbiental() {
  return await fetchWithAuthAmbiental('/enterprise/api/ambiental/enterprise/basic/headquearter-list/')
}


export async function getMeasurementPoints({ electricalpanelId } : { electricalpanelId: string }) {
  return await fetchWithAuthEnergy(`/api/v1/electrical-panel/${electricalpanelId}/devices/measurement-points/`)
}
