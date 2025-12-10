'use server'
import { fetchWithAuth, fetchWithAuthAmbiental } from "@/app/lib/api"
import { baseUrl } from "@/app/lib/constant"
import { RoomList } from "./type"
import { cacheLife } from "next/cache"

export async function detail() {
  'use cache'
  cacheLife('minutes')
  const res = await fetchWithAuth('/enterprise/api/enterprise/detail/')

  return res
}

export async function detailAmbiental() {

  'use cache'
  cacheLife('minutes')

  const res = await fetchWithAuthAmbiental('/enterprise/api/enterprise/detail/')

  return res
}

export async function roomsList({ search, status, headquarter, page, limit, offset, token }: RoomList) {

  'use cache'
  cacheLife('minutes')

  const url = new URL('/enterprise/api/enterprise/room-list/', baseUrl)

  if (search) url.searchParams.set('search', search)
  if (status) url.searchParams.set('status', status)
  if (headquarter) url.searchParams.set('headquarter', headquarter)
  if (page) url.searchParams.set('page', page)
  if (limit) url.searchParams.set('limit', limit)
  if (offset) url.searchParams.set('offset', offset)

  const res = await fetchWithAuth(`${url.pathname}${url.search}`, {}, token)
  return res
}

export async function roomsListAmbiental({ search, status, headquarter, page, limit, offset }: RoomList) {

  const url = new URL('enterprise/api/ambiental/enterprise/point-list/', baseUrl)

  if (search) url.searchParams.set('search', search)
  if (status) url.searchParams.set('status', status)
  if (headquarter) url.searchParams.set('headquarter', headquarter)
  if (page) url.searchParams.set('page', page)
  if (limit) url.searchParams.set('limit', limit)
  if (offset) url.searchParams.set('offset', offset)

  const res = await fetchWithAuthAmbiental(`${url.pathname}${url.search}`)
  return res
}





