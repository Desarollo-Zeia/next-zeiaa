'use server'
import { redirect } from 'next/navigation'
import { setToken } from '../lib/auth'
import { baseUrl } from '../lib/constant'
 
export async function userValidation(formData: FormData) {
  'use server'
 
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
      console.log(data)
      await setToken(data.token)
    } else {
      throw new Error('Error en el inicio de sesión')
    }
  } catch (error) {
    console.error('Error:', error)
    // Manejar el error (por ejemplo, mostrar un mensaje al usuario)
  }
  redirect(`/ocupacional/dashboard`)
}