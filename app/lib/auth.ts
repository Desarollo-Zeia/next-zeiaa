import { cookies } from 'next/headers'

export async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get('authToken')?.value
}

export async function setToken(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('authToken', token, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 
  })
}

export async function removeToken(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('authToken')
}
