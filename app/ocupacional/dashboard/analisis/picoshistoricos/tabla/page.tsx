import { readingsPeaksTableLow, readingsPeaksTableHigh, roomGeneralData } from "@/app/services/readings/data"
import TableComponent from "@/app/ui/picos/table"
import { DatepickerRange } from "@/app/ui/filters/datepicker-range"
import FiltersContainer from "@/app/ui/filters/filters-container"
import { format } from "date-fns"
import { getRooms } from "@/app/services/filters/data"
import RoomSelect from "@/app/ui/filters/room-select"
import { Indicator } from "@/app/type"
import StatusSelect from "@/app/ui/filters/status-select"
// import { cacheLife } from "next/cache";
import { getToken } from "@/app/lib/auth"
import { Suspense } from "react"
import ToggleHighLow from "@/app/ui/filters/toggle-high-low"

type SearchParams = {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

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

// async function ReadingsPeaks({ roomId, indicator, unit, date_after, date_before, page, status, token }: { roomId: string | number, indicator: string, unit: string, date_after: string, date_before: string, page?: string, status?: string, token: string }) {
//   'use cache'
//   return await readingsPeaks({ roomId, indicator, unit, date_after, date_before, page, status, token })
// }

async function PicosHistoricos({ searchParams }: SearchParams) {

  const { room, indicator, unit, date_after = new Date(), date_before = new Date(), page, status, level } = await searchParams

  const authToken = await getToken()

  const formattedDateAfter = format(date_after, 'yyyy-MM-dd')
  const formattedDateBefore = format(date_before, 'yyyy-MM-dd')

  const rooms = await getRooms(authToken!)
  const firstRoom = rooms.find((room: any) => room.is_activated === true)  // eslint-disable-line @typescript-eslint/no-explicit-any

  const currentFirstRoom = room ? room : firstRoom.id
  const generalRoomData = await roomGeneralData({ roomId: currentFirstRoom, token: authToken! })

  const { indicator: currentFirstIndicator, unit: currentFirstUnit } = generalRoomData.indicators_activated[0]

  const currentIndicator = indicator ?? currentFirstIndicator
  const currentUnit = unit ?? currentFirstUnit
  const readingsLow = await readingsPeaksTableLow({ roomId: currentFirstRoom, indicator: currentIndicator, unit: currentUnit, date_after: formattedDateAfter, date_before: formattedDateBefore, page, status, token: authToken! })

  const readingsHigh = await readingsPeaksTableHigh({ roomId: currentFirstRoom, indicator: currentIndicator, unit: currentUnit, date_after: formattedDateAfter, date_before: formattedDateBefore, page, status, token: authToken! })

  const thresholdsFilters = generalRoomData?.thresholds_filter[indicator as Indicator]

  return (
    <div>
      <FiltersContainer>
        <RoomSelect firstRoom={currentFirstRoom} rooms={rooms} />
        <StatusSelect status_filter={thresholdsFilters} />
        <DatepickerRange />
      </FiltersContainer>
      <TableComponent generalRoomData={generalRoomData} readings={level === 'high' ? readingsHigh : readingsLow} indicator={currentIndicator as Indicator} />
    </div>
  )
}

export default async function Page({ searchParams }: SearchParams) {
  return (
    <div>
      <Suspense fallback={<div>Cargando picos históricos...</div>}>
        <PicosHistoricos searchParams={searchParams} />
      </Suspense>
    </div>
  )
}