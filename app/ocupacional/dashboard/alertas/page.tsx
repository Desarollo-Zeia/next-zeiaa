import { alerts } from "@/app/sevices/alerts/data";
import { detail } from "@/app/sevices/enterprise/data";
import { getRooms } from "@/app/sevices/filters/data";
import { roomGeneralData } from "@/app/sevices/readings/data";
import { Indicator, SearchParams } from "@/app/type";
import TableComponent from "@/app/ui/alertas/table";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
import RoomSelect from "@/app/ui/filters/room-select";
import StatusSelect from "@/app/ui/filters/status-select";

export default async function page({ searchParams }: SearchParams) {

  const { first_room: firstRoom } = await detail()

  const { room, indicator = 'CO2', unit = 'PPM', date_after, date_before, page = '1', status } = await searchParams

  const currentFirstRoom = room ? room : firstRoom

  const rooms = await getRooms()
  const readings = await alerts({ roomId: currentFirstRoom, indicator, unit, date_after, date_before, page, status })
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
