import { Suspense } from 'react'
import { getCurrentUser } from '@/app/lib/user'
import { PostHogIdentifier } from './posthog-identifier'

async function PostHogAuthContent({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  
  return (
    <>
      <PostHogIdentifier user={user} />
      {children}
    </>
  )
}

export function PostHogAuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={children}>
      <PostHogAuthContent>{children}</PostHogAuthContent>
    </Suspense>
  )
}
