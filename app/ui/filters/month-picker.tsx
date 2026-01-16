'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React, { memo } from 'react'

const MONTHS = [
  { value: 'january', label: 'Enero' },
  { value: 'february', label: 'Febrero' },
  { value: 'march', label: 'Marzo' },
  { value: 'april', label: 'Abril' },
  { value: 'may', label: 'Mayo' },
  { value: 'june', label: 'Junio' },
  { value: 'july', label: 'Julio' },
  { value: 'august', label: 'Agosto' },
  { value: 'september', label: 'Septiembre' },
  { value: 'october', label: 'Octubre' },
  { value: 'november', label: 'Noviembre' },
  { value: 'december', label: 'Diciembre' },
]

type MonthSelectProps = {
  value?: string
  onChange: (value: string) => void,
  isPending?: boolean,
  firstMonth?: string,
  secondMonth?: string,
  disabled?: boolean,
}

export default memo(function MonthPicker({ value, onChange, isPending, firstMonth, secondMonth }: MonthSelectProps) {
  return (
    <div className='relative'>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px] bg-[#00b0c7]">
          <SelectValue placeholder="Meses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Ninguno</SelectItem>
          {MONTHS.map((month) => (
            <SelectItem key={month.value} value={month.value} disabled={month.value === firstMonth || month.value === secondMonth}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 w-[180px]">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  )
})