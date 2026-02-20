import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FiltersState {
  roomId: string
  headquarterId: string
  panelId: string
  pointId: string
  setRoom: (roomId: string) => void
  setHeadquarter: (headquarterId: string) => void
  setPanel: (panelId: string) => void
  setPoint: (pointId: string) => void
  clearFilters: () => void
  syncFromUrl: (params: URLSearchParams) => void
}

export const useFiltersStore = create<FiltersState>()(
  persist(
    (set) => ({
      roomId: '',
      headquarterId: '',
      panelId: '',
      pointId: '',
      setRoom: (roomId: string) => set({ roomId }),
      setHeadquarter: (headquarterId: string) => set({ headquarterId }),
      setPanel: (panelId: string) => set({ panelId }),
      setPoint: (pointId: string) => set({ pointId }),
      clearFilters: () => set({ roomId: '', headquarterId: '', panelId: '', pointId: '' }),
      syncFromUrl: (params: URLSearchParams) => {
        const roomId = params.get('room') ?? ''
        const headquarterId = params.get('headquarter') ?? ''
        const panelId = params.get('panel') ?? ''
        const pointId = params.get('point') ?? ''
        set({ roomId, headquarterId, panelId, pointId })
      },
    }),
    {
      name: 'zeiaa-filters-storage',
    }
  )
)
