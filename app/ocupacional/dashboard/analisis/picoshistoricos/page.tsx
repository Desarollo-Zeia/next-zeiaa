import { detail } from "@/app/sevices/enterprise/data";
import { readingsData, readingsPeaks, roomGeneralData } from "@/app/sevices/readings/data";
import TableComponent from "@/app/ui/picos/table";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
import RoomSelectFilter from "@/app/ui/filters/rooms";
import { format } from "date-fns";

export default async function page({ searchParams }) {

  const { first_room: firstRoom} = await detail()

  const { room, indicator = 'CO2', unit = 'PPM', date_after = new Date(), date_before = new Date(), page } = await searchParams

  const currentFirstRoom = room ? room : firstRoom

  const generalRoomData = await roomGeneralData({ roomId: currentFirstRoom})
  const readings = await readingsPeaks({ roomId: currentFirstRoom, indicator, unit, date_after: format(date_after, "yyyy-MM-dd"), date_before: format(date_before, "yyyy-MM-dd"), page })

  return (
    <div>
      <FiltersContainer>
        <RoomSelectFilter firstRoom={currentFirstRoom}/>
        <DatepickerRange/>
      </FiltersContainer>
      <TableComponent generalRoomData={generalRoomData} readings={readings} count={readings.count} indicator={indicator} unit={unit} date_after={date_after} date_before={date_before} room={currentFirstRoom}/>
    </div>
  )
}
