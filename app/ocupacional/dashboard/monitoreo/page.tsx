import { getToken } from "@/app/lib/auth"
import { getRooms } from "@/app/services/filters/data"
import { readingsGraph, roomGeneralData } from "@/app/services/readings/data"
import { SearchParams } from "@/app/type"
import MonitoreoMultiSala from "@/app/ui/monitoreo/monitoreo-multi-sala"
import { Suspense } from "react"
import MonitoreoSkeleton from "./loading"
import { format, subHours } from "date-fns"

// --- Componente Principal ---

async function Monitoreo({ searchParams }: SearchParams) {
  const { indicator, unit } = await searchParams

  const authToken = await getToken()

  // 1. Obtener lista de salas
  const rooms = await getRooms(authToken!)

  // Determinar la primera sala activa para obtener indicadores
  const firstRoom = rooms.find((room: { is_activated: boolean }) => room.is_activated === true)
  const generalRoomData = await roomGeneralData({ roomId: firstRoom.id.toString(), token: authToken! })
  const { indicator: currentFirstIndicator, unit: currentFirstUnit } = generalRoomData.indicators_activated[0]

  const currentIndicator = indicator ?? currentFirstIndicator
  const currentUnit = unit ?? currentFirstUnit

  // 2. Obtener datos de la última hora de TODAS las salas
  const now = new Date()
  const oneHourAgo = subHours(now, 1)
  const formattedDateAfter = format(oneHourAgo, "yyyy-MM-dd")
  const formattedDateBefore = format(now, "yyyy-MM-dd")

  const roomsReadings = await readingsGraph({
    indicator: currentIndicator,
    unit: currentUnit,
    date_after: formattedDateAfter,
    date_before: formattedDateBefore,
    token: authToken!,
  })

  return (
    <div className="py-4">
      <MonitoreoMultiSala
        roomsData={roomsReadings}
        indicator={currentIndicator}
        unit={currentUnit}
        indicators={generalRoomData.indicators_pollutants}
      />
    </div>
  )
}

export default async function Page({ searchParams }: SearchParams) {
  return (
    <div>
      <Suspense fallback={<MonitoreoSkeleton />}>
        <Monitoreo searchParams={searchParams} />
      </Suspense>
    </div>
  )
}