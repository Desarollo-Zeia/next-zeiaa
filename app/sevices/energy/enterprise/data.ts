'use server'
import { fetchWithAuthEnergy } from "@/app/lib/api"

export async function getHeadquarters() {

  return await fetchWithAuthEnergy(`/api/v1/user/headquarters/`)

}

export async function getEnergyMeasurementPoints({ headquarterId } : { headquarterId : string}) {

  return await fetchWithAuthEnergy(`/api/v1/headquarter/${headquarterId}/measurement-points/`)

}


export async function getEnergyCompanyDetails() {
  return await fetchWithAuthEnergy(`/api/v1/enterprises/1/`)
}

