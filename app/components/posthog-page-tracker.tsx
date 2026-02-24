'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'

export function PostHogPageTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const previousPathRef = useRef<string>('')
  const sessionStartTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    if (!pathname) return

    const currentHour = new Date().getHours()
    const portal = pathname.includes('/energia') ? 'energia' 
      : pathname.includes('/ambiental') ? 'ambiental' 
      : pathname.includes('/ocupacional') ? 'ocupacional' 
      : 'unknown'

    const url = window.origin + pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    const isPageRefresh = previousPathRef.current === pathname && previousPathRef.current !== ''
    const sessionDuration = Math.round((Date.now() - sessionStartTimeRef.current) / 1000)

    console.log('[PostHog] Page viewed:', pathname, 'Portal:', portal)

    posthog.capture('$pageview', {
      $current_url: url,
      pathname,
      portal,
      hour: currentHour,
      is_page_refresh: isPageRefresh,
      session_duration_seconds: sessionDuration,
      referrer: document.referrer || null,
    })

    if (isPageRefresh) {
      posthog.capture('page_refresh', {
        pathname,
        portal,
        session_duration_before_refresh: sessionDuration,
      })
    }

    previousPathRef.current = pathname
    sessionStartTimeRef.current = Date.now()
  }, [pathname, searchParams])

  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeOnPage = Math.round((Date.now() - sessionStartTimeRef.current) / 1000)
      
      posthog.capture('page_leave', {
        pathname: window.location.pathname,
        time_on_page_seconds: timeOnPage,
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  return null
}
