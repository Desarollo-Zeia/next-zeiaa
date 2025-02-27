"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useCallback, useEffect } from "react"
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
  energyHeadquarter: EnergyHeadquarter[] // Nombre exacto del prop
}

export default function HeadquarterEnergyFilter({ energyHeadquarter = [] }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentHq = searchParams.get("headquarter")

  const handleHeadquarterChange = useCallback(
    (headquarterId: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("headquarter", headquarterId)
      router.push(`?${params.toString()}`)
    },
    [router, searchParams],
  )

  // Set default headquarter on initial render if not already set
  useEffect(() => {
    if (!currentHq && energyHeadquarter.length > 0) {
      const defaultHqId = energyHeadquarter[0].id.toString()
      const params = new URLSearchParams(searchParams.toString())
      params.set("headquarter", defaultHqId)
      router.push(`?${params.toString()}`)
    }
  }, [currentHq, energyHeadquarter, router, searchParams])

  // Determine the current value for the select
  const selectValue = currentHq || (energyHeadquarter.length > 0 ? energyHeadquarter[0].id.toString() : "")

  return (
    <div>
      <Select value={selectValue} onValueChange={handleHeadquarterChange}>
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
      </Select>
    </div>
  )
}

