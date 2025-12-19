import { readingsPeaks, roomGeneralData } from "@/app/sevices/readings/data";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
import { format } from "date-fns";
import { getRooms } from "@/app/sevices/filters/data";
import { Indicator } from "@/app/type";
import { getToken } from "@/app/lib/auth";
import { Suspense } from "react";
import Peaks from "@/app/ui/picos/peaks";
import IndicatorToggle from "@/app/ui/filters/indicators-toggle";
import PicosSkeleton from "./loading";

type SearchParams = {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

async function PicosHistoricos({ searchParams }: SearchParams) {


  const { room, indicator, unit, date_after = new Date(), date_before = new Date(), page, status } = await searchParams

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
  const readings = await readingsPeaks({ roomId: currentFirstRoom, indicator: currentIndicator, unit: currentUnit, date_after: formattedDateAfter, date_before: formattedDateBefore, page, status, token: authToken! })

  const indicators = generalRoomData.indicators_activated

  const thresholdsFilters = generalRoomData?.thresholds_filter[indicator as Indicator]

  return (
    <div>
      <FiltersContainer>
        {/* <RoomSelect firstRoom={currentFirstRoom} rooms={rooms} /> */}
        <DatepickerRange />

      </FiltersContainer>
      {/* <TableComponent generalRoomData={generalRoomData} readings={readings} indicator={indicator as Indicator} /> */}
      <div className="flex justify-between px-4">
        <div>
          <p className="font-semibold">Top 3 valores más altos de cada sala</p>
          <p>Selecciona una de las salas para ver más detalles</p>
        </div>
        <IndicatorToggle indicators={indicators} indicatorParam={indicator as Indicator} />
      </div>
      <Peaks readings={readings} indicator={currentIndicator as 'CO2' | 'TEMPERATURE' | 'HUMIDITY'} indicators={indicators} />
    </div>
  )
}

export default async function Page({ searchParams }: SearchParams) {
  return (
    <div>
      <Suspense fallback={<PicosSkeleton />}>
        <PicosHistoricos searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
