'use client'
import React, { useTransition } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

const MONTHS = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
]

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
}

function getLastDayOfMonth(year: number, month: number): number {
  const daysInMonth: { [key: number]: number } = {
    1: 31,
    2: isLeapYear(year) ? 29 : 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31,
  }
  return daysInMonth[month]
}

function getMonthDateRange(year: number, month: number): string {
  const startDate = `${year}-${month.toString().padStart(2, '0')}-01`
  const lastDay = getLastDayOfMonth(year, month)
  const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`
  return `${startDate}:${endDate}`
}

export default function MonthFilter({ year }: { year: string }) {
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const { replace } = useRouter()

  const yearNumber = parseInt(year, 10)
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
  
  // Default to current month if we're in the selected year, otherwise January
  const defaultMonth = yearNumber === currentYear ? currentMonth : 1
  const defaultValue = getMonthDateRange(yearNumber, defaultMonth)

  const handleMonth = (month: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      const [start, finish] = month.split(':')

      params.set('date_start', start)
      params.set('date_end', finish)

      if (month === 'none') {
        params.delete('date_start')
        params.delete('date_end')
      }

      replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className='relative'>
      <Select onValueChange={handleMonth} defaultValue={defaultValue}>
        <SelectTrigger className="w-[180px] bg-[#00b0c7]">
          <SelectValue placeholder="Meses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Ninguno</SelectItem>
          {MONTHS.map((month) => (
            <SelectItem 
              key={month.value} 
              value={getMonthDateRange(yearNumber, month.value)}
            >
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  )
}
