'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from '@posthog/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST
    
    console.log('[PostHog] Initializing with key:', key ? 'Present' : 'MISSING')
    console.log('[PostHog] Host:', host)
    
    if (key) {
      posthog.init(key, {
        api_host: host || 'https://us.i.posthog.com',
        defaults: '2026-01-30',
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') posthog.debug()
        }
      })
      console.log('[PostHog] Initialized successfully')
    } else {
      console.error('[PostHog] Missing NEXT_PUBLIC_POSTHOG_KEY')
    }
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
