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

export async function setCompanyData(data: any): Promise<void> { // eslint-disable-line @typescript-eslint/no-explicit-any
  const cookieStore = await cookies()
  cookieStore.set('authData', JSON.stringify(data), { // Serializa el objeto
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 
  })
}

export async function getCompanyData(): Promise<any> {// eslint-disable-line @typescript-eslint/no-explicit-any
  const cookieStore = await cookies()
  const authData = cookieStore.get('authData')?.value
  return authData ? JSON.parse(authData) : null; // Deserializa el objeto
}


export async function removeToken(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('authToken')
}
