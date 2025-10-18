import { readingsPeaks, roomGeneralData } from "@/app/sevices/readings/data";
import TableComponent from "@/app/ui/picos/table";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
import { format } from "date-fns";
import { getRooms } from "@/app/sevices/filters/data";
import RoomSelect from "@/app/ui/filters/room-select";
import { Indicator } from "@/app/type";
import StatusSelect from "@/app/ui/filters/status-select";

type SearchParams = {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function page({ searchParams }: SearchParams) {


  const { room, indicator = 'CO2', unit = 'PPM', date_after = new Date(), date_before = new Date(), page, status } = await searchParams

  const formattedDateAfter = format(date_after, 'yyyy-MM-dd')
  const formattedDateBefore = format(date_before, 'yyyy-MM-dd')

  const rooms = await getRooms()
  const firstRoom = rooms.find((room: any) => room.is_activated === true)  // eslint-disable-line @typescript-eslint/no-explicit-any

  const currentFirstRoom = room ? room : firstRoom.id
  const generalRoomData = await roomGeneralData({ roomId: currentFirstRoom })
  const readings = await readingsPeaks({ roomId: currentFirstRoom, indicator, unit, date_after: formattedDateAfter, date_before: formattedDateBefore, page, status })

  return (
    <div>
      <FiltersContainer>
        <RoomSelect firstRoom={currentFirstRoom} rooms={rooms} />
        <StatusSelect />
        <DatepickerRange />
      </FiltersContainer>
      <TableComponent generalRoomData={generalRoomData} readings={readings} indicator={indicator as Indicator} />
    </div>
  )
}
