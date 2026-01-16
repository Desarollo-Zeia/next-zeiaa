'use client'
import React, { useTransition, memo } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

const START_YEAR = 2025

// Generar años una sola vez fuera del componente
const YEARS = (() => {
  const currentYear = new Date().getFullYear()
  const years: number[] = []
  for (let year = START_YEAR; year <= currentYear; year++) {
    years.push(year)
  }
  return years
})()

export default memo(function YearFilter({ year }: { year: string }) {
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleYear = (selectedYear: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      params.set('year', selectedYear)
      // Reset month dates when year changes to avoid inconsistencies
      params.delete('date_start')
      params.delete('date_end')
      replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className='relative'>
      <Select onValueChange={handleYear} value={year}>
        <SelectTrigger className="w-[120px] bg-[#00b0c7]">
          <SelectValue placeholder="Año" />
        </SelectTrigger>
        <SelectContent>
          {YEARS.map((y) => (
            <SelectItem key={y} value={y.toString()}>
              {y}
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
})
