'use client'

import { usePostHog } from '@posthog/react'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function PostHogPageTracker() {
  const posthog = usePostHog()
  const pathname = usePathname()

  useEffect(() => {
    if (posthog && pathname) {
      // Detectar qué portal está usando
      let portal = 'unknown'
      if (pathname.includes('/energia')) portal = 'energia'
      else if (pathname.includes('/ambiental')) portal = 'ambiental'
      else if (pathname.includes('/ocupacional')) portal = 'ocupacional'

      console.log('[PostHog] Page viewed:', pathname, 'Portal:', portal)

      posthog.capture('page_viewed', {
        pathname,
        portal,
        url: window.location.href,
      })
    }
  }, [posthog, pathname])

  return null
}
