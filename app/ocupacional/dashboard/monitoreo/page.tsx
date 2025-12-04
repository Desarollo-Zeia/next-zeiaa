import { getToken } from "@/app/lib/auth"
import { roomsList } from "@/app/sevices/enterprise/data"
import { getRooms } from "@/app/sevices/filters/data"
import { readingsData, roomGeneralData, roomLastData } from "@/app/sevices/readings/data"
import { Indicator, SearchParams, Unit } from "@/app/type"
import FiltersContainer from "@/app/ui/filters/filters-container"
import RoomSelect from "@/app/ui/filters/room-select"
import ChartComponent from "@/app/ui/monitoreo/chart"
import TableComponent from "@/app/ui/monitoreo/table"
// import { cacheLife } from "next/cache"

type Result = {
  indicator: string,
  value: string,
  unit: string,
  status: string,
  hours: string,
  date: string
}

interface Room {
  id: number
  name: string
  status: string
  is_activated: boolean,
  devices: { dev_eui: string, id: number, type_sensor: string }[],
  headquarter: { id: number, name: string }
}

// --- Funciones con Caché ---

// async function GetRooms(token: string) {
//   'use cache'
//   cacheLife('minutes')
//   const rooms = await getRooms(token)
//   return rooms
// }

// async function GetRoomList(token: string) {
//   'use cache'
//   cacheLife('minutes')
//   const rooms = await roomsList({ limit: '50', token })
//   return rooms
// }

// async function GetRoomLastData(roomId: string | number, token: string) {
//   'use cache'
//   cacheLife('minutes') // Ajusta a 'seconds' si necesitas datos más frescos
//   return await roomLastData({ roomId, token })
// }

// async function GetReadingsData(roomId: string | number, indicator: string, unit: string, token?: string) {
//   return await readingsData({ roomId, indicator, unit, token })
// }

// async function GetRoomGeneralData(roomId: string | number, token: string) {
//   'use cache'
//   cacheLife('minutes') // Generalmente esta info (como thresholds) cambia poco
//   return await roomGeneralData({ roomId, token })
// }

// --- Componente Principal ---

export default async function Page({ searchParams }: SearchParams) {
  const { room, indicator = 'CO2', unit = 'PPM' } = await searchParams

  const authToken = await getToken()

  // 1. Obtener lista de salas (Cached)
  const rooms = await await getRooms(authToken!)
  const roomsListReadings = await roomsList({ limit: '50', token: authToken! })

  // Determinar la sala actual
  const firstRoom = rooms.find((room: any) => room.is_activated === true) // eslint-disable-line @typescript-eslint/no-explicit-any
  const currentFirstRoom = room ? room : firstRoom.id.toString()

  // 2. Obtener datos específicos de la sala (Ahora usando las funciones Cached)
  // Nota: Podrías usar Promise.all aquí para acelerar la carga en paralelo si las dependencias lo permiten
  const data = await roomLastData({ roomId: currentFirstRoom, token: authToken! })
  const { results } = await readingsData({ roomId: currentFirstRoom, indicator, unit, token: authToken! })
  const generalRoomData = await roomGeneralData({ roomId: currentFirstRoom, token: authToken! })

  // Procesamiento de datos
  const { name } = rooms.find((room: Room) => room.id === Number(currentFirstRoom)) || { name: 'Desconocido' }
  const { status } = roomsListReadings.results.find((room: Room) => room.id === Number(currentFirstRoom)) || { status: 'Desconocido' }

  const sortResults = (results: Result[]): Result[] => {
    return results.sort((a, b) => {
      const [aHours] = a.hours ? a.hours.split(' ') : ['00:00']
      const [bHours] = b.hours ? b.hours.split(' ') : ['00:00']

      // Nota: Es mejor usar la fecha completa si está disponible, pero respetando tu lógica:
      const timeA = new Date(`1970-01-01T${aHours}`)
      const timeB = new Date(`1970-01-01T${bHours}`)

      return timeA.getTime() - timeB.getTime()
    });
  }

  const devUI = generalRoomData?.devices?.[0]?.dev_eui

  return (
    <div>
      <FiltersContainer>
        <RoomSelect firstRoom={currentFirstRoom} rooms={rooms} />
      </FiltersContainer>
      <div className="flex gap-4 mx-2">
        <TableComponent
          data={data}
          name={name}
          devUI={devUI}
          room={currentFirstRoom}
          status={status}
        />
        <ChartComponent
          results={sortResults(results)}
          generalRoomData={generalRoomData}
          indicator={indicator as Indicator}
          unit={unit as Unit}
          thresholds={generalRoomData?.thresholds}
        />
      </div>
    </div>
  )
}