'use client'
import React from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';


export default function PeriodPickerFilter() {

     const searchParams = useSearchParams()
      const [isPending, startTransition] = useTransition();
      const pathname = usePathname()
      const { replace } = useRouter()

    const handlePeriod = (period: string) => {
        startTransition(() => {
         const params = new URLSearchParams(searchParams);
         params.set('weekday', period);

         replace(`${pathname}?${params.toString()}`, { scroll: false});
        })
      
    }

    return (
        <div className='relative'>
            <ToggleGroup type="single" defaultValue='1,2,3,4,5' onValueChange={handlePeriod}>
                <ToggleGroupItem value="1,2,3,4,5">Lunes a viernes</ToggleGroupItem>
                <ToggleGroupItem value="6">Sábado</ToggleGroupItem>
                <ToggleGroupItem value="7">Domingo</ToggleGroupItem>
            </ToggleGroup>
            {isPending && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
            )}
        </div>
    )
}
