'use server'

import { fetchWithAuthEnergy } from "../lib/api"


export const accountData = async () => {
    const res = await fetchWithAuthEnergy('/api/v1/accounts/list/')
    return res
}
