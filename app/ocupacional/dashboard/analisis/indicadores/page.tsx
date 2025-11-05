import { getRooms } from "@/app/sevices/filters/data";
import { readingsData, roomGeneralData } from "@/app/sevices/readings/data";
import { Indicator, SearchParams, Unit } from "@/app/type";
import TableComponent from "@/app/ui/analisis/table";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
import RoomSelect from "@/app/ui/filters/room-select";
import StatusSelect from "@/app/ui/filters/status-select";
import { TimeRangeSlider } from "@/app/ui/filters/time-range-slider";
import { format } from "date-fns";

export default async function page({ searchParams }: SearchParams) {

  const { room, indicator = 'CO2', unit = 'PPM', date_after = new Date(), date_before = new Date(), page = '1', status, start, end, ordering } = await searchParams

  const formattedDateAfter = format(date_after, 'yyyy-MM-dd')
  const formattedDateBefore = format(date_before, 'yyyy-MM-dd')

  const rooms = await getRooms()
  const firstRoom = rooms.find((room: any) => room.is_activated === true)  // eslint-disable-line @typescript-eslint/no-explicit-any

  const currentFirstRoom = room ? room : firstRoom.id
  const generalRoomData = await roomGeneralData({ roomId: currentFirstRoom })
  const readings = await readingsData({ roomId: currentFirstRoom, indicator, unit, date_after: formattedDateAfter, date_before: formattedDateBefore, page, status, hour_after: start, hour_before: end, ordering })

  return (
    <div>
      <FiltersContainer>
        <RoomSelect firstRoom={currentFirstRoom} rooms={rooms} />
        <StatusSelect />
        <TimeRangeSlider />
        <DatepickerRange />
      </FiltersContainer>
      <TableComponent generalRoomData={generalRoomData} readings={readings} count={readings.count} indicator={indicator as Indicator} unit={unit as Unit} date_after={formattedDateAfter} date_before={formattedDateBefore} room={currentFirstRoom} />
    </div>
  )
}
