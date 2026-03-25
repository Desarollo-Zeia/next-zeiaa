'use client'

import { Card } from '@/components/ui/card'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import NoResultsFound from '../../no-result'
import { DollarSign, Zap } from 'lucide-react'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'

export type CalculatorDifferenceResult = {
  month: string
  year: number
  detail?: string
  consumption?: {
    total: number
    peak: number
    off_peak: number
  }
  cost?: {
    total: number
    peak: number
    off_peak: number
  }
  first_value?: number
  last_value?: number
  date_first_value?: string
  date_last_value?: string
  date_range: {
    start: string
    end: string
  }
}

interface CostDifferenceCheckerProps {
  firstCalculatorResultMonthly?: CalculatorDifferenceResult
  secondCalculatorResultMonthly?: CalculatorDifferenceResult
  formattedDateAfter1?: string
  formattedDateBefore1?: string
  formattedDateAfter2?: string
  formattedDateBefore2?: string
}

interface DatePickerRangeLocalProps {
  startParam: string
  endParam: string
  className?: string
  defaultFrom?: Date
  defaultTo?: Date
}

function parseISOorUndefined(s?: string | null): Date | undefined {
  if (!s) return undefined
  const t = Date.parse(s)
  return isNaN(t) ? undefined : new Date(t)
}

function formatNumberWithCommas(num?: number): string {
  if (num === undefined || num === null) return '0'
  return num.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function DatePickerRangeLocal({ startParam, endParam, className, defaultFrom, defaultTo }: DatePickerRangeLocalProps) {
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams as unknown as string)
  const pathname = usePathname()
  const { replace } = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const start = params.get(startParam)
  const end = params.get(endParam)

  const [fecha, setFecha] = React.useState<DateRange | undefined>({
    from: parseISOorUndefined(start) || defaultFrom,
    to: parseISOorUndefined(end) || defaultTo,
  })

  React.useEffect(() => {
    const newFrom = parseISOorUndefined(start) || defaultFrom
    const newTo = parseISOorUndefined(end) || defaultTo

    setFecha((prev) => {
      const prevFromISO = prev?.from?.toISOString()
      const prevToISO = prev?.to?.toISOString()
      const newFromISO = newFrom?.toISOString()
      const newToISO = newTo?.toISOString()

      if (prevFromISO === newFromISO && prevToISO === newToISO) {
        return prev
      }
      return { from: newFrom, to: newTo }
    })
  }, [start, end, defaultFrom, defaultTo])

  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  React.useEffect(() => {
    const nextParams = new URLSearchParams(searchParams?.toString() ?? "")
    if (fecha?.from || fecha?.to) {
      nextParams.delete("page")
    }
    clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      if (fecha?.from) {
        nextParams.set(startParam, fecha.from.toISOString())
      } else {
        nextParams.delete(startParam)
      }

      if (fecha?.to) {
        nextParams.set(endParam, fecha.to.toISOString())
      } else {
        nextParams.delete(endParam)
      }

      const nextQuery = nextParams.toString()
      const currentQuery = searchParams?.toString() ?? ""

      if (nextQuery !== currentQuery) {
        startTransition(() => {
          replace(`${pathname}?${nextQuery}`, { scroll: false })
        })
      }
    }, 500)

    return () => {
      clearTimeout(debounceRef.current)
    }
  }, [fecha, startParam, endParam, searchParams, pathname, replace])

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="fecha"
            variant="outline"
            className={cn(
              " justify-start text-left font-normal relative w-auto",
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
              <span>Selecciona un rango</span>
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

function ResultCard({ result, label }: { result?: CalculatorDifferenceResult, label: string }) {
  return (
    <Card className="p-4 shadow-md justify-center h-auto text-xl">
      {
        result?.detail ? (
          <NoResultsFound message="No se encontraron lecturas para este período." />
        ) : (
          <div className="flex flex-row gap-4 w-full">
            <div className="flex-1 space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                <Zap className="h-4 w-4" />
                {label}
              </h4>
              <div className="bg-[#00b0c7] p-3 rounded-lg border border-primary/20">
                <p className="text-xs text-white">Consumo total</p>
                <p className="text-xl font-bold text-white">{formatNumberWithCommas(result?.consumption?.total)} kWh</p>
                <p className="text-[10px] text-white/60">
                  Punta: {formatNumberWithCommas(result?.consumption?.peak)} | F. Punta: {formatNumberWithCommas(result?.consumption?.off_peak)}
                </p>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Costos
              </h4>
              <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                <p className="text-xs text-muted-foreground">Costo total</p>
                <p className="text-xl font-bold text-destructive">S/{formatNumberWithCommas(result?.cost?.total)}</p>
                <p className="text-[10px] text-muted-foreground/60">
                  Punta: S/{formatNumberWithCommas(result?.cost?.peak)} | F. Punta: S/{formatNumberWithCommas(result?.cost?.off_peak)}
                </p>
              </div>
            </div>
          </div>
        )
      }
    </Card>
  )
}

export default function CostDifferenceChecker({
  firstCalculatorResultMonthly,
  secondCalculatorResultMonthly,
  formattedDateAfter1,
  formattedDateBefore1,
  formattedDateAfter2,
  formattedDateBefore2
}: CostDifferenceCheckerProps) {

  const today = new Date()
  const previousMonthDate = subMonths(today, 1)

  const defaultDateAfter1 = startOfMonth(previousMonthDate)
  const defaultDateBefore1 = endOfMonth(previousMonthDate)
  const defaultDateAfter2 = startOfMonth(today)
  const defaultDateBefore2 = today

  return (
    <div className="flex justify-between gap-4">
      <div className="flex-1">
        <DatePickerRangeLocal
          startParam="date_after_1"
          endParam="date_before_1"
          className="mb-2"
          defaultFrom={defaultDateAfter1}
          defaultTo={defaultDateBefore1}
        />
        <ResultCard result={firstCalculatorResultMonthly} label="Consumo de energía" />
      </div>
      <div className="flex-1">
        <DatePickerRangeLocal
          startParam="date_after_2"
          endParam="date_before_2"
          className="mb-2"
          defaultFrom={defaultDateAfter2}
          defaultTo={defaultDateBefore2}
        />
        <ResultCard result={secondCalculatorResultMonthly} label="Consumo de energía" />
      </div>
    </div>
  )
}