'use client'
import {
    ToggleGroup,
    ToggleGroupItem,
  } from "@/components/ui/toggle-group"

  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";


export default function ChartFilters({ type, group_by } : { type: string, group_by: string}) {
    const [isPending, startTransition] = useTransition();
const searchParams = useSearchParams();
const pathname = usePathname();
const { replace } = useRouter();

  const handleConsumptionChange = (type: string) => {
    startTransition(() => {
      const newParams = new URLSearchParams(searchParams);
      
      if (type) {
        newParams.set('type', type);
      }

      if (type === 'none') {
        newParams.delete('type');
      }

      replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    })
  }

  const handleGroupChange = (type: string) => {
    startTransition(() => {
        const newParams = new URLSearchParams(searchParams);
        
        if (type) {
          newParams.set('group_by', type);
        }
  
        if (type === 'none') {
          newParams.delete('group_by');
        }
  
        replace(`${pathname}?${newParams.toString()}`, { scroll: false });
      })
  }

  return (
    <div className="flex items-center gap-2 relative">
        <ToggleGroup type="single" onValueChange={handleGroupChange} defaultValue={group_by}>
            <ToggleGroupItem value="day" aria-label="day">
                <p>Día</p>
            </ToggleGroupItem>
            <ToggleGroupItem value="month" aria-label="month">
                <p>Mes</p>
            </ToggleGroupItem>
        </ToggleGroup>
        <Select onValueChange={handleConsumptionChange} defaultValue={type}>
            <SelectTrigger className="w-[280px] bg-[#00b0c7]">
                <SelectValue placeholder="Selecciona un tipo de consumo" />
            </SelectTrigger>
            <SelectContent className="relative">
                <SelectGroup>
                    <SelectItem value="consumption">Consumo kWH</SelectItem>
                    <SelectItem value="cost">Consumo en S/</SelectItem>
                </SelectGroup>
            </SelectContent>
              {isPending && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
        </Select>

    </div>
  )
}
