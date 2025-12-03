'use server'
import { fetchWithAuthEnergy } from "@/app/lib/api"
import { baseUrlEnergy } from "@/app/lib/constant"

export async function current({ headquarterId, panelId, point, date_after, date_before, status, page, token }: { date_after?: string, date_before?: string, panelId?: string, headquarterId?: string, status?: string, page?: string, point: string, token?: string }) {
  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/${panelId}/measurement_point/${point}/current-imbalanced`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (status) url.searchParams.set('status', status)
  if (page) url.searchParams.set('page', page)


  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`, {}, token)

  return res
}

export async function currentGraph({ headquarterId, panelId, point, date_after, date_before, status, page, token }: { date_after?: string, date_before?: string, panelId?: string, headquarterId?: string, status?: string, page?: string, point: string, token?: string }) {

  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/${panelId}/measurement_point/${point}/unbalanced-current/counters-graph`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (status) url.searchParams.set('status', status)
  if (page) url.searchParams.set('page', page)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`, {}, token)

  return res
}

export async function voltage({ headquarterId, date_after, date_before, status, page, panelId, point, token }: { date_after?: string, date_before?: string, panelId?: string, headquarterId?: string, status?: string, page?: string, point?: string, token?: string }) {

  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/${panelId}/measurement_point/${point}/voltage-imbalanced`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (status) url.searchParams.set('status', status)
  if (page) url.searchParams.set('page', page)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`, {}, token)

  return res
}


export async function voltageGraph({ headquarterId, panelId, point, date_after, date_before, status, token }: { date_after?: string, date_before?: string, panelId?: string, headquarterId?: string, status?: string, point?: string, token?: string }) {

  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/${panelId}/measurement_point/${point}/unbalanced-voltage/counters-graph`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (status) url.searchParams.set('status', status)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`, {}, token)

  return res
}


export async function threeMostUnbalanced({ headquarterId }: { headquarterId?: string }) {

  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/most-three-unbalanced`, baseUrlEnergy)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`)

  return res
}



