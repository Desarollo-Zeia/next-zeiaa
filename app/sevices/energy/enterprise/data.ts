'use server'
import { fetchWithAuthEnergy } from "@/app/lib/api"

export async function getEnergyCompanyDetails({ headquarterId } : { headquarterId?: string }) {

  return await fetchWithAuthEnergy(`/api/v1/enterprises/${headquarterId}`)

}