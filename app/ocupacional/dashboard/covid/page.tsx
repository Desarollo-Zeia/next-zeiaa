import { getRooms } from "@/app/sevices/filters/data";
import { readingsCovid, readingsCovidBaselines } from "@/app/sevices/readings/data";
import { SearchParams } from "@/app/type";
import TableComponent from "@/app/ui/covid/table";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
import RoomSelect from "@/app/ui/filters/room-select";
import { format } from "date-fns";

export default async function page({ searchParams }: SearchParams) {

  const { room, indicator = 'CO2', unit = 'PPM', date_after = new Date(), date_before = new Date(), page = '1' } = await searchParams

  const formattedDateAfter = format(date_after, 'yyyy-MM-dd')
  const formattedDateBefore = format(date_before, 'yyyy-MM-dd')

  const rooms = await getRooms()
  const firstRoom = rooms.find((room: any) => room.is_activated === true)  // eslint-disable-line @typescript-eslint/no-explicit-any

  const currentFirstRoom = room ? room : firstRoom.id
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
