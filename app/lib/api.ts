import { getToken } from "./auth"
import { baseUrl } from "./constant"

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = await getToken()
  if (!token) {
    throw new Error('No authentication token available')
  }

  const headers = new Headers(options.headers)
  headers.set('Authorization', `token ${token}`)

  const response = await fetch(`${baseUrl}${url}`, { ...options, headers })
  if (!response.ok) {
    throw new Error('API request failed')
  }

  return response.json()
}

