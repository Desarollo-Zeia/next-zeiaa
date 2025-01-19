import { detail } from "@/app/sevices/enterprise/data";
import { readingsPeaks, roomGeneralData } from "@/app/sevices/readings/data";
import TableComponent from "@/app/ui/picos/table";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
import { format } from "date-fns";
import { getRooms } from "@/app/sevices/filters/data";
import RoomSelect from "@/app/ui/filters/room-select";
import { Indicator } from "@/app/type";

type SearchParams = {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function page({ searchParams } : SearchParams) {

  const { first_room: firstRoom} = await detail()

  const { room, indicator = 'CO2', unit = 'PPM', date_after = new Date(), date_before = new Date(), page } = await searchParams

  const currentFirstRoom = room ? room : firstRoom


  const rooms = await getRooms()
  const generalRoomData = await roomGeneralData({ roomId: currentFirstRoom})
  const readings = await readingsPeaks({ roomId: currentFirstRoom, indicator, unit, date_after: format(date_after, "yyyy-MM-dd"), date_before: format(date_before, "yyyy-MM-dd"), page })

  return (
    <div>
      <FiltersContainer>
        <RoomSelect firstRoom={currentFirstRoom} rooms={rooms}/>
        <DatepickerRange/>
      </FiltersContainer>
      <TableComponent generalRoomData={generalRoomData} readings={readings} indicator={indicator as Indicator}/>
    </div>
  )
}
