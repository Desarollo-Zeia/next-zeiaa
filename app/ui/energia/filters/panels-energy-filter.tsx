"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useCallback } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ElectricalPanel {
  id: number
  name: string
  is_active: boolean
}

interface PanelsFilterProps {
  energyPanels: ElectricalPanel[]
}

export default function PanelsFilterEnergy({ energyPanels }: PanelsFilterProps) {


  console.log(energyPanels)
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentPanel = searchParams.get("panel")

  const handlePanelChange = useCallback(
    (panelId: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("panel", panelId)
      router.push(`?${params.toString()}`)
    },
    [router, searchParams],
  )

  return (
    <div>
      <Select value={currentPanel || ""} onValueChange={handlePanelChange}>
        <SelectTrigger className="w-[240px] bg-[#00b0c7]">
          <SelectValue placeholder="Seleccionar panel" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {energyPanels?.map((panel) => (
              <SelectItem key={panel.id} value={panel.id.toString()}>
                {panel.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

