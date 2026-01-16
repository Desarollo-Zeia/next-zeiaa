import { getToken } from "@/app/lib/auth";
import { getRooms } from "@/app/services/filters/data";
import { readingsGraph, readingsReal, roomGeneralData } from "@/app/services/readings/data";
import { SearchParams } from "@/app/type";
// import { ChartComponent } from "@/app/ui/analisis/estadisticas/chart";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
// import IndicatorToggle from "@/app/ui/filters/indicators-toggle";
// import RoomSelect from "@/app/ui/filters/room-select";
import { ReadingsChart } from "@/components/chart-statistics";
import { format } from "date-fns"
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import EstadisticasSkeleton from "./loading";
// import { cacheLife } from "next/cache";

// async function GetRooms(token: string) {
//   'use cache'
//   cacheLife('minutes')
//   const rooms = await getRooms(token)
//   return rooms
// }

// async function GetGeneralData(token: string, currentFirstRoom: string | number) {
//   'use cache'
//   cacheLife('minutes')
//   return await roomGeneralData({ roomId: currentFirstRoom, token })

// }

// async function GetReadingsGraph({ roomId, indicator, unit, date_after, date_before, hour_before, hour_after, token }: { roomId: string | number, indicator: string, unit: string, date_after: string, date_before: string, hour_before: string, hour_after: string, token: string }) {
//   'use cache'
//   return await readingsGraph({ roomId, indicator, unit, date_after, date_before, hour_before, hour_after, token })
// }

async function Estadisticas({ searchParams }: SearchParams) {
  // const { first_room: firstRoom } = await detail()
  const { room, indicator, unit, date_after = new Date(), date_before = new Date(), start = '00:00', end = '23:00', interval } = await searchParams

  const authToken = await getToken()

  const formattedDateAfter = format(date_after, 'yyyy-MM-dd')
  const formattedDateBefore = format(date_before, 'yyyy-MM-dd')

  const rooms = await await getRooms(authToken!)

  const firstRoom = rooms.find((room: any) => room.is_activated === true)  // eslint-disable-line @typescript-eslint/no-explicit-any
  const currentFirstRoom = room ? room : firstRoom.id

  const generalRoomData = await roomGeneralData({ roomId: currentFirstRoom, token: authToken! })
  const { indicator: currentFirstIndicator, unit: currentFirstUnit } = generalRoomData.indicators_activated[0]

  const currentIndicator = indicator ?? currentFirstIndicator
  const currentUnit = unit ?? currentFirstUnit

  const readings = await readingsGraph({ indicator: currentIndicator, unit: currentUnit, date_after: formattedDateAfter, date_before: formattedDateBefore, hour_before: start, hour_after: end, token: authToken!, roomId: currentFirstRoom, interval })


  const indicators = generalRoomData.indicators_activated

  return (
    <div className="flex mx-2 justify-center gap-4">

      <ReadingsChart indicator={currentIndicator as 'CO2' | 'HUMIDITY' | 'TEMPERATURE'} unit={currentUnit} roomsData={readings} indicators={indicators} interval={interval} dateAfter={formattedDateAfter} dateBefore={formattedDateBefore} />
    </div>
  )
}

export default async function Page({ searchParams }: SearchParams) {
  return (
    <div>
      <Suspense fallback={<EstadisticasSkeleton />}>
        <Estadisticas searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
