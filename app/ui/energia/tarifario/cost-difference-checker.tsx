'use client'

import { Card } from '@/components/ui/card'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useTransition } from 'react'
import MonthPicker from '../../filters/month-picker'
import NoResultsFound from '../../no-result'
import { DollarSign, Zap } from 'lucide-react'

export type CalculatorDifferenceResult = {
  month: string
  year: number

  // ✅ Caso sin lecturas
  detail?: string

  // ✅ Caso con lecturas
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

const monthMap: Record<number, string> = {
  1: "january",
  2: "february",
  3: "march",
  4: "april",
  5: "may",
  6: "june",
  7: "july",
  8: "august",
  9: "september",
  10: "october",
  11: "november",
  12: "december",
}


export default function CostDifferenceChecker({ firstCalculatorResultMonthly, secondCalculatorResultMonthly }: { firstCalculatorResultMonthly?: CalculatorDifferenceResult, secondCalculatorResultMonthly?: CalculatorDifferenceResult }) {

  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const currentMonth = new Date().getMonth() + 1

  const firstMonth = searchParams.get('firstmonth') || monthMap[currentMonth - 1]
  const secondMonth = searchParams.get('secondmonth') || monthMap[currentMonth]

  const handleFisrtMonthChange = (month: string) => {
    startTransition(() => {
      const newParams = new URLSearchParams(searchParams);

      newParams.set('page', '1');

      if (month) {
        newParams.set('firstmonth', month);
      }

      if (month === 'none') {
        newParams.delete('firstmonth');
      }

      replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    });
  }

  const handleSecondMonthChange = (month: string) => {
    startTransition(() => {
      const newParams = new URLSearchParams(searchParams);

      newParams.set('page', '1');

      if (month) {
        newParams.set('secondmonth', month);
      }

      if (month === 'none') {
        newParams.delete('secondmonth');
      }

      replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="flex justify-between">
      <div className="flex-1">
        <MonthPicker
          onChange={handleFisrtMonthChange}
          isPending={isPending}
          value={firstMonth}
          firstMonth={firstMonth}
          secondMonth={secondMonth}
        />
        <Card className="p-4 flex flex-col gap-2 shadow-md justify-center h-auto items-center text-xl">
          {
            firstCalculatorResultMonthly?.detail ? (
              <NoResultsFound message="No se encontraron lecturas para este mes." />
            ) : (
              <>
                <div className="space-y-3 w-full">
                  <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Consumo de Energía
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">En punta</p>
                      <p className="text-lg font-semibold">{firstCalculatorResultMonthly?.consumption?.peak.toFixed(2)} kWh</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">Fuera de punta</p>
                      <p className="text-lg font-semibold">{firstCalculatorResultMonthly?.consumption?.off_peak.toFixed(2)} kWh</p>
                    </div>
                  </div>
                  <div className="bg-[#00b0c7] p-3 rounded-lg border border-primary/20">
                    <p className="text-xs text-white">Total</p>
                    <p className="text-xl font-bold text-white">{firstCalculatorResultMonthly?.consumption?.total.toFixed(2)} kWh</p>
                  </div>
                </div>
                <div className="space-y-3 w-full">
                  <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Costos
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">En punta</p>
                      <p className="text-lg font-semibold">S/{firstCalculatorResultMonthly?.cost?.peak.toFixed(2)}</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">Fuera de punta</p>
                      <p className="text-lg font-semibold">S/{firstCalculatorResultMonthly?.cost?.off_peak?.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                    <p className="text-xs text-muted-foreground">Total a pagar</p>
                    <p className="text-xl font-bold text-destructive">S/{firstCalculatorResultMonthly?.cost?.total.toFixed(2)}</p>
                  </div>
                </div>
              </>

            )
          }

        </Card>
      </div>
      <div className="flex-1">
        <MonthPicker onChange={handleSecondMonthChange}
          isPending={isPending}
          value={secondMonth}
          firstMonth={firstMonth}
          secondMonth={secondMonth}
        />
        <Card className="p-4 flex flex-col gap-2 shadow-md justify-center h-auto items-center text-xl">
          {
            secondCalculatorResultMonthly?.detail ? (
              <NoResultsFound message="No se encontraron lecturas para este mes." />
            ) : (
              <>
                <div className="space-y-3 w-full">
                  <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Consumo de Energía
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">En punta</p>
                      <p className="text-lg font-semibold">{secondCalculatorResultMonthly?.consumption?.peak.toFixed(2)} kWh</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">Fuera de punta</p>
                      <p className="text-lg font-semibold">{secondCalculatorResultMonthly?.consumption?.off_peak.toFixed(2)} kWh</p>
                    </div>
                  </div>
                  <div className="bg-[#00b0c7] p-3 rounded-lg border border-primary/20">
                    <p className="text-xs text-white">Total</p>
                    <p className="text-xl font-bold text-white">{secondCalculatorResultMonthly?.consumption?.total.toFixed(2)} kWh</p>
                  </div>
                </div>
                <div className="space-y-3 w-full">
                  <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Costos
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">En punta</p>
                      <p className="text-lg font-semibold">S/{secondCalculatorResultMonthly?.cost?.peak.toFixed(2)}</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">Fuera de punta</p>
                      <p className="text-lg font-semibold">S/{secondCalculatorResultMonthly?.cost?.off_peak?.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                    <p className="text-xs text-muted-foreground">Total a pagar</p>
                    <p className="text-xl font-bold text-destructive">S/{secondCalculatorResultMonthly?.cost?.total.toFixed(2)}</p>
                  </div>
                </div>
              </>
            )
          }
        </Card>
      </div>
    </div>
  )
}
