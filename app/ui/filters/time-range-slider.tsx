"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { format, addHours, startOfDay } from "date-fns"
import { useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "@/hooks/use-debounce"

interface TimeRangeSliderProps {
  initialStart?: string
  initialEnd?: string
}

export function TimeRangeSlider({ initialStart = "00:00", initialEnd = "23:00" }: TimeRangeSliderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialStartHour = hoursFromMidnight(initialStart)
  const initialEndHour = hoursFromMidnight(initialEnd)

  const [range, setRange] = React.useState([initialStartHour, initialEndHour])
  const debouncedRange = useDebounce(range, 300)

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams)
    params.set("start", formatTime(debouncedRange[0]))
    params.set("end", formatTime(debouncedRange[1]))
    router.push(`?${params.toString()}`, { scroll: false })
  }, [debouncedRange, router, searchParams])

  const handleRangeChange = (newRange: number[]) => {
    setRange(newRange)
  }

  return (
    <SliderPrimitive.Root
      className="relative flex  touch-none select-none items-center min-w-[280px]"
      min={0}
      max={23}
      step={1}
      value={range}
      onValueChange={handleRangeChange}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {range.map((value, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-1 mb-1.5">
            <div className="bg-primary text-primary-foreground text-xs font-semibold py-1 px-2 rounded">
              {formatTime(value)}
            </div>
          </div>
        </SliderPrimitive.Thumb>
      ))}
    </SliderPrimitive.Root>
  )
}

function hoursFromMidnight(time: string): number {
  const [hours] = time.split(":").map(Number)
  return hours
}

function formatTime(hours: number) {
  const date = addHours(startOfDay(new Date()), hours)
  return format(date, "HH:00")
}

