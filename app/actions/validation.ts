'use server'
import { redirect } from 'next/navigation'
import { removeToken, setCompanyData, setToken } from '../lib/auth'
import { baseUrl, baseUrlAmbiental, baseUrlEnergy } from '../lib/constant'

export async function actionOccupational(prevState: { message: string }, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  let shouldRedirect = false

  try {
    const response = await fetch(`${baseUrl}/account/api/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (response.ok) {
      const data = await response.json()
      await setToken(data.token)
      shouldRedirect = true
    } else {
      await removeToken()
      return { message: 'Error, valide correo o contraseña' }
    }
  } catch {
    return { message: 'Error de conexion, intente nuevamente' }
  }

  if (shouldRedirect) {
    redirect(`/ocupacional/dashboard/rooms`)
  }

  return { message: '' }
}

export async function actionAmbiental(prevState: { message: string }, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  let shouldRedirect = false

  try {
    const response = await fetch(`${baseUrlAmbiental}/account/api/token/ambiental`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (response.ok) {
      const data = await response.json()
      await setToken(data.token)
      shouldRedirect = true
    } else {
      await removeToken()
      return { message: 'Error, valide correo o contraseña' }
    }
  } catch {
    return { message: 'Error de conexion, intente nuevamente' }
  }

  if (shouldRedirect) {
    redirect(`/ambiental/dashboard`)
  }

  return { message: '' }
}

export async function actionEnergy(prevState: { message: string }, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  let shouldRedirect = false

  try {
    const response = await fetch(`${baseUrlEnergy}/api/v1/accounts/request-token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (response.ok) {
      const data = await response.json()
      await setToken(data.token)
      await setCompanyData(data.user)
      shouldRedirect = true
    } else {
      await removeToken()
      return { message: 'Error, valide correo o contraseña' }
    }
  } catch {
    return { message: 'Error de conexion, intente nuevamente' }
  }

  if (shouldRedirect) {
    redirect(`/energia/dashboard/panel`)
  }

  return { message: '' }
}
