# AGENTS.md

Guidelines for AI coding agents working in this Next.js 15 repository.

## Build/Lint/Test Commands

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Create production build
npm start            # Start production server
npm run lint         # Run ESLint (next lint)
```

**Note:** No test framework configured. When adding tests, prefer Vitest with React Testing Library.

## Project Structure

```
app/
├── [module]/dashboard/[feature]/  # Route modules (energia, ambiental, ocupacional)
│   ├── page.tsx, error.tsx, loading.tsx
├── sevices/                       # Server-side data fetching
├── ui/                            # Page-specific UI components
├── lib/                           # Utilities, API, constants, types
├── utils/                         # Helper functions and formatters
└── actions/                       # Server actions for mutations
components/ui/                     # Shadcn/ui components
hooks/                             # Custom React hooks
```

## Code Style Guidelines

### Import Ordering

```tsx
// 1. React → 2. Third-party → 3. @/components/ui → 4. @/app/ui → 5. Services/utils → 6. Types
import { useState } from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { DashboardHeader } from '@/app/ui/energia/dashboard-header'
import { fetchWithAuthEnergy } from '@/app/lib/api'
import type { SearchParams } from '@/app/lib/definitions'
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Files/Directories | kebab-case | `period-picker-filter.tsx` |
| Components | PascalCase | `PeriodPickerFilter` |
| Functions | camelCase | `fetchWithAuth` |
| Constants | SCREAMING_SNAKE_CASE | `CACHE_DURATION` |
| Types/Interfaces | PascalCase | `SearchParams` |

### TypeScript

- **Strict mode enabled** - do not use `// @ts-ignore`
- Use explicit types for function parameters and return values
- Prefer `interface` for object shapes, `type` for unions/intersections
- Use `type` imports: `import type { Foo } from './types'`
- When `any` is needed: `// eslint-disable-line @typescript-eslint/no-explicit-any`

### Component Patterns

**Server Components (default):**
```tsx
export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent searchParams={searchParams} />
    </Suspense>
  )
}
```

**Client Components:**
```tsx
'use client'
import { useTransition } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

export default function FilterComponent() {
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const pathname = usePathname()
  // Use startTransition + replace for URL state updates
}
```

### Data Fetching

Use server actions with `'use cache'` pattern:

```tsx
'use server'
import { cacheLife } from 'next/cache'

export async function getData({ token, ...params }: Params) {
  'use cache'
  cacheLife('minutes')
  return await fetchWithAuthEnergy(url, {}, token)
}
```

**API Wrappers:** `fetchWithAuth()`, `fetchWithAuthAmbiental()`, `fetchWithAuthEnergy()`

### Error Handling

**Error Boundaries (error.tsx):**
```tsx
'use client'
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    if (error.message.includes('403') || error.message.includes('Token')) {
      router.push('/login')
    }
  }, [error])
  return <button onClick={reset}>Intentar de nuevo</button>
}
```

**API Errors:**
```tsx
if (!response.ok) {
  const errorText = await response.text()
  throw new Error(`HTTP error! status: ${response.status} - URL: ${url} - Response: ${errorText.substring(0, 200)}`)
}
```

### Styling

- Use Tailwind CSS utility classes exclusively
- Use `cn()` from `@/lib/utils` for conditional classes
- Theme colors use CSS variables (HSL format)

```tsx
import { cn } from '@/lib/utils'
<div className={cn("flex gap-2", isPending && "opacity-50")} />
```

### State Management

1. **URL State (preferred):** Use search params for filter/pagination
2. **Zustand:** For complex client-side state across routes
3. **React state:** For local component state only

## Key Conventions

1. **Spanish UI:** User-facing text is in Spanish
2. **Path alias:** Use `@/` for imports from project root
3. **Shadcn/ui:** Add components via `npx shadcn@latest add [component]`
4. **No console.log in production:** Remove debug logs before committing
5. **File size:** Keep components under 300 lines; extract to hooks/utilities

## API Endpoints

- Main: `https://api.zeia.com.pe`
- Ambiental: `https://apiambiental.zeia.com.pe`
- Energy: `https://api.energy.zeia.com.pe`

## Common Patterns

**Filter with URL state:**
```tsx
const handleFilterChange = (key: string, value: string) => {
  const params = new URLSearchParams(searchParams)
  value ? params.set(key, value) : params.delete(key)
  replace(`${pathname}?${params.toString()}`, { scroll: false })
}
```

**Loading states:**
- `loading.tsx` for route-level loading
- `<Suspense>` with skeleton components for granular loading
- `useTransition` for client-side navigation feedback
