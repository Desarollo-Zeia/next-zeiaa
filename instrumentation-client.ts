import posthog from 'posthog-js'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    defaults: '2026-01-30',
    autocapture: true,
    capture_pageview: 'history_change',
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') {
        posthog.debug()
      }
    },
  })
}
