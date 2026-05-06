"use client"

import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Loader2 } from "lucide-react"

const SUBTYPES = [
  { value: 'overvoltage', label: 'Sobretensión' },
  { value: 'undervoltage', label: 'Subtensión' },
  { value: 'zero_voltage', label: 'Voltaje Cero' },
]

export default function FluctuationSubtypeToggle() {
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const currentSubtype = searchParams.get('fluctuation_subtype') ?? 'undervoltage'

  const handleValueChange = (value: string) => {
    if (!value) return

    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      params.set('fluctuation_subtype', value)
      replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="relative">
      <ToggleGroup
        type="single"
        onValueChange={handleValueChange}
        value={currentSubtype}
        disabled={isPending}
        className="justify-start relative rounded-sm p-2"
      >
        {SUBTYPES.map((subtype) => (
          <ToggleGroupItem
            className="border"
            key={subtype.value}
            value={subtype.value}
            aria-label={subtype.label}
            disabled={subtype.value === currentSubtype}
          >
            {subtype.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <Loader2 className="h-6 w-6 animate-spin text-[#00b0c7]" />
        </div>
      )}
    </div>
  )
}
