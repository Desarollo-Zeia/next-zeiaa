'use client'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useTransition } from 'react'

export default function CurrentVoltageToggle({ type, children } : { type: string, children?: React.ReactNode}) {

    const [isPending, startTransition] = useTransition()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const handleTypeChange= (type: string) => {
        startTransition(() => {
          const newParams = new URLSearchParams(searchParams);
          
          newParams.set('data_type', 'current');
    
          if (type) {
            newParams.set('data_type', type);
          }
    
          if (type === 'none') {
            newParams.delete('data_type');
          }
    
          replace(`${pathname}?${newParams.toString()}`, { scroll: false });
        });
      };

  return (
    <div className="flex justify-between items-center">
        <div>
            <h2 className='text-lg'>Historial tasa de distorsión armónica</h2>
        </div>
        <ToggleGroup type="single" className="relative" defaultValue={type} onValueChange={handleTypeChange}>
            {isPending && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-md z-10">
                <span className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></span>
                </div>
            )}
            <ToggleGroupItem value="current" aria-label="current">
                <p>Corriente</p>
            </ToggleGroupItem>
            <ToggleGroupItem value="voltage" aria-label="voltage">
                <p>Votaje</p>
            </ToggleGroupItem>
            <div className='ml-4'>
              { children }
            </div>
        </ToggleGroup>
      
    </div>
  )
}
