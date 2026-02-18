'use server'
import { fetchWithAuthEnergy } from "@/app/lib/api"
import { baseUrlEnergy } from "@/app/lib/constant"
import { cacheLife } from "next/cache"

export async function consumptionCalculator({ headquarterId, date_after, date_before, token }: { date_after?: string, date_before?: string, panelId?: string, headquarterId?: string, token?: string }) {

  'use cache'
  cacheLife('minutes')

  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/rate-consumption`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`, {}, token)

  return res
}

export async function consumptionCalculatorMonthly({ headquarterId, filter_month, token }: { headquarterId?: string, filter_month?: string, token?: string }) {

  'use cache'
  cacheLife('minutes')

  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/rate-consumption/monthly`, baseUrlEnergy)

  if (filter_month) url.searchParams.set('filter_month', filter_month)

  try {
    const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`, {}, token)
    return res
  } catch (error) {
    return { detail: error instanceof Error ? error.message : 'Error fetching monthly consumption', consumption: null }
  }
}

export async function consumptionInvoice({ headquarterId, token }: { date_after?: string, date_before?: string, panelId?: string, headquarterId?: string, token?: string }) {

  'use cache'
  cacheLife('minutes')

  const res = await fetchWithAuthEnergy(`/api/v1/headquarter/${headquarterId}/electrical_panel/rate-consumption/cycle`, {}, token)

  return res
}

export async function consumptionTable({ headquarterId, date_after, date_before, page, token }: { date_after?: string, date_before?: string, panelId?: string, headquarterId?: string, page?: string, token?: string }) {

  'use cache'
  cacheLife('minutes')

  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/rate-consumption/resume`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (page) url.searchParams.set('page', page)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`, {}, token)

  return res
}

export async function consumptionGraph({ headquarterId, group_by, date_after, date_before, token }: { date_after?: string, date_before?: string, panelId?: string, headquarterId?: string, group_by?: string, token?: string }) {

  'use cache'
  cacheLife('minutes')


  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/rate-consumption/historical`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (group_by) url.searchParams.set('group_by', group_by)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`, {}, token)

  return res
}

export async function consumptionTariff({ headquarterId, token }: { panelId?: string, headquarterId?: string, token?: string }) {

  'use cache'
  cacheLife('minutes')

  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/rate-consumption/detail-tariff`, baseUrlEnergy)

  const res = await fetchWithAuthEnergy(`${url.pathname}`, {}, token)

  return res
}

