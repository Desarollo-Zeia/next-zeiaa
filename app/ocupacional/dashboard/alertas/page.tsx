import { getToken } from "@/app/lib/auth";
import { alerts } from "@/app/services/alerts/data";
import { getRooms } from "@/app/services/filters/data";
import { roomGeneralData } from "@/app/services/readings/data";
import { Indicator, Room, SearchParams } from "@/app/type";
import TableComponent from "@/app/ui/alertas/table";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
import RoomSelect from "@/app/ui/filters/room-select";
// import StatusSelect from "@/app/ui/filters/status-select";
import { format } from "date-fns";
import { Suspense } from "react";
import AlertasSkeleton from "./loading";
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

// async function GetAlerts({ roomId, indicator, unit, date_after, date_before, page, status, token }: { roomId: string | number, indicator: string, unit: string, date_after: string, date_before: string, page?: string, status?: string, token?: string }) {
//   'use cache'
//   return await alerts({ roomId, indicator, unit, date_after, date_before, page, status, token })
// }

async function Alertas({ searchParams }: SearchParams) {


  const { room, indicator, unit, date_after = new Date(), date_before = new Date(), page = '1', status } = await searchParams

  const authToken = await getToken()


  const formattedDateAfter = format(date_after, 'yyyy-MM-dd')
  const formattedDateBefore = format(date_before, 'yyyy-MM-dd')

  const rooms: Room[] = await getRooms(authToken!)
  const firstRoom = rooms.find((room) => room.is_activated === true)

  const currentFirstRoom = room ? room : firstRoom?.id?.toString() ?? rooms[0]?.id?.toString()

  const generalRoomData = await roomGeneralData({ roomId: currentFirstRoom, token: authToken! })
  const { indicator: currentFirstIndicator, unit: currentFirstUnit } = generalRoomData.indicators_activated[0]

  const currentIndicator = indicator ?? currentFirstIndicator
  const currentUnit = unit ?? currentFirstUnit

  const readings = await alerts({ roomId: currentFirstRoom, indicator: currentIndicator, unit: currentUnit, date_after: formattedDateAfter, date_before: formattedDateBefore, page, status, token: authToken! })

  // const thresholdsFilters = generalRoomData?.thresholds_filter[indicator].filter((th: string) => th !== 'GOOD' && th !== 'MODERATE')

  return (
    <div>
      <FiltersContainer>
        <RoomSelect firstRoom={currentFirstRoom} rooms={rooms} />
        {/* <StatusSelect status_filter={thresholdsFilters} /> */}
        <DatepickerRange />
      </FiltersContainer>
      <TableComponent data={readings.results} count={readings.count} generalRoomData={generalRoomData} indicator={currentIndicator as Indicator} room={currentFirstRoom as string} unit={currentUnit} date_after={formattedDateAfter as string} date_before={formattedDateBefore as string} />
    </div>
  )
}

export default async function Page({ searchParams }: SearchParams) {
  return (
    <div>
      <Suspense fallback={<AlertasSkeleton />}>
        <Alertas searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

