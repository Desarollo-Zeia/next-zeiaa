import { getToken } from "@/app/lib/auth";
import { getRooms } from "@/app/sevices/filters/data";
import { readingsData, roomGeneralData } from "@/app/sevices/readings/data";
import { Indicator, SearchParams, Unit } from "@/app/type";
import TableComponent from "@/app/ui/analisis/table";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
import RoomSelect from "@/app/ui/filters/room-select";
import StatusSelect from "@/app/ui/filters/status-select";
import { TimeRangeSlider } from "@/app/ui/filters/time-range-slider";
import { format } from "date-fns";
import { Suspense } from "react";
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

// async function GetReadingsData({ roomId, indicator, unit, date_after, date_before, page, status, hour_before, hour_after, ordering, token }: { roomId: string | number, indicator?: string, unit?: string, date_after: string, date_before: string, page?: string, status?: string, hour_before?: string, hour_after?: string, ordering?: string, token: string }) {
//   'use cache'
//   return await readingsData({ roomId, indicator, unit, date_after, date_before, page, status, hour_before, hour_after, ordering, token })
// }

async function Indicadores({ searchParams }: SearchParams) {

  const { room, indicator, unit, date_after = new Date(), date_before = new Date(), page = '1', status, start, end, ordering } = await searchParams

  const authToken = await getToken()


  const formattedDateAfter = format(date_after, 'yyyy-MM-dd')
  const formattedDateBefore = format(date_before, 'yyyy-MM-dd')

  const rooms = await getRooms(authToken!)
  const firstRoom = rooms.find((room: any) => room.is_activated === true)  // eslint-disable-line @typescript-eslint/no-explicit-any

  const currentFirstRoom = room ? room : firstRoom.id

  const generalRoomData = await roomGeneralData({ roomId: currentFirstRoom, token: authToken! })
  const readings = await readingsData({ roomId: currentFirstRoom, indicator, unit, date_after: formattedDateAfter, date_before: formattedDateBefore, page, status, hour_before: end, hour_after: start, ordering, token: authToken! })
  const thresholdsFilters = generalRoomData?.thresholds_filter[indicator as Indicator]

  return (
    <div>
      <FiltersContainer>
        <RoomSelect firstRoom={currentFirstRoom} rooms={rooms} />
        <StatusSelect status_filter={thresholdsFilters} />
        <TimeRangeSlider />
        <DatepickerRange />
      </FiltersContainer>
      <TableComponent generalRoomData={generalRoomData} readings={readings} count={readings.count} indicator={indicator as Indicator} unit={unit as Unit} date_after={formattedDateAfter} date_before={formattedDateBefore} room={currentFirstRoom} />
    </div>
  )
}

export default async function Page({ searchParams }: SearchParams) {
  return (
    <div>
      <Suspense fallback={<div>Cargando indicadores...</div>}>
        <Indicadores searchParams={searchParams} />
      </Suspense>
    </div>
  )
}