import { fetchWithAuth } from "@/app/lib/api"

export async function getRooms() {
  return await fetchWithAuth('/enterprise/api/enterprise/basic/room-list/')
}

export async function getHeadquarters() {
  return await fetchWithAuth('/enterprise/api/enterprise/basic/headquearter-list/')
}
