'use client'

import { usePostHog } from '@posthog/react'
import { useEffect } from 'react'

interface User {
  email: string
  enterprise_name: string
  energy_modules?: string[]
}

export function PostHogIdentifier({ user }: { user: User | null }) {
  const posthog = usePostHog()

  useEffect(() => {
    if (user && user.email && posthog) {
      console.log('[PostHog] Identifying user:', user.email)
      
      posthog.identify(user.email, {
        email: user.email,
        enterprise_name: user.enterprise_name,
        energy_modules: user.energy_modules,
      })

      if (user.enterprise_name) {
        posthog.group('enterprise', user.enterprise_name, {
          name: user.enterprise_name,
        })
      }

      posthog.capture('user_identified', {
        email: user.email,
        enterprise_name: user.enterprise_name,
      })

      console.log('[PostHog] User identified successfully!')
    }
  }, [user, posthog])

  return null
}
