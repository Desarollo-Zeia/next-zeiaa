import { alerts } from "@/app/sevices/alerts/data";
import { getRooms } from "@/app/sevices/filters/data";
import { roomGeneralData } from "@/app/sevices/readings/data";
import { Indicator, SearchParams } from "@/app/type";
import TableComponent from "@/app/ui/alertas/table";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
import RoomSelect from "@/app/ui/filters/room-select";
import StatusSelect from "@/app/ui/filters/status-select";
import { format } from "date-fns";

export default async function page({ searchParams }: SearchParams) {


  const { room, indicator = 'CO2', unit = 'PPM', date_after = new Date(), date_before = new Date(), page = '1', status } = await searchParams

  const formattedDateAfter = format(date_after, 'yyyy-MM-dd')
  const formattedDateBefore = format(date_before, 'yyyy-MM-dd')

  const rooms = await getRooms()
  const firstRoom = rooms.find((room: any) => room.is_activated === true)  // eslint-disable-line @typescript-eslint/no-explicit-any

  const currentFirstRoom = room ? room : firstRoom.id
  const readings = await alerts({ roomId: currentFirstRoom, indicator, unit, date_after: formattedDateAfter, date_before: formattedDateBefore, page, status })
  const generalRoomData = await roomGeneralData({ roomId: currentFirstRoom })

  return (
    <div>
      <FiltersContainer>
        <RoomSelect firstRoom={currentFirstRoom} rooms={rooms} />
        <StatusSelect />
        <DatepickerRange />
      </FiltersContainer>
      <TableComponent data={readings.results} count={readings.count} generalRoomData={generalRoomData} indicator={indicator as Indicator} />
    </div>
  )
}
