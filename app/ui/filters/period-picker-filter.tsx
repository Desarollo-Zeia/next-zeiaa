'use client'
import React from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react'

const periods = [
    {
        id: 1,
        value: '1,2,3,4,5',
        name: 'Lunes a Viernes'
    },
    {
        id: 2,
        value: '6',
        name: 'Sábado'
    },
    {
        id: 3,
        value: '7',
        name: 'Domingo'
    }
]


export default function PeriodPickerFilter({ weekday }: { weekday: string }) {


    const searchParams = useSearchParams()

    const [isPending, startTransition] = useTransition()
    const pathname = usePathname()
    const { replace } = useRouter()

    const handlePeriod = (period: string) => {
        const params = new URLSearchParams(searchParams)
        startTransition(() => {
            params.set('weekday', period)

            replace(`${pathname}?${params.toString()}`, { scroll: false })
        })

    }

    return (
        <div className='relative'>
            <ToggleGroup type="single" value={weekday} onValueChange={handlePeriod}>
                {
                    periods.map(period => {
                        return (
                            <ToggleGroupItem key={period.id} value={period.value} disabled={period.value === weekday}>
                                {period.name}
                            </ToggleGroupItem>
                        )
                    })
                }
            </ToggleGroup>
            {isPending && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
            )}
        </div>
    )
}
