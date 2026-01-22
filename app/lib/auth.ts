import { cookies } from 'next/headers'
import { cache } from 'react'

/**
 * getToken - Obtiene el token de autenticación con deduplicación por request
 * 
 * Usa React.cache() para deduplicar llamadas dentro del mismo request.
 * Múltiples componentes pueden llamar a getToken() y solo se ejecutará una vez.
 * 
 * Impacto: Evita lecturas redundantes de cookies en componentes anidados
 */
export const getToken = cache(async (): Promise<string | undefined> => {
  const cookieStore = await cookies()
  return cookieStore.get('authToken')?.value
})

export async function setToken(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('authToken', token, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 
  })
}

export async function setCompanyData(data: any): Promise<void> { // eslint-disable-line @typescript-eslint/no-explicit-any
  const cookieStore = await cookies()
  cookieStore.set('authData', JSON.stringify(data), { // Serializa el objeto
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 
  })
}

/**
 * getCompanyData - Obtiene los datos de la empresa con deduplicación por request
 */
export const getCompanyData = cache(async (): Promise<any> => { // eslint-disable-line @typescript-eslint/no-explicit-any
  const cookieStore = await cookies()
  const authData = cookieStore.get('authData')?.value
  return authData ? JSON.parse(authData) : null
})


export async function removeToken(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('authToken')
}
