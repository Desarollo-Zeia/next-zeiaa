# Agent Instructions for next-zeia-project

## Build Commands

```bash
# Development
pnpm dev          # Start development server (Next.js 16)

# Build & Deploy
pnpm build        # Production build
pnpm start        # Start production server

# Linting
pnpm lint         # Run ESLint (Next.js config)

# Testing
# Note: Currently no test suite configured. Do NOT create tests.
# If tests are added in the future, run with:
# pnpm test              # Run all tests
# pnpm test -- --watch   # Watch mode
# pnpm test path/to/file # Run single test file
```

## Project Structure

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Icons:** Lucide React (from shadcn config)
- **Charts:** Recharts + Chart.js

### Directory Conventions

```
app/
  ├── lib/           # Utilities, API clients, auth
  ├── ui/            # Reusable UI components
  ├── services/      # Data fetching functions
  ├── type.ts        # TypeScript types/interfaces
  ├── [module]/      # Feature routes (energia, ambiental, ocupacional)
  └── layout.tsx     # Root layout
components/
  └── ui/            # shadcn/ui components (button, card, etc.)
```

## Code Style Guidelines

### Imports

1. **Order:** React/Next → External libs → Internal (@/*) → Relative
2. **Path Aliases:** Always use `@/` for internal imports
   ```tsx
   import { Button } from "@/components/ui/button"
   import { getToken } from "@/app/lib/auth"
   ```

### Naming Conventions

- **Components:** PascalCase (e.g., `ChartComponent.tsx`)
- **Files:** kebab-case (e.g., `cost-difference-checker.tsx`)
- **Functions:** camelCase (e.g., `fetchWithAuth`)
- **Types/Interfaces:** PascalCase (e.g., `ElectricalPanelData`)
- **Constants:** UPPER_SNAKE_CASE in `app/lib/constant.ts`

### TypeScript

- Enable strict mode (configured in tsconfig.json)
- Prefer `interface` over `type` for object shapes
- Use explicit return types for exported functions
- Avoid `any` - use `unknown` with type guards instead

```tsx
// Good
interface MeasurementPoint {
  id: number
  name: string
}

async function fetchData(): Promise<MeasurementPoint[]> {
  // ...
}
```

### Component Patterns

1. **Server Components:** Default for pages, fetch data directly
2. **Client Components:** Use `'use client'` only when needed (hooks, browser APIs)
3. **Props:** Destructure in function signature

```tsx
// Server Component
async function Page({ searchParams }: { searchParams: { page?: string } }) {
  const data = await fetchData()
  return <View data={data} />
}

// Client Component
'use client'
function View({ data }: { data: Data[] }) {
  const [selected, setSelected] = useState<string>('')
  // ...
}
```

### Styling

- Use Tailwind CSS utility classes
- Custom colors: Use CSS variables from `tailwind.config.ts`
- Primary brand color: `#00b0c7` (cyan)
- Responsive: Use `md:`, `lg:` prefixes
- Avoid arbitrary values (e.g., `w-[100px]`) - add to config if needed

### Error Handling

```tsx
// API calls - throw errors with context
try {
  const res = await fetchWithAuth(url)
  return res
} catch (error) {
  console.error('Failed to fetch:', error)
  return { detail: 'Error message for UI' }
}

// Components - use error.tsx boundaries

// Never expose sensitive info in error messages
// Good: 'Failed to load data'
// Bad: 'HTTP error 401 - Invalid token abc123'
```

### State Management

- Use **Zustand** for global client state (see `app/lib/store/`)
- Prefer React `useState` for local component state
- Use `use-debounce` for search inputs and filters

```tsx
import { create } from 'zustand'

interface AppState {
  selectedPanel: string | null
  setSelectedPanel: (id: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  selectedPanel: null,
  setSelectedPanel: (id) => set({ selectedPanel: id }),
}))
```

### Analytics

- Project uses **PostHog** for analytics (configured in `app/lib/analytics.ts`)
- Identify users with `posthog.identify(userId, userProperties)`
- Track events with `posthog.capture(eventName, properties)`
- See `app/instrumentation.client.js` for client-side setup

### Environment Variables

Required environment variables (see `.env.example` or deployment docs):
- `NEXT_PUBLIC_API_URL` - Main API endpoint
- `NEXT_PUBLIC_API_URL_ENERGY` - Energy module API
- `NEXT_PUBLIC_API_URL_AMBIENTAL` - Environmental module API
- `POSTHOG_KEY` - PostHog analytics key

### Data Fetching

- Use `app/lib/api.ts` for authenticated requests
- Cache expensive operations with `React.cache()` or `'use cache'`
- Pass tokens as parameters in cached functions (not cookies directly)
- Use `Promise.all()` for parallel independent requests

```tsx
// Good - pass token explicitly for caching
async function getData(token?: string) {
  'use cache'
  return await fetchWithAuth('/api/data', {}, token)
}
```

### shadcn/ui Components

- Use CLI to add: `npx shadcn add [component]`
- Customize in `components/ui/` directory
- Import from `@/components/ui/[component]`

### Git Workflow

```bash
# Before committing, always run:
pnpm lint

# Commit message format:
# feat: add new feature
# fix: resolve bug
# refactor: improve code structure
# style: formatting changes
```

### VS Code Extensions

Check `.vscode/extensions.json` for recommended extensions.

---

## Key References

- **shadcn/ui:** https://ui.shadcn.com
- **Next.js:** https://nextjs.org/docs
- **Tailwind:** https://tailwindcss.com/docs
- **Lucide Icons:** https://lucide.dev/icons
