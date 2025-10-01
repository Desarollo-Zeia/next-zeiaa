import { detail } from "@/app/sevices/enterprise/data";
import { getRooms } from "@/app/sevices/filters/data";
import { readingsData, roomGeneralData } from "@/app/sevices/readings/data";
import { Indicator, SearchParams, Unit } from "@/app/type";
import TableComponent from "@/app/ui/analisis/table";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
import RoomSelect from "@/app/ui/filters/room-select";
import StatusSelect from "@/app/ui/filters/status-select";
import { TimeRangeSlider } from "@/app/ui/filters/time-range-slider";

export default async function page({ searchParams }: SearchParams) {

  const { first_room: firstRoom } = await detail()

  const { room, indicator = 'CO2', unit = 'PPM', date_after, date_before, page, status, start, end, ordering } = await searchParams

  const currentFirstRoom = room ? room : firstRoom

  const rooms = await getRooms()
  const generalRoomData = await roomGeneralData({ roomId: currentFirstRoom })
  const readings = await readingsData({ roomId: currentFirstRoom, indicator, unit, date_after, date_before, page, status, hour_after: start, hour_before: end, ordering })

  return (
    <div>
      <FiltersContainer>
        <RoomSelect firstRoom={firstRoom} rooms={rooms} />
        <StatusSelect />
        <TimeRangeSlider />
        <DatepickerRange />
      </FiltersContainer>
      <TableComponent generalRoomData={generalRoomData} readings={readings} count={readings.count} indicator={indicator as Indicator} unit={unit as Unit} date_after={date_after} date_before={date_before} room={currentFirstRoom} />
    </div>
  )
}
