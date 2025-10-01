import { detail } from "@/app/sevices/enterprise/data";
import { getRooms } from "@/app/sevices/filters/data";
import { readingsCovid, readingsCovidBaselines } from "@/app/sevices/readings/data";
import { SearchParams } from "@/app/type";
import TableComponent from "@/app/ui/covid/table";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
import RoomSelect from "@/app/ui/filters/room-select";

export default async function page({ searchParams }: SearchParams) {

  const { first_room: firstRoom } = await detail()

  const { room, indicator = 'CO2', unit = 'PPM', date_after, date_before, page = '1' } = await searchParams

  const currentFirstRoom = room ? room : firstRoom

  const rooms = await getRooms()
  const readings = await readingsCovid({ roomId: currentFirstRoom, indicator, unit, date_after, date_before, page })
  const covidBaselines = await readingsCovidBaselines({ date_after, date_before, roomId: currentFirstRoom })

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
