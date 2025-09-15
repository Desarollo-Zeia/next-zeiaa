'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'

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

interface MonthPickerProps {
  value?: string
  onChange?: (value: string) => void
  disabledMonth?: string // para bloquear un mes específico
}

export default function MonthPicker({ value, onChange, disabledMonth }: MonthPickerProps) {
  return (
    <Select
      value={value}
      onValueChange={(val) => {
        if (onChange) onChange(val)
      }}
    >
      <SelectTrigger className="w-[180px] bg-[#00b0c7]">
        <SelectValue placeholder="Meses" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">Ninguno</SelectItem>
        {MONTHS.map((month) => (
          <SelectItem
            key={month.value}
            value={month.value}
            disabled={disabledMonth === month.value} // 🔒 bloquea el mes seleccionado en el otro picker
          >
            {month.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
