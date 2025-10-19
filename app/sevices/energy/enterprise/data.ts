'use server'
import { fetchWithAuthEnergy } from "@/app/lib/api"

import { cache } from 'react'

export const getHeadquarters = cache(async () => {
  return await fetchWithAuthEnergy(`/api/v1/user/headquarters/`)
})

export async function getEnergyMeasurementPointPanels({ headquarterId } : { headquarterId : string}) {

  return await fetchWithAuthEnergy(`/api/v1/headquarter/${headquarterId}/measurement-points/`)

}


export async function getEnergyCompanyDetails() {
  return await fetchWithAuthEnergy(`/api/v1/enterprises/1/`)
}

