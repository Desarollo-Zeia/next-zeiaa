"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useTransition } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFiltersStore } from "@/app/lib/stores/filters-store"

export interface ElectricalPanel {
  id: number
  name: string
  is_active: boolean
}

interface PanelsFilterProps {
  energyPanels: ElectricalPanel[],
  panel: string
}

export default function PanelsFilterEnergy({ energyPanels = [], panel }: PanelsFilterProps) {

  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const pathname = usePathname()
  const { panelId, setPanel } = useFiltersStore()

  const currentPanelId = panelId || searchParams.get('panel') || panel

  const handlePanelChange = (panelId: string) => {
    setPanel(panelId)
    
    startTransition(() => {
      const params = new URLSearchParams(searchParams)

      params.set("panel", panelId)
      params.set("page", '1')
      params.delete('point')
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    })
  }

  return (
    <div className="relative">
      <Select value={currentPanelId || panel} onValueChange={handlePanelChange}>
        <SelectTrigger className="w-[240px] bg-[#00b0c7]">
          <SelectValue placeholder="Seleccionar panel" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {energyPanels.map((panel) => (
              <SelectItem key={panel.id} value={panel.id.toString()} disabled={!panel.is_active}>
                {panel.name}
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

