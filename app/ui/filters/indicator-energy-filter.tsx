'use client'
import React, { useTransition } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

const ENERGY_INDICATORS = [
  { value: 'EPpos', label: 'Energía activa consumida (KWh)' },
  { value: 'EPneg', label: 'Energía activa generada (KWh)' },
  { value: 'EQpos', label: 'Energía reactiva inductiva (KVarh)' },
  { value: 'EQneg', label: 'Energía reactiva capacitiva (KVarh)' },
]

export default function IndicatorEnergyFilter({ indicador }: { indicador: string }) {
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleIndicatorChange = (selectedIndicator: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      params.set('indicador', selectedIndicator)
      replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className='relative'>
      <Select onValueChange={handleIndicatorChange} value={indicador}>
        <SelectTrigger className="w-[280px] bg-[#00b0c7]">
          <SelectValue placeholder="Indicador" />
        </SelectTrigger>
        <SelectContent>
          {ENERGY_INDICATORS.map((indicator) => (
            <SelectItem key={indicator.value} value={indicator.value}>
              {indicator.label}
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
