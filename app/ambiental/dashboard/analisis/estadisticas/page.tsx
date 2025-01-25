import { detailAmbiental } from "@/app/sevices/enterprise/data";
import { getRoomsAmbiental } from "@/app/sevices/filters/data";
import { readingsGraphAmbiental, roomGeneralDataAmbiental } from "@/app/sevices/readings/data";
import { Indicator, SearchParams, Unit } from "@/app/type";
import { ChartComponent } from "@/app/ui/analisis/estadisticas/chart";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
import RoomSelect from "@/app/ui/filters/room-select";
import { format } from "date-fns";


export default async function page({ searchParams } : SearchParams) {
  const { first_room: firstRoom} = await detailAmbiental()

  const { room, indicator = 'CO2', unit = 'PPM', date_after = new Date(), date_before = new Date(), start = '00:00', end = '23:00'} = await searchParams

  const currentFirstRoom = room ? room : firstRoom

  const rooms = await getRoomsAmbiental()
  const readings = await readingsGraphAmbiental({ roomId: currentFirstRoom, indicator, unit, date_after: format(date_after,"yyyy-MM-dd"), date_before: format(date_before, "yyyy-MM-dd")})
  const generalRoomData = await roomGeneralDataAmbiental({ roomId: currentFirstRoom})

  return (
    <div>
      <FiltersContainer>
        <RoomSelect firstRoom={currentFirstRoom} rooms={rooms}/>
        <DatepickerRange />
      </FiltersContainer>
      <ChartComponent readings={readings} indicator={indicator as Indicator} unit={unit as Unit} generalRoomData={generalRoomData} start={start} end={end}/>
    </div>
  )
}
