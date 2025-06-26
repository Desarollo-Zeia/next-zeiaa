"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useTransition } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type EnergyHeadquarter = {
  id: number
  name: string
  is_active: boolean
  electrical_panels: Array<{
    id: number
    name: string
    is_active: boolean
  }>
  powers: Array<{
    id: number
    type: string
    power_installed: number
    power_contracted: number
    power_max: number
  }>
}

type Props = {
  energyHeadquarter: EnergyHeadquarter[], // Nombre exacto del prop
  energy: string
}


export default function HeadquarterEnergyFilter({ energyHeadquarter = [], energy }: Props ) {

   const [isPending, startTransition] = useTransition()
   const searchParams = useSearchParams()
   const { replace } = useRouter()
   const pathname = usePathname()


  const handleHeadquarterChange = (headquarterId: string) => {
    startTransition(() => {
        const params = new URLSearchParams(searchParams)
        params.set("headquarter", headquarterId)
        params.set("page", '1')
        replace(`${pathname}?${params.toString()}`)
    })
    }
  
  return (
    <div>
      <Select defaultValue={energy} onValueChange={handleHeadquarterChange}>
        <SelectTrigger className="w-[240px] bg-[#00b0c7]">
          <SelectValue placeholder="Seleccionar sede" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {energyHeadquarter.map((hq) => (
              <SelectItem key={hq.id} value={hq.id.toString()}>
                {hq.name}
              </SelectItem>
            ))}
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

