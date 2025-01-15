"use client"

import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from 'lucide-react'
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useSearchParams, usePathname, useRouter } from 'next/navigation';


export function DatepickerRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {

  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const pathname = usePathname()
  const { replace } = useRouter()

  const [fecha, setFecha] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  })

  const handleSelect = (fecha) => {

    if (fecha?.from) {
      // const from = format(fecha?.from, "yyyy-MM-dd" )
      params.set('date_after', fecha.from)
    } else {
      params.delete('date_after')
    }

    if (fecha?.to) {
      // const to = format(fecha?.to, "yyyy-MM-dd" )
      params.set('date_before', fecha.to)
    } else {
      params.delete('date_before')
    }

    setFecha(fecha)
    replace(`${pathname}?${params.toString()}`)
    
  }


  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="fecha"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !fecha && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {fecha?.from ? (
              fecha.to ? (
                <>
                  {format(fecha.from, "d MMMM, yyyy", { locale: es })} -{" "}
                  {format(fecha.to, "d MMMM, yyyy", { locale: es })}
                </>
              ) : (
                format(fecha.from, "d MMMM, yyyy", { locale: es })
              )
            ) : (
              <span>Selecciona un rango de fechas</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={fecha?.from}
            selected={fecha}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={es}
            classNames={{
              // day_selected: "bg-[#00b0c7] text-primary-foreground",
              // day_range_middle: "bg-[#9ed2d9] text-primary-foreground",
              day_range_end: "bg-[#00b0c7] text-primary-foreground",
              day_range_start: "bg-[#00b0c7] text-primary-foreground",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}