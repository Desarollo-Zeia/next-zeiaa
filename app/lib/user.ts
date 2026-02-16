'use server'

import { cookies } from 'next/headers'

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const authData = cookieStore.get('authData')?.value
  
  if (authData) {
    try {
      return JSON.parse(authData)
    } catch {
      return null
    }
  }
  
  return null
}
