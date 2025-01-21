"use client"

import { Indicator } from "@/app/type";
import { INDICATOR_UNIT_RAW } from "@/app/utils/formatter";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

interface IndicatorToggleProps {
  indicators: { indicator: string, unit: string }[]
  indicatorParam: string
}

export default function IndicatorToggle( { indicators, indicatorParam } : IndicatorToggleProps) {

  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const pathname = usePathname()
  const { replace } = useRouter()
  

  const handleValueChange = (value: Indicator) => {
    let unit : string
    
    if (value === 'TVOC') {
      const TVOC_UNIT = indicators.find(indicator => indicator.indicator === value)
      unit = TVOC_UNIT?.unit as string
    } else {
      unit = INDICATOR_UNIT_RAW[value as Indicator]
    }

    params.set('page', '1')
    params.set('indicator', value)
    params.set('unit', unit)
    
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <ToggleGroup type="single" onValueChange={handleValueChange} value={indicatorParam}  className="justify-center">
      {indicators.map((indicator : { indicator: string, unit: string }) => {
        return (
          <ToggleGroupItem key={indicator.indicator} value={indicator.indicator} aria-label={indicator.indicator}>
            {indicator.indicator}  
          </ToggleGroupItem>
        )
      })}
    </ToggleGroup>
  )
}