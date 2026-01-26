"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'

export default function ToggleHighLow() {
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const currentLevel = searchParams.get('level') ?? 'high'

  const handleValueChange = (value: string) => {
    if (!value) return

    startTransition(() => {
      const params = new URLSearchParams(searchParams)

      params.set('page', '1')
      params.set('level', value)

      replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="relative">
      <ToggleGroup
        type="single"
        onValueChange={handleValueChange}
        value={currentLevel}
        disabled={isPending}
        className="justify-center relative rounded-sm p-2"
      >
        <ToggleGroupItem
          className="border"
          value="high"
          aria-label="High"
          disabled={currentLevel === 'high'}
        >
          Datos mas altos por dia
        </ToggleGroupItem>
        <ToggleGroupItem
          className="border"
          value="low"
          aria-label="Low"
          disabled={currentLevel === 'low'}
        >
          Datos mas bajos por dia
        </ToggleGroupItem>
      </ToggleGroup>

      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00b0c7]"></div>
        </div>
      )}
    </div>
  )
}
