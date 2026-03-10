'use client'

import ErrorView from '@/app/ui/error-view'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorView error={error} reset={reset} />
}
