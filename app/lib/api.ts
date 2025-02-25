import { getToken } from "./auth"
import { baseUrl, baseUrlAmbiental, baseUrlEnergy } from "./constant"

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = await getToken()


  const headers = new Headers(options.headers)
  headers.set('Authorization', `token ${token}`)

  const response = await fetch(`${baseUrl}${url}`, { ...options, headers })

  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
    return response.blob();
  }

  return response.json()
}
export async function fetchWithAuthAmbiental(url: string, options: RequestInit = {}) {
  const token = await getToken()

  const headers = new Headers(options.headers)
  headers.set('Authorization', `token ${token}`)

  const response = await fetch(`${baseUrlAmbiental}${url}`, { ...options, headers })
  

  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
    return response.blob();
  }

  return response.json()
}

export async function fetchWithAuthEnergy(url: string, options: RequestInit = {}) {
  const token = await getToken()

  const headers = new Headers(options.headers)
  headers.set('Authorization', `token ${token}`)

  const response = await fetch(`${baseUrlEnergy}${url}`, { ...options, headers })
  

  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
    return response.blob();
  }

  return response.json()
}
