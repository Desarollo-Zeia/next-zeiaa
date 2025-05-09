"use client"

import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from 'lucide-react'
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
  // const [isPending, startTransition] = React.useTransition()
  const start = params.get('date_after')
  const end = params.get('date_before')

  // Parsear fechas correctamente
  const [fecha, setFecha] = React.useState<any>({ // eslint-disable-line @typescript-eslint/no-explicit-any
    from: start ? new Date(start) : undefined,
    to: end ? new Date(end) : undefined,
  })

  React.useEffect(() => {
      if (fecha?.from) {
        params.set('date_after', fecha.from) 
      } else {
        params.delete('date_after')
      }

      if (fecha?.to) {
        params.set('date_before', fecha.to)
      } else {
        params.delete('date_before')
      }

      replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [fecha])

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="fecha"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal relative",
              !fecha && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {fecha?.from ? (
              fecha.to ? (
                <>
                  {format(fecha.from, "d MMMM, yyyy", { locale: es })} -{" "}
                  {format(fecha.to, "d MMMM, yyyy", { locale: es })}
                  {/* {isPending && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                    </div>
                  )} */}
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
            onSelect={setFecha}
            numberOfMonths={2}
            locale={es}
            classNames={{
              day_range_end: "bg-[#00b0c7] text-primary-foreground",
              day_range_start: "bg-[#00b0c7] text-primary-foreground",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
