import { getToken } from "@/app/lib/auth"
import { getRooms } from "@/app/services/filters/data"
import { readingsGraph, roomGeneralData } from "@/app/services/readings/data"
import { SearchParams } from "@/app/type"
import MonitoreoMultiSala from "@/app/ui/monitoreo/monitoreo-multi-sala"
import { Suspense } from "react"
import MonitoreoSkeleton from "./loading"
import { format, subHours } from "date-fns"

// --- Componente Principal ---
// Optimizado para eliminar waterfalls (async-parallel pattern)

async function Monitoreo({ searchParams }: SearchParams) {
  const { indicator, unit } = await searchParams

  // Preparar fechas de forma síncrona (no necesita await)
  const now = new Date()
  const oneHourAgo = subHours(now, 1)
  const formattedDateAfter = format(oneHourAgo, "yyyy-MM-dd")
  const formattedDateBefore = format(now, "yyyy-MM-dd")

  // 1. Obtener token y rooms en paralelo no es posible porque rooms necesita el token
  // Pero podemos iniciar el token primero y luego rooms
  const authToken = await getToken()
  const rooms = await getRooms(authToken!)

  // Determinar la primera sala activa para obtener indicadores
  const firstRoom = rooms.find((room: { is_activated: boolean }) => room.is_activated === true)

  // 2. Si ya tenemos indicator/unit de searchParams, no necesitamos esperar por generalRoomData
  // para el request de readingsGraph - podemos paralelizar
  const hasIndicatorParams = indicator && unit

  if (hasIndicatorParams) {
    // Caso optimizado: indicator/unit ya conocidos - paralelizar ambas requests
    const [generalRoomData, roomsReadings] = await Promise.all([
      roomGeneralData({ roomId: firstRoom.id.toString(), token: authToken! }),
      readingsGraph({
        indicator,
        unit,
        date_after: formattedDateAfter,
        date_before: formattedDateBefore,
        token: authToken!,
      })
    ])

    return (
      <div className="py-4">
        <MonitoreoMultiSala
          roomsData={roomsReadings}
          indicator={indicator as "CO2" | "TEMPERATURE" | "HUMIDITY"}
          unit={unit}
          indicators={generalRoomData.indicators_pollutants}
        />
      </div>
    )
  }

  // Caso sin params: necesitamos generalRoomData primero para obtener indicadores por defecto
  const generalRoomData = await roomGeneralData({ roomId: firstRoom.id.toString(), token: authToken! })
  const { indicator: currentFirstIndicator, unit: currentFirstUnit } = generalRoomData.indicators_activated[0]

  const currentIndicator = currentFirstIndicator
  const currentUnit = currentFirstUnit

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