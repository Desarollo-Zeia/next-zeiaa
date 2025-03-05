"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useCallback, useEffect } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ElectricalPanel {
  id: number
  name: string
  is_active: boolean
}

interface PanelsFilterProps {
  energyPanels: ElectricalPanel[]
}

export default function PanelsFilterEnergy({ energyPanels = [] }: PanelsFilterProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentPanel = searchParams.get("panel")

  const handlePanelChange = useCallback(
    (panelId: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("panel", panelId)
      router.push(`?${params.toString()}`, { scroll: false})
    },
    [router, searchParams],
  )

  // Set default panel on initial render if not already set
  useEffect(() => {
    if (!currentPanel && energyPanels.length > 0) {
      const defaultPanelId = energyPanels[0].id.toString()
      const params = new URLSearchParams(searchParams.toString())
      params.set("panel", defaultPanelId)
      router.push(`?${params.toString()}`)
    }
  }, [currentPanel, energyPanels, router, searchParams])

  // Determine the current value for the select
  const selectValue = currentPanel || (energyPanels.length > 0 ? energyPanels[0].id.toString() : "")

  return (
    <div>
      <Select value={selectValue} onValueChange={handlePanelChange}>
        <SelectTrigger className="w-[240px] bg-[#00b0c7]">
          <SelectValue placeholder="Seleccionar panel" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {energyPanels.map((panel) => (
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

