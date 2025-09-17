'use client'

import { Card } from '@/components/ui/card'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useTransition } from 'react'
import MonthPicker from '../../filters/month-picker'
import NoResultsFound from '../../no-result'

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

  const firstMonth = searchParams.get('firstmonth') || monthMap[currentMonth]
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
        <Card className="p-4 flex flex-col gap-2 shadow-md justify-between">
          {
            firstCalculatorResultMonthly?.detail ? (
              <NoResultsFound message="No se encontraron lecturas para este mes." />
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex justify-evenly gap-4">
                  <div className="flex flex-col justify-center items-center">
                    <p className='text-sm font-medium'>En punta</p>
                    <p className="text-center">{firstCalculatorResultMonthly?.consumption?.peak.toFixed(2)} KWh</p>
                  </div>
                  <div>
                    =
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <div className="flex flex-col justify-center items-center">
                      <p className='text-sm font-medium'>Soles</p>
                      <p className="text-center">S/ {firstCalculatorResultMonthly?.cost?.peak.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-evenly gap-4">
                  <div className="flex flex-col justify-center items-center">
                    <p className='text-sm font-medium'>Fuera punta</p>
                    <p className="text-center">{firstCalculatorResultMonthly?.consumption?.off_peak.toFixed(2)} KWh</p>
                  </div>
                  <div>
                    =
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <div className="flex flex-col justify-center items-center">
                      <p className='text-sm font-medium'>Soles</p>
                      <p className="text-center">S/ {firstCalculatorResultMonthly?.cost?.off_peak.toFixed(2)} </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          }

        </Card>
      </div>
      <div className="flex items-center px-6">
        <p className="text-2xl">VS</p>
      </div>
      <div className="flex-1">
        <MonthPicker onChange={handleSecondMonthChange}
          isPending={isPending}
          value={secondMonth}
          firstMonth={firstMonth}
          secondMonth={secondMonth}
        />
        <Card className="p-4 flex flex-col gap-2 shadow-md justify-between">
          {
            secondCalculatorResultMonthly?.detail ? (
              <NoResultsFound message="No se encontraron lecturas para este mes." />
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex justify-evenly gap-4">
                  <div className="flex flex-col justify-center items-center">
                    <p className='text-sm font-medium'>En punta</p>
                    <p className="text-center">{secondCalculatorResultMonthly?.consumption?.peak?.toFixed(2)} KWh</p>
                  </div>
                  <div>
                    =
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <div className="flex flex-col justify-center items-center">
                      <p className='text-sm font-medium'>Soles</p>
                      <p className="text-center">S/ {secondCalculatorResultMonthly?.cost?.peak?.toFixed(2)} </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-evenly gap-4">
                  <div className="flex flex-col justify-center items-center">
                    <p className='text-sm font-medium'>Fuera de punta</p>
                    <p className="text-center">{secondCalculatorResultMonthly?.consumption?.off_peak?.toFixed(2)} KWh</p>
                  </div>
                  <div>
                    =
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <div className="flex flex-col justify-center items-center">
                      <p className='text-sm font-medium'>Soles</p>
                      <p className="text-center">S/ {secondCalculatorResultMonthly?.cost?.off_peak?.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        </Card>
      </div>
    </div>
  )
}
