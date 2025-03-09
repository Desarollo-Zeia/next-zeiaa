"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function FrequencyEnergyFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Get the current value from URL or default to 'day'
  const [selectedFrequency, setSelectedFrequency] = useState<string>(searchParams.get("last_by") || "day")

  // Options for the filter
  const frequencyOptions = [
    { label: "Por hora", value: "hour" },
    { label: "Por día", value: "day" },
    { label: "Por semana", value: "week" },
    { label: "Por mes", value: "month" },
  ]

  // Update URL with the selected frequency
  const updateFrequency = useCallback(
    (value: string) => {
      // Create a new URLSearchParams object with the current params
      const params = new URLSearchParams(searchParams.toString())

      // Update the last_by parameter
      params.set("last_by", value)

      // Update local state immediately
      setSelectedFrequency(value)

      // Wrap the router navigation in startTransition
      startTransition(() => {
        // Update the URL without refreshing the page
        router.push(`?${params.toString()}`, { scroll: false })
      })
    },
    [searchParams, router],
  )

  // Update state if URL changes externally
  useEffect(() => {
    const currentValue = searchParams.get("last_by")
    if (currentValue && currentValue !== selectedFrequency) {
      setSelectedFrequency(currentValue)
    }
  }, [searchParams, selectedFrequency])

  return (
    <div className="flex flex-wrap gap-2">
      {frequencyOptions.map((option) => (
        <Button
        
          key={option.value}
          onClick={() => updateFrequency(option.value)}
          variant={selectedFrequency === option.value ? "default" : "outline"}
          className={cn(
            "transition-all",
            selectedFrequency === option.value ? "text-primary-foreground bg-[#00b0c7]" : "bg-background hover:bg-muted",
            isPending && "opacity-70",
          )}
          disabled={isPending && selectedFrequency === option.value}
        >
          {option.label}
       
        </Button>
      ))}
    </div>
  )
}

