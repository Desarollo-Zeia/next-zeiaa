"use client"

import { Indicator } from "@/app/type";
import { INDICATOR_CONVERTED, INDICATOR_UNIT_RAW } from "@/app/utils/formatter";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';

interface IndicatorToggleProps {
  indicators: { indicator: string, unit: string }[]
  indicatorParam: string
}

export default function IndicatorToggle({ indicators, indicatorParam }: IndicatorToggleProps) {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleValueChange = (value: Indicator) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      let unit: string;

      if (value === 'TVOC') {
        const TVOC_UNIT = indicators.find(indicator => indicator.indicator === value);
        unit = TVOC_UNIT?.unit as string;
      } else {
        unit = INDICATOR_UNIT_RAW[value as Indicator];
      }

      params.set('page', '1');
      params.set('indicator', value);
      params.set('unit', unit);

      replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="relative">
      <ToggleGroup 
        type="single" 
        onValueChange={handleValueChange} 
        value={indicatorParam}
        disabled={isPending}
        className="justify-center relative"
      >
        {indicators.map((indicator: { indicator: string, unit: string }) => (
          <ToggleGroupItem 
            key={indicator.indicator}
            value={indicator.indicator}
            aria-label={indicator.indicator}
            disabled={isPending}
          >
            {INDICATOR_CONVERTED[indicator.indicator as Indicator]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00b0c7]"></div>
        </div>
      )}
    </div>
  );
}