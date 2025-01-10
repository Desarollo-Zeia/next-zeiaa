"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useState } from "react";

interface IndicatorToggleProps {
  indicators: { indicator: string, unit: string }[]
}

export default function IndicatorToggle( { indicators } : IndicatorToggleProps) {

  const [checkedIndicator, setCheckedIndicator] = useState<string>('CO2')
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleValueChange = (indicatorObj : { indicator: string, unit: string} ) => {
    const params = new URLSearchParams(searchParams)
    const { indicator, unit } = indicatorObj
    setCheckedIndicator(indicator)
    if (indicator && unit) {
      params.set('indicator', indicator)
      params.set('unit', unit)
    } 

    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <ToggleGroup type="single" value={checkedIndicator} onValueChange={handleValueChange}  className="justify-center">
      {indicators.map((indicator : { indicator: string, unit: string }) => {
        return (
          <ToggleGroupItem className={`${checkedIndicator === indicator.indicator ? 'bg-[#00b0c7] text-white hover:bg-[#00b0c7] hover:text-white' : 'bg-inherit' } `} key={indicator.indicator} value={indicator} aria-label={indicator.indicator}>
            {indicator.indicator}  
          </ToggleGroupItem>
        )
      })}
    </ToggleGroup>
  )
}