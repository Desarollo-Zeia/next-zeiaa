import { fetchWithAuth } from "@/app/lib/api"
import { baseUrl } from "@/app/lib/constant"
import { RoomList } from "./type"

export async function detail() {
  const res = await fetchWithAuth('/enterprise/api/enterprise/detail/')
  
  return res 
}

export async function roomsList({ search, status, headquarter, page, limit, offset } : RoomList) {

  const url = new URL('enterprise/api/enterprise/room-list/', baseUrl)

  if (search) url.searchParams.set('search', search)
  if (status) url.searchParams.set('status', status)
  if (headquarter) url.searchParams.set('headquarter', headquarter)
  if (page) url.searchParams.set('page', page)
  if (limit) url.searchParams.set('limit', limit)
  if (offset) url.searchParams.set('offset', offset)

  const res = await fetchWithAuth(`${url.pathname}${url.search}`)
  return res
}


