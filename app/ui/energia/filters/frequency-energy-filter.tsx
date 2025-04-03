"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useTransition } from "react"

export default function FrequencyEnergyFilter({ category, frequencyP } : { category: string, frequencyP: string }) {
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const pathname = usePathname()
  // Get the current value from URL or default to 'day'

  const frequencyDicc = {
    power: [
      { label: "Hora", value: "hour" }
    ] ,
    current: [
      { label: "Hora", value: "hour" },
    ],
    energy: [
      { label: "Hora", value: "hour" },
      { label: "Día", value: "day" },
      { label: "Semana", value: "week" },
      { label: "Mes", value: "month" },
    ],
    voltage: [
      { label: "Hora", value: "hour" },
    ]
  }

  const handleFrequencyChange = (value: string) => { 
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      params.set("last_by", value)
      params.set("page", '1')
      replace(`${pathname}?${params.toString()}`)
  })
  }

  return (
    <div className="flex justify-center flex-wrap gap-2">
      <ToggleGroup type="single" onValueChange={handleFrequencyChange} defaultValue={frequencyP}   aria-label="Frequency" className="flex gap-2 relative">
        {
          frequencyDicc[category as keyof typeof frequencyDicc].map((frequency) => (
            <ToggleGroupItem
              key={frequency.value}
              value={frequency.value}
              className={cn(
                "w-[120px] h-[40px] bg-[#00b0c7] text-white",
                frequencyP === frequency.value ? "bg-[#00b0c7] hover:bg-inherit" : "bg-gray-100 text-gray-700"
              )}
              disabled={frequencyP === frequency.value}
            >
              {frequency.label}
            </ToggleGroupItem>
          ))
        }
        {isPending && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
          )}
      </ToggleGroup>
    </div>
  )
}

