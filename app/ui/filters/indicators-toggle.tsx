"use client"

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

  const handleValueChange = (indicatorObj : { indicator: string, unit: string} ) => {
    params.set('page', '1')
    
    const { indicator, unit } = indicatorObj
    if (indicator && unit) {
      params.set('indicator', indicator)
      params.set('unit', unit)
    } 

    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <ToggleGroup type="single" onValueChange={handleValueChange}  className="justify-center">
      {indicators.map((indicator : { indicator: string, unit: string }) => {
        return (
          <ToggleGroupItem className={`${indicatorParam === indicator.indicator ? 'bg-[#00b0c7] text-white hover:bg-[#00b0c7] hover:text-white' : 'bg-inherit' } `} key={indicator.indicator} value={indicator} aria-label={indicator.indicator}>
            {indicator.indicator}  
          </ToggleGroupItem>
        )
      })}
    </ToggleGroup>
  )
}