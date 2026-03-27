'use server'
import { fetchWithAuthEnergy } from "@/app/lib/api"
import { baseUrlEnergy } from "@/app/lib/constant"
import { cacheLife } from 'next/cache'
import { cache } from 'react'

const consumptionCalculatorCached = cache(async (headquarterId: string, date_after?: string, date_before?: string, token?: string) => {
  'use cache'
  cacheLife('minutes')

  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/rate-consumption`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`, {}, token)

  return res
})

const consumptionCalculatorMonthlyCached = cache(async (headquarterId: string, date_after?: string, date_before?: string, token?: string) => {
  'use cache'
  cacheLife('minutes')

  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/rate-consumption/date-range`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)

  try {
    const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`, {}, token)
    return res
  } catch (error) {
    return { detail: error instanceof Error ? error.message : 'Error fetching monthly consumption', consumption: null }
  }
})

const consumptionInvoiceCached = cache(async (headquarterId: string, token?: string) => {
  'use cache'
  cacheLife('hours')

  const res = await fetchWithAuthEnergy(`/api/v1/headquarter/${headquarterId}/electrical_panel/rate-consumption/cycle`, {}, token)

  return res
})

const consumptionTableCached = cache(async (headquarterId: string, date_after?: string, date_before?: string, page?: string, token?: string) => {
  'use cache'
  cacheLife('minutes')

  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/rate-consumption/resume`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (page) url.searchParams.set('page', page)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`, {}, token)

  return res
})

const consumptionGraphCached = cache(async (headquarterId: string, group_by?: string, date_after?: string, date_before?: string, token?: string) => {
  'use cache'
  cacheLife('minutes')

  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/rate-consumption/historical`, baseUrlEnergy)

  if (date_after) url.searchParams.set('date_after', date_after)
  if (date_before) url.searchParams.set('date_before', date_before)
  if (group_by) url.searchParams.set('group_by', group_by)

  const res = await fetchWithAuthEnergy(`${url.pathname}${url.search}`, {}, token)

  return res
})

const consumptionTariffCached = cache(async (headquarterId: string, token?: string) => {
  'use cache'
  cacheLife('hours')

  const url = new URL(`/api/v1/headquarter/${headquarterId}/electrical_panel/rate-consumption/detail-tariff`, baseUrlEnergy)

  const res = await fetchWithAuthEnergy(`${url.pathname}`, {}, token)

  return res
})

export async function consumptionCalculator({ headquarterId, date_after, date_before, token }: { date_after?: string, date_before?: string, panelId?: string, headquarterId?: string, token?: string }) {
  return await consumptionCalculatorCached(headquarterId!, date_after, date_before, token)
}

export async function consumptionCalculatorMonthly({ headquarterId, date_after, date_before, token }: { headquarterId?: string, date_after?: string, date_before?: string, token?: string }) {
  return await consumptionCalculatorMonthlyCached(headquarterId!, date_after, date_before, token)
}

export async function consumptionInvoice({ headquarterId, token }: { date_after?: string, date_before?: string, panelId?: string, headquarterId?: string, token?: string }) {
  return await consumptionInvoiceCached(headquarterId!, token)
}

export async function consumptionTable({ headquarterId, date_after, date_before, page, token }: { date_after?: string, date_before?: string, panelId?: string, headquarterId?: string, page?: string, token?: string }) {
  return await consumptionTableCached(headquarterId!, date_after, date_before, page, token)
}

export async function consumptionGraph({ headquarterId, group_by, date_after, date_before, token }: { date_after?: string, date_before?: string, panelId?: string, headquarterId?: string, group_by?: string, token?: string }) {
  return await consumptionGraphCached(headquarterId!, group_by, date_after, date_before, token)
}

export async function consumptionTariff({ headquarterId, token }: { panelId?: string, headquarterId?: string, token?: string }) {
  return await consumptionTariffCached(headquarterId!, token)
}

