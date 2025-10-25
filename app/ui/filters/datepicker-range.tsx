"use client"

import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useSearchParams, usePathname, useRouter } from "next/navigation"

function parseISOorUndefined(s?: string | null) {
  if (!s) return undefined
  const t = Date.parse(s)
  return isNaN(t) ? undefined : new Date(t)
}

export function DatepickerRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams as any) // eslint-disable-line @typescript-eslint/no-explicit-any
  const pathname = usePathname()
  const { replace } = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const start = params.get("date_after")
  const end = params.get("date_before")

  // inicializa con parse seguro
  const [fecha, setFecha] = React.useState<any>({ // eslint-disable-line @typescript-eslint/no-explicit-any
    from: parseISOorUndefined(start),
    to: parseISOorUndefined(end),
  })

  // --- Sincroniza `fecha` cuando cambian los params de la URL ---
  React.useEffect(() => {
    const newFrom = parseISOorUndefined(start)
    const newTo = parseISOorUndefined(end)

    // Usamos el setter funcional para evitar dependencias extra y sólo actualizar si cambió
    setFecha((prev: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const prevFromISO = prev?.from?.toISOString()
      const prevToISO = prev?.to?.toISOString()
      const newFromISO = newFrom?.toISOString()
      const newToISO = newTo?.toISOString()

      if (prevFromISO === newFromISO && prevToISO === newToISO) {
        return prev // no cambiar
      }
      return { from: newFrom, to: newTo }
    })
  }, [start, end])

  // ref para el timer del debounce
  const debounceRef = React.useRef<number>(0)

  React.useEffect(() => {
    const nextParams = new URLSearchParams(searchParams as any)  // eslint-disable-line @typescript-eslint/no-explicit-any
    if (fecha?.from || fecha?.to) {
      nextParams.delete("page")
    }
    window.clearTimeout(debounceRef.current)

    debounceRef.current = window.setTimeout(() => {
      // construimos params según fecha
      if (fecha?.from) {
        nextParams.set("date_after", fecha.from.toISOString())
        nextParams.delete("this_week")
        nextParams.delete("this_month")
      } else {
        nextParams.delete("date_after")
      }

      if (fecha?.to) {
        nextParams.set("date_before", fecha.to.toISOString())
        nextParams.delete("this_week")
        nextParams.delete("this_month")
      } else {
        nextParams.delete("date_before")
      }

      const nextQuery = nextParams.toString()
      const currentQuery = (searchParams as any).toString?.() ?? "" // eslint-disable-line @typescript-eslint/no-explicit-any

      // evitar replace si no cambia la query (reduce repeticiones de navegación)
      if (nextQuery !== currentQuery) {
        startTransition(() => {
          replace(`${pathname}?${nextQuery}`, { scroll: false })
        })
      }
    }, 500)

    return () => {
      window.clearTimeout(debounceRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fecha])

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="fecha"
            variant="outline"
            className={cn(
              " justify-start text-left font-normal relative w-auto",
              // <-- corregido: comprobar si NO hay `from`
              !fecha?.from && "text-muted-foreground"
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

            {isPending && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black" />
              </div>
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
            className="rounded-lg border shadow-sm"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
