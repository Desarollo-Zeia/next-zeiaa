import { getToken } from "./auth"
import { baseUrl, baseUrlAmbiental, baseUrlEnergy } from "./constant"

export async function fetchWithAuth(url: string, options: RequestInit = {}, token?: string) {
  const authToken = token || await getToken()


  const headers = new Headers(options.headers)
  headers.set('Authorization', `token ${authToken}`)

  const response = await fetch(`${baseUrl}${url}`, { ...options, headers })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HTTP error! status: ${response.status} - URL: ${baseUrl}${url} - Response: ${errorText.substring(0, 200)}`)
  }

  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
    return response.blob();
  }

  if (contentType && contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  throw new Error(`Expected JSON response but received: ${contentType}. Response: ${text.substring(0, 100)}...`)
}
export async function fetchWithAuthAmbiental(url: string, options: RequestInit = {}, token?: string) {
  const authToken = token || await getToken()

  const headers = new Headers(options.headers)
  headers.set('Authorization', `token ${authToken}`)

  const response = await fetch(`${baseUrlAmbiental}${url}`, { ...options, headers })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HTTP error! status: ${response.status} - URL: ${baseUrlAmbiental}${url} - Response: ${errorText.substring(0, 200)}`)
  }

  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
    return response.blob();
  }

  if (contentType && contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  throw new Error(`Expected JSON response but received: ${contentType}. Response: ${text.substring(0, 100)}...`)
}

export async function fetchWithAuthEnergy(url: string, options: RequestInit = {}, token?: string) {
  const authToken = token || await getToken()

  const headers = new Headers(options.headers)
  headers.set('Authorization', `token ${authToken}`)

  const response = await fetch(`${baseUrlEnergy}${url}`, { ...options, headers })

  if (!response.ok) {
    const errorText = await response.text()

    // Handle 400 responses with detail field as valid API responses
    if (response.status === 400) {
      try {
        const errorData = JSON.parse(errorText)
        if (errorData.detail) {
          return errorData
        }
      } catch {
        // If not valid JSON, fall through to throw error
      }
    }

    throw new Error(`HTTP error! status: ${response.status} - URL: ${baseUrlEnergy}${url} - Response: ${errorText.substring(0, 200)}`)
  }

  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
    return response.blob();
  }

  if (contentType && contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  throw new Error(`Expected JSON response but received: ${contentType}. Response: ${text.substring(0, 100)}...`)
}
