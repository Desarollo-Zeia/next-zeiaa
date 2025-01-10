"use client"

import { Indicator, INDICATOR_UNIT_RAW } from "@/app/utils/formatter";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

interface IndicatorToggleProps {
  indicators: { indicator: string, unit: string }[]
}

export default function IndicatorToggle( { indicators } : IndicatorToggleProps) {

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const params = new URLSearchParams(searchParams);
  const indicator = params.get('indicator') as Indicator

  const handleValueChange = (indicator : Indicator ) => {
    const params = new URLSearchParams(searchParams)

    if (indicator) {
      params.set('indicator', indicator);
      params.set('unit', INDICATOR_UNIT_RAW[indicator]);
    } 

    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <ToggleGroup type="single" value={indicator} onValueChange={handleValueChange}  className="justify-center">
      {indicators.map((indicator : { indicator: string, unit: string }) => (
        <ToggleGroupItem key={indicator.indicator} value={indicator.indicator} aria-label={indicator.indicator}>
          {indicator.indicator}  
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}