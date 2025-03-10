"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function DateRangePicker() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize date range from URL params or default to last 3 days
  const [date, setDate] = useState<DateRange | undefined>(() => {
    const date_after = searchParams.get("date_after")
    const date_before = searchParams.get("date_before")

    if (date_after && date_before) {
      return {
        from: new Date(date_after),
        to: new Date(date_before),
      }
    }

    return {
      from: addDays(new Date(), -3),
      to: new Date(),
    }
  })

  // Update URL when dates change
  useEffect(() => {
    if (date?.from && date?.to) {
      const params = new URLSearchParams(searchParams.toString())
      params.set("date_after", format(date.from, "yyyy-MM-dd"))
      params.set("date_before", format(date.to, "yyyy-MM-dd"))
      router.push(`?${params.toString()}`, { scroll: false })
    }
  }, [date, router, searchParams])

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

