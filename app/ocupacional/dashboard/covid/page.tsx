import { getRooms } from "@/app/services/filters/data";
import { readingsCovid, readingsCovidBaselines } from "@/app/services/readings/data";
import { Room, SearchParams } from "@/app/type";
import TableComponent from "@/app/ui/covid/table";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
import RoomSelect from "@/app/ui/filters/room-select";
import { format } from "date-fns";
import { Suspense } from "react";

async function Covid({ searchParams }: SearchParams) {

  const { room, indicator = 'CO2', unit = 'PPM', date_after = new Date(), date_before = new Date(), page = '1' } = await searchParams

  const formattedDateAfter = format(date_after, 'yyyy-MM-dd')
  const formattedDateBefore = format(date_before, 'yyyy-MM-dd')

  const rooms: Room[] = await getRooms()
  const firstRoom = rooms.find((room) => room.is_activated === true)

  const currentFirstRoom = room ?? String(firstRoom?.id ?? '')
  const readings = await readingsCovid({ roomId: currentFirstRoom, indicator, unit, date_after: formattedDateAfter, date_before: formattedDateBefore, page })
  const covidBaselines = await readingsCovidBaselines({ date_after: formattedDateAfter, date_before: formattedDateBefore, roomId: currentFirstRoom })

  return (
    <div>
      <FiltersContainer>
        <RoomSelect firstRoom={currentFirstRoom} rooms={rooms} />
        <DatepickerRange />
      </FiltersContainer>
      <TableComponent data={readings.results} count={readings.count} baselines={covidBaselines} currentRoom={currentFirstRoom} />
    </div>
  )
}

export default async function Page({ searchParams }: SearchParams) {
  return (
    <div>
      <Suspense fallback={<div>Cargando datos de COVID...</div>}>
        <Covid searchParams={searchParams} />
      </Suspense>
    </div>
  )
}


