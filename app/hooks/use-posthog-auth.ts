'use client'

import { usePostHog } from '@posthog/react'
import { useEffect, useState } from 'react'

interface AuthData {
  email: string
  enterprise_name: string
  energy_modules?: string[]
}

export function usePostHogAuth() {
  const posthog = usePostHog()
  const [identified, setIdentified] = useState(false)

  useEffect(() => {
    function identifyUser() {
      if (!posthog || identified) return

      try {
        console.log('[PostHog] Checking for authData cookie...')
        
        const authDataCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('authData='))

        console.log('[PostHog] Cookie found:', authDataCookie ? 'Yes' : 'No')

        if (authDataCookie) {
          const authData: AuthData = JSON.parse(decodeURIComponent(authDataCookie.split('=')[1]))
          
          console.log('[PostHog] Auth data:', authData)

          if (authData.email) {
            console.log('[PostHog] Identifying user:', authData.email)
            
            posthog.identify(authData.email, {
              email: authData.email,
              enterprise_name: authData.enterprise_name,
              energy_modules: authData.energy_modules,
            })

            if (authData.enterprise_name) {
              posthog.group('enterprise', authData.enterprise_name, {
                name: authData.enterprise_name,
              })
            }

            // Capturar evento de login
            posthog.capture('user_identified', {
              email: authData.email,
              enterprise_name: authData.enterprise_name,
            })

            setIdentified(true)
            console.log('[PostHog] User identified successfully!')
          }
        } else {
          console.log('[PostHog] No authData cookie found')
        }
      } catch (e) {
        console.error('[PostHog] Identification error:', e)
      }
    }

    // Intentar identificar inmediatamente
    identifyUser()
    
    // Y también después de un delay por si la cookie se setea después
    const timeout = setTimeout(identifyUser, 1000)
    const timeout2 = setTimeout(identifyUser, 3000)

    return () => {
      clearTimeout(timeout)
      clearTimeout(timeout2)
    }
  }, [posthog, identified])

  return { identified }
}
