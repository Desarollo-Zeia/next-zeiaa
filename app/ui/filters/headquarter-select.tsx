'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useFiltersStore } from '@/app/lib/stores/filters-store';
import posthog from "posthog-js";

interface Headquarter {
  id:number
  name:string
}

interface Headquarters {
  count: number,
  next: string,
  previous: string,
  results : Headquarter[]
}

export default function HeadquarterSelect({ headquarters } : { headquarters : Headquarters }) {

  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname()
  const { replace } = useRouter()
  const { headquarterId, setHeadquarter } = useFiltersStore()

  const currentHeadquarterId = headquarterId || searchParams.get('headquarter') || ''

  const handleRoomChange = (headquarter: string) => {
    const previousValue = currentHeadquarterId
    const newValue = headquarter === 'none' ? '' : headquarter
    
    if (previousValue !== newValue) {
      posthog.capture('filter_used', {
        filter_type: 'headquarter',
        previous_value: previousValue,
        new_value: newValue,
        pathname: pathname,
        timestamp: new Date().toISOString(),
      })
    }
    
    setHeadquarter(headquarter === 'none' ? '' : headquarter)
    
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (headquarter && headquarter !== 'none') {
        params.set('headquarter', headquarter);
      } 
 
      if (headquarter === 'none') {
        params.delete('headquarter');
      }
 
      replace(`${pathname}?${params.toString()}`, { scroll: false});
    })
  }
  
  return (
    <div className="relative">
      <Select onValueChange={handleRoomChange} value={currentHeadquarterId || 'none'}>
        <SelectTrigger className="w-[240px] bg-[#00b0c7]">
          <SelectValue placeholder="Selecciona una sede" className="text-white font-bold"/>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='none'>Sin área</SelectItem>
          {
            headquarters?.results?.map((headquarter : Headquarter) => (
              <SelectItem key={headquarter.id} value={String(headquarter.id)} >{headquarter.name}</SelectItem>
            ))
          }
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
