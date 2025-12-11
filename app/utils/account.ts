'use server'

import { fetchWithAuth, fetchWithAuthEnergy } from "../lib/api"


export const accountData = async () => {
    const res = await fetchWithAuthEnergy('/api/v1/accounts/list/')
    return res
}

export const accountDataOcupacional = async () => {
    const res = await fetchWithAuth('/enterprise/api/enterprise/detail/')
    return res
}
