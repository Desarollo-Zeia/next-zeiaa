'use server'
import { redirect } from 'next/navigation'
import { removeToken, setToken } from '../lib/auth'
import { baseUrl } from '../lib/constant'
 
export async function action(prevState: { message: string}, formData: FormData) {

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    const response = await fetch(`${baseUrl}/account/api/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (response.ok) {
      const data = await response.json()
      await setToken(data.token)
    } else {
      await removeToken()
      return { message: 'Error, valide correo o constraseña'}
    }
  } catch (error) {
    console.error('Error:', error)
  }

  redirect(`/ocupacional/dashboard`)

}