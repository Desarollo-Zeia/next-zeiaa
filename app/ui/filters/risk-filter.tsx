'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function RiskFilter() {

    const [isPending, startTransition] = useTransition();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
  
    const handleRoomChange = (risk: string) => {
      startTransition(() => {
        const newParams = new URLSearchParams(searchParams);
        
        newParams.set('page', '1');
  
        if (risk) {
          newParams.set('risk', risk);
        }
  
        if (risk === 'none') {
          newParams.delete('risk');
        }
  
        replace(`${pathname}?${newParams.toString()}`, { scroll: false });
      });
    };

  
  return (
    <div className="relative">
      <Select 
        onValueChange={handleRoomChange} 
        disabled={isPending}
      >
        <SelectTrigger className="w-[240px] bg-[#00b0c7]">
          <SelectValue 
            placeholder={isPending ? "Cargando..." : "Selecciona una sala"} 
            className="text-white font-bold"
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='none'>Sin nivel específico</SelectItem>
          <SelectItem value='0'>Riesgo muy bajo</SelectItem>
          <SelectItem value='1'>Riesgo bajo</SelectItem>
          <SelectItem value='2'>Riesgo medio bajo</SelectItem>
          <SelectItem value='3'>Riesgo medio alto</SelectItem>
          <SelectItem value='4'>Riesgo muy alto</SelectItem>
          
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
