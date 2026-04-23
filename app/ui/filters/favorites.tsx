'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useTransition, useEffect } from 'react'
import { useFiltersStore } from '@/app/lib/stores/filters-store'
import posthog from "posthog-js"

interface Favorite {
  id: number
  name: string
  measurement_point: number
  enterprise_id: number
  energy_headquarter_id: number
  electrical_panel_id: number
}

interface FavoritesData {
  results: Favorite[]
}

interface FavoritesProps {
  data: FavoritesData
}

export default function Favorites({ data }: FavoritesProps) {
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const { replace } = useRouter()
  const { headquarterId, panelId, pointId, setHeadquarter, setPanel, setPoint, syncFromUrl } = useFiltersStore()

  useEffect(() => {
    syncFromUrl(searchParams)
  }, [searchParams, syncFromUrl])

  const firstFavorite = data?.results?.[0]

  if (!data || !data.results || data.results.length === 0 || !firstFavorite) {
    return null
  }

  const handleFavoriteChange = (favoriteId: string) => {
    const selected = data.results.find(f => String(f.id) === favoriteId)
    if (!selected) return

    const newHeadquarterId = String(selected.energy_headquarter_id)
    const newPanelId = String(selected.electrical_panel_id)
    const newPointId = String(selected.measurement_point)

    posthog.capture('filter_used', {
      filter_type: 'favorites',
      previous_value: `${headquarterId}-${panelId}-${pointId}`,
      new_value: `${newHeadquarterId}-${newPanelId}-${newPointId}`,
      pathname: pathname,
      timestamp: new Date().toISOString(),
    })

    setHeadquarter(newHeadquarterId)
    setPanel(newPanelId)
    setPoint(newPointId)

    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      params.set('headquarter', newHeadquarterId)
      params.set('panel', newPanelId)
      params.set('point', newPointId)
      replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  const getDisplayValue = () => {
    const selected = data.results.find(
      f => String(f.energy_headquarter_id) === headquarterId &&
        String(f.electrical_panel_id) === panelId &&
        String(f.measurement_point) === pointId
    )
    return selected ? String(selected.id) : ''
  }

  return (
    <div className="relative">
      <Select onValueChange={handleFavoriteChange} defaultValue={getDisplayValue()}>
        <SelectTrigger className="w-[240px] bg-[#00b0c7] text-white">
          <SelectValue className="text-white font-bold" placeholder="Favoritos" />
        </SelectTrigger>
        <SelectContent>
          {
            data?.results?.map((favorite: Favorite) => (
              <SelectItem key={favorite.id} value={String(favorite.id)}>
                {favorite.name}
              </SelectItem>
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